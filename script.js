/* ================================================
   KEYLOGGER — Web Front End
   Interactions & Live Demo
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollAnimations();
  initLiveDemo();
  initCopyButtons();
});

/* --- Navigation --- */
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 50);
    lastScroll = scrollY;
  }, { passive: true });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close mobile nav on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
    });
  });
}

/* --- Scroll Fade-in Animations --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animations slightly
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* --- Live Demo --- */
function initLiveDemo() {
  const input = document.getElementById('demoInput');
  const output = document.getElementById('demoOutput');
  const clearBtn = document.getElementById('demoClear');
  const countDisplay = document.getElementById('demoCount');

  // Special key mappings (mirrors the Python script)
  const SPECIAL_KEYS = {
    ' ': ' ',          // Space → space character
    'Enter': '\n',     // Enter → newline
    'Tab': '\t',       // Tab → tab
    'Backspace': '[BACKSPACE]',
  };

  // Modifier keys to ignore (mirrors IGNORED_KEYS in Python)
  const IGNORED_KEYS = new Set([
    'Shift', 'Control', 'Alt', 'AltGraph',
    'CapsLock', 'Meta', 'NumLock', 'ScrollLock',
  ]);

  let logContent = '';
  let keystrokeCount = 0;

  input.addEventListener('keydown', (e) => {
    const key = e.key;

    // Escape → stop (clear the demo)
    if (key === 'Escape') {
      e.preventDefault();
      appendToLog('[ESC — program stops]', true);
      return;
    }

    // Ignore modifiers
    if (IGNORED_KEYS.has(key)) {
      return;
    }

    keystrokeCount++;

    // Check special key mappings
    if (SPECIAL_KEYS[key] !== undefined) {
      appendToLog(SPECIAL_KEYS[key], key !== ' ' && key !== 'Enter' && key !== 'Tab');
    } else if (key.length === 1) {
      // Printable character
      appendToLog(key, false);
    } else {
      // Unmapped special keys → bracket notation
      appendToLog(`[${key.toUpperCase()}]`, true);
    }

    countDisplay.textContent = `${keystrokeCount} keystroke${keystrokeCount !== 1 ? 's' : ''} captured`;
  });

  // Prevent Tab from leaving the textarea
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
    }
  });

  function appendToLog(text, isSpecial) {
    if (isSpecial) {
      logContent += `<span class="special-key">${escapeHtml(text)}</span>`;
    } else {
      logContent += escapeHtml(text);
    }
    output.innerHTML = logContent;
    output.scrollTop = output.scrollHeight;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  clearBtn.addEventListener('click', () => {
    input.value = '';
    logContent = '';
    output.innerHTML = '';
    keystrokeCount = 0;
    countDisplay.textContent = '0 keystrokes captured';
    input.focus();
  });
}

/* --- Copy Buttons --- */
function initCopyButtons() {
  document.querySelectorAll('.code-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const codeEl = document.getElementById(targetId);

      if (!codeEl) return;

      // Extract plain text (strip HTML tags)
      const text = codeEl.textContent
        .split('\n')
        .filter(line => !line.trim().startsWith('#'))  // remove comments
        .map(line => line.replace(/^\$ /, ''))           // remove prompts
        .filter(line => line.trim())
        .join('\n');

      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        btn.textContent = 'Failed';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
    });
  });
}
