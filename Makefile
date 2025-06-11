VENV_NAME = myenv
PYTHON = $(VENV_NAME)/bin/python
MAIN_SCRIPT = api/main.py

all: run

$(VENV_NAME)/bin/activate:
	@if [ ! -d "$(VENV_NAME)" ]; then \
		python3 -m venv $(VENV_NAME); \
		echo "Virtual environment created."; \
	else \
		echo "Virtual environment already exists."; \
	fi

setup: $(VENV_NAME)/bin/activate
	$(VENV_NAME)/bin/pip install -r requirements.txt

run:
	$(PYTHON) $(MAIN_SCRIPT)

clean:
	rm -rf $(VENV_NAME)

help:
	@echo "Makefile for your project"
	@echo "Usage:"
	@echo "  make run          # Install dependencies and run the project"
	@echo "  make install      # Install dependencies in the virtual environment"
	@echo "  make clean        # Remove the virtual environment"
	@echo "  make help         # Show this help message"
