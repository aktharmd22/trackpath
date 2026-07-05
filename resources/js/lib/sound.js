/**
 * Notification sounds, synthesised with the Web Audio API — no audio files.
 * Gated by the user's saved preference (users.sound_enabled) via configureSound().
 * Browsers only allow audio after a user gesture; every trigger in the app
 * (clicks, drags, form submits) counts, so playback works when it matters.
 */

let enabled = true;
let ctx = null;
let alertPlayed = false;

export function configureSound(isEnabled) {
    enabled = Boolean(isEnabled);
}

function context() {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();

    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    return ctx;
}

function tone(frequency, startAt, duration, { type = 'sine', peak = 0.12 } = {}) {
    const audio = context();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    const start = audio.currentTime + startAt;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
}

function play(fn) {
    if (!enabled || typeof window === 'undefined') {
        return;
    }

    try {
        fn();
    } catch {
        // Audio blocked (no user gesture yet) — fail silently.
    }
}

/** Subtle blip — item added, card dropped. */
export function playPop() {
    play(() => {
        tone(520, 0, 0.09, { type: 'triangle', peak: 0.08 });
    });
}

/** Rising two-note chime — task or lesson completed. */
export function playComplete() {
    play(() => {
        tone(659, 0, 0.12, { type: 'triangle' });
        tone(880, 0.09, 0.16, { type: 'triangle' });
    });
}

/** Gentle attention chime — something is due. */
export function playAlert() {
    play(() => {
        tone(587, 0, 0.14, { type: 'sine' });
        tone(440, 0.13, 0.2, { type: 'sine', peak: 0.09 });
    });
}

/** Alert for due items, at most once per full page load. */
export function playDueAlertOnce() {
    if (alertPlayed) {
        return;
    }

    alertPlayed = true;
    playAlert();
}
