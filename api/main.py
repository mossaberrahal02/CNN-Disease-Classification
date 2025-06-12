from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import os
from typing import List, Dict
import json
from datetime import datetime

app = FastAPI(
    title="Potato Disease Classification API",
    description="API for classifying potato diseases using CNN",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model with error handling
try:
    MODEL_PATH = "/home/merrahal/Desktop/detection/models/potatoes_v1.h5"
    if not os.path.exists(MODEL_PATH):
        # Fallback to relative path
        MODEL_PATH = "../models/potatoes_v1.h5"
    MODEL = tf.keras.models.load_model(MODEL_PATH)
    MODEL_LOADED = True
except Exception as e:
    print(f"Error loading model: {e}")
    MODEL = None
    MODEL_LOADED = False
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]
SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png", ".bmp", ".tiff"]#check wah

@app.get("/")
async def root():
    return {
        "message": "Potato Disease Classification API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/ping")
async def test():
    return {"message": "Hello, World!", "timestamp": datetime.now().isoformat()}

@app.get("/health")
async def health_check():
    """Comprehensive health check including model status"""
    return {
        "status": "healthy" if MODEL_LOADED else "unhealthy",
        "model_loaded": MODEL_LOADED,
        "tensorflow_version": tf.__version__,
        "supported_classes": CLASS_NAMES,
        "supported_formats": SUPPORTED_FORMATS,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/classes")
async def get_classes():
    """Get available classification classes"""
    return {
        "classes": CLASS_NAMES,
        "total_classes": len(CLASS_NAMES),
        "class_descriptions": {
            "Early Blight": "A common potato disease caused by Alternaria solani",
            "Late Blight": "A serious potato disease caused by Phytophthora infestans", 
            "Healthy": "No disease detected - healthy potato plant"
        }
    }

def read_file_as_image(data) -> np.ndarray:
    try:
        image = np.array(Image.open(BytesIO(data)))
        return image
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

def validate_image(file: UploadFile) -> bool:
    """Validate uploaded image file"""
    if not file.content_type.startswith('image/'):
        return False
    
    file_extension = os.path.splitext(file.filename.lower())[1]
    return file_extension in SUPPORTED_FORMATS

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Predict disease class for a single image"""
    if not MODEL_LOADED:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if not validate_image(file):
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format. Supported formats: {SUPPORTED_FORMATS}"
        )
    
    try:
        # Read and process image
        image = read_file_as_image(await file.read())
        img_batch = np.expand_dims(image, 0)
        
        # Make prediction
        predictions = MODEL.predict(img_batch)
        predicted_class_index = np.argmax(predictions[0])
        predicted_class = CLASS_NAMES[predicted_class_index]
        confidence = float(np.max(predictions[0]))
        
        # Get all class probabilities
        class_probabilities = {
            CLASS_NAMES[i]: float(predictions[0][i]) 
            for i in range(len(CLASS_NAMES))
        }
        
        return {
            'filename': file.filename,
            'predicted_class': predicted_class,
            'confidence': confidence,
            'class_probabilities': class_probabilities,
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/batch")
async def predict_batch(files: List[UploadFile] = File(...)):
    """Predict disease classes for multiple images"""
    if not MODEL_LOADED:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if len(files) > 10:  # Limit batch size
        raise HTTPException(status_code=400, detail="Maximum 10 files allowed per batch")
    
    results = []
    
    for file in files:
        try:
            if not validate_image(file):
                results.append({
                    'filename': file.filename,
                    'error': f"Unsupported file format. Supported: {SUPPORTED_FORMATS}"
                })
                continue
            
            # Process image
            image = read_file_as_image(await file.read())
            img_batch = np.expand_dims(image, 0)
            
            # Make prediction
            predictions = MODEL.predict(img_batch)
            predicted_class_index = np.argmax(predictions[0])
            predicted_class = CLASS_NAMES[predicted_class_index]
            confidence = float(np.max(predictions[0]))
            
            class_probabilities = {
                CLASS_NAMES[i]: float(predictions[0][i]) 
                for i in range(len(CLASS_NAMES))
            }
            
            results.append({
                'filename': file.filename,
                'predicted_class': predicted_class,
                'confidence': confidence,
                'class_probabilities': class_probabilities,
                'status': 'success'
            })
            
        except Exception as e:
            results.append({
                'filename': file.filename,
                'error': str(e),
                'status': 'error'
            })
    
    return {
        'total_files': len(files),
        'successful_predictions': len([r for r in results if r.get('status') == 'success']),
        'failed_predictions': len([r for r in results if r.get('status') == 'error']),
        'results': results,
        'timestamp': datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(app, port=8000, host="localhost")