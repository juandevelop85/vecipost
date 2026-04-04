from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

# In-memory database substitute
items_db = []

class Item(BaseModel):
    id: int
    name: str
    description: str = None

@app.get("/items", response_model=List[Item])
async def get_items():
    return items_db

@app.post("/items", response_model=Item)
async def create_item(item: Item):
    # Check if item with the same id already exists
    for existing_item in items_db:
        if existing_item.id == item.id:
            return {"error": "Item with this ID already exists."}
    items_db.append(item)
    return item
