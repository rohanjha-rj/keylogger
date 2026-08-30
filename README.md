# Keylogger

A Python-based keyboard event recorder built with `pynput`, created for educational and research purposes as part of the CFET internship.

> **Disclaimer:** This project is intended strictly for educational and authorized security-research purposes. Unauthorized use of keylogging software is illegal and unethical.

## Features

- Records keyboard input to a local `log.txt` file
- Buffered I/O to reduce disk writes
- Handles special keys (space, enter, tab, backspace) with readable output
- Graceful exit by pressing `Escape`
- Ignores modifier keys (Shift, Ctrl, Alt, Caps Lock, etc.)

## Setup

```bash
# 1. Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt
```

## Usage

```bash
python keylogger.py
```

Press **Escape** to stop recording. Output is written to `log.txt` in the project directory.