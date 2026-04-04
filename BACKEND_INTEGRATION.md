# TrustLens Backend Integration Requirements

This document specifies the API requirements for the **Multimodal Deepfake Detection Engine** backend. The goal is to provide a standardized interface for the frontend to communicate with AI-driven detection models.

## 1. Core Architecture
The frontend expects a RESTful or WebSocket-based communication layer. For the initial version, the frontend is designed to handle a `POST` request for file analysis.

## 2. API Endpoints

### 2.1. File Verification
**Endpoint:** `POST /api/v1/verify`  
**Content-Type:** `multipart/form-data`

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `media` | File | The media file to analyze (MP4, MOV, WAV, MP3, JPG, PNG). |

**Expected JSON Response:**
```json
{
  "session_id": "TL-XXXX-XXXX",
  "overall_authenticity_score": 94.8,
  "risk_level": "LOW",
  "modalities": [
    {
      "type": "VIDEO",
      "score": 95.2,
      "anomalies_detected": false,
      "details": "High facial consistency detected."
    },
    {
      "type": "AUDIO",
      "score": 99.1,
      "anomalies_detected": false,
      "details": "Natural spectral density."
    }
  ],
  "forensic_analysis": {
    "lip_sync_deviation": "0.002%",
    "artifact_density": "Low",
    "neural_signature": "Clean",
    "heatmap_overlay_url": "https://api.trustlens.ai/storage/heatmaps/xyz.png",
    "latent_distortion_value": 0.0234
  },
  "engine_logs": [
    "INFERENCE ENGINE V.3.1.0 INITIALIZED",
    "DECODING FRAME BUFFERS...",
    "AUDIO_SPECTRAL ANALYSIS: STABLE",
    "SIGNAL_TO_NOISE_RATIO: 124db"
  ]
}
```

## 3. Data Definitions

### 3.1. Authenticity Score
- **Range:** 0.0 to 100.0.
- **Critical Threshold:** < 60% indicates a high probability of manipulation.

### 3.2. Forensic Heatmap
The frontend displays a heatmap overlay. The response should provide a URL to a transparent PNG or SVG where manipulated regions are highlighted in hot colors (red/orange).
- **Format:** Image Overlay or a coordinate grid (e.g., `[[x, y, intensity], ...]`).

### 3.3. Risk Level Enum
- `LOW`: Safe.
- `MEDIUM`: Potential minor artifacting.
- `HIGH`: Confirmed deepfake/manipulation.
- `CRITICAL`: High-confidence adversarial attack.

## 4. Suggested Models for Implementation
To fulfill these requirements, the backend could utilize:
- **Audio:** SincNet or SpecRNet for synthetic voice detection.
- **Video:** MesoNet or Xception-based deepfake classifiers.
- **Sync:** LipFORENSICS for multimodal (audio-visual) mismatch detection.

## 5. Future WebSocket Implementation (Real-time)
For real-time results, a WebSocket connection at `WS /api/v1/stream-analysis` is recommended:
- **Event:** `inference_step`
- **Payload:** `{ "progress": 25, "log_entry": "Processing Frame 120/1000", "partial_score": 92.1 }`
