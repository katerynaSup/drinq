from pydantic import BaseModel, Field
from typing import List, Optional

class Ingredient(BaseModel):
    id: str
    name: Optional[str] = None
    amount: str
    unit: Optional[str] = None
    
    def __init__(self, **data):
        if 'id' in data and 'name' not in data:
            data['name'] = data['id'].replace('-', ' ').title()
        super().__init__(**data)

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