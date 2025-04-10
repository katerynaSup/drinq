from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from models.drink import Drink, Ingredient
from models.recommendation import DrinkRecommender
import json
from pathlib import Path

router = APIRouter()
recommender = DrinkRecommender()



@router.get("/drinks", response_model=List[Dict])
async def get_all_drinks(
    limit: int = Query(50, description="Maximum number of drinks to return")
):
    """Get a list of all available drinks, with optional limit"""
    try:
        data_file = Path(__file__).parent.parent.parent / "frontend" / "src" / "data" / "drinks.json"
        with open(data_file, "r") as f:
            drinks_data = json.load(f)
            
        return drinks_data[:limit]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load drinks: {str(e)}")

@router.get("/drinks/{drink_id}")
async def get_drink_by_id(drink_id: str):
    """Get a specific drink by its ID"""
    try:
        data_file = Path(__file__).parent.parent.parent / "frontend" / "src" / "data" / "drinks.json"
        with open(data_file, "r") as f:
            drinks_data = json.load(f)
        
        for drink in drinks_data:
            if drink["id"] == drink_id:
                return drink
                
        raise HTTPException(status_code=404, detail=f"Drink with ID '{drink_id}' not found")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


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
