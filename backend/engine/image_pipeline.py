import os
import cv2
import numpy as np
import tensorflow as tf
import uuid
from backend.explainers.explainability import generate_visual_explanation

# Load the local Xception model once when the pipeline starts
# We use the reconstruction method confirmed by verify_recon.py to bypass Keras 3 issues
MODEL_PATH = r"d:\coding\model-test\extra\image\XceptionModel.keras"

print(f"Loading Image Pipeline via reconstruction from {MODEL_PATH}...")

def load_with_reconstruction():
    try:
        base_model = tf.keras.applications.Xception(weights=None, include_top=False, input_shape=(299, 299, 3))
        # This architecture was verified to match the weights in verify_recon.py
        model = tf.keras.Sequential([
            base_model,
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(512, name='dense'), 
            tf.keras.layers.Dense(128, name='dense_1'),
            tf.keras.layers.Dense(2, activation='softmax', name='dense_2')
        ])
        model.load_weights(MODEL_PATH)
        return model
    except Exception as e:
        print(f"Failed to reconstruct image model: {e}")
        return None

image_model = load_with_reconstruction()

def analyze_image(file_path):
    if image_model is None:
        raise Exception("Image model not loaded.")

    # Prepare Image
    img = cv2.imread(file_path)
    if img is None:
        raise ValueError("Invalid image file.")
        
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    # Xception expects (299, 299)
    img_resized = cv2.resize(img_rgb, (299, 299)) 
    
    # Normalization: Xception expects [-1, 1]
    img_normalized = (img_resized / 127.5) - 1.0
    
    input_tensor = np.expand_dims(img_normalized, axis=0)
    
    # Predict
    preds = image_model.predict(input_tensor, verbose=0)
    
    # For a 2-unit softmax output, [Class 0, Class 1]
    # Standard deepfake classification often uses [REAL, FAKE] or [FAKE, REAL].
    # Based on our validation, index 0 is REAL and index 1 is FAKE.
    prob_real = float(preds[0][0]) * 100
    prob_fake = float(preds[0][1]) * 100
    
    # Explainability Data
    anomalies_detected = prob_fake > 50.0
    heatmap_url = None
    details = "Image morphology is consistent and natural."
    
    if anomalies_detected:
        heat_filename = f"heatmap_{uuid.uuid4().hex[:8]}.png"
        heatmap_url, details = generate_visual_explanation(file_path, heat_filename)

    return {
        "type": "IMAGE",
        "score": prob_real, # Authenticity score
        "anomalies_detected": anomalies_detected,
        "details": details,
        "_prob_real": prob_real,
        "_prob_fake": prob_fake,
        "_heatmap_url": heatmap_url
    }
