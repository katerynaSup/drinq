from pydantic import BaseModel
from typing import List, Optional

class Ingredient(BaseModel):
    name: str
    amount: str
    unit: Optional[str] = None

class Drink(BaseModel):
    id: str
    name: str
    description: str
    ingredients: List[Ingredient]
    instructions: List[str]
    glass_type: str
    image_url: Optional[str] = None
    tags: List[str] = []
    flavor_profile: List[str] = []
    base_spirit: str
    difficulty: int  # 1-5 scale
    prep_time_minutes: int