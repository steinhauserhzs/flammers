/* =========================================================
   FLAMMERS — Áudio: SFX + música generativa + ambiências
   Tudo sintetizado via WebAudio (zero assets externos).
   ========================================================= */

const Sfx = (() => {
  let ctx = null;
  let on = true;

  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(type, f0, f1, dur, vol = 0.14, when = 0) {
    if (!on) return;
    try {
      const a = ac();
      const t = a.currentTime + when;
      const osc = a.createOscillator();
      const g = a.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f0, t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(g).connect(a.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch (e) {}
  }

  function noiseSweep(dur, vol = 0.12) {
    if (!on) return;
    try {
      const a = ac();
      const t = a.currentTime;
      const len = Math.floor(a.sampleRate * dur);
      const buf = a.createBuffer(1, len, a.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
      const src = a.createBufferSource();
      const f = a.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.setValueAtTime(1200, t);
      f.frequency.exponentialRampToValueAtTime(120, t + dur);
      const g = a.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      src.buffer = buf;
      src.connect(f).connect(g).connect(a.destination);
      src.start(t);
    } catch (e) {}
  }

  return {
    unlock() { try { ac(); } catch (e) {} },
    ctx: () => ctx ? ctx : (() => { try { return ac(); } catch (e) { return null; } })(),
    set(v) { on = v; if (!v) { Music.stop(); Ambience.stop(); } },
    get on() { return on; },
    tone,
    click()   { tone("square", 700, 700, 0.05, 0.06); },
    pop()     { tone("sine", 520, 880, 0.07, 0.1); },
    msg()     { tone("sine", 880, 660, 0.09, 0.09); tone("sine", 660, 660, 0.07, 0.07, 0.07); },
    cashIn()  { tone("sine", 900, 1400, 0.08, 0.1); tone("sine", 1400, 1400, 0.09, 0.08, 0.06); },
    cashOut() { tone("triangle", 400, 220, 0.13, 0.1); },
    success() { [523, 659, 784].forEach((f, i) => tone("sine", f, f, 0.11, 0.11, i * 0.07)); },
    fanfare() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone("square", f, f, 0.1, 0.07, i * 0.08)); },
    error()   { tone("sawtooth", 220, 150, 0.22, 0.1); },
    sleep()   { noiseSweep(0.7, 0.1); },
    wake()    { tone("sine", 300, 600, 0.25, 0.08); },
    buy()     { tone("sine", 700, 1100, 0.07, 0.09); tone("sine", 1100, 1500, 0.08, 0.08, 0.06); }
  };
})();

/* ---------- Música generativa (sequencer simples) ---------- */
const Music = (() => {
  let timer = null, step = 0, mood = null, gain = null;

  // padrões: [baixo (nota por compasso de 4)], [melodia (16 steps, 0 = pausa)]
  const MOODS = {
    theme: { bpm: 132, bass: [130.8, 98, 110, 87.3], // C3 G2 A2 F2 — I V vi IV
      mel: [523, 0, 659, 784, 0, 659, 523, 0, 587, 0, 523, 494, 523, 0, 392, 0],
      wave: "square", vol: 0.045, melVol: 0.035 },
    chill: { bpm: 84, bass: [110, 110, 87.3, 98],
      mel: [440, 0, 0, 523, 0, 0, 494, 0, 0, 440, 0, 392, 0, 0, 330, 0],
      wave: "sine", vol: 0.05, melVol: 0.03 },
    tense: { bpm: 108, bass: [110, 103.8, 110, 116.5], // A2 Ab2 A2 Bb2 cromático
      mel: [440, 0, 466, 0, 440, 0, 415, 0, 440, 0, 466, 0, 523, 0, 466, 0],
      wave: "triangle", vol: 0.05, melVol: 0.028 }
  };

  function tick() {
    const a = Sfx.ctx();
    if (!a || !Sfx.on) return;
    const M = MOODS[mood];
    const t = a.currentTime;
    if (!gain) { gain = a.createGain(); gain.gain.value = 1; gain.connect(a.destination); }
    // baixo a cada 4 steps
    if (step % 4 === 0) {
      const o = a.createOscillator(), g = a.createGain();
      o.type = "triangle";
      o.frequency.value = M.bass[Math.floor(step / 4) % M.bass.length];
      g.gain.setValueAtTime(M.vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g).connect(gain);
      o.start(t); o.stop(t + 0.32);
    }
    // melodia
    const n = M.mel[step % M.mel.length];
    if (n) {
      const o = a.createOscillator(), g = a.createGain();
      o.type = M.wave;
      o.frequency.value = n;
      g.gain.setValueAtTime(M.melVol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      o.connect(g).connect(gain);
      o.start(t); o.stop(t + 0.18);
    }
    step++;
  }

  return {
    play(m) {
      if (!MOODS[m]) return;
      if (mood === m && timer) return;
      this.stop();
      mood = m; step = 0;
      const ms = 60000 / MOODS[m].bpm / 2; // colcheias
      timer = setInterval(tick, ms);
    },
    stop() { if (timer) clearInterval(timer); timer = null; mood = null; }
  };
})();

/* ---------- Ambiências por cenário ---------- */
const Ambience = (() => {
  let timer = null;

  // por cena: plinks aleatórios que evocam o lugar
  const SCENES = {
    "sc-quarto":   { every: [2600, 5200], f: [220, 330], type: "sine", vol: 0.02 },      // tic-tac suave
    "sc-escola":   { every: [900, 2400], f: [500, 1400], type: "triangle", vol: 0.018 }, // burburinho
    "sc-cantina":  { every: [1200, 3000], f: [700, 1800], type: "sine", vol: 0.02 },     // louça/campainha
    "sc-shopping": { every: [1000, 2600], f: [900, 2200], type: "sine", vol: 0.016 },    // eco de loja
    "sc-parque":   { every: [700, 2000], f: [2000, 3600], type: "sine", vol: 0.022 },    // passarinhos
    "sc-rua":      { every: [1100, 2800], f: [300, 900], type: "triangle", vol: 0.018 }  // cidade
  };

  function schedule(cfg) {
    const delay = cfg.every[0] + Math.random() * (cfg.every[1] - cfg.every[0]);
    timer = setTimeout(() => {
      if (Sfx.on) {
        const f = cfg.f[0] + Math.random() * (cfg.f[1] - cfg.f[0]);
        Sfx.tone(cfg.type, f, f * (cfg.f[0] > 1500 ? 1.3 : 0.9), 0.09, cfg.vol);
        if (cfg.f[0] > 1500 && Math.random() < 0.5) Sfx.tone(cfg.type, f * 1.2, f, 0.07, cfg.vol, 0.12); // trinado
      }
      schedule(cfg);
    }, delay);
  }

  return {
    play(scene) {
      this.stop();
      const cfg = SCENES[scene];
      if (cfg) schedule(cfg);
    },
    stop() { if (timer) clearTimeout(timer); timer = null; }
  };
})();
