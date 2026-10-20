from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.cache import get_cached, set_cached
from app.data import PRODUCTS

app = FastAPI(title="Sample Store API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _find_product(product_id: int):
    for product in PRODUCTS:
        if product["id"] == product_id:
            return product
    return None


@app.get("/api/products")
def list_products():
    return {"products": PRODUCTS}


@app.get("/api/products/{product_id}")
def get_product(product_id: int):
    cache_key = f"product:{product_id}"
    cached = get_cached(cache_key)
    if cached is not None:
        return cached

    product = _find_product(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    set_cached(cache_key, product)
    return product