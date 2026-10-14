import os
import re
import json
import ssl
import requests
import websockets
from fastapi import FastAPI, HTTPException, WebSocket, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate
import jwt
import datetime

load_dotenv()

# ✅ Sirf aik dafa app initialize karein
app = FastAPI(title="SPHERE Backend")

# Secret key for JWT token encoding/decoding
SECRET_KEY = "sphere_secret_key_12345"
ALGORITHM = "HS256"

# ✅ CORS middleware (sab requests ke liye)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vite frontend & all origins allowed for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary in-memory user database
fake_users_db = {
    "ayesha@company.com": "password123"
}

# Request body validation schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    fullName: str
    email: str
    password: str

class JoinRequest(BaseModel):
    platform: str
    meeting_url: str

class LeaveRequest(BaseModel):
    platform: str
    meeting_url: str

VEXA_API_KEY = os.getenv("VEXA_API_KEY")
VEXA_BASE_URL = "https://api.cloud.vexa.ai"
VEXA_WS_URL = "wss://api.cloud.vexa.ai/ws"

PLATFORM_MAP = {
    "google_meet": "google_meet",
    "zoom": "zoom",
    "teams": "teams",
}

# ⚠️ TESTING ONLY — SSL verify disabled
_ssl_ctx = ssl.create_default_context()
_ssl_ctx.check_hostname = False
_ssl_ctx.verify_mode = ssl.CERT_NONE


# ==================== AUTH ENDPOINTS ====================
@app.post("/api/login")
async def login(credentials: LoginRequest):
    if credentials.email in fake_users_db and fake_users_db[credentials.email] == credentials.password:
        
        # Token generate karna (expires in 2 hours)
        expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        token_payload = {
            "sub": credentials.email,
            "exp": expiration
        }
        token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)

        return {
            "status": "success",
            "message": "Login successful",
            "token": token,
            "user": {
                "email": credentials.email,
                "name": "Ayesha" if credentials.email == "ayesha@company.com" else credentials.email.split("@")[0].capitalize(),
                "role": "Workspace Admin" if credentials.email == "ayesha@company.com" else "Workspace Member"
            }
        }
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password"
    )


@app.post("/api/signup")
async def signup(credentials: SignupRequest):
    if not credentials.fullName or not credentials.email or not credentials.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All fields are required"
        )
    
    if credentials.email in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Store user in our database dictionary
    fake_users_db[credentials.email] = credentials.password

    # Token generate for session setup
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    token_payload = {
        "sub": credentials.email,
        "exp": expiration
    }
    token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "status": "success",
        "message": "User registered successfully",
        "token": token,
        "user": {
            "email": credentials.email,
            "name": credentials.fullName,
            "role": "Workspace Member"
        }
    }


# ==================== TRANSLITERATION HELPER ====================
def to_hinglish(text, lang):
    if not text:
        return text

    try:
        if lang == "hi":
            result = transliterate(text, sanscript.DEVANAGARI, sanscript.ITRANS)
        elif lang == "ur":
            result = transliterate(text, sanscript.URDU, sanscript.ITRANS)
        else:
            return text

        result = result.lower()
        result = " ".join(result.split())
        return result
    except Exception as e:
        print(f"Transliteration error: {e}")
        return text


def extract_native_meeting_id(platform: str, meeting_url: str) -> str:
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


# ==================== MEETING BOT ENDPOINTS ====================
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
        "language": "hi",
        "automatic_leave": {
            "max_time_left_alone": 1800000,
            "max_wait_for_admission": 600000,
        },
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
            "message": "Sphere bot meeting join kar raha hai!",
            "bot_id": data.get("id"),
            "meeting_status": data.get("status"),
            "native_meeting_id": native_meeting_id,
        }

    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Vexa API timed out.")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Server connection error: {str(e)}")


@app.post("/api/bot/leave")
async def leave_meeting(request: LeaveRequest):
    if not VEXA_API_KEY:
        raise HTTPException(status_code=500, detail="VEXA_API_KEY is missing.")

    platform = PLATFORM_MAP.get(request.platform.lower())
    if not platform:
        raise HTTPException(status_code=400, detail=f"Unsupported platform: {request.platform}")

    try:
        native_meeting_id = extract_native_meeting_id(platform, request.meeting_url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    headers = {"X-API-Key": VEXA_API_KEY}

    try:
        response = requests.delete(
            f"{VEXA_BASE_URL}/bots/{platform}/{native_meeting_id}",
            headers=headers,
            timeout=30,
        )

        if response.status_code not in (200, 202, 404):
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Vexa API Error ({response.status_code}): {response.text}",
            )

        return {"status": "success", "message": "Bot left the meeting"}

    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Vexa API timed out.")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/bot/leave-native/{platform}/{native_meeting_id}")
async def leave_meeting_native(platform: str, native_meeting_id: str):
    if not VEXA_API_KEY:
        raise HTTPException(status_code=500, detail="VEXA_API_KEY is missing.")

    if platform not in PLATFORM_MAP.values():
        raise HTTPException(status_code=400, detail=f"Unsupported platform: {platform}")

    headers = {"X-API-Key": VEXA_API_KEY}

    try:
        response = requests.delete(
            f"{VEXA_BASE_URL}/bots/{platform}/{native_meeting_id}",
            headers=headers,
            timeout=30,
        )

        if response.status_code not in (200, 202, 404):
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Vexa API Error ({response.status_code}): {response.text}",
            )

        return {"status": "success", "message": "Bot left the meeting"}

    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Vexa API timed out.")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== WEBSOCKET ENDPOINT ====================
@app.websocket("/ws/transcript/{platform}/{native_meeting_id}")
async def transcript_websocket(
    websocket: WebSocket, platform: str, native_meeting_id: str
):
    await websocket.accept()

    if not VEXA_API_KEY:
        await websocket.send_json({"type": "error", "error": "VEXA_API_KEY missing"})
        await websocket.close()
        return

    try:
        async with websockets.connect(
            VEXA_WS_URL,
            additional_headers={"X-API-Key": VEXA_API_KEY},
            ssl=_ssl_ctx,
        ) as vexa_ws:
            subscribe_msg = {
                "action": "subscribe",
                "meetings": [
                    {"platform": platform, "native_id": native_meeting_id}
                ],
            }
            await vexa_ws.send(json.dumps(subscribe_msg))
            print(f"✅ Subscribed: {subscribe_msg}")

            async for message in vexa_ws:
                try:
                    data = json.loads(message)
                    msg_type = data.get("type")

                    if msg_type == "transcript":
                        if data.get("segment"):
                            seg = data["segment"]
                            original = seg.get("text", "")
                            seg["original_text"] = original
                            seg["text"] = to_hinglish(original, seg.get("language"))

                        for key in ("confirmed", "pending"):
                            if data.get(key) and isinstance(data[key], list):
                                for s in data[key]:
                                    original = s.get("text", "")
                                    s["original_text"] = original
                                    s["text"] = to_hinglish(original, s.get("language"))

                        if data.get("segments") and isinstance(data["segments"], list):
                            for s in data["segments"]:
                                original = s.get("text", "")
                                s["original_text"] = original
                                s["text"] = to_hinglish(original, s.get("language"))

                    await websocket.send_json(data)

                except json.JSONDecodeError:
                    await websocket.send_text(message)
                except Exception as e:
                    print(f"❌ WS loop error: {e}")

    except websockets.exceptions.ConnectionClosed:
        try:
            await websocket.send_json({"type": "error", "error": "Vexa closed"})
        except Exception:
            pass
    except Exception as e:
        print(f"❌ WS error: {e}")
        try:
            await websocket.send_json({"type": "error", "error": str(e)})
        except Exception:
            pass
    finally:
        try:
            await websocket.close()
        except Exception:
            pass