<<<<<<< HEAD
from fastapi import FastAPI, Request, HTTPException
import os
import httpx

app = FastAPI(title="Echo Gate")

ATLAS_ADDR = os.environ.get("ATLAS_ADDR", "http://localhost:5173")

def _is_internal(ip: str) -> bool:
    if not ip:
        return False
    return ip.startswith("172.")

@app.get("/")
async def status():
    return {"service": "Echo Gate", "note": "courier gateway"}

@app.get("/artifact")
async def artifact(request: Request, path: str):
    forwarded = request.headers.get("x-forwarded-for")
    client_ip = forwarded.split(",")[0].strip() if forwarded else request.client.host

    if not _is_internal(client_ip):
        raise HTTPException(status_code=403, detail="access denied")

    # if not path.startswith("/_artifact/"):
    #     raise HTTPException(status_code=400, detail="invalid artifact path")

    target = ATLAS_ADDR.rstrip("/") + path
    print(target)
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            r = await client.get(target)
        except Exception as e:
            raise HTTPException(status_code=502, detail="upstream error")

    return {"status": r.status_code, "body": r.text}
=======
from fastapi import FastAPI, Request, HTTPException
import os
import httpx

app = FastAPI(title="Echo Gate")

ATLAS_ADDR = os.environ.get("ATLAS_ADDR", "http://localhost:5173")

def _is_internal(ip: str) -> bool:
    if not ip:
        return False
    return ip.startswith("172.")

@app.get("/")
async def status():
    return {"service": "Echo Gate", "note": "courier gateway"}

@app.get("/artifact")
async def artifact(request: Request, path: str):
    forwarded = request.headers.get("x-forwarded-for")
    client_ip = forwarded.split(",")[0].strip() if forwarded else request.client.host

    if not _is_internal(client_ip):
        raise HTTPException(status_code=403, detail="access denied")

    # if not path.startswith("/_artifact/"):
    #     raise HTTPException(status_code=400, detail="invalid artifact path")

    target = ATLAS_ADDR.rstrip("/") + path
    print(target)
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            r = await client.get(target)
        except Exception as e:
            raise HTTPException(status_code=502, detail="upstream error")

    return {"status": r.status_code, "body": r.text}
>>>>>>> d4a2367056d677336c8a5b16802e91d113b52a21
