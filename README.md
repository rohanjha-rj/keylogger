# Keylogger

A Python-based keyboard event recorder built with the [`pynput`](https://pypi.org/project/pynput/) library, created for educational and authorized security-research purposes as part of the **CFET Internship**.

> **⚠️ Disclaimer:** This project is intended **strictly** for educational and authorized security-research purposes. Unauthorized use of keylogging software is illegal and unethical. Always obtain explicit consent before running this tool on any system.

---

## What It Does

The script silently listens for keyboard events in the background and records every keystroke to a local text file (`log.txt`). It translates raw key events into human-readable text — typing characters normally, converting special keys like Space and Enter into their expected output, and tagging non-printable keys (e.g., Backspace, Delete) in bracket notation so the log remains understandable.

---

## How It Works — Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                     Program Starts                          │
│         keyboard.Listener(on_press) is created              │
│         A background thread begins monitoring               │
│         all keyboard events system-wide.                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
            ┌─────────────────────┐
            │   Key Press Event   │◄──────────────────────┐
            └──────────┬──────────┘                       │
                       │                                  │
                       ▼                                  │
              ┌────────────────┐      Yes                 │
              │  Is it Escape? ├──────────► Flush buffer  │
              └───────┬────────┘            → Stop        │
                      │ No                                │
                      ▼                                   │
              ┌────────────────┐      Yes                 │
              │  Is it a       ├──────────► Skip (ignore) ┤
              │  modifier key? │                          │
              └───────┬────────┘                          │
                      │ No                                │
                      ▼                                   │
              ┌────────────────┐      Yes                 │
              │  Is it a       ├──────────► Append mapped │
              │  special key?  │            value to      │
              │  (space/enter/ │            buffer        │
              │   tab/bksp)    │              │           │
              └───────┬────────┘              │           │
                      │ No                    │           │
                      ▼                       │           │
              ┌────────────────┐              │           │
              │  Has a .char   │ Yes          │           │
              │  attribute?    ├───► Append   │           │
              │  (printable)   │    key.char  │           │
              └───────┬────────┘      │       │           │
                      │ No            │       │           │
                      ▼               │       │           │
              Append [KEY_NAME]       │       │           │
              (bracket notation)      │       │           │
                      │               │       │           │
                      ▼◄──────────────┘◄──────┘           │
              ┌────────────────┐                          │
              │ Buffer full?   │      Yes                 │
              │ (≥ 10 chars)   ├──────────► flush_buffer()│
              └───────┬────────┘            Write to      │
                      │ No                  log.txt       │
                      │                       │           │
                      └───────────────────────┴───────────┘
                        (wait for next key event)
```

### Step-by-step breakdown

1. **Startup** — `keyboard.Listener` from `pynput` spawns a background thread that hooks into the OS-level keyboard event stream. The main thread blocks on `listener.join()` until the listener stops.

2. **Key event received** — Every physical key press fires the `on_press(key)` callback.

3. **Escape → Stop** — If the key is `Esc`, the remaining buffer is flushed to disk and the callback returns `False`, which signals `pynput` to stop the listener.

4. **Modifier filtering** — Modifier keys (Shift, Ctrl, Alt, Caps Lock, Cmd) are silently ignored — they don't produce readable output on their own.

5. **Special key mapping** — Keys like Space, Enter, Tab, and Backspace are translated to their readable equivalents (`" "`, `"\n"`, `"\t"`, `"[BACKSPACE]"`).

6. **Printable characters** — Regular alphanumeric keys have a `.char` attribute (e.g., `'a'`, `'5'`, `'@'`), which is appended directly.

7. **Unmapped special keys** — Anything else (arrow keys, function keys, Delete, etc.) is logged in bracket notation like `[DELETE]`, `[F5]`, `[HOME]`.

8. **Buffered writing** — Keystrokes accumulate in an in-memory list. Once 10 characters are buffered, they are written to `log.txt` in a single batch to reduce disk I/O overhead. The buffer is also flushed on exit.

9. **Error safety** — A `try/except` wraps the callback to prevent any unexpected exception from crashing the listener thread. A `try/except/finally` wraps the main block to handle `Ctrl+C` interrupts and guarantee a final buffer flush.

---

## Project Structure

```
keylogger/
├── keylogger.py        # Main script — listener, callback, buffer logic
├── Keycodes.txt        # Reference of all pynput.keyboard.Key enums with virtual key codes
├── requirements.txt    # Python dependency (pynput>=1.7.6)
├── .gitignore          # Excludes venv, IDE config, bytecache, and log output
└── README.md           # This file
```

---

## Setup

```bash
# 1. Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt
```

---

## Usage

```bash
python keylogger.py
```

- Keystrokes are recorded to **`log.txt`** in the project directory.
- Press **Escape** to stop recording gracefully.
- Press **Ctrl+C** in the terminal to force-stop (buffer is still flushed).

### Sample `log.txt` output

```
hello world
this is a test[BACKSPACE][BACKSPACE][BACKSPACE][BACKSPACE]demo
```

---

## Key Behavior Reference

| Key Pressed | What Gets Logged |
|---|---|
| `a`, `Z`, `5`, `@` | The character itself |
| Space | ` ` (space character) |
| Enter | `\n` (newline) |
| Tab | `\t` (tab character) |
| Backspace | `[BACKSPACE]` |
| Delete, Home, F5, etc. | `[DELETE]`, `[HOME]`, `[F5]` |
| Shift, Ctrl, Alt, Cmd | *(ignored — not logged)* |
| Escape | *(stops the program)* |

---

## Dependencies

- **Python 3.7+**
- **[pynput](https://pypi.org/project/pynput/) ≥ 1.7.6** — Cross-platform keyboard/mouse input monitoring.

See [`Keycodes.txt`](Keycodes.txt) for a full reference of all special key enums and their virtual key codes.