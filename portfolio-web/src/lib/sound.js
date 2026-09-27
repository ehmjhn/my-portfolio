// ---------------------------------------------------------------
//  Tiny sound engine, built with the Web Audio API.
// ---------------------------------------------------------------
//  The trick here: we do NOT load any .mp3 or .wav files.
//  Every sound is generated on the fly with an oscillator, so the
//  whole sound system costs zero network requests and zero KB.
//
//  Sounds are a bonus, never a requirement — if the browser blocks
//  audio, every function below quietly does nothing.
// ---------------------------------------------------------------

// We keep one AudioContext for the whole app. Creating a new one for
// every sound would be slow and browsers limit how many you can make.
let audioContext = null

// Lazily create the context the first time we actually play something.
function getContext() {
  if (audioContext === null) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null // very old browser, no audio support
    audioContext = new AudioCtx()
  }
  return audioContext
}

// One sound = one oscillator + one volume fade.
//
//  freq     -> starting pitch in Hz (higher = higher sound)
//  type     -> waveform: 'sine' (soft), 'triangle' (warm), 'square' (buzzy)
//  duration -> how long it lasts in seconds
//  volume   -> how loud, 0 to 1 (we stay very quiet on purpose)
//  slideTo  -> optional ending pitch, makes the sound "glide" upward
function tone({ freq = 440, type = 'sine', duration = 0.08, volume = 0.05, slideTo = null }) {
  const ctx = getContext()
  if (!ctx) return

  // Browsers start the context "suspended" until a real user click.
  if (ctx.state === 'suspended') ctx.resume()

  const osc = ctx.createOscillator() // the thing that makes the pitch
  const gain = ctx.createGain() // the thing that controls loudness

  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime)

  if (slideTo) {
    // exponentialRampToValueAtTime makes the pitch slide smoothly
    osc.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + duration)
  }

  // The fade: 0 -> volume almost instantly -> 0 by the end.
  // Without this you hear a "pop" instead of a clean sound.
  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start()
  osc.stop(ctx.currentTime + duration + 0.02)
}

// ---------------------------------------------------------------
//  The actual sound library. Components call playSound('click').
// ---------------------------------------------------------------
const sounds = {
  // super quiet, for when your mouse moves over buttons
  hover: () => tone({ freq: 620, type: 'sine', duration: 0.05, volume: 0.02 }),

  // main button press
  click: () => tone({ freq: 340, type: 'triangle', duration: 0.09, volume: 0.05 }),

  // one keystroke in the terminal / command palette
  type: () => tone({ freq: 900, type: 'square', duration: 0.02, volume: 0.012 }),

  // a panel sliding open (palette, shortcuts sheet)
  open: () => tone({ freq: 460, type: 'sine', duration: 0.13, volume: 0.04, slideTo: 740 }),

  // panel closing, same sound but sliding downward
  close: () => tone({ freq: 560, type: 'sine', duration: 0.13, volume: 0.04, slideTo: 240 }),

  // something worked (form sent, answer found)
  success: () => tone({ freq: 520, type: 'triangle', duration: 0.11, volume: 0.05, slideTo: 920 }),

  // something went wrong (validation failed, unknown command)
  error: () => tone({ freq: 200, type: 'sawtooth', duration: 0.16, volume: 0.04, slideTo: 110 }),

  // two-note little jingle, used when the site "boots"
  boot: () => {
    tone({ freq: 300, type: 'sine', duration: 0.1, volume: 0.035 })
    setTimeout(() => tone({ freq: 520, type: 'sine', duration: 0.15, volume: 0.035, slideTo: 900 }), 95)
  },
}

// The one function the rest of the app calls.
export function playSound(name) {
  const fn = sounds[name]
  if (!fn) return
  try {
    fn()
  } catch {
    // Audio failing must never break the page. Just stay silent.
  }
}
