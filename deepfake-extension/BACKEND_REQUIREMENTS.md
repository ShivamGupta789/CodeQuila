# Backend Requirements for Deepfake Detector Extension

To successfully connect this browser extension to your local deepfake detection backend, your server must meet the following requirements.

## 1. Network & CORS Requirements

Because the extension makes requests from the context of whatever website you are visiting, your backend will receive Cross-Origin requests.

*   **Host/Port:** By default, the extension expects the server to be running at `http://127.0.0.1:5000`. You can change this in the extension's popup UI.
*   **CORS:** Cross-Origin Resource Sharing **must** be enabled. You need to allow all origins (`*`) while testing.

## 2. API Contract

The extension expects a single POST endpoint for analysis.

### Endpoint
`POST http://127.0.0.1:5000/detect`
*(Note: If your endpoint is different, update the URL in the extension popup.)*

### Expected Request (from Extension to Backend)
The extension will send a JSON payload with the `Content-Type: application/json` header.

```json
{
  "type": "image", 
  "data": "https://example.com/path/to/media.jpg"
}
```
*   `type`: A string indicating the media type. Currently supported types from the extension are `"image"`, `"video"`, and `"audio"`.
*   `data`: A string. For now, this is the absolute URL to the media source (`src` attribute) found on the webpage. 
*   *Note: Your backend must be capable of fetching the media from this URL to run inference on it.*

### Expected Response (from Backend to Extension)
The backend must respond with a `200 OK` status and a JSON body containing the detection results.

```json
{
  "isDeepfake": true,
  "confidence": 0.95
}
```
*   `isDeepfake`: A boolean (`true` or `false`) indicating if the model thinks the media is fake.
*   `confidence`: A float between 0.0 and 1.0 indicating the model's certainty. (e.g., 0.95 = 95% confident).

## 3. Example Implementations

### Using Flask (Python)

Install requirements: `pip install Flask Flask-Cors requests`

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app) 

@app.route('/detect', methods=['POST'])
def detect_deepfake():
    req_data = request.get_json()
    
    media_type = req_data.get('type')
    media_url = req_data.get('data')
    
    print(f"Received request to analyze {media_type} at URL: {media_url}")
    
    # --- YOUR ML LOGIC GOES HERE ---
    # 1. Download the media from media_url
    # 2. Run it through your model
    # 3. Determine if it's a deepfake
    
    # Mock result
    is_fake = True 
    confidence = 0.98

    # Return exactly what the extension expects
    return jsonify({
        "isDeepfake": is_fake,
        "confidence": confidence
    })

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
```

### Using FastAPI (Python)

Install requirements: `pip install fastapi uvicorn requests`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RequestData(BaseModel):
    type: str
    data: str

@app.post("/detect")
async def detect_deepfake(req: RequestData):
    print(f"Received request to analyze {req.type} at URL: {req.data}")
    
    # --- YOUR ML LOGIC GOES HERE ---
    
    # Mock result
    return {
        "isDeepfake": False,
        "confidence": 0.88
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)
```
