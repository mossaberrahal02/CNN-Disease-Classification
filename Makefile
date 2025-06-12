# 🥔 Potato Disease Classification System
# Cross-platform Makefile for Linux and Windows (with WSL/Git Bash)

# Variables
VENV_NAME = myenv
BACKEND_DIR = api
FRONTEND_DIR = frontend

# Detect OS for different commands
ifeq ($(OS),Windows_NT)
    PYTHON = python
    PIP = pip
    VENV_ACTIVATE = $(VENV_NAME)\Scripts\activate
    RM_RF = rmdir /s /q
    MKDIR = mkdir
else
    PYTHON = python3
    PIP = $(VENV_NAME)/bin/pip
    VENV_ACTIVATE = $(VENV_NAME)/bin/activate
    RM_RF = rm -rf
    MKDIR = mkdir -p
endif

.PHONY: help setup setup-backend setup-frontend start start-backend start-frontend clean clean-all

# Default target
all: help

help:
	@echo "🥔 Potato Disease Classification System"
	@echo "========================================"
	@echo ""
	@echo "Setup Commands:"
	@echo "  make setup           # Setup complete project (backend + frontend)"
	@echo "  make setup-backend   # Setup Python backend only"
	@echo "  make setup-frontend  # Setup React frontend only"
	@echo ""
	@echo "Start Commands:"
	@echo "  make start           # Instructions to start both services"
	@echo "  make start-backend   # Start FastAPI backend server"
	@echo "  make start-frontend  # Start React frontend server"
	@echo ""
	@echo "Clean Commands:"
	@echo "  make clean           # Clean cache files"
	@echo "  make clean-all       # Remove virtual environment and node_modules"
	@echo ""
	@echo "Requirements:"
	@echo "  - Python 3.8+ installed"
	@echo "  - Node.js 14+ and npm installed"
	@echo ""

# Setup complete project
setup: setup-backend setup-frontend
	@echo "✅ Complete setup finished!"
	@echo ""
	@echo "To start the application:"
	@echo "  1. Backend:  make start-backend"
	@echo "  2. Frontend: make start-frontend"
	@echo ""
	@echo "Or see: make start"

# Setup backend
setup-backend:
	@echo "🐍 Setting up Python backend..."
	@if [ ! -d "$(VENV_NAME)" ]; then \
		$(PYTHON) -m venv $(VENV_NAME); \
		echo "Virtual environment created"; \
	fi
ifeq ($(OS),Windows_NT)
	$(VENV_NAME)\Scripts\pip install --upgrade pip
	$(VENV_NAME)\Scripts\pip install -r requirements.txt
else
	$(VENV_NAME)/bin/pip install --upgrade pip
	$(VENV_NAME)/bin/pip install -r requirements.txt
endif
	@echo "✅ Backend setup complete!"

# Setup frontend
setup-frontend:
	@echo "📦 Setting up React frontend..."
	cd $(FRONTEND_DIR) && npm install
	@echo "✅ Frontend setup complete!"

# Start commands with instructions
start:
	@echo "🚀 Starting Potato Disease Classification System"
	@echo "================================================"
	@echo ""
	@echo "Open TWO terminals and run these commands:"
	@echo ""
	@echo "Terminal 1 (Backend):"
ifeq ($(OS),Windows_NT)
	@echo "  cd $(BACKEND_DIR)"
	@echo "  ..\\$(VENV_NAME)\\Scripts\\activate"
	@echo "  python main.py"
else
	@echo "  cd $(BACKEND_DIR)"
	@echo "  source ../$(VENV_NAME)/bin/activate"
	@echo "  python main.py"
endif
	@echo ""
	@echo "Terminal 2 (Frontend):"
	@echo "  cd $(FRONTEND_DIR)"
	@echo "  npm start"
	@echo ""
	@echo "Then visit:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend API: http://localhost:8000"
	@echo "  API Docs: http://localhost:8000/docs"

# Start backend only
start-backend: setup-backend
	@echo "🚀 Starting FastAPI backend..."
	@echo "Backend will run on: http://localhost:8000"
	@echo "API docs will be at: http://localhost:8000/docs"
	@echo ""
ifeq ($(OS),Windows_NT)
	cd $(BACKEND_DIR) && ..\\$(VENV_NAME)\\Scripts\\python main.py
else
	cd $(BACKEND_DIR) && ../$(VENV_NAME)/bin/python main.py
endif

# Start frontend only
start-frontend: setup-frontend
	@echo "🎨 Starting React frontend..."
	@echo "Frontend will run on: http://localhost:3000"
	cd $(FRONTEND_DIR) && npm start

# Clean cache files
clean:
	@echo "🧹 Cleaning cache files..."
	find . -type d -name "__pycache__" -exec $(RM_RF) {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@echo "✅ Cache cleaned!"

# Remove everything (virtual env and node_modules)
clean-all:
	@echo "🧹 Removing all dependencies..."
	$(RM_RF) $(VENV_NAME) 2>/dev/null || true
	$(RM_RF) $(FRONTEND_DIR)/node_modules 2>/dev/null || true
	$(RM_RF) $(FRONTEND_DIR)/build 2>/dev/null || true
	@echo "✅ Complete cleanup finished!"
	@echo ""
	@echo "Run 'make setup' to reinstall everything"

# Quick check if project is properly set up
check:
	@echo "🔍 Checking project setup..."
	@if [ -d "$(VENV_NAME)" ]; then \
		echo "✅ Python virtual environment: OK"; \
	else \
		echo "❌ Python virtual environment: Missing (run 'make setup-backend')"; \
	fi
	@if [ -d "$(FRONTEND_DIR)/node_modules" ]; then \
		echo "✅ Node.js dependencies: OK"; \
	else \
		echo "❌ Node.js dependencies: Missing (run 'make setup-frontend')"; \
	fi
	@if [ -f "models/potatoes_v1.h5" ]; then \
		echo "✅ ML Model file: OK"; \
	else \
		echo "❌ ML Model file: Missing"; \
	fi
