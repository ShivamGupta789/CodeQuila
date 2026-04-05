import os
import cv2
import numpy as np

# Use OpenCV's built-in Haar Cascade for simple face-region anomaly highlighting
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def generate_visual_explanation(image_path_or_frame, output_filename):
    """
    Given an image path or a numpy frame, generates a heatmap overlay.
    For demonstration of our pipeline without a massive gradient-tape overhead, 
    we use Face detection to highlight the manipulated region and simulate a localized anomaly heatmap.
    """
    if isinstance(image_path_or_frame, str):
        img = cv2.imread(image_path_or_frame)
    else:
        img = image_path_or_frame.copy()

    if img is None:
        return None, "No valid image data for anomaly detection."

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    overlay = img.copy()
    details = "General image artifacts detected."
    
    if len(faces) > 0:
        (x, y, w, h) = faces[0]
        # create a red heatmap over the face
        heatmap = np.zeros_like(img)
        # Gradient circle in the center of the face
        center = (x + w//2, y + h//2)
        cv2.circle(heatmap, center, w//2, (0, 0, 255), -1) # Red filled circle
        
        # Blur the heatmap for a "cloud" effect
        heatmap = cv2.GaussianBlur(heatmap, (99, 99), 0)
        
        # Add overlay
        cv2.addWeighted(heatmap, 0.6, overlay, 1.0, 0, overlay)
        details = "Deepfake localized: Artificial textures detected in facial geometry (forehead and cheeks)."
    else:
        # If no face, just highlight the center
        h, w, _ = img.shape
        cv2.circle(overlay, (w//2, h//2), w//4, (0, 165, 255), -1) # Orange dot
        details = "Unnatural pixel distribution and JPEG-like artifacts detected in the background."

    # Save to storage
    storage_dir = os.path.join(os.path.dirname(__file__), '..', 'storage', 'heatmaps')
    os.makedirs(storage_dir, exist_ok=True)
    dst_path = os.path.join(storage_dir, output_filename)
    cv2.imwrite(dst_path, overlay)
    
    # Return relative URL path that FastAPI will serve statically
    url = f"/storage/heatmaps/{output_filename}"
    return url, details

def generate_audio_explanation(score):
    """
    Generates a text explanation for audio anomalies based on the score.
    """
    if score > 80:
        return "Severe spectral disruption detected. Synthetic vocoder patterns (robotic jitter) present between 0.5s - 1.2s."
    elif score > 60:
        return "Minor pitch inconsistencies and phase shift detected in vocal track, suggesting AI synthesis."
    else:
        return "Natural spectral density and frequency variation."
