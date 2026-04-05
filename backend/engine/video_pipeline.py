import os
import cv2
import numpy as np
import tensorflow as tf
import uuid
from backend.explainers.explainability import generate_visual_explanation

MODEL_PATH = r"d:\coding\model-test\final-models\NotUrFace-AI\COMBINED_best_Phase1.keras"

print(f"Loading Video Pipeline from {MODEL_PATH}...")
# Load the local Video model once when the pipeline starts
# We use the reconstruction method from test_video.py to bypass Keras 3 issues
MODEL_PATH = r"d:\coding\model-test\final-models\NotUrFace-AI\COMBINED_best_Phase1.keras"

print(f"Loading Video Pipeline via reconstruction from {MODEL_PATH}...")
def load_video_model():
    try:
        base_model = tf.keras.applications.Xception(weights=None, include_top=False, input_shape=(299, 299, 3), pooling='avg')

        model = tf.keras.Sequential([
            tf.keras.layers.InputLayer(input_shape=(30, 299, 299, 3)),
            tf.keras.layers.TimeDistributed(base_model, name='time_distributed'),
            tf.keras.layers.LSTM(256, name='lstm'),
            tf.keras.layers.Dropout(0.5, name='dropout'),
            tf.keras.layers.Dense(2, activation='softmax', name='dense')
        ])
        model.load_weights(MODEL_PATH)
        return model
    except Exception as e:
        print(f"Failed to load video model: {e}")
        return None

video_model = load_video_model()

def analyze_video(file_path, total_frames=30, size=(299, 299)):
    if video_model is None:
        raise Exception("Video model not loaded.")

    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        raise ValueError("Invalid video file.")
        
    frames = []
    frame_count = 0
    
    # User constraint requested sampling a limited part of the video! Sticking to exactly total_frames.
    while cap.isOpened() and frame_count < total_frames:
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame = cv2.resize(frame, size)
        frame = (frame / 127.5) - 1.0 # normalize to [-1, 1]
        
        frames.append(frame)
        frame_count += 1
        
    cap.release()
    
    # Pad if video had less than 30 frames
    while len(frames) < total_frames:
        if frames: frames.append(frames[-1])
        else: frames.append(np.zeros((size[0], size[1], 3), dtype=np.float32))

    input_tensor = np.expand_dims(np.array(frames), axis=0) # (1, 30, 299, 299, 3)
    
    # Predict
    preds = video_model.predict(input_tensor, verbose=0)
    
    prob_fake = float(preds[0][0]) * 100
    prob_real = float(preds[0][1]) * 100
    
    anomalies_detected = prob_fake > 60.0
    heatmap_url = None
    details = "Frame sequences appear naturally consistent and contiguous."
    
    # Explainability: Extract a central frame for the visual explainer
    if anomalies_detected:
        heat_filename = f"heatmap_vid_{uuid.uuid4().hex[:8]}.png"
        mid_frame = frames[len(frames)//2] 
        # Revert normalized frame to BGR [0, 255] just for drawing
        vis_frame = ((mid_frame + 1.0) * 127.5).astype(np.uint8)
        vis_frame_bgr = cv2.cvtColor(vis_frame, cv2.COLOR_RGB2BGR)
        
        heatmap_url, details = generate_visual_explanation(vis_frame_bgr, heat_filename)

    return {
        "type": "VIDEO",
        "score": prob_real,
        "anomalies_detected": anomalies_detected,
        "details": details,
        "_prob_real": prob_real,
        "_prob_fake": prob_fake,
        "_heatmap_url": heatmap_url
    }
