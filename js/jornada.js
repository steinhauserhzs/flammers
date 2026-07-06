/* =========================================================
   FLAMMERS Jornada — engine + UI do modo história (teens)
   Mapa de fases → cenas ilustradas → escolhas → estrelas
   ========================================================= */

"use strict";

const JKEY = "flammersj_save";
let J = null;

const $j = (id) => document.getElementById(id);
const jel = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};
function jicon(name, cls) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", cls || "ic");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", "#" + name);
  svg.appendChild(use);
  return svg;
}
const jfmt = (n) => Math.round(n).toLocaleString("pt-BR");

function jsave() { try { localStorage.setItem(JKEY, JSON.stringify(J)); } catch (e) {} }
function jload() {
  try { const d = JSON.parse(localStorage.getItem(JKEY)); if (d && d.v === 1) { J = d; return true; } } catch (e) {}
  return false;
}
function jnew() {
  J = { v: 1, char: null, name: "", age: 0, dream: "bike", cofre: 0, coins: 0, stars: {}, stickers: [], vidaSeen: false };
  jsave();
}

/* ---------------- Telas ---------------- */
function show(id) {
  document.querySelectorAll(".scr").forEach(s => s.classList.remove("active"));
  $j(id).classList.add("active");
  if (id === "scr-map") { Music.play("theme"); Ambience.stop(); }
  else if (id !== "scr-level") { Music.stop(); Ambience.stop(); }
}

function toast(msg) {
  const t = $j("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2400);
}

function confetti() {
  const box = $j("confetti");
  for (let i = 0; i < 28; i++) {
    const p = jel("div", "conf");
    p.style.left = Math.random() * 100 + "%";
    p.style.background = ["#ff5a1f", "#ffd166", "#4ecdc4", "#8b5cf6", "#4ade80"][i % 5];
    p.style.animationDelay = (Math.random() * 0.4) + "s";
    box.appendChild(p);
    setTimeout(() => p.remove(), 2400);
  }
}

/* ---------------- Mapa ---------------- */
function levelState(id) {
  if (J.stars[id]) return "done";
  const idx = JLEVELS.findIndex(l => l.id === id);
  const prev = JLEVELS[idx - 1];
  if (!prev || J.stars[prev.id]) return "current";
  return "locked";
}

let lastCoinsShown = null;
function renderMap() {
  const coinsEl = $j("mp-coins");
  coinsEl.textContent = jfmt(J.coins);
  if (lastCoinsShown !== null && J.coins !== lastCoinsShown) {
    coinsEl.parentElement.classList.add("tickup");
    setTimeout(() => coinsEl.parentElement.classList.remove("tickup"), 500);
  }
  lastCoinsShown = J.coins;
  const dream = DREAMS.find(d => d.id === J.dream) || DREAMS[0];
  $j("mp-dream-img").src = dream.img;
  $j("mp-dream-name").textContent = dream.name + " · R$ " + jfmt(J.cofre) + "/" + jfmt(dream.cost);
  const pct = Math.min(100, Math.round(J.cofre / dream.cost * 100));
  $j("mp-dream-fill").style.width = pct + "%";
  $j("mp-dream-pct").textContent = pct + "%";

  const box = $j("map-nodes");
  box.replaceChildren();
  JLEVELS.forEach((lvl, i) => {
    const pos = MAP_NODES[i] || { x: 50, y: 50 };
    const st = levelState(lvl.id);
    const node = jel("button", "map-node " + st);
    node.style.left = pos.x + "%";
    node.style.top = pos.y + "%";
    if (st === "locked") node.appendChild(jicon("i-lock"));
    else {
      node.appendChild(document.createTextNode(String(lvl.n)));
      if (J.stars[lvl.id]) {
        const sr = jel("div", "node-stars");
        for (let s = 0; s < J.stars[lvl.id]; s++) sr.appendChild(jicon("i-star-f", "ic"));
        node.appendChild(sr);
      }
    }
    node.onclick = () => {
      Sfx.unlock();
      if (st === "locked") { Sfx.error(); toast("Complete a fase anterior primeiro!"); return; }
      Sfx.click();
      startLevel(lvl, st === "done");
    };
    box.appendChild(node);
  });

  // nó final: Modo Vida Real
  const allDone = JLEVELS.length > 0 && JLEVELS.every(l => J.stars[l.id]);
  const vn = jel("button", "map-node vida" + (allDone ? "" : " locked"));
  vn.style.left = VIDA_NODE.x + "%";
  vn.style.top = VIDA_NODE.y + "%";
  vn.appendChild(jicon(allDone ? "i-phone" : "i-lock"));
  vn.appendChild(document.createTextNode(allDone ? "VIDA REAL" : ""));
  vn.onclick = () => {
    if (!allDone) { Sfx.error(); toast("Termine as 10 fases pra desbloquear o Modo Vida Real!"); return; }
    vidaModal();
  };
  box.appendChild(vn);

  // dica da Rê (objetivo claro)
  const next = JLEVELS.find(l => !J.stars[l.id]);
  const g = $j("guide-text");
  const nm = J.name ? J.name : "";
  if (next) g.textContent = (nm ? nm + ", p" : "P") + "róxima missão — Fase " + next.n + ": " + next.title + ". " + (pct >= 100 ? "E seu sonho tá PRONTO pra buscar, hein!" : "Seu sonho tá " + pct + "% pago. Bora!");
  else g.textContent = (nm ? nm + ", você" : "Você") + " completou a jornada! Refaça fases pra ganhar 3 estrelas — ou encare o Modo Vida Real lá em cima." + (J.age >= 16 ? " Na sua idade, aliás? Você vai se ver nele." : "");
}

/* ---------------- Sonho ---------------- */
function dreamModal(forcePick) {
  const m = $j("modal");
  m.classList.add("active");
  const box = $j("modal-box");
  box.replaceChildren();
  box.appendChild(jel("h3", null, forcePick ? "Escolha seu novo sonho!" : "Cofre dos Sonhos"));
  box.appendChild(jel("p", "modal-sub", "Guardado: R$ " + jfmt(J.cofre) + ". Todo fim de fase você decide quanto guardar. Quando encher, o sonho é seu!"));
  const grid = jel("div", "dream-grid");
  DREAMS.forEach(d => {
    const o = jel("button", "dream-opt" + (J.dream === d.id ? " sel" : ""));
    const img = document.createElement("img");
    img.src = d.img; img.alt = "";
    o.appendChild(img);
    o.appendChild(jel("span", null, d.name));
    o.appendChild(jel("small", null, "R$ " + jfmt(d.cost)));
    o.onclick = () => {
      J.dream = d.id; jsave(); Sfx.pop();
      grid.querySelectorAll(".dream-opt").forEach(x => x.classList.remove("sel"));
      o.classList.add("sel");
      renderMap();
    };
    grid.appendChild(o);
  });
  box.appendChild(grid);
  const b = jel("button", "big-btn small", "Fechar");
  b.onclick = () => m.classList.remove("active");
  box.appendChild(b);
}

function checkDream() {
  const dream = DREAMS.find(d => d.id === J.dream) || DREAMS[0];
  if (J.cofre >= dream.cost) {
    J.cofre -= dream.cost;
    jsave();
    Sfx.fanfare();
    confetti(); setTimeout(confetti, 500); setTimeout(confetti, 1000);
    const m = $j("modal");
    m.classList.add("active");
    const box = $j("modal-box");
    box.replaceChildren();
    const img = document.createElement("img");
    img.className = "modal-art"; img.src = dream.img; img.alt = "";
    box.appendChild(img);
    box.appendChild(jel("h3", null, "SONHO REALIZADO!"));
    box.appendChild(jel("p", "modal-sub", "Você juntou, esperou, fugiu das ciladas… e conseguiu: " + dream.name + " é sua!\n\nIsso que você sentiu agora? É o gostinho de meta cumprida. Nenhuma comprinha por impulso chega perto."));
    const b = jel("button", "big-btn small", "Escolher próximo sonho");
    b.onclick = () => { m.classList.remove("active"); dreamModal(true); };
    box.appendChild(b);
  }
}

/* ---------------- Fase (runner) ---------------- */
let LV = null;

function startLevel(lvl, isReplay) {
  LV = { lvl, i: -1, coins: 0, best: 0, choicesTotal: lvl.steps.filter(s => s.t === "choice" || s.t === "mini").length, quizTotal: lvl.steps.filter(s => s.t === "quiz").length, quizRight: 0, replay: isReplay, queue: [] };
  Music.play(lvl.id === "f5" || lvl.id === "f8" ? "tense" : "chill");
  Ambience.play(lvl.bg);
  $j("lv-bg").src = "assets/art/" + lvl.bg + ".svg";
  $j("lv-title").textContent = "Fase " + lvl.n + " · " + lvl.title;
  $j("lv-coins").textContent = "0";
  $j("lv-phone").classList.remove("show");
  $j("lv-phone-msgs").replaceChildren();
  show("scr-level");
  nextStep();
}

function speakerOf(who) {
  if (who === "voce") return { name: J.name || HEROES[J.char].name, img: HEROES[J.char].img };
  if (who === "nar") return { name: "história", img: null };
  const c = CAST[who];
  return c ? { name: c.name, img: c.img } : { name: who, img: null };
}

let typing = null;
let typingFull = "";
function typeText(elText, full) {
  clearInterval(typing);
  typingFull = full;
  elText.textContent = "";
  let i = 0;
  typing = setInterval(() => {
    i += 2;
    elText.textContent = full.slice(0, i);
    if (i >= full.length) { clearInterval(typing); typing = null; }
  }, 16);
}

function nextStep() {
  // fila de feedbacks pendentes primeiro
  if (LV.queue.length) {
    const fb = LV.queue.shift();
    renderSay(fb.who || "re", fb.text, fb.emo);
    return;
  }
  LV.i++;
  const step = LV.lvl.steps[LV.i];
  if (!step) return endLevel();
  if (step.t === "say") renderSay(step.who, step.text);
  else if (step.t === "chat") renderChat(step);
  else if (step.t === "choice") renderChoice(step);
  else if (step.t === "quiz") renderQuiz(step);
  else if (step.t === "mini") renderMini(step);
  else nextStep();
}

function renderSay(who, text, emo) {
  const sp = speakerOf(who);
  const dialog = $j("lv-dialog");
  dialog.style.display = "block";
  $j("lv-choices").replaceChildren();
  const spEl = $j("lv-speaker");
  spEl.textContent = sp.name;
  spEl.className = "lv-speaker" + (who === "nar" ? " nar" : "");
  const port = $j("lv-portrait");
  let img = sp.img, pkey = who;
  if (emo && J.char) { img = "assets/art/" + J.char + "-" + emo + ".svg"; pkey = J.char + "-" + emo; }
  if (img) {
    port.style.display = "block";
    if (port.dataset.who !== pkey) {
      port.src = img;
      port.dataset.who = pkey;
      port.classList.remove("pop");
      void port.offsetWidth;
      port.classList.add("pop");
    }
  } else port.style.display = "none";
  typeText($j("lv-text"), text);
  $j("lv-tap").style.display = "block";
  Sfx.pop();
}

function renderChat(step) {
  $j("lv-dialog").style.display = "none";
  $j("lv-choices").replaceChildren();
  const phone = $j("lv-phone");
  phone.classList.add("show");
  const msgs = $j("lv-phone-msgs");
  const m = jel("div", "pmsg fresh", step.text);
  msgs.appendChild(m);
  msgs.scrollTop = msgs.scrollHeight;
  Sfx.msg();
  // avança com tap no painel (handler global)
}

function coinFloat(v) {
  const f = jel("div", "coin-float" + (v < 0 ? " neg" : ""), (v > 0 ? "+" : "") + v);
  f.style.left = (35 + Math.random() * 30) + "%";
  f.style.bottom = "30%";
  $j("lv-float").appendChild(f);
  setTimeout(() => f.remove(), 1100);
}

function applyCoins(v) {
  LV.coins += v;
  $j("lv-coins").textContent = jfmt(Math.max(0, JCONFIG.baseCoins + LV.coins));
  coinFloat(v);
  if (v > 0) Sfx.cashIn(); else Sfx.cashOut();
}

function renderChoice(step) {
  renderSay("nar", step.prompt || "O que você faz?");
  $j("lv-tap").style.display = "none";
  const box = $j("lv-choices");
  box.replaceChildren();
  step.options.forEach((opt) => {
    const b = jel("button", "lv-choice", opt.label);
    b.onclick = () => {
      if (b.dataset.done) return;
      box.querySelectorAll(".lv-choice").forEach(x => { x.dataset.done = "1"; x.disabled = true; });
      b.classList.add(opt.best ? "right" : (opt.coins || 0) < 0 ? "wrong" : "right");
      if (opt.best) LV.best++;
      if (opt.coins) applyCoins(opt.coins);
      if (opt.fb) LV.queue.push({ who: "nar", text: opt.fb, emo: opt.best ? "feliz" : (opt.coins || 0) < 0 ? "triste" : null });
      setTimeout(nextStep, 650);
    };
    box.appendChild(b);
  });
}

function renderQuiz(step) {
  renderSay("re", step.q);
  $j("lv-tap").style.display = "none";
  const box = $j("lv-choices");
  box.replaceChildren();
  step.options.forEach((opt, i) => {
    const b = jel("button", "lv-choice", opt.label || String(opt));
    b.onclick = () => {
      if (b.dataset.done) return;
      box.querySelectorAll(".lv-choice").forEach((x, xi) => {
        x.dataset.done = "1"; x.disabled = true;
        if (xi === step.correct) x.classList.add("right");
      });
      if (i === step.correct) {
        LV.quizRight++;
        applyCoins(JCONFIG.quizBonus);
        Sfx.success();
        LV.queue.push({ who: "re", text: "Acertou" + (J.name ? ", " + J.name : "") + "! " + (step.why || ""), emo: "feliz" });
      } else {
        b.classList.add("wrong");
        Sfx.error();
        LV.queue.push({ who: "re", text: "Quase! " + (step.why || ""), emo: "choque" });
      }
      setTimeout(nextStep, 750);
    };
    box.appendChild(b);
  });
}

/* ---------------- Minigames ---------------- */
function miniDone(step, success, reward) {
  if (success) LV.best++;
  applyCoins(reward);
  LV.queue.push({ who: "re", text: success ? (step.win || "Mandou MUITO bem!") : (step.lose || "Não foi dessa vez — mas a lição fica."), emo: success ? "feliz" : "triste" });
  if (success) Sfx.success(); else Sfx.error();
  setTimeout(nextStep, 700);
}

function renderMini(step) {
  renderSay("re", step.prompt || "Desafio!");
  $j("lv-tap").style.display = "none";
  const box = $j("lv-choices");
  box.replaceChildren();
  const mini = jel("div", "mini-box");
  mini.appendChild(jel("div", "mini-title", "MINIGAME"));
  if (step.sub) mini.appendChild(jel("div", "mini-sub", step.sub));
  box.appendChild(mini);

  if (step.kind === "split") {
    const total = step.total || 50;
    const vals = jel("div", "split-vals");
    const g = jel("span", "sv-g"), s = jel("span", "sv-s");
    vals.appendChild(g); vals.appendChild(s);
    const range = document.createElement("input");
    range.type = "range"; range.className = "split-range";
    range.min = 0; range.max = total; range.value = Math.round(total / 2);
    const upd = () => {
      const save = parseInt(range.value);
      g.textContent = "Gastar R$ " + (total - save);
      s.textContent = "Guardar R$ " + save;
    };
    range.oninput = () => { upd(); Sfx.click(); };
    upd();
    const ok = jel("button", "big-btn small", "Confirmar divisão");
    ok.onclick = () => {
      const save = parseInt(range.value);
      const pct = save / total * 100;
      const good = pct >= (step.min || 30) && pct <= (step.max || 70);
      miniDone(step, good, good ? 30 : -10);
    };
    mini.appendChild(vals); mini.appendChild(range); mini.appendChild(ok);
  }

  if (step.kind === "budget") {
    const items = step.items || [{ n: "Fruta", p: 3 }, { n: "Salgado + suco", p: 5 }, { n: "Brownie", p: 8 }, { n: "Combo Turbo", p: 12 }];
    const budget = step.budget || 25;
    const days = ["SEG", "TER", "QUA", "QUI", "SEX"];
    const sel = [1, 1, 1, 1, 1];
    const grid = jel("div", "budget-grid");
    const totalEl = jel("div", "budget-total");
    const upd = () => {
      const t = sel.reduce((a, i) => a + items[i].p, 0);
      totalEl.textContent = "Total: R$ " + t + " / R$ " + budget;
      totalEl.className = "budget-total " + (t > budget ? "over" : "ok");
      return t;
    };
    days.forEach((d, di) => {
      const cell = jel("button", "budget-day");
      const it = () => items[sel[di]];
      const render = () => {
        cell.replaceChildren();
        cell.appendChild(jel("div", "bd-day", d));
        cell.appendChild(jel("div", "bd-item", it().n));
        cell.appendChild(jel("div", "bd-price", "R$ " + it().p));
      };
      cell.onclick = () => { sel[di] = (sel[di] + 1) % items.length; Sfx.click(); render(); upd(); };
      render();
      grid.appendChild(cell);
    });
    upd();
    const ok = jel("button", "big-btn small", "Fechar a semana");
    ok.onclick = () => {
      const t = upd();
      const good = t <= budget;
      miniDone(step, good, good ? 30 + (budget - t) : -15);
    };
    mini.appendChild(grid); mini.appendChild(totalEl); mini.appendChild(ok);
  }

  if (step.kind === "catch") {
    const hud = jel("div", "catch-hud");
    const timeEl = jel("span", "ch-time"), scoreEl = jel("span", "ch-score");
    hud.appendChild(timeEl); hud.appendChild(scoreEl);
    const area = jel("div", "catch-area");
    mini.appendChild(hud); mini.appendChild(area);
    let score = 0, time = step.time || 12, over = false;
    const goods = step.goods || ["+R$"], bads = step.bads || ["GOLPE"];
    scoreEl.textContent = "0 pts";
    timeEl.textContent = time + "s";
    const spawn = () => {
      if (over) return;
      const isGood = Math.random() < 0.6;
      const it = jel("button", "catch-item " + (isGood ? "good" : "bad"),
        isGood ? goods[Math.floor(Math.random() * goods.length)] : bads[Math.floor(Math.random() * bads.length)]);
      it.style.left = (5 + Math.random() * 75) + "%";
      it.style.top = "-56px";
      area.appendChild(it);
      const speed = 2200 + Math.random() * 1400;
      const t0 = performance.now();
      const fall = (ts) => {
        if (!it.isConnected) return;
        const p = (ts - t0) / speed;
        it.style.top = (p * 260 - 56) + "px";
        if (p < 1 && !over) requestAnimationFrame(fall);
        else it.remove();
      };
      requestAnimationFrame(fall);
      it.onclick = () => {
        if (over) return;
        if (isGood) { score += 10; Sfx.cashIn(); } else { score -= 15; Sfx.error(); }
        scoreEl.textContent = score + " pts";
        it.remove();
      };
      setTimeout(spawn, 550 + Math.random() * 450);
    };
    spawn();
    const clock = setInterval(() => {
      time--;
      timeEl.textContent = time + "s";
      if (time <= 0) {
        clearInterval(clock);
        over = true;
        area.querySelectorAll(".catch-item").forEach(x => x.remove());
        const good = score >= (step.goal || 40);
        miniDone(step, good, good ? 35 : Math.max(-10, Math.round(score / 4)));
      }
    }, 1000);
  }

  if (step.kind === "spot") {
    const card = jel("div", "spot-card");
    const status = jel("div", "spot-status");
    let found = 0, taps = 0;
    const flagsTotal = step.pieces.filter(p => p.flag).length;
    const maxTaps = flagsTotal + 2;
    const upd = () => { status.textContent = "Sinais de golpe: " + found + "/" + flagsTotal + " · tentativas: " + (maxTaps - taps); };
    step.pieces.forEach(p => {
      const sp = jel("span", "spot-piece", p.t + " ");
      sp.onclick = () => {
        if (sp.dataset.done || taps >= maxTaps) return;
        sp.dataset.done = "1";
        taps++;
        if (p.flag) { found++; sp.classList.add("flag-found"); Sfx.pop(); }
        else { sp.classList.add("spot-miss"); Sfx.error(); }
        upd();
        if (found >= flagsTotal || taps >= maxTaps) {
          const good = found >= flagsTotal;
          setTimeout(() => miniDone(step, good, good ? 35 : -10), 500);
        }
      };
      card.appendChild(sp);
    });
    upd();
    mini.appendChild(card); mini.appendChild(status);
  }

  if (step.kind === "price") {
    const cost = step.cost || 2;
    let price = 4;
    const row = jel("div", "price-row");
    const minus = jel("button", "price-btn", "−");
    const val = jel("div", "price-val");
    const plus = jel("button", "price-btn", "+");
    row.appendChild(minus); row.appendChild(val); row.appendChild(plus);
    const sim = jel("div", "price-sim");
    const demand = (p) => Math.max(0, Math.round(46 - p * 4.4));
    const upd = () => {
      val.textContent = "R$ " + price;
      const d = demand(price), lucro = (price - cost) * d;
      sim.replaceChildren();
      sim.appendChild(document.createTextNode("A R$ " + price + ", uns " + d + " colegas comprariam."));
      sim.appendChild(document.createElement("br"));
      const b = document.createElement("b");
      b.className = "lucro";
      b.textContent = "Custo R$ " + cost + "/un → lucro estimado: R$ " + lucro;
      sim.appendChild(b);
    };
    minus.onclick = () => { if (price > 1) price--; Sfx.click(); upd(); };
    plus.onclick = () => { if (price < 10) price++; Sfx.click(); upd(); };
    upd();
    const ok = jel("button", "big-btn small", "Vender a este preço!");
    ok.onclick = () => {
      const lucro = (price - cost) * demand(price);
      const good = lucro >= (step.goal || 90);
      miniDone(step, good, good ? Math.min(45, Math.round(lucro / 3)) : (lucro <= 0 ? -15 : 5));
    };
    mini.appendChild(row); mini.appendChild(sim); mini.appendChild(ok);
  }
}

function endLevel() {
  clearInterval(typing); typing = null;
  const lvl = LV.lvl;
  let coins = Math.max(5, JCONFIG.baseCoins + LV.coins);
  if (LV.replay) coins = Math.max(5, Math.round(coins * JCONFIG.replayFactor));
  const fullBest = LV.best >= LV.choicesTotal && LV.choicesTotal > 0;
  const quizOk = LV.quizRight >= LV.quizTotal && LV.quizTotal > 0;
  const stars = (fullBest && quizOk) ? 3 : (quizOk || LV.best >= 1) ? 2 : 1;
  const prev = J.stars[lvl.id] || 0;
  J.stars[lvl.id] = Math.max(prev, stars);
  jsave();

  $j("r-title").textContent = stars === 3 ? "Mandou bem" + (J.name ? ", " + J.name : "") + "!" : "Fase " + lvl.n + " concluída!";
  const sr = $j("r-stars");
  sr.replaceChildren();
  for (let i = 0; i < 3; i++) sr.appendChild(jicon("i-star-f", "ic st" + (i < stars ? " on" : "")));
  $j("r-coins").textContent = "+" + jfmt(coins);
  $j("r-lesson").textContent = lvl.lesson;
  show("scr-result");
  Sfx.fanfare();
  if (stars === 3) confetti();

  const half1 = Math.ceil(coins / 2), half2 = Math.floor(coins / 2);
  $j("btn-save-all").textContent = "Guardar tudo (+" + jfmt(coins) + " no cofre)";
  $j("btn-save-half").textContent = "Metade (+" + jfmt(half1) + " cofre / +" + jfmt(half2) + " livre)";
  $j("btn-save-all").onclick = () => {
    Sfx.cashIn();
    J.cofre += coins;
    finishResult();
    toast("+" + jfmt(coins) + " moedas no Cofre dos Sonhos");
  };
  $j("btn-save-half").onclick = () => {
    Sfx.cashIn();
    J.cofre += half1;
    J.coins += half2;
    finishResult();
    toast("+" + jfmt(half1) + " no cofre · +" + jfmt(half2) + " moedas livres");
  };
}

function finishResult() {
  jsave();
  show("scr-map");
  renderMap();
  checkDream();
}

/* ---------------- Lojinha / Conquistas / Ajustes ---------------- */
function shopModal() {
  const m = $j("modal");
  m.classList.add("active");
  const box = $j("modal-box");
  box.replaceChildren();
  box.appendChild(jel("h3", null, "Lojinha"));
  box.appendChild(jel("p", "modal-sub", "Moedas livres: " + jfmt(J.coins) + ". Aqui você gasta o que NÃO foi pro cofre — gastar também faz parte, desde que seja escolha."));
  STICKERS.forEach(s => {
    const owned = J.stickers.includes(s.id);
    const row = jel("div", "shop-row");
    row.appendChild(jicon(s.ico));
    row.appendChild(jel("div", "s-name", s.name));
    const b = jel("button", "big-btn small" + (owned ? " ghost" : ""), owned ? "Seu!" : jfmt(s.cost) + " moedas");
    b.disabled = owned;
    b.onclick = () => {
      if (J.coins < s.cost) { Sfx.error(); toast("Moedas insuficientes. O cofre não conta, hein!"); return; }
      J.coins -= s.cost;
      J.stickers.push(s.id);
      jsave(); Sfx.buy(); confetti();
      shopModal();
    };
    row.appendChild(b);
    box.appendChild(row);
  });
  const c = jel("button", "big-btn small ghost", "Fechar");
  c.onclick = () => m.classList.remove("active");
  box.appendChild(c);
}

function achieveModal() {
  const m = $j("modal");
  m.classList.add("active");
  const box = $j("modal-box");
  box.replaceChildren();
  box.appendChild(jel("h3", null, "Conquistas"));
  const totalStars = Object.values(J.stars).reduce((a, b) => a + b, 0);
  box.appendChild(jel("p", "modal-sub", totalStars + " de " + (JLEVELS.length * 3) + " estrelas conquistadas.\nItens da lojinha: " + J.stickers.length + " de " + STICKERS.length + "."));
  if (J.stickers.length) {
    STICKERS.filter(s => J.stickers.includes(s.id)).forEach(s => {
      const row = jel("div", "shop-row");
      row.appendChild(jicon(s.ico));
      row.appendChild(jel("div", "s-name", s.name));
      box.appendChild(row);
    });
  }
  const c = jel("button", "big-btn small ghost", "Fechar");
  c.onclick = () => m.classList.remove("active");
  box.appendChild(c);
}

function configModal() {
  const m = $j("modal");
  m.classList.add("active");
  const box = $j("modal-box");
  box.replaceChildren();
  box.appendChild(jel("h3", null, "Ajustes"));
  const s1 = jel("div", "shop-row");
  s1.appendChild(jicon("i-flame"));
  s1.appendChild(jel("div", "s-name", "Sons"));
  const bs = jel("button", "big-btn small ghost", Sfx.on ? "Ligado" : "Desligado");
  bs.onclick = () => { Sfx.set(!Sfx.on); localStorage.setItem("flammers_sound", Sfx.on ? "on" : "off"); bs.textContent = Sfx.on ? "Ligado" : "Desligado"; Sfx.click(); };
  s1.appendChild(bs);
  box.appendChild(s1);

  const s2 = jel("div", "shop-row");
  s2.appendChild(jicon("i-phone"));
  s2.appendChild(jel("div", "s-name", "Modo Vida Real (16+): simulador avançado"));
  const bv = jel("button", "big-btn small ghost", "Abrir");
  bv.onclick = () => { window.location.href = "vida.html"; };
  s2.appendChild(bv);
  box.appendChild(s2);

  const s3 = jel("div", "shop-row");
  s3.appendChild(jicon("i-lock"));
  s3.appendChild(jel("div", "s-name", "Recomeçar a jornada do zero"));
  const br = jel("button", "big-btn small ghost", "Apagar");
  br.onclick = () => { localStorage.removeItem(JKEY); location.reload(); };
  s3.appendChild(br);
  box.appendChild(s3);

  const c = jel("button", "big-btn small", "Fechar");
  c.onclick = () => m.classList.remove("active");
  box.appendChild(c);
}

function vidaModal() {
  const m = $j("modal");
  m.classList.add("active");
  const box = $j("modal-box");
  box.replaceChildren();
  box.appendChild(jel("h3", null, "MODO VIDA REAL"));
  box.appendChild(jel("p", "modal-sub", "Você dominou a jornada. Agora o desafio adulto: assumir o celular de Jô, 27 anos, R$ 8.000 de dívida no cartão — e levar essa vida até a independência financeira.\n\nJuros de verdade. Golpes de verdade. Sem estrelinhas."));
  const b = jel("button", "big-btn small", "Encarar");
  b.onclick = () => { window.location.href = "vida.html"; };
  box.appendChild(b);
  const c = jel("button", "big-btn small ghost", "Ainda não");
  c.onclick = () => m.classList.remove("active");
  box.appendChild(c);
}

/* ---------------- Boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  const has = jload();
  Sfx.set(localStorage.getItem("flammers_sound") !== "off");

  let picked = null;
  document.querySelectorAll(".hero-card").forEach(h => {
    h.onclick = () => {
      Sfx.unlock(); Sfx.pop();
      document.querySelectorAll(".hero-card").forEach(x => x.classList.remove("sel"));
      h.classList.add("sel");
      picked = h.dataset.hero;
      $j("btn-start").disabled = false;
    };
  });
  $j("btn-start").onclick = () => {
    if (!picked) return;
    const name = $j("in-name").value.trim();
    if (name.length < 2) { Sfx.error(); toast("Me conta seu nome primeiro!"); $j("in-name").focus(); return; }
    if (!J) jnew();
    J.char = picked;
    J.name = name.charAt(0).toUpperCase() + name.slice(1);
    J.age = parseInt($j("in-age").value) || 0;
    jsave();
    Sfx.fanfare(); confetti();
    show("scr-map");
    renderMap();
    setTimeout(() => dreamModal(true), 900);
  };

  // botão de som (mapa e fase)
  const syncMute = () => {
    const href = Sfx.on ? "#i-sound" : "#i-mute";
    $j("mute-ic").setAttribute("href", href);
    $j("mute-ic-lv").setAttribute("href", href);
  };
  const toggleMute = () => {
    Sfx.unlock();
    Sfx.set(!Sfx.on);
    localStorage.setItem("flammers_sound", Sfx.on ? "on" : "off");
    syncMute();
    if (Sfx.on) {
      Sfx.click();
      const scr = document.querySelector(".scr.active").id;
      if (scr === "scr-map") Music.play("theme");
      else if (scr === "scr-level" && LV) {
        Music.play(LV.lvl.id === "f5" || LV.lvl.id === "f8" ? "tense" : "chill");
        Ambience.play(LV.lvl.bg);
      }
    }
    toast(Sfx.on ? "Som ligado" : "Som desligado");
  };
  $j("btn-mute").onclick = toggleMute;
  $j("btn-mute-lv").onclick = toggleMute;
  syncMute();

  $j("btn-dream").onclick = () => { Sfx.click(); dreamModal(false); };
  $j("btn-shop").onclick = () => { Sfx.click(); shopModal(); };
  $j("btn-stickers").onclick = () => { Sfx.click(); achieveModal(); };
  $j("btn-config").onclick = () => { Sfx.click(); configModal(); };
  $j("btn-quit").onclick = () => { Sfx.click(); clearInterval(typing); show("scr-map"); renderMap(); };

  // avanço de diálogo: tap em qualquer lugar do painel (menos botões)
  document.querySelector(".lv-panel").onclick = (e) => {
    if (e.target.closest("button")) return;
    if (!LV) return;
    if (typing) { clearInterval(typing); typing = null; $j("lv-text").textContent = typingFull; return; }
    const cur = LV.lvl.steps[LV.i];
    if (!cur) { if (document.querySelector(".scr.active").id === "scr-level") endLevel(); return; }
    if (cur.t === "say" || cur.t === "chat") nextStep();
    else if ($j("lv-choices").children.length === 0) nextStep();
  };

  $j("modal").onclick = (e) => { if (e.target.id === "modal") $j("modal").classList.remove("active"); };

  if (has && J.char) { show("scr-map"); renderMap(); }
  else show("scr-title");

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
    // quando um SW novo assume, recarrega uma vez pra pegar a versão fresca
    let swRefreshed = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (swRefreshed) return;
      swRefreshed = true;
      location.reload();
    });
  }
});
