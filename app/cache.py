import json
import os

import redis

REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379")

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = redis.Redis.from_url(REDIS_URL, socket_connect_timeout=1)
    return _client


def get_cached(key):
    try:
        raw = _get_client().get(key)
    except (redis.RedisError, OSError):
        return None
    if raw is None:
        return None
    try:
        return json.loads(raw)
    except (ValueError, TypeError):
        return None


def set_cached(key, value, ttl=60):
    try:
        _get_client().set(key, json.dumps(value), ex=ttl)
    except (redis.RedisError, OSError):
        return None
    return None