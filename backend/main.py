import os
import re
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Meeting Bot Dispatcher")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JoinRequest(BaseModel):
    platform: str
    meeting_url: str

class LeaveRequest(BaseModel):
    platform: str
    meeting_url: str  # We will parse the native ID from this

# Vexa Hosted API configuration
VEXA_API_KEY = os.getenv("VEXA_API_KEY")
VEXA_BASE_URL = "https://api.cloud.vexa.ai"

PLATFORM_MAP = {
    "google_meet": "google_meet",
    "zoom": "zoom",
    "teams": "teams",
}

def extract_native_meeting_id(platform: str, meeting_url: str) -> str:
    """Extract Vexa's native_meeting_id from a full meeting URL."""
    url = meeting_url.strip()
    
    if platform == "google_meet":
        match = re.search(r"meet\.google\.com/([a-z0-9-]+)", url)
        if match:
            return match.group(1)
        if re.fullmatch(r"[a-z0-9-]+", url):
            return url
        raise ValueError(f"Could not extract Google Meet code from URL: {url}")
    
    elif platform == "zoom":
        match = re.search(r"/j/(\d+)", url)
        if match:
            return match.group(1)
        if re.fullmatch(r"\d+", url):
            return url
        raise ValueError(f"Could not extract Zoom meeting ID from URL: {url}")
    
    elif platform == "teams":
        match = re.search(r"/meet/(\d+)", url)
        if match:
            return match.group(1)
        match = re.search(r"meetup-join/([^/]+)", url)
        if match:
            return match.group(1)
        if re.fullmatch(r"\d+", url):
            return url
        raise ValueError(f"Could not extract Teams meeting ID from URL: {url}")
    
    raise ValueError(f"Unsupported platform: {platform}")


@app.post("/api/bot/join")
async def join_meeting(request: JoinRequest):
    if not VEXA_API_KEY:
        raise HTTPException(status_code=500, detail="VEXA_API_KEY is missing.")
    
    platform = PLATFORM_MAP.get(request.platform.lower())
    if not platform:
        raise HTTPException(status_code=400, detail=f"Unsupported platform: {request.platform}")
    
    try:
        native_meeting_id = extract_native_meeting_id(platform, request.meeting_url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    payload = {
        "platform": platform,
        "native_meeting_id": native_meeting_id,
        "bot_name": "Sphere",
    }
    
    headers = {
        "X-API-Key": VEXA_API_KEY,
        "Content-Type": "application/json",
    }
    
    try:
        response = requests.post(
            f"{VEXA_BASE_URL}/bots",
            json=payload,
            headers=headers,
            timeout=30,
        )
        
        if response.status_code not in (200, 201):
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Vexa API Error ({response.status_code}): {response.text}",
            )
        
        data = response.json()
        return {
            "status": "success",
            "message": "Sphere bot is joining the meeting!",
            "bot_id": data.get("id"),
            "meeting_status": data.get("status"),
        }
    
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Vexa API timed out.")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Server connection error: {str(e)}")


@app.post("/api/bot/leave")
async def leave_meeting(request: LeaveRequest):
    """Signals the Vexa bot to leave the meeting."""
    if not VEXA_API_KEY:
        raise HTTPException(status_code=500, detail="VEXA_API_KEY is missing.")
    
    platform = PLATFORM_MAP.get(request.platform.lower())
    if not platform:
        raise HTTPException(status_code=400, detail=f"Unsupported platform: {request.platform}")
    
    try:
        native_meeting_id = extract_native_meeting_id(platform, request.meeting_url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    headers = {
        "X-API-Key": VEXA_API_KEY,
    }
    
    try:
        # Vexa's endpoint to stop/leave a bot
        response = requests.delete(
            f"{VEXA_BASE_URL}/bots/{platform}/{native_meeting_id}",
            headers=headers,
            timeout=30,
        )
        
        # Vexa returns 202 Accepted or 200 OK on successful stop
        if response.status_code not in (200, 202):
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Vexa API Error ({response.status_code}): {response.text}",
            )
        
        # Try to parse JSON, but handle cases where it might be empty
        try:
            data = response.json()
        except ValueError:
            data = {}
            
        return {
            "status": "success",
            "message": "Sphere bot meeting leave kar raha hai!",
            "vex_response": data,
        }
    
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Vexa API timed out.")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Server connection error: {str(e)}")