from fastapi import FastAPI, Request, HTTPException, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
import os, uvicorn, time
from pydantic import BaseModel
from typing import Optional
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
from selenium import webdriver
import string
import time

import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=2)

FLAG = os.getenv('FLAG', 'openECSC{TEST_FLAG}')

app = FastAPI()
templates = Jinja2Templates(directory="templates")

events = {}


class EventURL(BaseModel):
    protocol: str
    domain: str
    port: Optional[int]
    path: str

    def to_url(self) -> str:
        """Reconstruct the full URL."""
        netloc = self.domain
        if self.port:
            netloc += f":{self.port}"
        return f"{self.protocol}://{netloc}{self.path}"

class Event(BaseModel):
    name: str
    URL: EventURL


event = Event(
    name="Seiba",
    URL=EventURL(
        protocol="http",
        domain="example.com",
        port=80,
        path=""
    )
)

events[1] = event


@app.get("/")
async def get_index(request: Request):

    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/event/{event_id}", response_class=HTMLResponse)
async def get_event(request: Request, event_id: int, auto_redir: bool=False):

    event = events.get(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return templates.TemplateResponse("event.html", {
        "request": request,
        "event_name": event.name,
        "event_url": event.URL,
        "auto_redir": auto_redir,
        "next": next
    })


@app.post("/event")
async def post_event(
    name: str = Form(...),
    protocol: str = Form(...),
    domain: str = Form(...),
    port: Optional[int] = Form(None),
    path: str = Form(...)
):
    if any([i for i in protocol if i not in string.ascii_lowercase]):
        return RedirectResponse(url="/", status_code=303)
        
    event_id = len(events) + 1
    event = Event(
        name=name,
        URL=EventURL(protocol=protocol, domain=domain, port=port, path=path)
    )
    events[event_id] = event

    return RedirectResponse(url=f"/event/{event_id}", status_code=303)


@app.get("/report")
async def get_report(request: Request):

    return templates.TemplateResponse("report.html", {"request": request})


@app.post("/report")
async def post_report(request: Request, url: str = Form(...)):
    if not url.startswith("http://127.0.0.1/"):
        return templates.TemplateResponse("report.html", {"request": request, "status": "Invalid URL!"})

    await run_selenium(url)

    return { "status": "Admin visited reported page!" }


def selenium_task(url: str):
    
    options = Options()
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    service = Service("/usr/local/bin/geckodriver")  # install geckodriver via apt or wget

    driver = webdriver.Firefox(service=service, options=options)

    driver.set_page_load_timeout(10)
    
    try:
        driver.get("http://127.0.0.1/")

        driver.add_cookie({
            "name": "admin",
            "value": FLAG,
            "path": "/",
            "httpOnly": False,
        })

        driver.get(url)

        time.sleep(10)

    finally:
        driver.quit()


async def run_selenium(url: str):
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(executor, selenium_task, url)

uvicorn.run(app=app, host='0.0.0.0', port=80)
