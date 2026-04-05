import os
import uuid
import mimetypes
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Import Engines
from backend.engine.image_pipeline import analyze_image
from backend.engine.audio_pipeline import analyze_audio
from backend.engine.video_pipeline import analyze_video

import httpx
from pydantic import BaseModel

app = FastAPI(title="TrustLens Multimodal Deepfake Engine")

class DetectRequest(BaseModel):
    type: str # 'image', 'video', 'audio'
    data: str # URL

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure folders exist
TEMP_DIR = os.path.join(os.path.dirname(__file__), "storage", "temp")
HEATMAP_DIR = os.path.join(os.path.dirname(__file__), "storage", "heatmaps")
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(HEATMAP_DIR, exist_ok=True)

# Mount heatmaps folder statically so frontend can access `heatmap_overlay_url`
app.mount("/storage/heatmaps", StaticFiles(directory=HEATMAP_DIR), name="heatmaps")

@app.post("/api/v1/verify")
async def verify_media(media: UploadFile = File(...)):
    session_id = f"TL-{uuid.uuid4().hex[:8].upper()}-{uuid.uuid4().hex[:4].upper()}"
    
    # Save the file temporarily
    temp_path = os.path.join(TEMP_DIR, f"{session_id}_{media.filename}")
    try:
        content = await media.read()
        with open(temp_path, "wb") as f:
            f.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save upload: {e}")

    # Determine type
    mime_type, _ = mimetypes.guess_type(temp_path)
    if not mime_type:
        mime_type = media.content_type
        
    try:
        if mime_type and mime_type.startswith("image"):
            result = analyze_image(temp_path)
        elif mime_type and mime_type.startswith("audio"):
            result = analyze_audio(temp_path)
        elif mime_type and mime_type.startswith("video"):
            result = analyze_video(temp_path)
        else:
            raise ValueError("Unsupported media format")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Inference error: {str(e)}")
    finally:
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)

    # Format exactly as frontent_reqmts.md dictates
    overall_auth = result["score"]
    
    # Risk Level mapping per frontent_reqmts.md
    # Thresholds: < 60% indicates high probability of manipulation.
    # I'll refine this:
    # LOW: > 80
    # MEDIUM: 60-80
    # HIGH: 40-60
    # CRITICAL: < 40
    if overall_auth < 40:
        risk_level = "CRITICAL"
    elif overall_auth < 60:
        risk_level = "HIGH"
    elif overall_auth < 80:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # Modalities list
    modalities = [
        {
            "type": result["type"],
            "score": round(overall_auth, 2),
            "anomalies_detected": result["anomalies_detected"],
            "details": result["details"]
        }
    ]

    # Forensic Analysis
    forensic = {
        "lip_sync_deviation": result.get("lip_sync_deviation", "0.00%"),
        "artifact_density": "High" if result["anomalies_detected"] else "Low",
        "neural_signature": "Anomalous" if result["anomalies_detected"] else "Clean",
        "latent_distortion_value": round(result.get("_prob_fake", 0.0) / 100.0, 4)
    }
    
    if result.get("_heatmap_url"):
        # Use host from request if possible, or default to localhost
        forensic["heatmap_overlay_url"] = "http://localhost:8000" + result["_heatmap_url"]

    response = {
        "session_id": session_id,
        "overall_authenticity_score": round(overall_auth, 2),
        "risk_level": risk_level,
        "modalities": modalities,
        "forensic_analysis": forensic,
        "engine_logs": [
            "INFERENCE ENGINE INITIALIZED",
            f"DECODING BUFFER: {media.filename}",
            f"{result['type']}_ANALYSIS COMPLETED",
            f"VERDICT: {risk_level} RISK"
        ]
    }

    return response

@app.post("/detect")
async def detect_from_url(req: DetectRequest):
    """
    Special endpoint for the browser extension.
    Downloads the media from a URL and runs inference.
    """
    session_id = f"EXT-{uuid.uuid4().hex[:8].upper()}"
    ext = mimetypes.guess_extension(req.data.split('?')[0]) or ""
    temp_filename = f"{session_id}{ext}"
    temp_path = os.path.join(TEMP_DIR, temp_filename)
    
    print(f"Extension request: {req.type} from {req.data}")
    
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(req.data, follow_redirects=True, timeout=30.0)
            if resp.status_code != 200:
                raise HTTPException(status_code=400, detail=f"Failed to fetch media from URL: {resp.status_code}")
            
            with open(temp_path, "wb") as f:
                f.write(resp.content)
                
        # Perform analysis based on type
        if req.type == "image":
            result = analyze_image(temp_path)
        elif req.type == "audio":
            result = analyze_audio(temp_path)
        elif req.type == "video":
            result = analyze_video(temp_path)
        else:
            raise ValueError(f"Unsupported type: {req.type}")
            
        # Determine the correct confidence for the EXTENSION
        # The extension expects 'confidence' to be the confidence in the returned 'isDeepfake' value
        if result["anomalies_detected"]:
            confidence = result["_prob_fake"] / 100.0
        else:
            confidence = result["_prob_real"] / 100.0
            
        return {
            "isDeepfake": result["anomalies_detected"],
            "confidence": round(confidence, 4)
        }
        
    except Exception as e:
        print(f"Extension analysis error: {e}")
        return {
            "isDeepfake": False,
            "confidence": 0.0,
            "error": str(e)
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=False)
