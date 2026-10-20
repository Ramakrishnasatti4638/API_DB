# Sample Store API

A small FastAPI service that exposes a sample product catalog for a demo store.
It offers a list endpoint and a single-product lookup endpoint, with an
optional Redis cache (`REDIS_URL`, default `redis://localhost:6379`) that
fails open: when Redis is unreachable the API keeps working without raising
errors. CORS is enabled for `http://localhost:5173` so a local frontend can
call the API directly.

Install:

```
pip install -r requirements.txt
```

Start the server:

```
uvicorn app.main:app --port 8000
```

Run the tests (works even if Redis is not running):

```
pytest
```