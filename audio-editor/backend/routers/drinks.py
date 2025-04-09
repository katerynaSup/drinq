from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from models.drink import Drink, Ingredient
from models.recommendation import DrinkRecommender
import os
import json

router = APIRouter()
recommender = DrinkRecommender()



@router.get("/drinks", response_model=List[Drink])
async def get_all_drinks(
    limit: int = Query(50, description="Maximum number of drinks to return")
):
    """Get a list of all available drinks, with optional limit"""
    return recommender.drinks[:limit]

@router.get("/drinks/{drink_id}", response_model=Drink)
async def get_drink_by_id(drink_id: str):
    """Get a specific drink by its ID"""
    for drink in recommender.drinks:
        if drink.id == drink_id:
            return drink
    raise HTTPException(status_code=404, detail=f"Drink with ID '{drink_id}' not found")


@router.get("/spirits", response_model=List[str])
async def get_available_spirits():
    """Get a list of all available base spirits in the database"""
    spirits = set()
    for drink in recommender.drinks:
        spirits.add(drink.base_spirit)
    return sorted(list(spirits))

@router.get("/tags", response_model=List[str])
async def get_available_tags():
    """Get a list of all available tags in the database"""
    tags = set()
    for drink in recommender.drinks:
        for tag in drink.tags:
            tags.add(tag)
    return sorted(list(tags))

# Load substitution data from JSON
def load_substitutions():
    with open(os.path.join(os.path.dirname(__file__), "../data/substitutions.json")) as f:
        return json.load(f)

# Add this new endpoint
@router.get("/ingredient-substitutions/{ingredient}")
async def get_ingredient_substitutions(ingredient: str):
    """Get substitution suggestions for a specific ingredient"""
    try:
        substitutions = load_substitutions()
        
        # Convert to lowercase for case-insensitive matching
        ingredient = ingredient.lower()
        
        # Check if we have substitutions for this ingredient
        if ingredient in substitutions:
            return {"ingredient": ingredient, "substitutions": substitutions[ingredient]}
        
        # Try to find partial matches
        partial_matches = {}
        for key in substitutions:
            if ingredient in key or key in ingredient:
                partial_matches[key] = substitutions[key]
        
        if partial_matches:
            return {"ingredient": ingredient, "substitutions": list(partial_matches.values())[0], 
                    "note": "Based on similar ingredient"}
        
        # No substitutions found
        return {"ingredient": ingredient, "substitutions": [], "note": "No substitutions found"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding substitutions: {str(e)}")
