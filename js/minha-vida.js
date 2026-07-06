/* =========================================================
   FLAMMERS — Minha Vida
   Vida financeira REAL do jogador: carteira, metas, planos,
   resumo com análise da Rê. 100% local (privacidade total).
   ========================================================= */

"use strict";

const MVKEY = "flammersmv_save";
let MV = null;
let tab = "carteira";

const $m = (id) => document.getElementById(id);
const mel = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};
function micon(name, cls) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", cls || "ic");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", "#" + name);
  svg.appendChild(use);
  return svg;
}
const mfmt = (n) => "R$ " + (Math.round(n * 100) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const todayISO = () => new Date().toISOString().slice(0, 10);
const monthKey = (d) => (d || todayISO()).slice(0, 7);

const CATS = {
  in:  [["mesada", "Mesada"], ["salario", "Salário/bico"], ["presente", "Presente"], ["venda", "Vendi algo"], ["outro_in", "Outro"]],
  out: [["lanche", "Lanche/comida"], ["transporte", "Transporte"], ["lazer", "Rolê/lazer"], ["jogos", "Jogos/skins"], ["roupas", "Roupas"], ["estudo", "Estudos"], ["outro_out", "Outro"]]
};
const CATCOLOR = { mesada: "#4ecdc4", salario: "#4ade80", presente: "#ffd166", venda: "#8b5cf6", outro_in: "#a3e635",
  lanche: "#ff8c42", transporte: "#38bdf8", lazer: "#ff5a1f", jogos: "#8b5cf6", roupas: "#f472b6", estudo: "#4ecdc4", outro_out: "#94a3b8" };
const catName = (id) => { for (const k of ["in", "out"]) { const c = CATS[k].find(x => x[0] === id); if (c) return c[1]; } return id; };

const MVBADGES = {
  primeiro: { ico: "i-star-f", name: "Primeiro Registro", desc: "Anotou a primeira movimentação real" },
  semana: { ico: "i-flame", name: "Semana no Controle", desc: "7 dias seguidos anotando" },
  meta1: { ico: "i-target", name: "Sonhador com Plano", desc: "Criou a primeira meta real" },
  metaok: { ico: "i-check", name: "Meta Batida", desc: "Completou uma meta de verdade" },
  azul: { ico: "i-coin", name: "Mês no Azul", desc: "Fechou um mês gastando menos do que ganhou" }
};

/* ---------------- Save ---------------- */
function mvLoad() {
  try { const d = JSON.parse(localStorage.getItem(MVKEY)); if (d && d.v === 1) { MV = d; return; } } catch (e) {}
  MV = { v: 1, tx: [], goals: [], plans: [], streak: 0, lastDay: "", badges: [] };
}
function mvSave() { try { localStorage.setItem(MVKEY, JSON.stringify(MV)); } catch (e) {} }

function toast(msg) {
  const t = $m("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2600);
}
function confetti() {
  const box = $m("confetti");
  for (let i = 0; i < 26; i++) {
    const p = mel("div", "conf");
    p.style.left = Math.random() * 100 + "%";
    p.style.background = ["#ff5a1f", "#ffd166", "#4ecdc4", "#8b5cf6", "#4ade80"][i % 5];
    p.style.animationDelay = (Math.random() * 0.4) + "s";
    box.appendChild(p);
    setTimeout(() => p.remove(), 2400);
  }
}
function award(id) {
  if (MV.badges.includes(id)) return;
  MV.badges.push(id);
  mvSave();
  Sfx.fanfare(); confetti();
  toast("Conquista real: " + MVBADGES[id].name + "!");
}
function bumpStreak() {
  const today = todayISO();
  if (MV.lastDay === today) return;
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  MV.streak = MV.lastDay === y ? MV.streak + 1 : 1;
  MV.lastDay = today;
  if (MV.streak >= 7) award("semana");
  $m("mv-streak").textContent = MV.streak;
}

/* ---------------- Métricas do mês ---------------- */
function monthTx() { const mk = monthKey(); return MV.tx.filter(t => monthKey(t.date) === mk); }
function totals(txs) {
  const inn = txs.filter(t => t.type === "in").reduce((s, t) => s + t.val, 0);
  const out = txs.filter(t => t.type === "out").reduce((s, t) => s + t.val, 0);
  return { inn, out, saldo: inn - out };
}

/* ---------------- Render ---------------- */
function render() {
  $m("mv-streak").textContent = MV.streak;
  document.querySelectorAll(".mv-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  $m("mv-add").style.display = tab === "resumo" ? "none" : "flex";
  const body = $m("mv-body");
  body.replaceChildren();
  if (tab === "carteira") renderCarteira(body);
  if (tab === "metas") renderMetas(body);
  if (tab === "planos") renderPlanos(body);
  if (tab === "resumo") renderResumo(body);
}

function renderCarteira(body) {
  const { inn, out, saldo } = totals(monthTx());
  const hero = mel("div", "card hero");
  hero.appendChild(mel("div", "w-label", "SALDO DO MÊS (" + new Date().toLocaleDateString("pt-BR", { month: "long" }).toUpperCase() + ")"));
  const big = mel("div", "big-value" + (saldo < 0 ? " neg" : ""), mfmt(saldo));
  hero.appendChild(big);
  const row = mel("div", "mv-inout");
  const i1 = mel("span", "mv-in"); i1.appendChild(micon("i-up", "ic sm")); i1.appendChild(document.createTextNode(" " + mfmt(inn)));
  const i2 = mel("span", "mv-out"); i2.appendChild(micon("i-dn", "ic sm")); i2.appendChild(document.createTextNode(" " + mfmt(out)));
  row.appendChild(i1); row.appendChild(i2);
  hero.appendChild(row);
  body.appendChild(hero);

  body.appendChild(mel("div", "section-label", "MOVIMENTAÇÕES"));
  const txs = [...MV.tx].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 40);
  if (!txs.length) {
    const empty = mel("div", "mv-empty");
    empty.appendChild(mel("div", null, "Nada anotado ainda."));
    empty.appendChild(mel("div", "mv-empty-sub", "Toca no + e registra teu primeiro gasto ou ganho de verdade. A Rê analisa tudo pra você no Resumo."));
    body.appendChild(empty);
    return;
  }
  for (const t of txs) {
    const r = mel("div", "mv-tx");
    const dot = mel("span", "mv-dot");
    dot.style.background = CATCOLOR[t.cat] || "#888";
    r.appendChild(dot);
    const mid = mel("div", "mv-tx-mid");
    mid.appendChild(mel("div", "mv-tx-desc", t.desc || catName(t.cat)));
    mid.appendChild(mel("div", "mv-tx-meta", catName(t.cat) + " · " + t.date.slice(8, 10) + "/" + t.date.slice(5, 7)));
    r.appendChild(mid);
    r.appendChild(mel("div", "mv-tx-val " + (t.type === "in" ? "pos" : "negv"), (t.type === "in" ? "+" : "−") + mfmt(t.val)));
    const del = mel("button", "mv-del");
    del.appendChild(micon("i-trash", "ic sm"));
    del.onclick = () => { MV.tx = MV.tx.filter(x => x.id !== t.id); mvSave(); Sfx.pop(); render(); };
    r.appendChild(del);
    body.appendChild(r);
  }
}

function renderMetas(body) {
  if (!MV.goals.length) {
    const empty = mel("div", "mv-empty");
    empty.appendChild(mel("div", null, "Nenhuma meta real ainda."));
    empty.appendChild(mel("div", "mv-empty-sub", "No jogo você encheu o Cofre dos Sonhos. Aqui é DE VERDADE: cria uma meta (fone, bike, viagem...) e registra cada depósito."));
    body.appendChild(empty);
    return;
  }
  for (const g of MV.goals) {
    const card = mel("div", "card");
    const top = mel("div", "card-top");
    top.appendChild(mel("div", "card-title", g.name));
    top.appendChild(mel("div", "debt-val " + (g.done ? "pos" : ""), g.done ? "CONQUISTADA!" : mfmt(g.saved) + " / " + mfmt(g.target)));
    card.appendChild(top);
    const pct = Math.min(100, Math.round(g.saved / g.target * 100));
    const track = mel("div", "goal-track");
    const fill = mel("div", "goal-fill");
    fill.style.width = pct + "%";
    track.appendChild(fill);
    card.appendChild(track);
    card.appendChild(mel("div", "goal-nums", pct + "% do caminho" + (g.deadline ? " · até " + g.deadline.slice(8, 10) + "/" + g.deadline.slice(5, 7) : "")));
    if (!g.done) {
      const row = mel("div", "btn-row");
      const dep = mel("button", "mini-btn hot", "Depositei!");
      dep.onclick = () => depositModal(g);
      row.appendChild(dep);
      const rm = mel("button", "mini-btn danger", "Excluir");
      rm.onclick = () => { MV.goals = MV.goals.filter(x => x.id !== g.id); mvSave(); render(); };
      row.appendChild(rm);
      card.appendChild(row);
    }
    body.appendChild(card);
  }
}

function renderPlanos(body) {
  if (!MV.plans.length) {
    const empty = mel("div", "mv-empty");
    empty.appendChild(mel("div", null, "Nenhum plano anotado."));
    empty.appendChild(mel("div", "mv-empty-sub", "Planos são sonhos com passos. Anota aqui o que você quer fazer: \"vender doce na escola\", \"pesquisar preço do fone\", \"guardar R$ 10 por semana\"..."));
    body.appendChild(empty);
    return;
  }
  for (const p of MV.plans) {
    const r = mel("div", "mv-plan" + (p.done ? " done" : ""));
    const chk = mel("button", "mv-chk" + (p.done ? " on" : ""));
    if (p.done) chk.appendChild(micon("i-check", "ic sm"));
    chk.onclick = () => { p.done = !p.done; mvSave(); if (p.done) { Sfx.success(); } render(); };
    r.appendChild(chk);
    r.appendChild(mel("div", "mv-plan-text", p.text));
    const del = mel("button", "mv-del");
    del.appendChild(micon("i-trash", "ic sm"));
    del.onclick = () => { MV.plans = MV.plans.filter(x => x.id !== p.id); mvSave(); render(); };
    r.appendChild(del);
    body.appendChild(r);
  }
}

/* ---------------- Resumo + Rê Analisa ---------------- */
function reTips() {
  const txs = monthTx();
  const { inn, out, saldo } = totals(txs);
  const tips = [];
  if (!MV.tx.length) {
    tips.push("Começa simples: anota UMA coisa que você gastou hoje. Quem anota, enxerga — quem enxerga, decide.");
    return tips;
  }
  if (out > inn && inn > 0) tips.push("Alerta: este mês você gastou " + mfmt(out - inn) + " a MAIS do que ganhou. Lembra da fase da mesada? Hora de segurar uns dias.");
  if (saldo >= 0 && inn > 0) {
    const rate = Math.round(saldo / inn * 100);
    if (rate >= 20) tips.push("Você guardou " + rate + "% do que ganhou este mês. Isso é nível Lenda da Grana — melhor que muito adulto!");
    else if (rate > 0) tips.push("Sobrou " + rate + "% este mês. Bora tentar chegar nos 20%? Cada realzinho guardado trabalha pra você.");
  }
  const byCat = {};
  txs.filter(t => t.type === "out").forEach(t => byCat[t.cat] = (byCat[t.cat] || 0) + t.val);
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  if (top && out > 0 && top[1] / out > 0.4) tips.push("Quase metade dos seus gastos foi com " + catName(top[0]).toLowerCase() + " (" + mfmt(top[1]) + "). Não é proibido — mas foi uma ESCOLHA ou foi no piloto automático?");
  const near = MV.goals.find(g => !g.done && g.saved / g.target >= 0.7);
  if (near) tips.push("Sua meta \"" + near.name + "\" tá " + Math.round(near.saved / near.target * 100) + "% completa! Falta pouco — não vale desistir na reta final.");
  if (MV.streak >= 3) tips.push("Já são " + MV.streak + " dias seguidos anotando. Constância é o superpoder financeiro mais subestimado que existe.");
  if (!tips.length) tips.push("Tudo em ordem por aqui. Continua anotando que no fim do mês a gente fecha as contas juntos.");
  return tips;
}

function renderResumo(body) {
  const txs = monthTx();
  const { inn, out, saldo } = totals(txs);

  // Rê analisa
  const re = mel("div", "mv-re");
  const av = document.createElement("img");
  av.src = "assets/art/re.svg"; av.className = "mv-re-av"; av.alt = "Rê";
  re.appendChild(av);
  const bub = mel("div", "mv-re-bub");
  bub.appendChild(mel("div", "mv-re-tag", "RÊ ANALISA SEUS NÚMEROS"));
  reTips().forEach(t => bub.appendChild(mel("p", "mv-re-tip", t)));
  re.appendChild(bub);
  body.appendChild(re);

  // gastos por categoria (gráfico de barras CSS)
  body.appendChild(mel("div", "section-label", "GASTOS POR CATEGORIA (MÊS)"));
  const byCat = {};
  txs.filter(t => t.type === "out").forEach(t => byCat[t.cat] = (byCat[t.cat] || 0) + t.val);
  const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  if (!entries.length) body.appendChild(mel("div", "mv-empty-sub", "Sem gastos anotados este mês."));
  const max = entries.length ? entries[0][1] : 1;
  for (const [cat, val] of entries) {
    const r = mel("div", "mv-bar-row");
    r.appendChild(mel("div", "mv-bar-name", catName(cat)));
    const track = mel("div", "mv-bar-track");
    const fill = mel("div", "mv-bar-fill");
    fill.style.width = Math.max(6, Math.round(val / max * 100)) + "%";
    fill.style.background = CATCOLOR[cat] || "#888";
    track.appendChild(fill);
    r.appendChild(track);
    r.appendChild(mel("div", "mv-bar-val", mfmt(val)));
    body.appendChild(r);
  }

  // taxa de poupança
  if (inn > 0) {
    body.appendChild(mel("div", "section-label", "TAXA DE POUPANÇA"));
    const card = mel("div", "card hero");
    const rate = Math.max(0, Math.round(saldo / inn * 100));
    card.appendChild(mel("div", "big-value small" + (saldo < 0 ? " neg" : ""), saldo < 0 ? "no vermelho" : rate + "%"));
    card.appendChild(mel("div", "card-desc", "do que entrou este mês " + (saldo < 0 ? "— gastou mais do que ganhou" : "ficou com você")));
    body.appendChild(card);
  }

  // conquistas reais
  if (MV.badges.length) {
    body.appendChild(mel("div", "section-label", "CONQUISTAS REAIS"));
    const grid = mel("div", "badge-grid");
    for (const id of MV.badges) {
      const b = MVBADGES[id];
      if (!b) continue;
      const c = mel("div", "badge-card");
      c.appendChild(micon(b.ico));
      c.appendChild(mel("div", "badge-name", b.name));
      grid.appendChild(c);
    }
    body.appendChild(grid);
  }

  // exportar
  body.appendChild(mel("div", "section-label", "SEUS DADOS, SUAS REGRAS"));
  const row = mel("div", "btn-row");
  const bj = mel("button", "mini-btn", "Baixar backup (JSON)");
  bj.onclick = () => download("flammers-minha-vida.json", JSON.stringify(MV, null, 2), "application/json");
  const bc = mel("button", "mini-btn", "Planilha (CSV)");
  bc.onclick = () => {
    const rows = [["data", "tipo", "categoria", "descricao", "valor"]];
    MV.tx.forEach(t => rows.push([t.date, t.type === "in" ? "entrada" : "saida", catName(t.cat), (t.desc || "").replace(/[;\n]/g, " "), String(t.val).replace(".", ",")]));
    download("flammers-carteira.csv", rows.map(r => r.join(";")).join("\n"), "text/csv");
  };
  row.appendChild(bj); row.appendChild(bc);
  body.appendChild(row);
}

function download(name, content, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿" + content], { type }));
  a.download = name;
  a.click();
  Sfx.pop();
  toast("Arquivo gerado — seus dados são seus.");
}

/* ---------------- Modais de adição ---------------- */
function openModal() { $m("modal").classList.add("active"); const b = $m("modal-box"); b.replaceChildren(); return b; }
function closeModal() { $m("modal").classList.remove("active"); }

function addTxModal() {
  const box = openModal();
  box.appendChild(mel("h3", null, "Anotar movimentação"));
  let type = "out";
  const seg = mel("div", "mv-seg");
  const bOut = mel("button", "mv-seg-b active", "Gastei");
  const bIn = mel("button", "mv-seg-b", "Ganhei");
  seg.appendChild(bOut); seg.appendChild(bIn);
  box.appendChild(seg);
  const val = document.createElement("input");
  val.type = "number"; val.min = "0"; val.step = "0.01"; val.placeholder = "Valor (R$)";
  val.className = "t-input mv-w";
  box.appendChild(val);
  const sel = document.createElement("select");
  sel.className = "t-input mv-w";
  const fillCats = () => {
    sel.replaceChildren();
    CATS[type].forEach(([id, name]) => { const o = document.createElement("option"); o.value = id; o.textContent = name; sel.appendChild(o); });
  };
  fillCats();
  box.appendChild(sel);
  const desc = document.createElement("input");
  desc.type = "text"; desc.maxLength = 40; desc.placeholder = "Descrição (opcional)";
  desc.className = "t-input mv-w";
  box.appendChild(desc);
  bOut.onclick = () => { type = "out"; bOut.classList.add("active"); bIn.classList.remove("active"); fillCats(); Sfx.click(); };
  bIn.onclick = () => { type = "in"; bIn.classList.add("active"); bOut.classList.remove("active"); fillCats(); Sfx.click(); };
  const ok = mel("button", "big-btn small", "Salvar");
  ok.onclick = () => {
    const v = parseFloat(val.value);
    if (!v || v <= 0) { Sfx.error(); toast("Coloca o valor!"); return; }
    MV.tx.push({ id: Date.now(), type, val: v, cat: sel.value, desc: desc.value.trim(), date: todayISO() });
    bumpStreak();
    if (MV.tx.length === 1) award("primeiro");
    const { inn, out } = totals(monthTx());
    if (inn > 0 && inn >= out && MV.tx.filter(t => monthKey(t.date) === monthKey()).length >= 5) award("azul");
    mvSave(); Sfx.cashIn(); closeModal(); render();
    toast(type === "in" ? "+" + mfmt(v) + " anotado. Boa!" : mfmt(v) + " anotado. Anotar já é controlar.");
  };
  box.appendChild(ok);
}

function addGoalModal() {
  const box = openModal();
  box.appendChild(mel("h3", null, "Nova meta REAL"));
  box.appendChild(mel("p", "modal-sub", "Igual ao Cofre dos Sonhos do jogo — só que essa é da sua vida."));
  const name = document.createElement("input");
  name.type = "text"; name.maxLength = 30; name.placeholder = "O que você quer? (ex: fone novo)";
  name.className = "t-input mv-w";
  const target = document.createElement("input");
  target.type = "number"; target.min = "1"; target.placeholder = "Quanto custa? (R$)";
  target.className = "t-input mv-w";
  const dl = document.createElement("input");
  dl.type = "date";
  dl.className = "t-input mv-w";
  box.appendChild(name); box.appendChild(target); box.appendChild(dl);
  const ok = mel("button", "big-btn small", "Criar meta");
  ok.onclick = () => {
    const t = parseFloat(target.value);
    if (name.value.trim().length < 2 || !t || t <= 0) { Sfx.error(); toast("Preenche o nome e o valor!"); return; }
    MV.goals.push({ id: Date.now(), name: name.value.trim(), target: t, saved: 0, deadline: dl.value || null, done: false });
    award("meta1");
    bumpStreak(); mvSave(); Sfx.success(); closeModal(); render();
  };
  box.appendChild(ok);
}

function depositModal(g) {
  const box = openModal();
  box.appendChild(mel("h3", null, "Depósito na meta"));
  box.appendChild(mel("p", "modal-sub", g.name + " — faltam " + mfmt(g.target - g.saved)));
  const val = document.createElement("input");
  val.type = "number"; val.min = "0"; val.step = "0.01"; val.placeholder = "Quanto você guardou? (R$)";
  val.className = "t-input mv-w";
  box.appendChild(val);
  const ok = mel("button", "big-btn small", "Registrar depósito");
  ok.onclick = () => {
    const v = parseFloat(val.value);
    if (!v || v <= 0) { Sfx.error(); toast("Coloca o valor!"); return; }
    g.saved += v;
    bumpStreak();
    if (g.saved >= g.target) {
      g.done = true;
      award("metaok");
      confetti(); setTimeout(confetti, 500);
      Sfx.fanfare();
      toast("META REAL CONQUISTADA: " + g.name + "!");
    } else {
      Sfx.cashIn();
      toast("+" + mfmt(v) + " na meta. Tá chegando!");
    }
    mvSave(); closeModal(); render();
  };
  box.appendChild(ok);
}

function addPlanModal() {
  const box = openModal();
  box.appendChild(mel("h3", null, "Novo plano"));
  const text = document.createElement("input");
  text.type = "text"; text.maxLength = 60; text.placeholder = "Ex: pesquisar preço do fone em 3 lojas";
  text.className = "t-input mv-w";
  box.appendChild(text);
  const ok = mel("button", "big-btn small", "Anotar plano");
  ok.onclick = () => {
    if (text.value.trim().length < 3) { Sfx.error(); toast("Escreve o plano!"); return; }
    MV.plans.push({ id: Date.now(), text: text.value.trim(), done: false });
    bumpStreak(); mvSave(); Sfx.pop(); closeModal(); render();
  };
  box.appendChild(ok);
}

/* ---------------- Boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  mvLoad();
  Sfx.set(localStorage.getItem("flammers_sound") !== "off");
  document.querySelectorAll(".mv-tab").forEach(b => {
    b.onclick = () => { Sfx.unlock(); Sfx.click(); tab = b.dataset.tab; render(); };
  });
  $m("mv-add").onclick = () => {
    Sfx.unlock(); Sfx.click();
    if (tab === "carteira") addTxModal();
    else if (tab === "metas") addGoalModal();
    else if (tab === "planos") addPlanModal();
  };
  $m("mv-back").onclick = () => { window.location.href = "index.html"; };
  $m("modal").onclick = (e) => { if (e.target.id === "modal") closeModal(); };
  render();
});
