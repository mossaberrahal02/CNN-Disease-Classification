# CNN-Disease-Classification

1- Direct Backend Inference

Frontend (user uploads image)
   ↓
Backend (FastAPI loads model + runs prediction)
   ↓
Returns result to frontend

Pros:

    Easy to build
    No extra setup (no Docker, no external services)
    Good for learning, small apps

Cons:

    Your backend becomes heavy
    Only works well if your backend is in Python
    You must restart the server if the model changes
    Doesn't scale well for many users

2- TensorFlow Serving

run the model in a separate server, and the backend only sends prediction requests

    * save the model (model.save("my_model/1"))
    * run TensorFlow Serving (usually in Docker) to host it   ```docker run -p 8501:8501 ...``` This creates an HTTP API like http://localhost:8501/v1/models/my_model:predict
    the backend sends images to that URL and gets predictions.


Frontend (user uploads image)
   ↓
Backend (forwards image to TensorFlow Serving API)
   ↓
TensorFlow Serving (model runs here → returns prediction)
   ↓
Backend → Frontend

Pros:

    Backend becomes lighter (no model loading)
    Works with any backend language (Node.js, Go, etc.)
    Supports model versioning
    Better for production and scaling
Cons:

    Requires Docker or setup
    Slightly more complex
    You need to handle communication between backend and model server
