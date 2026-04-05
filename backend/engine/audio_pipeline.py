from transformers import pipeline
import math
from backend.explainers.explainability import generate_audio_explanation

MODEL_PATH = r"d:\coding\model-test\final-models\MelodyMachine-Audio"

print(f"Loading Audio Pipeline from {MODEL_PATH}...")
try:
    audio_model = pipeline("audio-classification", model=MODEL_PATH)
except Exception as e:
    print(f"Failed to load audio pipeline: {e}")
    audio_model = None

def analyze_audio(file_path):
    if audio_model is None:
        raise Exception("Audio model not loaded.")

    try:
        preds = audio_model(file_path)
    except Exception as e:
        raise ValueError(f"Could not process audio: {str(e)}")

    prob_real = 50.0
    prob_fake = 50.0
    for p in preds:
        lbl = p['label'].lower()
        if 'real' in lbl or 'original' in lbl:
            prob_real = p['score'] * 100
        elif 'fake' in lbl or 'spoof' in lbl:
            prob_fake = p['score'] * 100

    anomalies_detected = prob_fake > 60.0
    details = generate_audio_explanation(prob_fake)

    return {
        "type": "AUDIO",
        "score": prob_real, # Score mapped to authenticity score logic
        "anomalies_detected": anomalies_detected,
        "details": details,
        "_prob_real": prob_real,
        "_prob_fake": prob_fake
    }
