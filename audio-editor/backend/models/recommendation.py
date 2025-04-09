# backend/models/recommendation.py
from typing import List, Dict, Any
import json
from pathlib import Path
from models.drink import Drink

class DrinkRecommender:
    def __init__(self):
        self.drinks = self._load_drinks()
    
    def _load_drinks(self) -> List[Drink]:
        """Load drinks from the JSON database"""
        data_file = Path(__file__).parent.parent / "data" / "drinks.json"
        with open(data_file, "r") as f:
            drinks_data = json.load(f)
        
        # Handle empty file case
        if not drinks_data:
            return []
            
        return [Drink(**drink) for drink in drinks_data]
    
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