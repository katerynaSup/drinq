# backend/models/recommendation.py
from typing import List, Dict, Any
import json
from pathlib import Path
from models.drink import Drink, Ingredient
import os

class DrinkRecommender:
    def __init__(self):
        self.drinks = self._load_drinks()
    
    def _load_drinks(self):
        """Load drinks from JSON file"""
        try:
            # Updated path to match the new location in frontend
            data_file = Path(__file__).parent.parent.parent / "frontend" / "src" / "data" / "drinks.json"
            
            with open(data_file, "r") as f:
                drinks_data = json.load(f)
            
            # Convert JSON data to Drink objects
            drinks = []
            for drink_dict in drinks_data:
                # Create a Drink object and populate it with data from the JSON
                # Adapt this part based on your Drink model structure
                ingredients = []
                for ing in drink_dict.get("ingredients", []):
                    ingredients.append(Ingredient(
                        id=ing.get("id", ""),
                        amount=ing.get("amount", ""),
                        unit=ing.get("unit", "")
                    ))
                
                drink = Drink(
                    id=drink_dict.get("id", ""),
                    name=drink_dict.get("name", ""),
                    description=drink_dict.get("description", ""),
                    ingredients=ingredients,
                    instructions=drink_dict.get("method", "").split(". "),
                    glass_type=drink_dict.get("glass", ""),
                    image_url=drink_dict.get("image_url", ""),
                    tags=drink_dict.get("tags", []),
                    flavor_profile=drink_dict.get("flavor_profile", []),
                    base_spirit=next((ing["id"] for ing in drink_dict.get("ingredients", []) 
                                   if ing["id"] in ["vodka", "rum", "gin", "tequila", "whiskey"]), "other"),
                    difficulty=drink_dict.get("difficulty", 1),
                    prep_time_minutes=drink_dict.get("prep_time_minutes", 5)
                )
                drinks.append(drink)
            
            return drinks
        except Exception as e:
            print(f"Error loading drinks: {str(e)}")
            return []
    
    def recommend(self, preferences: Dict[str, Any], limit: int = 5) -> List[Drink]:
        """Generate drink recommendations based on user preferences"""
        # If we have no drinks, return empty list
        if not self.drinks:
            return []
            
        scored_drinks = []
        
        for drink in self.drinks:
            score = self._calculate_score(drink, preferences)
            scored_drinks.append((drink, score))
        
        # Sort by score (highest first) and return top matches
        scored_drinks.sort(key=lambda x: x[1], reverse=True)
        return [drink for drink, _ in scored_drinks[:limit]]
    
    def _calculate_score(self, drink: Drink, preferences: Dict[str, Any]) -> float:
        """Calculate match score between a drink and user preferences"""
        score = 0.0
        
        # Spirit preference (weighted heavily)
        if preferences.get('spirits', {}).get(drink.base_spirit.lower(), False):
            score += 30
            
        # Flavor profile match
        user_flavors = preferences.get('flavors', {})
        for flavor in drink.flavor_profile:
            if flavor.lower() in user_flavors:
                # Add points based on how much the user likes this flavor
                flavor_score = user_flavors[flavor.lower()] * 3
                score += flavor_score
        
        # Complexity match (closer = better)
        user_complexity = preferences.get('complexity', 3)
        complexity_diff = abs(user_complexity - drink.difficulty)
        score -= complexity_diff * 5  # Penalty for complexity mismatch
        
        # Occasion match
        if preferences.get('occasion') and any(tag.startswith('occasion:') and tag.endswith(preferences['occasion']) for tag in drink.tags):
            score += 15
            
        return score