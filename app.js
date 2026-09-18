const CDN = "https://cdn.jsdelivr.net/gh/workinwithai-create/PreEight@main/public/samples";
const STEPS = 16;
const SECTION = 8;
const TURN = 4;
const TOTAL = SECTION + TURN;

const recipes = [
  { id: "ii-v", name: "II–V door", blurb: "ii then V of the target. Classic turn that opens the next section." },
  { id: "walk-down", name: "Walk down", blurb: "Upright walks 8–7–6–5 into the target root." },
  { id: "half-time", name: "Half-time turn", blurb: "Half pocket on the turn. Full pocket returns on 13." },
  { id: "stop-air", name: "Stop air", blurb: "Two hits on bar 9. Two bars of air. Target lands clean." },
  { id: "nylon-cycle", name: "Nylon cycle", blurb: "Nylon plays a short cycle that resolves into the next root." },
  { id: "pedal-v", name: "Pedal V", blurb: "Bass holds the dominant. Piano and kit lean forward." },
  { id: "brass-call", name: "Brass call", blurb: "Trumpet answers on the last two bars of the turn." },
  { id: "kit-open", name: "Kit open", blurb: "Hats open, then close into the downbeat of the next section." },
  { id: "violin-hold", name: "Violin hold", blurb: "Violin sustains the 5 then resolves as the target arrives." },
  { id: "backdoor", name: "Backdoor", blurb: "bVII–I motion. Soul / gospel turn without a hard V." }
];

function bar(symbol, piano, guitar, bass) {
  return { symbol, piano, guitar, bass };
}

const grooves = [
  {
    id: "amber",
    name: "Amber Walk",
    bpm: 98,
    key: "A minor",
    section: [
      bar("Am", [45, 48, 52, 57], [45, 52, 57], 33),
      bar("F", [41, 45, 48, 53], [41, 48, 53], 41),
      bar("C", [48, 52, 55, 60], [48, 52, 55], 36),
      bar("G", [43, 47, 50, 55], [43, 47, 50], 31),
      bar("Am", [45, 48, 52, 57], [45, 52, 57], 33),
      bar("F", [41, 45, 48, 53], [41, 48, 53], 41),
      bar("C", [48, 52, 55, 60], [48, 52, 55], 36),
      bar("G", [43, 47, 50, 55], [43, 47, 50], 31)
    ],
    turn: [
      bar("Bm7b5", [47, 50, 53, 57], [47, 53, 57], 35),
      bar("E7", [40, 44, 47, 52], [40, 47, 50], 28),
      bar("Am", [45, 48, 52, 57], [45, 52, 57], 33),
      bar("Am", [45, 48, 52, 57], [45, 52, 57], 33)
    ]
  },
  {
    id: "porch",
    name: "Porch Climb",
    bpm: 86,
    key: "E major",
    section: [
      bar("E", [40, 44, 47, 52], [40, 47, 52], 28),
      bar("B", [35, 39, 42, 47], [35, 42, 47], 23),
      bar("C#m", [44, 47, 51, 56], [44, 51, 56], 32),
      bar("A", [33, 37, 40, 45], [33, 40, 45], 33),
      bar("E", [40, 44, 47, 52], [40, 47, 52], 28),
      bar("B", [35, 39, 42, 47], [35, 42, 47], 23),
      bar("C#m", [44, 47, 51, 56], [44, 51, 56], 32),
      bar("A", [33, 37, 40, 45], [33, 40, 45], 33)
    ],
    turn: [
      bar("F#m", [42, 45, 49, 54], [42, 49, 54], 30),
      bar("B7", [35, 39, 42, 45], [35, 42, 45], 23),
      bar("E", [40, 44, 47, 52], [40, 47, 52], 28),
      bar("E", [40, 44, 47, 52], [40, 47, 52], 28)
    ]
  },
  {
    id: "fold",
    name: "Fold Radio",
    bpm: 104,
    key: "D minor",
    section: [
      bar("Dm", [38, 41, 45, 50], [38, 45, 50], 26),
      bar("Bb", [34, 38, 41, 46], [34, 41, 46], 34),
      bar("F", [41, 45, 48, 53], [41, 48, 53], 29),
      bar("C", [36, 40, 43, 48], [36, 43, 48], 24),
      bar("Dm", [38, 41, 45, 50], [38, 45, 50], 26),
      bar("Bb", [34, 38, 41, 46], [34, 41, 46], 34),
      bar("F", [41, 45, 48, 53], [41, 48, 53], 29),
      bar("C", [36, 40, 43, 48], [36, 43, 48], 24)
    ],
    turn: [
      bar("Em7b5", [40, 43, 46, 50], [40, 46, 50], 28),
      bar("A7", [33, 37, 40, 43], [33, 40, 43], 33),
      bar("Dm", [38, 41, 45, 50], [38, 45, 50], 26),
      bar("Dm", [38, 41, 45, 50], [38, 45, 50], 26)
    ]
  }
];

const state = { groove: grooves[0], recipe: recipes[0], playing: false, bar: 0, mode: null };
let ctx, bus, buffers = {};

async function load() {
  ctx = new AudioContext();
  bus = ctx.createGain();
  bus.gain.value = 0.35;
  bus.connect(ctx.destination);
  const files = [
    ["kick", `${CDN}/drums/kick.mp3`],
    ["snare", `${CDN}/drums/snare.mp3`],
    ["hat", `${CDN}/drums/hihat.mp3`],
    ["crash", `${CDN}/drums/crash.mp3`],
    ["pC3", `${CDN}/piano/C3.mp3`],
    ["pC4", `${CDN}/piano/C4.mp3`],
    ["pA3", `${CDN}/piano/A3.mp3`],
    ["bE1", `${CDN}/bass/E1.mp3`],
    ["bA1", `${CDN}/bass/A1.mp3`],
    ["bC2", `${CDN}/bass/C2.mp3`],
    ["gE2", `${CDN}/guitar/E2.mp3`],
    ["gA2", `${CDN}/guitar/A2.mp3`],
    ["gE3", `${CDN}/guitar/E3.mp3`],
    ["tC4", `${CDN}/trumpet/C4.mp3`],
    ["vA3", `${CDN}/violin/A3.mp3`]
  ];
  let n = 0;
  for (const [k, url] of files) {
    try {
      const r = await fetch(url);
      buffers[k] = await ctx.decodeAudioData(await r.arrayBuffer());
    } catch (e) {
      console.warn(k, e);
    }
    n++;
    document.getElementById("status").textContent = `Seating chairs ${n}/${files.length}`;
  }
  document.getElementById("status").textContent = "Chairs seated · live FluidR3 + kit";
}

function playBuf(name, when, rate = 1, gain = 0.4) {
  const b = buffers[name];
  if (!b || !ctx) return;
  const src = ctx.createBufferSource();
  src.buffer = b;
  src.playbackRate.value = rate;
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(g);
  g.connect(bus);
  src.start(when);
}

function rateFromMidi(midi, baseMidi) {
  return Math.pow(2, (midi - baseMidi) / 12);
}

function chordAt(i) {
  return i < SECTION ? state.groove.section[i] : state.groove.turn[i - SECTION];
}

function zone(i) {
  return i < SECTION ? "section" : "turn";
}

function scheduleBar(barIndex, t0, stepDur) {
  const ch = chordAt(barIndex);
  const z = zone(barIndex);
  const rec = state.recipe.id;
  const onTurn = z === "turn";

  for (let s = 0; s < STEPS; s++) {
    const when = t0 + s * stepDur;

    if (onTurn && rec === "stop-air" && barIndex >= 9 && barIndex <= 10 && s > 4) continue;
    if (onTurn && rec === "stop-air" && barIndex === 9 && s > 0 && s < 8) continue;

    if (s % 2 === 0) {
      let hatGain = 0.07;
      if (onTurn && rec === "kit-open") hatGain = barIndex >= 10 ? 0.12 : 0.05;
      if (onTurn && rec === "half-time") hatGain = s % 4 === 0 ? 0.09 : 0.03;
      playBuf("hat", when, 1, hatGain);
    }

    if (s === 0) playBuf("kick", when, 1, 0.7);
    if (onTurn && rec === "half-time" && s === 8) playBuf("kick", when, 1, 0.55);

    if (s === 8 && !(onTurn && rec === "half-time")) playBuf("snare", when, 1, 0.45);
    if (onTurn && rec === "half-time" && s === 0) playBuf("snare", when, 1, 0.35);

    if (s === 0) {
      playBuf("pC4", when, rateFromMidi(ch.piano[2] || 60, 60), onTurn && rec === "pedal-v" ? 0.34 : 0.28);
      playBuf("pA3", when, rateFromMidi(ch.piano[1] || 57, 57), 0.22);

      let bassMidi = ch.bass;
      if (onTurn && rec === "walk-down") {
        const walkMap = {
          8: [ch.bass + 7, ch.bass + 5, ch.bass + 3, ch.bass],
          9: [ch.bass + 5, ch.bass + 3, ch.bass + 2, ch.bass],
          10: [ch.bass, ch.bass, ch.bass, ch.bass],
          11: [ch.bass, ch.bass, ch.bass, ch.bass]
        };
        const walk = walkMap[barIndex] || [ch.bass];
        bassMidi = walk[0];
        if (walk[1]) playBuf("bA1", when + 4 * stepDur, rateFromMidi(walk[1], 33), 0.4);
        if (walk[2]) playBuf("bA1", when + 8 * stepDur, rateFromMidi(walk[2], 33), 0.4);
        if (walk[3]) playBuf("bA1", when + 12 * stepDur, rateFromMidi(walk[3], 33), 0.45);
      }
      if (onTurn && rec === "pedal-v") {
        bassMidi = ch.bass;
      }
      playBuf("bA1", when, rateFromMidi(bassMidi, 33), 0.45);
      playBuf("gA2", when, rateFromMidi(ch.guitar[0] || 45, 45), onTurn && rec === "nylon-cycle" ? 0.3 : 0.22);
    }

    if (onTurn && rec === "nylon-cycle" && (s === 4 || s === 12)) {
      playBuf("gE3", when, rateFromMidi((ch.guitar[1] || 52) + 2, 52), 0.26);
    }

    if (onTurn && rec === "brass-call" && barIndex >= 10 && (s === 4 || s === 12)) {
      playBuf("tC4", when, rateFromMidi(ch.piano[3] || 69, 60), 0.36);
    }

    if (onTurn && rec === "violin-hold" && s === 0) {
      playBuf("vA3", when, rateFromMidi(ch.piano[2] || 60, 57), 0.2);
    }

    if (onTurn && barIndex === 10 && s === 0 && (rec === "ii-v" || rec === "backdoor" || rec === "kit-open")) {
      playBuf("crash", when, 1, 0.18);
    }
  }
}

let timer = null;

function stop() {
  state.playing = false;
  state.mode = null;
  if (timer) clearTimeout(timer);
  timer = null;
  paintBars();
}

async function play(mode) {
  if (!ctx) await load();
  if (ctx.state === "suspended") await ctx.resume();
  stop();
  state.playing = true;
  state.mode = mode;
  const startBar = mode === "eight" ? SECTION : 0;
  const endBar = mode === "loop" ? SECTION : TOTAL;
  const stepDur = 60 / state.groove.bpm / 4;
  let barIndex = startBar;
  const tick = () => {
    if (!state.playing) return;
    if (barIndex >= endBar) {
      if (mode === "loop") barIndex = startBar;
      else {
        stop();
        return;
      }
    }
    state.bar = barIndex;
    paintBars();
    scheduleBar(barIndex, ctx.currentTime + 0.02, stepDur);
    barIndex += 1;
    timer = setTimeout(tick, STEPS * stepDur * 1000);
  };
  tick();
}

function punch() {
  const g = state.groove;
  const r = state.recipe;
  return `PivotFour punch list
${g.name} · ${g.bpm} BPM · ${g.key} · ${r.name}

The problem: the section ends on the same chord and the next part jump-cuts or loops dead.
Session players write four live bars that turn the harmony around so the next section has motion and destination.
The move: ${r.blurb}

Section (bars 1–8)
${g.section.map((b, i) => `  ${i + 1}. ${b.symbol}`).join("\n")}

Turn (bars 9–12) — ${r.name}
${g.turn.map((b, i) => `  ${i + 9}. ${b.symbol}`).join("\n")}

Live chairs only (FluidR3 piano, upright, nylon, kit, trumpet, violin).
Distinct from TagFour (last-line end), LiftTwo (pre-hook climb), PreEight, AfterHook, EndEight, LastHook, ModEight, CallFour, BreakFour, PedalFour.
Drop the WAV on bars 9–12. Do not paste the last chord of the section into the next section.`;
}

function paintGrooves() {
  const el = document.getElementById("grooves");
  el.innerHTML = "";
  grooves.forEach((g) => {
    const b = document.createElement("button");
    b.className = "card" + (state.groove.id === g.id ? " on" : "");
    b.innerHTML = `<b>${g.name}</b><span>${g.bpm} BPM · ${g.key}</span>`;
    b.onclick = () => {
      state.groove = g;
      render();
    };
    el.appendChild(b);
  });
}

function paintRecipes() {
  const el = document.getElementById("recipes");
  el.innerHTML = "";
  recipes.forEach((r) => {
    const b = document.createElement("button");
    b.className = "card" + (state.recipe.id === r.id ? " on" : "");
    b.innerHTML = `<b>${r.name}</b><span>${r.blurb}</span>`;
    b.onclick = () => {
      state.recipe = r;
      render();
    };
    el.appendChild(b);
  });
}

function paintBars() {
  const el = document.getElementById("bars");
  el.innerHTML = "";
  for (let i = 0; i < TOTAL; i++) {
    const ch = chordAt(i);
    const z = zone(i);
    const d = document.createElement("div");
    d.className = "bar " + (z === "turn" ? "turn" : "") + (state.playing && state.bar === i ? " active" : "");
    const label = z === "section" ? "S" : "T";
    d.innerHTML = `<div class="n">${i + 1} · ${label}</div><div class="c">${ch.symbol}</div>`;
    el.appendChild(d);
  }
}

function render() {
  paintGrooves();
  paintRecipes();
  paintBars();
  document.getElementById("punch").textContent = punch();
}

document.getElementById("playA").onclick = () => play("loop");
document.getElementById("playB").onclick = () => play("cut");
document.getElementById("play8").onclick = () => play("eight");
document.getElementById("stop").onclick = stop;
document.getElementById("copy").onclick = () => navigator.clipboard.writeText(punch());

render();
load();
