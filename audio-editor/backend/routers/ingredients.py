from fastapi import APIRouter, HTTPException
import json

router = APIRouter()

# Load substitutions data
try:
    with open('data/substitutions.json', 'r') as f:
        substitutions_data = json.load(f)
except FileNotFoundError:
    substitutions_data = {}

@router.get("/ingredient-substitutions/{ingredient}")
async def get_ingredient_substitutions(ingredient: str):
    # Convert ingredient name to match the format in json (lowercase, spaces to hyphens)
    ingredient_key = ingredient.lower().replace(' ', '-')
    
    if ingredient_key in substitutions_data:
        return {"substitutions": substitutions_data[ingredient_key]["substitutions"]}
    else:
        return {"substitutions": []} 