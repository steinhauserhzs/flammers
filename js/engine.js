/* =========================================================
   FLAMMERS — ENGINE v3 (estado, tempo, economia, eventos)
   Toda a simulação vive aqui. UI só desenha e chama ações.
   v3: exploits fechados, retenção por data real, fricção
   imobiliária, beat diário garantido, fail-state.
   ========================================================= */

"use strict";

const SAVE_KEY = "flammers3_save";
const CHEQUE_ESPECIAL_DAY = 0.0028;

let G = null;

/* ---------------- Novo jogo / Save ---------------- */
function newGame() {
  G = {
    v: 3,
    name: PERSONA.name,
    day: 0,
    cash: PERSONA.cash,
    reserve: 0,
    salary: PERSONA.salary,
    stress: PERSONA.stress,
    mood: PERSONA.mood,
    score: PERSONA.score,
    xp: 0,
    radar: 10,
    debts: DEBTS_START.map(d => ({ ...d })),
    subs: SUBS_START.map(s => ({ ...s })),
    invest: { selic: 0, cdb: 0, fiiUnits: 0, cripto: 0 },
    prices: { fii: 100, market: 1.0 },
    cdbLockUntil: 0,
    properties: [],
    listings: [],
    missions: { done: [] },
    badges: [],
    chat: {},
    inbox: [],
    notifs: {},
    flags: {},
    scheduled: [{ day: 60, key: "tioze_guilt" }],
    cooldowns: {},
    firedEvents: [],
    history: [],
    blockExtraUntil: 0,
    lastExtraDay: -9, lastFreelaWeek: -1,
    moodDay: {},
    negDays: 0,
    monthPaid: 0, monthEarned: 0, monthInterest: 0,
    realStreak: 0, lastRealDay: "", lastSeen: Date.now(),
    lastReport: null,
    won: false, ended: false,
    log: []
  };
  refreshListings();
  chatPush("re", "them",
    "Oi, " + G.name + "! Aqui é a Rê, sua consultora da Flamma. A partir de hoje, eu e você vamos tirar sua vida do vermelho — missão por missão. Sem julgamento, sem economês. Sua primeira missão já tá no app Metas. Bora?");
  notify("metas"); notify("zapzap");
  logAdd("Rê entrou na sua vida financeira");
  save();
}

function save() { G.lastSeen = Date.now(); try { localStorage.setItem(SAVE_KEY, JSON.stringify(G)); } catch (e) {} }
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (d && d.v === 3) { G = d; return true; }
  } catch (e) {}
  return false;
}
function resetGame() { localStorage.removeItem(SAVE_KEY); newGame(); }

/* ---------------- Helpers ---------------- */
const fmt = (n) => "R$ " + Math.round(n).toLocaleString("pt-BR");
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const monthDay = () => ((G.day - 1) % 30) + 1;
const isWeekend = () => G.day % 7 === 0 || G.day % 7 === 6;
const rnd = (a, b) => a + Math.random() * (b - a);
const todayKey = () => { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };

function logAdd(text, val) {
  G.log.unshift({ day: G.day, text, val: val || 0 });
  if (G.log.length > 60) G.log.pop();
}

function notify(app) { G.notifs[app] = (G.notifs[app] || 0) + 1; }
function clearNotif(app) { G.notifs[app] = 0; }

function chatPush(contact, who, text) {
  if (!G.chat[contact]) G.chat[contact] = [];
  G.chat[contact].push({ who, text, day: G.day });
  if (who === "them") notify("zapzap");
}

function levelOf(xp) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) idx = i;
  return LEVELS[idx];
}

/* ---------------- Métricas ---------------- */
function investTotal() {
  return G.invest.selic + G.invest.cdb + G.invest.fiiUnits * G.prices.fii + G.invest.cripto;
}
function propsValue() {
  return G.properties.reduce((s, p) => s + p.value * G.prices.market, 0);
}
function netWorth() {
  return G.cash + G.reserve + investTotal() + propsValue() - G.debts.reduce((s, d) => s + d.total, 0);
}
/* Renda passiva LÍQUIDA: aluguéis + dividendos + renda fixa − parcelas de financiamento − parcela do acordo */
function passiveMonthly() {
  const rents = G.properties.filter(p => p.renting).reduce((s, p) => s + p.rent * 0.92, 0); // 8% manutenção
  const fiiDiv = G.invest.fiiUnits * G.prices.fii * 0.0085;
  const fixedIncome = (G.invest.selic * 0.00035 + G.invest.cdb * 0.00041 + G.reserve * 0.00033) * 30;
  const finParcels = G.subs.filter(s => s.active && String(s.id).startsWith("fin_")).reduce((s, x) => s + x.cost, 0);
  const acordo = G.debts.find(d => d.id === "parcelado" && d.total > 0);
  return rents + fiiDiv + fixedIncome - finParcels - (acordo ? acordo.parcela : 0);
}
function dailyCost() {
  let c = DAILY_COST;
  if (G.flags.bike) c -= 4;
  if (G.flags.marmiteira) c -= 3;
  return Math.max(5, c);
}
function monthlyCostNow() { return MONTHLY_COST - (DAILY_COST - dailyCost()) * 30; }
function phaseNow() {
  if (G.won) return 5;
  if (G.properties.length >= 2) return 4;
  if (investTotal() > 8000) return 3;
  if (G.reserve >= 6900) return 2;
  if (!G.debts.some(d => (d.id === "rotativo" || d.id === "parcelado") && d.total > 0)) return 1;
  return 0;
}

/* ---------------- API dos eventos ---------------- */
function makeApi(payload) {
  return {
    G: () => G,
    payload: () => payload,
    cash: (v) => { G.cash += v; logAdd(v >= 0 ? "Entrada (evento)" : "Saída (evento)", v); },
    reserve: (v) => { G.reserve = Math.max(0, G.reserve + v); },
    stress: (v) => { G.stress = clamp(G.stress + v, 0, 100); },
    mood: (v) => { G.mood = clamp(G.mood + v, 0, 100); },
    xp: (v) => { G.xp += v; },
    radar: (v) => { G.radar = clamp(G.radar + v, 0, 100); if (G.radar >= 50) award("radar50"); },
    salary: (pct) => { G.salary = Math.round(G.salary * (1 + pct)); },
    flag: (k, v) => { G.flags[k] = v === undefined ? true : v; },
    schedule: (key, days, pl) => { G.scheduled.push({ day: G.day + days, key, payload: pl }); },
    msg: (contact, text) => chatPush(contact, "them", text),
    mentorSoon: (text) => { G.scheduled.push({ day: G.day + 1, key: "__mentor__", text }); },
    mentorNote: (text) => chatPush("re", "them", text),
    debtSettle: (id, payPct) => {
      const d = G.debts.find(x => x.id === id);
      if (!d) return 0;
      const val = Math.round(d.total * payPct);
      G.cash -= val; d.total = 0;
      G.score = clamp(G.score + 80, 0, 1000);
      logAdd("Quitação " + d.name, -val);
      return val;
    },
    debtAdd: (id, name, total, rate) => { G.debts.push({ id, name, ico: "i-alert", total, rate, desc: "" }); },
    subAdd: (id, name, cost, months) => { G.subs.push({ id, name, ico: "i-card", cost, active: true, monthsLeft: months || 0 }); },
    investAdd: (kind, val) => {
      if (kind === "fii") G.invest.fiiUnits += val / G.prices.fii;
      else G.invest[kind] = (G.invest[kind] || 0) + val;
      G.flags.invested = true;
    }
  };
}

/* ---------------- Badges ---------------- */
function award(id) {
  if (G.badges.includes(id)) return;
  const b = BADGES[id];
  if (!b) return;
  G.badges.push(id);
  UI.confetti();
  Sfx.fanfare();
  UI.toast("Badge conquistado: " + b.name);
  chatPush("re", "them", "Badge desbloqueado: " + b.name + " — " + b.desc + ". Colecione todos!");
}

/* ---------------- Missões ---------------- */
const MISSION_CHECKS = {
  m1: () => !!G.flags.bankOpened,
  m2: () => !!G.flags.negotiated || !G.debts.some(d => d.id === "rotativo" && d.total > 0),
  m3: () => !!G.flags.subCancelled,
  m4: () => G.reserve >= 500,
  m5: () => !G.debts.some(d => (d.id === "rotativo" || d.id === "parcelado") && d.total > 0),
  m6: () => G.reserve >= 2300,
  m7: () => !!G.flags.invested,
  m6b: () => G.reserve >= 4500,
  m8: () => G.reserve >= 6900,
  m9: () => G.properties.length >= 1,
  m10: () => !!G.flags.flipped,
  m11: () => passiveMonthly() >= 800,
  m12: () => passiveMonthly() >= monthlyCostNow()
};

function activeMissions() {
  const pending = MISSIONS.filter(m => !G.missions.done.includes(m.id));
  return pending.slice(0, 3);
}

function checkMissions() {
  for (const m of activeMissions()) {
    if (MISSION_CHECKS[m.id] && MISSION_CHECKS[m.id]()) {
      G.missions.done.push(m.id);
      G.xp += m.xp;
      if (m.unlock) G.flags[m.unlock] = true;
      chatPush("re", "them", "MISSÃO CUMPRIDA — " + m.title + " (+" + m.xp + " XP)\n\n" + m.mentor);
      notify("metas");
      UI.confetti();
      Sfx.success();
      UI.toast("Missão cumprida: " + m.title + " (+" + m.xp + " XP)");
      if (m.id === "m5") UI.bigMoment("NOME LIMPO", "A dívida do cartão morreu. Seu nome voltou pra praça — e com ele, seu poder de negociar.", "assets/art/wp1.svg");
      if (m.id === "m9") UI.bigMoment("PROPRIETÁRIO", "A primeira escritura é sua. De devedor a dono em " + G.day + " dias.", "assets/art/prop-vaga.svg");
      if (m.id === "m10") award("flipper");
      if (m.id === "m12") winGame();
      save();
    }
  }
}

function winGame() {
  if (G.won) return;
  G.won = true;
  award("fire");
  UI.fireScreen();
}

/* ---------------- Retenção por data real ---------------- */
function realDayCheck() {
  const today = todayKey();
  if (G.lastRealDay === today) return;
  const gift = 50 + Math.min(G.realStreak, 7) * 10;
  const yesterday = (() => { const d = new Date(Date.now() - 86400000); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); })();
  G.realStreak = (G.lastRealDay === yesterday) ? G.realStreak + 1 : 1;
  G.lastRealDay = today;
  G.cash += gift; G.xp += 20;
  const away = Date.now() - (G.lastSeen || Date.now());
  const back = away > 86400000 ? "Que bom te ver de volta! " : "";
  chatPush("re", "them", back + "Bônus de constância: dia " + G.realStreak + " seguido cuidando da vida do Jô. Caiu " + fmt(gift) + " + 20 XP. Constância vence valor — sempre.");
  if (G.realStreak >= 7) award("constancia");
  notify("zapzap");
  save();
}

/* ---------------- Ações do jogador ---------------- */
const Actions = {
  sleep(days) {
    days = days || 1;
    const start = { cash: G.cash, day: G.day, msgs: 0 };
    let interest = 0, events = 0;
    for (let i = 0; i < days; i++) {
      if (G.ended) break;
      const before = G.inbox.length;
      const j = advanceDay();
      interest += j;
      if (G.inbox.length > before) events++;
      if (days > 1 && G.inbox.length >= 2) break; // semana para se a caixa lotar
    }
    G.lastReport = {
      from: start.day, to: G.day,
      delta: Math.round(G.cash - start.cash),
      interest: Math.round(interest),
      events
    };
    Sfx.sleep();
    save();
    UI.morningReport();
  },

  extraShift() {
    if (G.day <= G.blockExtraUntil) { UI.toast("Você está de atestado. Descanse."); Sfx.error(); return; }
    if (G.lastExtraDay === G.day) { UI.toast("Já fez turno extra hoje. O corpo tem limite!"); Sfx.error(); return; }
    if (G.flags.folgaDay === G.day) { UI.toast("Hoje foi dia de folga — sem turno extra."); Sfx.error(); return; }
    G.lastExtraDay = G.day;
    const pay = 110;
    G.cash += pay; G.stress = clamp(G.stress + 10, 0, 100); G.mood = clamp(G.mood - 3, 0, 100);
    G.monthEarned += pay;
    logAdd("Turno extra", pay);
    Sfx.cashIn();
    UI.toast("Turno extra: +" + fmt(pay) + " (estresse +10)");
    save(); UI.renderAll();
  },

  freela() {
    if (!isWeekend()) { UI.toast("Freela só rola no fim de semana."); Sfx.error(); return; }
    if (G.day <= G.blockExtraUntil) { UI.toast("De atestado. O corpo cobra os juros dele."); Sfx.error(); return; }
    const week = Math.floor(G.day / 7);
    if (G.lastFreelaWeek === week) { UI.toast("Freela desta semana já feito!"); Sfx.error(); return; }
    G.lastFreelaWeek = week;
    const pay = G.flags.curso ? 290 : 180;
    G.cash += pay; G.stress = clamp(G.stress + 8, 0, 100);
    G.monthEarned += pay;
    logAdd("Freela de fim de semana", pay);
    Sfx.cashIn();
    UI.toast("Freela: +" + fmt(pay) + (G.flags.curso ? " (turbinado pelo curso!)" : ""));
    save(); UI.renderAll();
  },

  folga() {
    if (G.lastExtraDay === G.day) { UI.toast("Turno extra e folga no mesmo dia não existe nem em Brasília."); Sfx.error(); return; }
    G.flags.folgaDay = G.day + 1;
    G.stress = clamp(G.stress - 18, 0, 100); G.mood = clamp(G.mood + 8, 0, 100);
    UI.toast("Folga tirada. Estresse −18.");
    Actions.sleep(1);
  },

  toReserve(v) {
    v = Math.min(v, Math.floor(G.cash));
    if (v <= 0) { UI.toast("Sem saldo disponível pra guardar."); Sfx.error(); return; }
    G.cash -= v; G.reserve += v;
    logAdd("Guardado na reserva", -v);
    Sfx.cashIn();
    UI.toast("+" + fmt(v) + " na reserva");
    checkMissions(); save(); UI.renderAll();
  },

  fromReserve(v) {
    v = Math.min(v, G.reserve);
    if (v <= 0) return;
    G.reserve -= v; G.cash += v;
    logAdd("Resgate da reserva", v);
    save(); UI.renderAll();
  },

  payDebt(id, amount) {
    const d = G.debts.find(x => x.id === id);
    if (!d || d.total <= 0) return;
    const v = Math.min(amount === "all" ? d.total : amount, d.total, Math.max(0, G.cash));
    if (v <= 0) { UI.toast("Saldo insuficiente."); Sfx.error(); return; }
    G.cash -= v; d.total -= v;
    G.monthPaid += v;
    logAdd("Pagamento " + d.name, -v);
    Sfx.cashOut();
    if (d.total <= 0.5) {
      d.total = 0;
      G.score = clamp(G.score + 70, 0, 1000);
      UI.confetti();
      Sfx.success();
      UI.toast("Dívida quitada: " + d.name + "!");
      if (d.id === "tioze") chatPush("mae", "them", "Filho, o tio Zé ligou todo bobo dizendo que você pagou tudo. Tô orgulhosa!");
    } else {
      UI.toast("Pago " + fmt(v) + ". Restam " + fmt(d.total));
    }
    checkMissions(); save(); UI.renderAll();
  },

  negotiate(option) {
    const d = G.debts.find(x => x.id === "rotativo");
    if (!d || d.total <= 0) return;
    if (option === "vista") {
      const cost = Math.round(d.total * 0.75);
      if (G.cash < cost) { UI.toast("Você precisa de " + fmt(cost) + " em conta."); Sfx.error(); return; }
      G.cash -= cost; d.total = 0; G.flags.negotiated = true;
      G.score = clamp(G.score + 90, 0, 1000);
      logAdd("Quitação com 25% de desconto", -cost);
      UI.confetti(); Sfx.success(); UI.toast("Rotativo QUITADO com desconto!");
    } else if (option === "parcelar") {
      const parcela = Math.ceil((d.total * 1.22) / 18);
      d.total = 0;
      G.debts.push({ id: "parcelado", name: "Acordo do cartão (18x de " + fmt(parcela) + ")", ico: "i-card",
        total: parcela * 18, rate: 0, parcela, chargeDay: 12, desc: "Acordo fechado: juro congelado. Total do acordo: " + fmt(parcela * 18) });
      G.flags.negotiated = true;
      G.score = clamp(G.score + 40, 0, 1000);
      logAdd("Acordo: rotativo parcelado em 18x", 0);
      Sfx.success();
      UI.toast("Acordo fechado! O juro de 13,5%/mês PAROU de correr.");
      chatPush("re", "them", "Acordo fechado! Repara: o total ficou maior que a dívida de hoje, MAS o juro congelou — sem acordo, em 6 meses ela DOBRARIA. Parcelou? Agora é sagrado pagar em dia.");
    }
    checkMissions(); save(); UI.renderAll();
  },

  cancelSub(id) {
    const s = G.subs.find(x => x.id === id);
    if (!s || !s.active || s.monthsLeft > 0) { UI.toast("Essa é uma parcela — precisa pagar até o fim."); Sfx.error(); return; }
    s.active = false;
    G.flags.subCancelled = true;
    logAdd("Assinatura cancelada: " + s.name);
    Sfx.pop();
    UI.toast(s.name + " cancelada: +" + fmt(s.cost) + "/mês no bolso");
    checkMissions(); save(); UI.renderAll();
  },

  invest(kind, val) {
    if (!G.flags.invest) return;
    val = Math.min(val, Math.floor(G.cash));
    if (val <= 0) { UI.toast("Saldo insuficiente."); Sfx.error(); return; }
    G.cash -= val;
    if (kind === "fii") G.invest.fiiUnits += val / G.prices.fii;
    else G.invest[kind] += val;
    if (kind === "cdb") G.cdbLockUntil = G.day + 30;
    G.flags.invested = true;
    logAdd("Aplicação " + kind.toUpperCase(), -val);
    Sfx.buy();
    UI.toast(fmt(val) + " aplicados");
    checkMissions(); save(); UI.renderAll();
  },

  redeem(kind, val) {
    if (kind === "cdb" && G.day < G.cdbLockUntil) {
      UI.toast("CDB travado por mais " + (G.cdbLockUntil - G.day) + " dias. Liquidez tem preço!");
      Sfx.error();
      return;
    }
    let available = kind === "fii" ? G.invest.fiiUnits * G.prices.fii : G.invest[kind];
    val = Math.min(val === "all" ? available : val, available);
    if (val <= 0) return;
    if (kind === "fii") G.invest.fiiUnits -= val / G.prices.fii;
    else G.invest[kind] -= val;
    G.cash += val;
    logAdd("Resgate " + kind.toUpperCase(), val);
    Sfx.cashIn();
    save(); UI.renderAll();
  },

  buyShopItem(id) {
    const item = SHOP.find(i => i.id === id);
    if (!item) return;
    if (item.kind === "mood" && G.moodDay[id] === G.day) {
      UI.toast("Um " + item.name.toLowerCase() + " por dia basta. Amanhã tem mais.");
      Sfx.error(); return;
    }
    if (item.kind === "sub") {
      if (G.subs.find(s => s.id === id && s.active)) { UI.toast("Já assinado!"); return; }
      G.subs.push({ id: item.id, name: item.name, ico: item.ico, cost: item.price, active: true });
      Sfx.buy();
      UI.toast("Assinatura ativada: " + item.name + " (–" + fmt(item.price) + "/mês)");
      if (item.note) chatPush("re", "them", item.note);
      save(); UI.renderAll(); return;
    }
    if (G.cash < item.price) { UI.toast("Saldo insuficiente (isso já é uma lição)."); Sfx.error(); return; }
    G.cash -= item.price;
    if (item.mood) G.mood = clamp(G.mood + item.mood, 0, 100);
    if (item.stress) G.stress = clamp(G.stress + item.stress, 0, 100);
    if (item.kind === "mood") G.moodDay[id] = G.day;
    if (item.kind === "util") G.flags[item.id] = true;
    if (item.id === "curso") G.flags.curso = true;
    logAdd("Compra: " + item.name, -item.price);
    Sfx.buy();
    UI.toast(item.name + (item.price ? " (–" + fmt(item.price) + ")" : ""));
    if (item.note) chatPush("re", "them", item.note);
    save(); UI.renderAll();
  },

  buyProperty(lid, financed) {
    const l = G.listings.find(x => x.lid === lid);
    if (!l || !G.flags.imoveis) return;
    const price = Math.round(l.price);
    if (financed) {
      if (G.flags.creditBlocked) { UI.toast("Crédito bloqueado pelo histórico negativo. Limpe a barra primeiro."); Sfx.error(); return; }
      if (G.score < 550) { UI.toast("Financiamento negado: score abaixo de 550. Pague contas em dia!"); Sfx.error(); return; }
      const entry = Math.round(price * FIN.entryPct);
      if (G.cash < entry) { UI.toast("Entrada de " + fmt(entry) + " necessária."); Sfx.error(); return; }
      const principal = price - entry;
      const r = FIN.monthlyRate, n = FIN.months;
      const parcela = Math.ceil(principal * r / (1 - Math.pow(1 + r, -n)));
      G.cash -= entry;
      G.subs.push({ id: "fin_" + lid, name: "Financiamento " + l.name, ico: "i-bank", cost: parcela, active: true, monthsLeft: n });
      G.properties.push({ pid: l.lid, name: l.name, img: l.img, value: price, rent: l.rent, boughtFor: price, renting: false, rentPending: false, reformed: false, reformEnd: 0 });
      chatPush("re", "them", "Financiou! Olho aberto: " + n + " parcelas de " + fmt(parcela) + " somam " + fmt(parcela * n + entry) + " por um imóvel de " + fmt(price) + ". Financiamento é ferramenta — desde que o aluguel LÍQUIDO ajude a pagar a parcela.");
    } else {
      if (G.cash < price) { UI.toast("Faltam " + fmt(price - G.cash) + ". (Reserva não é pra isso.)"); Sfx.error(); return; }
      G.cash -= price;
      G.properties.push({ pid: l.lid, name: l.name, img: l.img, value: price, rent: l.rent, boughtFor: price, renting: false, rentPending: false, reformed: false, reformEnd: 0 });
    }
    G.listings = G.listings.filter(x => x.lid !== lid);
    logAdd("Compra de imóvel: " + l.name, financed ? 0 : -price);
    if (l.auction && Math.random() < 0.4) {
      G.scheduled.push({ day: G.day + 5, key: "__auction_debt__", pname: l.name });
    }
    UI.confetti(); Sfx.fanfare(); UI.toast(l.name + " é SEU!");
    checkMissions(); save(); UI.renderAll();
  },

  toggleRent(pid) {
    const p = G.properties.find(x => x.pid === pid);
    if (!p) return;
    if (p.reformEnd > G.day) { UI.toast("Em reforma por mais " + (p.reformEnd - G.day) + " dias."); Sfx.error(); return; }
    if (p.rentPending) { UI.toast("Anunciado — inquilino chegando em breve."); return; }
    if (p.renting) {
      p.renting = false;
      UI.toast("Imóvel desocupado.");
    } else {
      p.rentPending = true;
      const wait = Math.round(rnd(3, 8));
      G.scheduled.push({ day: G.day + wait, key: "inquilino_chega", payload: pid });
      Sfx.pop();
      UI.toast("Anunciado! Inquilino deve fechar em ~" + wait + " dias. (Manutenção: 8% do aluguel)");
    }
    checkMissions(); save(); UI.renderAll();
  },

  reform(pid) {
    const p = G.properties.find(x => x.pid === pid);
    if (!p || p.reformed) return;
    const cost = Math.round(p.value * REFORM.costPct);
    if (G.cash < cost) { UI.toast("Reforma custa " + fmt(cost) + "."); Sfx.error(); return; }
    if (p.renting || p.rentPending) { UI.toast("Desocupe o imóvel antes de reformar."); Sfx.error(); return; }
    G.cash -= cost;
    p.reformed = true;
    p.reformEnd = G.day + REFORM.days;
    const boost = rnd(0.22, 0.38); // reforma tem variância, como na vida
    p.value = Math.round(p.value * (1 + boost));
    p.rent = Math.round(p.rent * 1.25);
    logAdd("Reforma: " + p.name, -cost);
    Sfx.buy();
    UI.toast("Reforma iniciada! Pronta em " + REFORM.days + " dias. Valorização: +" + Math.round(boost * 100) + "%");
    save(); UI.renderAll();
  },

  sellProperty(pid) {
    const p = G.properties.find(x => x.pid === pid);
    if (!p) return;
    if (p.reformEnd > G.day) { UI.toast("Termine a reforma antes de vender."); Sfx.error(); return; }
    const gross = Math.round(p.value * G.prices.market);
    const net = Math.round(gross * (1 - SELL_FEE));
    G.cash += net;
    // quitar financiamento pendente na venda
    const fin = G.subs.find(s => s.id === "fin_" + pid && s.active);
    if (fin) {
      const owed = fin.cost * fin.monthsLeft * 0.82; // quitação antecipada com desconto de juros
      G.cash -= Math.round(owed);
      fin.active = false;
      chatPush("banco", "them", "Venda com financiamento ativo: saldo devedor de " + fmt(owed) + " quitado na escritura.");
    }
    G.properties = G.properties.filter(x => x.pid !== pid);
    const profit = net - p.boughtFor;
    logAdd("Venda: " + p.name, net);
    if (profit > 0 && p.reformed) G.flags.flipped = true;
    Sfx.cashIn();
    UI.toast(profit > 0 ? "Vendido! Lucro de " + fmt(profit) + " (após 5% de corretagem)" : "Vendido por " + fmt(net) + " (prejuízo de " + fmt(-profit) + ")");
    checkMissions(); save(); UI.renderAll();
  },

  answerEvent(eventId, choiceIdx) {
    const ev = EVENTS.find(e => e.id === eventId);
    if (!ev) return;
    const idx = G.inbox.findIndex(i => i.eventId === eventId);
    if (idx < 0) return;
    G.inbox.splice(idx, 1);
    const choice = ev.choices[choiceIdx];
    chatPush(ev.from, "me", choice.label);
    Sfx.pop();
    const api = makeApi();
    const reply = choice.effect(api);
    if (reply) chatPush(ev.from, "sys", reply);
    checkMissions(); save(); UI.renderAll();
  },

  openBank() { G.flags.bankOpened = true; clearNotif("banco"); checkMissions(); save(); }
};

/* ---------------- Mercado imobiliário ---------------- */
function refreshListings() {
  const pool = PROPERTY_POOL.filter(p => !G.properties.some(o => o.pid === p.id));
  const n = Math.min(4, pool.length);
  const picked = [...pool].sort(() => Math.random() - 0.5).slice(0, n);
  G.listings = picked.map(p => ({
    lid: p.id, name: p.name, img: p.img, rent: p.rent, auction: !!p.auction,
    desc: p.desc, worth: p.worth || null,
    price: Math.round(p.base * rnd(0.92, 1.1) * G.prices.market)
  }));
}

/* ---------------- Avanço do dia ---------------- */
function advanceDay() {
  if (G.ended) return 0;
  G.day++;
  const md = monthDay();
  let dayInterest = 0;

  // custo de vida diário
  G.cash -= dailyCost();

  // cheque especial
  if (G.cash < 0) {
    const juro = Math.abs(G.cash) * CHEQUE_ESPECIAL_DAY;
    G.cash -= juro;
    G.monthInterest += juro;
    dayInterest += juro;
    G.negDays++;
    if (!G.flags.chequeWarned) {
      G.flags.chequeWarned = true;
      chatPush("banco", "them", "ATENÇÃO: você entrou no CHEQUE ESPECIAL. Juros de ~8,7% ao mês correndo TODO DIA sobre o saldo negativo. Saia daí o quanto antes!");
      chatPush("re", "them", "Cheque especial é o segundo juro mais caro do país. Se tiver reserva ou investimento, resgatar pra cobrir é quase sempre melhor negócio.");
    }
    if (G.negDays === 15 && !G.flags.creditBlocked) {
      G.flags.creditBlocked = true;
      G.score = clamp(G.score - 150, 0, 1000);
      chatPush("banco", "them", "NEGATIVAÇÃO: 15 dias no vermelho profundo. Score despencou 150 pontos e novas linhas de crédito foram BLOQUEADAS até o saldo voltar ao azul por 10 dias.");
      chatPush("re", "them", "Chegou a hora da conversa dura: negativado, tudo fica mais caro e mais difícil. Prioridade absoluta agora é sair do negativo — resgata investimento, corta gasto, faz freela. Eu tô aqui.");
      notify("banco");
    }
  } else {
    G.flags.chequeWarned = false;
    if (G.negDays > 0) G.negDays = Math.max(0, G.negDays - 1.5);
    if (G.flags.creditBlocked && G.negDays <= 0) {
      G.flags.creditBlocked = false;
      chatPush("banco", "them", "Crédito desbloqueado: saldo estabilizado. Bem-vindo de volta ao azul.");
    }
  }

  // juros das dívidas
  for (const d of G.debts) {
    if (d.total > 0 && d.rate > 0) {
      const j = d.total * (d.rate / 30);
      d.total += j;
      G.monthInterest += j;
      dayInterest += j;
    }
  }

  // rendimentos
  G.reserve *= 1.00033;
  G.invest.selic *= 1.00035;
  G.invest.cdb *= 1.00041;
  G.prices.fii = Math.max(40, G.prices.fii * (1 + rnd(-0.012, 0.013)));
  if (G.invest.cripto > 0) G.invest.cripto = Math.max(0, G.invest.cripto * (1 + rnd(-0.10, 0.09)));
  G.prices.market = clamp(G.prices.market * (1 + rnd(-0.003, 0.0037)), 0.7, 1.8);

  // dividendos FII (dia 1)
  if (md === 1 && G.invest.fiiUnits > 0) {
    const div = Math.round(G.invest.fiiUnits * G.prices.fii * 0.0085);
    G.cash += div;
    logAdd("Dividendos FII", div);
    chatPush("banco", "them", "Dividendos dos FIIs: +" + fmt(div) + ". Aluguel sem inquilino te ligando.");
  }

  // aluguéis (dia 3) — líquidos de 8% de manutenção
  if (md === 3) {
    let totalRent = 0;
    for (const p of G.properties.filter(x => x.renting)) {
      const liquid = Math.round(p.rent * 0.92);
      G.cash += liquid;
      totalRent += liquid;
      logAdd("Aluguel líquido: " + p.name, liquid);
    }
    if (totalRent > 0) chatPush("banco", "them", "Aluguéis do mês (já descontada a manutenção de 8%): +" + fmt(totalRent) + ".");
  }

  // salário
  if (md === PERSONA.payday) {
    G.cash += G.salary;
    G.monthEarned += G.salary;
    logAdd("Salário", G.salary);
    chatPush("banco", "them", "Salário caiu: +" + fmt(G.salary) + ". Lembrete da Rê: pague-se primeiro (reserva antes de gastar).");
    notify("banco");
  }

  // contas fixas
  for (const b of BILLS) {
    if (md === b.day) {
      if (G.cash - b.amount > -800) {
        G.cash -= b.amount;
        G.monthPaid += b.amount;
        logAdd(b.name, -b.amount);
        G.score = clamp(G.score + 3, 0, 1000);
      } else {
        const fine = Math.round(b.amount * 0.1);
        G.cash -= (b.amount + fine);
        G.score = clamp(G.score - 30, 0, 1000);
        G.stress = clamp(G.stress + 10, 0, 100);
        logAdd(b.name + " (ATRASADA, multa)", -(b.amount + fine));
        chatPush("banco", "them", b.name + " paga com atraso: multa de " + fmt(fine) + " e score arranhado.");
      }
    }
  }

  // assinaturas e parcelas (dia 8)
  if (md === 8) {
    for (const s of G.subs.filter(x => x.active)) {
      G.cash -= s.cost;
      G.monthPaid += s.cost;
      logAdd(s.name, -s.cost);
      if (s.monthsLeft) {
        s.monthsLeft--;
        if (s.monthsLeft <= 0) { s.active = false; chatPush("banco", "them", "Última parcela de \"" + s.name + "\" paga!"); }
      }
    }
  }

  // acordo do cartão (dia 12)
  const acordo = G.debts.find(d => d.id === "parcelado" && d.total > 0);
  if (acordo && md === acordo.chargeDay) {
    G.cash -= acordo.parcela;
    acordo.total = Math.max(0, acordo.total - acordo.parcela);
    G.monthPaid += acordo.parcela;
    logAdd("Parcela do acordo", -acordo.parcela);
    G.score = clamp(G.score + 8, 0, 1000);
    if (acordo.total <= 0) chatPush("banco", "them", "ACORDO 100% QUITADO. Seu nome está LIMPO na praça!");
  }

  // mercado semanal
  if (G.day % GROCERY.every === 0) {
    G.cash -= GROCERY.amount;
    logAdd(GROCERY.name, -GROCERY.amount);
  }

  // drift emocional
  G.stress = clamp(G.stress + (isWeekend() ? -2.5 : 1.6), 0, 100);
  G.mood = clamp(G.mood - 0.6, 0, 100);

  // consequências emocionais
  if (G.stress >= 90 && Math.random() < 0.25 && G.day > G.blockExtraUntil) {
    G.blockExtraUntil = G.day + 3;
    G.lastFreelaWeek = Math.floor(G.day / 7); // burnout cancela o freela da semana
    G.cash -= 180;
    G.stress = 60;
    chatPush("re", "them", "BURNOUT. Seu corpo emitiu o boleto: R$ 180 de consulta, 3 dias sem turno extra E o freela da semana cancelado. Saúde é a base da pirâmide financeira — sem ela, o resto desmonta.");
    notify("zapzap");
  }
  if (G.mood <= 15 && Math.random() < 0.3) {
    const gasto = Math.round(rnd(60, 150));
    G.cash -= gasto;
    logAdd("Compra por impulso (tristeza)", -gasto);
    chatPush("re", "them", "Bateu aquela tristeza e rolou compra por impulso: –" + fmt(gasto) + ". Não é falta de caráter, é química. Cuidar do humor É estratégia financeira. Que tal um rolê barato?");
  }

  // agendados
  const due = G.scheduled.filter(s => s.day <= G.day);
  G.scheduled = G.scheduled.filter(s => s.day > G.day);
  for (const s of due) {
    if (s.key === "__mentor__") chatPush("re", "them", s.text);
    else if (s.key === "__auction_debt__") {
      G.debts.push({ id: "condominio", name: "Dívida condominial (leilão)", ico: "i-alert", total: 9000, rate: 0.01, desc: "A surpresa da caixa-surpresa do leilão." });
      chatPush("banco", "them", "Notificação do condomínio: o sobrado do leilão tinha R$ 9.000 de dívida condominial. Ela acompanha o imóvel. Leilão: só com diligência (e margem pra surpresa).");
      notify("banco");
    }
    else if (FOLLOWUPS[s.key]) FOLLOWUPS[s.key](makeApi(s.payload));
  }

  // evento do dia (chance maior com caixa vazia) + beat garantido
  const hadEvent = maybeFireEvent();
  if (!hadEvent && G.inbox.length === 0) {
    const f = FILLERS[Math.floor(Math.random() * FILLERS.length)];
    chatPush(f.from, "them", f.text);
  }

  // fechamento do mês
  if (md === 30) {
    const nw = netWorth();
    const headline = HEADLINES[Math.floor(Math.random() * HEADLINES.length)](G);
    chatPush("re", "them",
      "FECHAMENTO DO MÊS\nJuros pagos: " + fmt(G.monthInterest) + "\nPatrimônio líquido: " + fmt(nw) +
      "\nRenda passiva líquida: " + fmt(passiveMonthly()) + "/mês (meta da independência: " + fmt(monthlyCostNow()) + ")\n\n" + headline);
    notify("zapzap");
    G.monthPaid = 0; G.monthEarned = 0; G.monthInterest = 0;
    refreshListings();
    if (G.flags.imoveis) notify("imoveis");
  }

  // badges de progresso
  if (netWorth() >= 1000) award("primeiro_mil");
  if (G.properties.length >= 3) award("magnata");
  if (G.stress < 40) { G.flags.zenDays = (G.flags.zenDays || 0) + 1; if (G.flags.zenDays >= 7) award("semana_zen"); }
  else G.flags.zenDays = 0;

  G.history.push(Math.round(netWorth()));
  if (G.history.length > 120) G.history.shift();

  checkMissions();
  save();
  return dayInterest;
}

/* ---------------- Sorteio de eventos ---------------- */
function maybeFireEvent() {
  if (G.inbox.length >= 2) return false;
  const chance = G.inbox.length === 0 ? 0.75 : 0.35;
  if (Math.random() > chance) return false;
  const pool = EVENTS.filter(e => {
    if (e.minDay && G.day < e.minDay) return false;
    if (e.once && G.firedEvents.includes(e.id)) return false;
    if (e.cooldown && (G.cooldowns[e.id] || 0) > G.day) return false;
    if (e.cond && !e.cond(G)) return false;
    if (G.inbox.some(i => i.eventId === e.id)) return false;
    return true;
  });
  if (!pool.length) return false;
  const totalW = pool.reduce((s, e) => s + (e.weight || 1), 0);
  let r = Math.random() * totalW;
  let ev = pool[0];
  for (const e of pool) { r -= (e.weight || 1); if (r <= 0) { ev = e; break; } }
  G.firedEvents.push(ev.id);
  if (ev.cooldown) G.cooldowns[ev.id] = G.day + ev.cooldown;
  const text = typeof ev.text === "function" ? ev.text(G) : ev.text;
  chatPush(ev.from, "them", text);
  G.inbox.push({ eventId: ev.id, contact: ev.from });
  notify("zapzap");
  return true;
}
