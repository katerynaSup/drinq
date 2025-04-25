import torch
from typing import Literal, List, Dict, Any, Optional
import json
from transformers import AutoModelForCausalLM, AutoTokenizer
from fastapi import APIRouter, HTTPException, Body
import uuid
import os
import httpx
import asyncio
import traceback
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# LLM Configuration - Default model

MODEL_PATH = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"  # 1.1B parameters
# MODEL_PATH = "microsoft/phi-2"  # 2.7B parameters but very efficient
# MODEL_PATH = "HuggingFaceH4/zephyr-7b-beta"  # 7B but optimized
# MODEL_PATH = "google/gemma-2b-it"  # 2B parameter model from Google
# MODEL_PATH = "deepseek-ai/deepseek-llm-7b-chat"  # 7B parameter model from DeepSeek

# MODEL_PATH = "davanstrien/recipe-gen"  # 1.3B parameter model
# MODEL_PATH = "flozi00/genius-cocktail-generator"  # 350M parameter model
# # or "davanstrien/recipe-gen-small" (60M params)
DEFAULT_MODEL = MODEL_PATH



# Initialize model dictionary to store loaded models
models = {}

# API Keys for external LLM providers
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Add this line

# https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY

class LLMConfig(BaseModel):
    """Configuration for LLM selection"""
    provider: Literal["local", "openai", "anthropic", "gemini"] = Field(default="local", description="LLM provider to use")
    model_name: Optional[str] = Field(default=None, description="Model name to use")


def get_best_device() -> Literal['cuda', 'mps', 'cpu']:
    """Determine the best available device for model inference"""
    if torch.cuda.is_available():
        return 'cuda'
    
    # if hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
    #     try:
    #         test_tensor = torch.ones(1, device='mps')
    #         _ = test_tensor + 1
    #         return 'mps'
    #     except (RuntimeError, AttributeError):
    #         pass
    
    return 'cpu'


def load_local_model(model_name: str = DEFAULT_MODEL):
    """Load a local Hugging Face model if not already loaded"""
    if model_name not in models:
        device = get_best_device()
        print(f"Loading model {model_name} on {device}")
        
        try:
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModelForCausalLM.from_pretrained(model_name, trust_remote_code=True, 
            torch_dtype=torch.bfloat16 if device == 'cuda' else torch.float32)
            # model = AutoModelForCausalLM.from_pretrained(model_name, trust_remote_code=True, torch_dtype=torch.float32)
            model = model.to(device)
            # device = model.device
            print(f"Model loaded on device: {device}")
            models[model_name] = {"model": model, "tokenizer": tokenizer}
            return True
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            return False
    return True


# Add function to generate text using the Gemini API
async def generate_with_gemini(prompt: str, model_name: str = "gemini-2.0-flash") -> str:
    """Generate text using Google Gemini API"""
    if not GEMINI_API_KEY:
        raise ValueError("Gemini API key not found in environment variables")
    
    # Format the request according to Gemini API specifications
    request_data = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1000,
            "topP": 0.95,
            "topK": 50
        }
    }
    
    # The URL includes the model and API key
    url = f"https://generativelanguage.googleapis.com/v1/models/{model_name}:generateContent?key={GEMINI_API_KEY}"
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            url,
            json=request_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code != 200:
            raise ValueError(f"Gemini API error: {response.text}")
        
        data = response.json()
        
        # Extract the text from the response
        if "candidates" in data and len(data["candidates"]) > 0:
            candidate = data["candidates"][0]
            if "content" in candidate and "parts" in candidate["content"]:
                parts = candidate["content"]["parts"]
                if parts and "text" in parts[0]:
                    return parts[0]["text"]
        
        raise ValueError("Failed to extract text from Gemini API response")





def generate_drink_prompt(ingredients: List[Dict], user_prompt: Optional[str] = None):
    """Generate a prompt for the LLM based on available ingredients and user request"""
    ingredient_names = [ing["name"] for ing in ingredients]
    ingredients_text = ", ".join(ingredient_names)
    
    theme_text = f"The user would like: {user_prompt}" if user_prompt else ""
    
    prompt = f"""You are an expert bartender. Create a unique cocktail recipe using ONLY these ingredients: {ingredients_text}.
{theme_text}

Respond ONLY with a JSON object in this exact format without any explanation text:

{{
    "name": "Drink Name",
    "description": "A brief description of the drink (1-2 sentences)",
    "ingredients": [
        {{"name": "Ingredient1", "amount": "2", "unit": "oz"}},
        {{"name": "Ingredient2", "amount": "1", "unit": "oz"}},
        {{"name": "Ingredient3", "amount": "0.5", "unit": "oz"}}
    ],
    "instructions": ["Step 1", "Step 2", "Step 3"],
    "glass_type": "Type of glass",
    "difficulty": 3,
    "prep_time_minutes": 5
}}

Be creative but make a realistic and tasty drink. ONLY use ingredients from the provided list.
"""
    return prompt


async def generate_with_local_model(model_name: str, prompt: str) -> str:
    print("Generating with local model...")
    """Generate text using a local Hugging Face model"""
    if model_name not in models:
        success = load_local_model(model_name)
        if not success:
            raise ValueError(f"Failed to load model: {model_name}")
    
    model = models[model_name]["model"]
    tokenizer = models[model_name]["tokenizer"]
    
    # Add a clear marker for where the JSON should start
    modified_prompt = prompt + "\n\nJSON RESPONSE:\n"
    
    # Tokenize input
    print("Tokenizing input...")
    inputs = tokenizer(modified_prompt, return_tensors="pt").to(model.device)
    
    # Generate with simplified parameters
    with torch.no_grad():
        print("Generating output...")
        outputs = model.generate(
            input_ids=inputs["input_ids"],
            attention_mask=inputs.get("attention_mask", None),
            max_length=inputs["input_ids"].shape[1] + 1024,  # Reduced from 2048 for speed
            do_sample=True,
            temperature=0.7,
            num_return_sequences=1,
            top_k=50, 
            top_p=0.95, 
            eos_token_id=tokenizer.eos_token_id,  # explicitly set EOS token
        )
    
    # Get the complete response
    print("Decoding output...")
    full_response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Extract only the part after our marker if present
    if "JSON RESPONSE:" in full_response:
        response_text = full_response.split("JSON RESPONSE:", 1)[1].strip()
    else:
        prompt_text = tokenizer.decode(inputs["input_ids"][0], skip_special_tokens=True)
        response_text = full_response[len(prompt_text):].strip()
    

    print("Full response:", full_response)
    return response_text


async def generate_with_openai(prompt: str, model_name: str = "gpt-3.5-turbo") -> str:
    """Generate text using OpenAI API"""
    if not OPENAI_API_KEY:
        raise ValueError("OpenAI API key not found in environment variables")
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            json={
                "model": model_name,
                "messages": [
                    {"role": "system", "content": "You are an expert bartender who responds only with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 1000
            }
        )
        
        if response.status_code != 200:
            raise ValueError(f"OpenAI API error: {response.text}")
        
        data = response.json()
        return data["choices"][0]["message"]["content"]


async def generate_with_anthropic(prompt: str, model_name: str = "claude-3-haiku-20240307") -> str:
    """Generate text using Anthropic API"""
    if not ANTHROPIC_API_KEY:
        raise ValueError("Anthropic API key not found in environment variables")
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json"
            },
            json={
                "model": model_name,
                "max_tokens": 1000,
                "system": "You are an expert bartender who responds only with valid JSON.",
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
        )
        
        if response.status_code != 200:
            raise ValueError(f"Anthropic API error: {response.text}")
        
        data = response.json()
        return data["content"][0]["text"]


async def generate_drink_text(prompt: str, llm_config: LLMConfig) -> str:
    """Generate text using the specified LLM provider and model"""
    provider = llm_config.provider
    model_name = llm_config.model_name
    
    if provider == "local":
        model_name = model_name or DEFAULT_MODEL
        return await generate_with_local_model(model_name, prompt)
    elif provider == "openai":
        model_name = model_name or "gpt-3.5-turbo"
        return await generate_with_openai(prompt, model_name)
    elif provider == "anthropic":
        model_name = model_name or "claude-3-haiku-20240307"
        return await generate_with_anthropic(prompt, model_name)
    elif provider == "gemini":  # Add this section
        model_name = model_name or "gemini-1.5-flash"
        return await generate_with_gemini(prompt, model_name)
    else:
        raise ValueError(f"Unsupported LLM provider: {provider}")


def parse_ai_response(response_text: str) -> Dict:
    """Parse the AI response to extract the drink recipe in JSON format"""
    # print out AI response for debugging
    # print(f"AI Response: {response_text}")

    try:
        # First try to find and parse JSON content
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        
        if start_idx != -1 and end_idx > 0:
            json_content = response_text[start_idx:end_idx]
            
            # Basic cleanup of common JSON errors
            json_content = json_content.replace('// more ingredients...', '')
            json_content = json_content.replace('\n//', '\n')
            
            # Replace trailing commas (common JSON error)
            import re
            json_content = re.sub(r',(\s*[\]}])', r'\1', json_content)
            
            try:
                drink_data = json.loads(json_content)
                
                # Validate required fields
                required_fields = ["name", "description", "ingredients", "instructions"]
                for field in required_fields:
                    if field not in drink_data:
                        raise ValueError(f"Missing required field: {field}")
                
                return drink_data
            except json.JSONDecodeError:
                raise ValueError("Failed to parse JSON response")
        else:
            raise ValueError("No JSON structure found in response")
    except Exception as e:
        # If we can't parse the output, create a fallback response
        return {
            "name": "Mystery Cocktail",
            "description": "A surprising mix created from your bar ingredients.",
            "ingredients": [
                {"name": ingredient["name"], "amount": "1", "unit": "part"}
                for ingredient in ingredients[:3] if isinstance(ingredients, list)
            ],
            "instructions": ["Mix all ingredients in a shaker with ice", "Strain into glass", "Enjoy!"],
            "glass_type": "Rocks Glass",
            "difficulty": 2,
            "prep_time_minutes": 5
        }


def generate_fallback_recipe(ingredients: List[Dict], user_prompt: Optional[str] = None) -> Dict:
    """Generate a fallback recipe when the AI generation fails"""
    if not ingredients:
        return {
            "name": "Classic Surprise",
            "description": "A simple yet satisfying mix.",
            "ingredients": [],
            "instructions": ["Mix all ingredients", "Serve and enjoy"],
            "glass_type": "Rocks Glass",
            "difficulty": 1,
            "prep_time_minutes": 5
        }
    
    # Choose up to 3 random ingredients from the list
    import random
    selected_ingredients = random.sample(ingredients, min(3, len(ingredients)))
    
    # Generate a simple recipe
    return {
        "name": "Bartender's Choice",
        "description": "A special mix created just for you.",
        "ingredients": [
            {"name": ingredient["name"], "amount": "1", "unit": "part"}
            for ingredient in selected_ingredients
        ],
        "instructions": [
            "Combine all ingredients in a shaker with ice",
            "Shake well until chilled",
            "Strain into glass and serve"
        ],
        "glass_type": "Rocks Glass",
        "difficulty": 2,
        "prep_time_minutes": 5
    }


@router.post("/generate-drink", response_model=Dict[str, Any])
async def generate_drink(
    ingredients: List[Dict] = Body(..., description="List of ingredients in user's bar"),
    user_prompt: Optional[str] = Body(None, description="User's request or theme for the drink"),
    llm_config: LLMConfig = Body(LLMConfig(), description="LLM configuration")
):
    """Generate a custom drink recipe using AI based on available ingredients"""
    if not ingredients:
        raise HTTPException(status_code=400, detail="No ingredients provided")
    
    try:
        print("Generating drink with ingredients:", ingredients)
        print("User prompt:", user_prompt)
        print("LLM config:", llm_config)
        prompt = generate_drink_prompt(ingredients, user_prompt)
        response_text = await generate_drink_text(prompt, llm_config)
        drink_data = parse_ai_response(response_text)
        drink_data["id"] = f"ai-{uuid.uuid4().hex[:8]}"
        
        return drink_data
    except Exception as e:
        # Create a fallback drink if generation fails
        fallback = generate_fallback_recipe(ingredients, user_prompt)
        fallback["id"] = f"ai-{uuid.uuid4().hex[:8]}"
        return fallback


@router.post("/generate-multiple-drinks", response_model=List[Dict[str, Any]])
async def generate_multiple_drinks(
    ingredients: List[Dict] = Body(..., description="List of ingredients in user's bar"),
    user_prompt: Optional[str] = Body(None, description="User's request or theme for the drinks"),
    count: int = Body(3, description="Number of drinks to generate"),
    llm_config: LLMConfig = Body(LLMConfig(), description="LLM configuration")
):
    """Generate multiple custom drink recipes using AI based on available ingredients"""
    if not ingredients:
        raise HTTPException(status_code=400, detail="No ingredients provided")
    
    if count < 1 or count > 5:
        raise HTTPException(status_code=400, detail="Count must be between 1 and 5")
    
    try:
        tasks = []
        drink_prompts = []
        
        # Create distinct variations of the prompt
        for i in range(count):
            variation = ""
            if count > 1:
                ordinals = ["first", "second", "third", "fourth", "fifth"]
                if i < len(ordinals):
                    variation = f"Make this the {ordinals[i]} unique drink option."
            
            combined_prompt = f"{user_prompt} {variation}".strip() if user_prompt or variation else None
            prompt = generate_drink_prompt(ingredients, combined_prompt)
            drink_prompts.append(prompt)
            tasks.append(generate_drink_text(prompt, llm_config))
        
        drinks = []
        used_names = set()
        
        # Try to run generation tasks concurrently
        try:
            print("Generating drinks concurrently...")
            drink_responses = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process the responses
            for i, response in enumerate(drink_responses):
                try:
                    # Handle exceptions from task
                    if isinstance(response, Exception):
                        raise response
                    
                    drink_data = parse_ai_response(response)
                    
                    # Ensure name is unique
                    if drink_data["name"] in used_names:
                        drink_data["name"] += f" {i+1}"
                    used_names.add(drink_data["name"])
                    
                    drink_data["id"] = f"ai-{uuid.uuid4().hex[:8]}"
                    drinks.append(drink_data)
                except Exception as e:
                    # Use fallback recipe if parsing fails
                    print(f"Error processing drink {i+1}: {str(e)}, using fallback")
                    fallback = generate_fallback_recipe(ingredients, user_prompt)
                    fallback["name"] = f"Bartender's Choice {i+1}"
                    fallback["id"] = f"ai-{uuid.uuid4().hex[:8]}"
                    drinks.append(fallback)
        except Exception as e:
            # If parallel processing fails, fall back to sequential processing
            print(f"Concurrent processing failed: {str(e)}")
            print("Falling back to sequential processing")
            
            for i in range(count):
                try:
                    print("Generating drink with ingredients:", ingredients)
                    print("User prompt:", user_prompt)
                    print("LLM config:", llm_config)
                    response = await generate_drink_text(drink_prompts[i], llm_config)
                    drink_data = parse_ai_response(response)
                    
                    # Ensure name is unique
                    if drink_data["name"] in used_names:
                        drink_data["name"] += f" {i+1}"
                    used_names.add(drink_data["name"])
                    
                    drink_data["id"] = f"ai-{uuid.uuid4().hex[:8]}"
                    drinks.append(drink_data)
                except Exception as e:
                    # Use fallback recipe if processing fails
                    fallback = generate_fallback_recipe(ingredients, user_prompt)
                    fallback["name"] = f"Bartender's Choice {i+1}"
                    fallback["id"] = f"ai-{uuid.uuid4().hex[:8]}"
                    drinks.append(fallback)
        
        # If we still have no drinks, generate simple fallbacks
        if not drinks:
            for i in range(count):
                fallback = generate_fallback_recipe(ingredients, user_prompt)
                fallback["name"] = f"Bartender's Special {i+1}"
                fallback["id"] = f"ai-{uuid.uuid4().hex[:8]}"
                drinks.append(fallback)
        
        return drinks
    
    except Exception as e:
        # Create a basic set of drinks as a last resort
        drinks = []
        for i in range(count):
            fallback = generate_fallback_recipe(ingredients, user_prompt)
            fallback["name"] = f"Emergency Cocktail {i+1}"
            fallback["id"] = f"ai-{uuid.uuid4().hex[:8]}"
            drinks.append(fallback)
        return drinks


@router.get("/available-llms", response_model=Dict[str, Any])
async def get_available_llms():
    """Get information about available LLM providers and models"""
    providers = {
        "local": {
            "available": True,
            "models": [DEFAULT_MODEL]
        },
        "openai": {
            "available": bool(OPENAI_API_KEY),
            "models": ["gpt-3.5-turbo", "gpt-4"] if OPENAI_API_KEY else []
        },
        "anthropic": {
            "available": bool(ANTHROPIC_API_KEY),
            "models": ["claude-3-haiku-20240307", "claude-3-sonnet-20240229"] if ANTHROPIC_API_KEY else []
        },
        "gemini": {  # Add this section
            "available": bool(GEMINI_API_KEY),
            "models": ["gemini-1.5-flash", "gemini-1.5-pro"] if GEMINI_API_KEY else []
        }
    }
    
    return {
        "providers": providers,
        "default_provider": "local",
        "default_model": DEFAULT_MODEL
    }