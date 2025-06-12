# 🥔 Potato Disease Classification System

A full-stack machine learning application that uses CNN to classify potato diseases from leaf images. The system can detect Early Blight, Late Blight, and identify Healthy potato plants.

### Option 1: Using Makefile (Linux/macOS/WSL)
```bash
make setup    # Setup both backend and frontend
make start    # Get instructions to start both services
```

### Option 2: Using Setup Scripts

**Linux/macOS/Git Bash:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows Command Prompt:**
```cmd
setup.bat
```

### Option 3: Manual Setup

**Backend Setup:**
```bash
python3 -m venv myenv
source myenv/bin/activate  # On Windows: myenv\Scripts\activate
pip install -r requirements.txt
```

**Frontend Setup:**
```bash
cd frontend
npm install
```

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+ and npm
- Git (optional, for cloning)

## 🏃‍♂️ Running the Application

Open **two terminals**:

**Terminal 1 (Backend):**
```bash
cd api
source ../myenv/bin/activate  # Windows: ..\myenv\Scripts\activate
python main.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

Access the application:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs






## Architecture

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
