#!/bin/bash

# 🥔 Potato Disease Classification System Setup Script
# Works on Linux, macOS, and Windows (with Git Bash or WSL)

set -e  # Exit on any error

echo "🥔 Potato Disease Classification System Setup"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    print_error "Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

# Determine Python command
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

print_status "Using Python: $($PYTHON_CMD --version)"
print_status "Using Node.js: $(node --version)"
print_status "Using npm: $(npm --version)"

echo ""

# Setup Python backend
print_status "Setting up Python backend..."

if [ ! -d "myenv" ]; then
    print_status "Creating Python virtual environment..."
    $PYTHON_CMD -m venv myenv
    print_success "Virtual environment created!"
else
    print_warning "Virtual environment already exists"
fi

print_status "Installing Python dependencies..."

# Activate virtual environment and install dependencies
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows Git Bash
    myenv/Scripts/pip install --upgrade pip
    myenv/Scripts/pip install -r requirements.txt
else
    # Linux/macOS
    myenv/bin/pip install --upgrade pip
    myenv/bin/pip install -r requirements.txt
fi

print_success "Python backend setup complete!"

echo ""

# Setup React frontend
print_status "Setting up React frontend..."

cd frontend

if [ ! -d "node_modules" ]; then
    print_status "Installing Node.js dependencies..."
    npm install
    print_success "Frontend dependencies installed!"
else
    print_warning "Node.js dependencies already installed"
fi

cd ..

print_success "React frontend setup complete!"

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "To start the application, open TWO terminals:"
echo ""
echo "${YELLOW}Terminal 1 (Backend):${NC}"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "  cd api"
    echo "  ../myenv/Scripts/activate"
    echo "  python main.py"
else
    echo "  cd api"
    echo "  source ../myenv/bin/activate"
    echo "  python main.py"
fi
echo ""
echo "${YELLOW}Terminal 2 (Frontend):${NC}"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "${BLUE}Access Points:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8000"
echo "  API Documentation: http://localhost:8000/docs"
echo ""
echo "Happy disease detection! 🥔🔬"
