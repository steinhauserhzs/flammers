/* =========================================================
   FLAMMERS — UI v3 do "FlammaPhone"
   Arte exclusiva, motion, som e zero emoji no chrome.
   ========================================================= */

"use strict";

const $id = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};
function icon(name, cls) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "ic" + (cls ? " " + cls : ""));
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", "#" + name);
  svg.appendChild(use);
  return svg;
}

let currentApp = "home";
let currentChat = null;
let lastCashShown = null;

const EXPLAIN = {
  stress: "Estresse alto cobra caro: acima de 90, risco de burnout (consulta + dias parado). Folga e lazer derrubam.",
  mood: "Humor baixo abre a porteira da compra por impulso. Rolê barato também é gestão financeira.",
  radar: "Radar anti-golpe: sobe cada vez que você fareja uma cilada. Golpista odeia gente treinada.",
  score: "Score de crédito: sobe pagando em dia. Acima de 550 destrava financiamento imobiliário."
};

const UI = {

  /* ---------------- Navegação ---------------- */
  go(app) {
    currentApp = app;
    document.querySelectorAll(".app-screen").forEach(s => s.classList.remove("active"));
    $id("app-" + app).classList.add("active");
    if (app === "banco") Actions.openBank();
    if (app !== "zapzap") currentChat = null;
    if (app === "zapzap") clearNotif("zapzap");
    if (app === "metas") clearNotif("metas");
    if (app === "imoveis") clearNotif("imoveis");
    UI.renderAll();
  },

  /* ---------------- Render mestre ---------------- */
  renderAll() {
    UI.statusBar();
    UI.renderHome();
    if (currentApp === "zapzap") UI.renderZap();
    if (currentApp === "banco") UI.renderBank();
    if (currentApp === "metas") UI.renderMissions();
    if (currentApp === "trampo") UI.renderWork();
    if (currentApp === "invest") UI.renderInvest();
    if (currentApp === "imoveis") UI.renderProps();
    if (currentApp === "shop") UI.renderShop();
  },

  statusBar() {
    const ph = PHASES[phaseNow()];
    $id("sb-day").textContent = "Dia " + G.day + " · " + ph.title;
    const cashEl = $id("sb-cash");
    cashEl.textContent = fmt(G.cash);
    cashEl.className = "sb-cash " + (G.cash < 0 ? "neg" : "");
    if (lastCashShown !== null && Math.round(G.cash) !== lastCashShown) {
      cashEl.classList.add("tick");
      setTimeout(() => cashEl.classList.remove("tick"), 180);
    }
    lastCashShown = Math.round(G.cash);
    $id("sb-streak-n").textContent = G.realStreak || 0;
    document.getElementById("phone").style.setProperty("--wp-img", "url('" + ph.wp + "')");
  },

  /* ---------------- HOME ---------------- */
  renderHome() {
    $id("home-owner-name").textContent = G.name;
    $id("home-level").textContent = levelOf(G.xp).title;
    const nw = netWorth();
    const nwEl = $id("w-networth");
    nwEl.textContent = fmt(nw);
    nwEl.className = "w-value " + (nw < 0 ? "neg" : "pos");
    const passive = passiveMonthly();
    $id("w-passive").textContent = fmt(Math.max(0, passive)) + "/mês";
    const goal = monthlyCostNow();
    const pct = clamp(Math.round(Math.max(0, passive) / goal * 100), 0, 100);
    $id("w-firebar").style.width = pct + "%";
    $id("w-firepct").textContent = "Independência: " + pct + "%";
    UI.sparkline();

    document.querySelectorAll(".app-ico[data-app]").forEach(a => {
      const app = a.dataset.app;
      const n = G.notifs[app] || 0;
      let b = a.querySelector(".badge");
      if (n > 0) {
        if (!b) { b = el("div", "badge"); a.appendChild(b); }
        b.textContent = n > 9 ? "9+" : n;
      } else if (b) b.remove();

      const locked = (app === "invest" && !G.flags.invest) || (app === "imoveis" && !G.flags.imoveis);
      a.classList.toggle("locked", locked && app === "invest"); // LarLar fica em modo vitrine
      let tag = a.querySelector(".locktag");
      if (locked) {
        if (!tag) { tag = el("div", "locktag"); tag.appendChild(icon("i-lock")); a.appendChild(tag); }
      } else if (tag) tag.remove();

      // pulso guiando o primeiro passo (FTUE)
      a.classList.toggle("pulse", G.missions.done.length === 0 && app === "banco" && G.flags.introSeen === true);
    });

    $id("m-stress").style.width = G.stress + "%";
    $id("m-mood").style.width = G.mood + "%";
    $id("m-radar").style.width = G.radar + "%";
    $id("m-score").textContent = Math.round(G.score);
  },

  sparkline() {
    const cv = $id("spark");
    const c = cv.getContext("2d");
    const w = cv.width, h = cv.height;
    c.clearRect(0, 0, w, h);
    const data = G.history.length > 1 ? G.history : [netWorth(), netWorth()];
    const min = Math.min(...data, 0), max = Math.max(...data, 1);
    const span = (max - min) || 1;
    if (min < 0 && max > 0) {
      const zy = h - 3 - ((0 - min) / span) * (h - 8);
      c.strokeStyle = "rgba(255,255,255,0.18)";
      c.lineWidth = 1;
      c.setLineDash([3, 3]);
      c.beginPath(); c.moveTo(0, zy); c.lineTo(w, zy); c.stroke();
      c.setLineDash([]);
    }
    c.beginPath();
    data.forEach((v, i) => {
      const x = i / (data.length - 1) * (w - 4) + 2;
      const y = h - 3 - ((v - min) / span) * (h - 8);
      i === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
    });
    const up = data[data.length - 1] >= data[0];
    c.strokeStyle = up ? "#4ade80" : "#f87171";
    c.lineWidth = 2;
    c.stroke();
  },

  /* ---------------- ZAPZAP ---------------- */
  renderZap() {
    const list = $id("zap-list");
    const conv = $id("zap-conv");
    if (currentChat) {
      list.style.display = "none";
      conv.style.display = "flex";
      UI.renderConversation();
      return;
    }
    list.style.display = "block";
    conv.style.display = "none";
    list.replaceChildren();
    const keys = Object.keys(G.chat).sort((a, b) => {
      const la = G.chat[a][G.chat[a].length - 1], lb = G.chat[b][G.chat[b].length - 1];
      return (lb ? lb.day : 0) - (la ? la.day : 0);
    });
    for (const k of keys) {
      const ct = CONTACTS[k] || { name: k, avatar: "assets/art/logo.svg" };
      const msgs = G.chat[k];
      const last = msgs[msgs.length - 1];
      const row = el("button", "chat-row");
      const av = document.createElement("img");
      av.className = "chat-av";
      av.src = ct.avatar;
      av.alt = "";
      const mid = el("div", "chat-mid");
      mid.appendChild(el("div", "chat-name", ct.name));
      mid.appendChild(el("div", "chat-prev", (last.who === "me" ? "Você: " : "") + last.text.slice(0, 46) + (last.text.length > 46 ? "…" : "")));
      row.appendChild(av); row.appendChild(mid);
      if (G.inbox.some(i => i.contact === k)) row.appendChild(el("div", "chat-dot", "responder"));
      row.onclick = () => { Sfx.click(); currentChat = k; UI.renderZap(); };
      list.appendChild(row);
    }
    if (!keys.length) list.appendChild(el("div", "empty", "Nenhuma conversa ainda. Durma um dia — a vida chega."));
  },

  renderConversation() {
    const ct = CONTACTS[currentChat] || { name: currentChat, avatar: "assets/art/logo.svg" };
    $id("conv-title").textContent = ct.name;
    $id("conv-av").src = ct.avatar;
    const box = $id("conv-msgs");
    box.replaceChildren();
    const msgs = G.chat[currentChat] || [];
    msgs.forEach((m, i) => {
      const b = el("div", "bubble " + (m.who === "me" ? "me" : m.who === "sys" ? "sys" : "them") + (i === msgs.length - 1 ? " fresh" : ""));
      b.textContent = m.text;
      const d = el("div", "bubble-day", "dia " + m.day);
      b.appendChild(d);
      box.appendChild(b);
    });
    const pend = G.inbox.find(i => i.contact === currentChat);
    const choicesBox = $id("conv-choices");
    choicesBox.replaceChildren();
    if (pend) {
      const ev = EVENTS.find(e => e.id === pend.eventId);
      ev.choices.forEach((c, i) => {
        if (c.cond && !c.cond(G)) return;
        const btn = el("button", "choice-btn", c.label);
        btn.onclick = () => { Actions.answerEvent(ev.id, i); };
        choicesBox.appendChild(btn);
      });
    }
    box.scrollTop = box.scrollHeight;
  },

  /* ---------------- BANCO ---------------- */
  renderBank() {
    $id("bk-cash").textContent = fmt(G.cash);
    $id("bk-cash").className = "big-value " + (G.cash < 0 ? "neg" : "");
    $id("bk-cheque").style.display = G.cash < 0 ? "block" : "none";
    $id("bk-reserve").textContent = fmt(G.reserve);
    const sc = Math.round(G.score);
    $id("bk-score").textContent = sc;
    $id("bk-score").style.color = sc >= 700 ? "#4ade80" : sc >= 500 ? "#ffd166" : "#f87171";

    const dv = $id("bk-debts");
    dv.replaceChildren();
    const activeDebts = G.debts.filter(d => d.total > 0);
    if (!activeDebts.length) dv.appendChild(el("div", "empty", "ZERO dívidas. Respira esse ar."));
    for (const d of activeDebts) {
      const card = el("div", "card debt-card");
      const top = el("div", "card-top");
      const title = el("div", "card-title");
      title.appendChild(icon(d.ico || "i-card"));
      title.appendChild(document.createTextNode(d.name));
      top.appendChild(title);
      top.appendChild(el("div", "debt-val", fmt(d.total)));
      card.appendChild(top);
      if (d.rate > 0) {
        const daily = d.total * d.rate / 30;
        card.appendChild(el("div", "debt-warn", "Crescendo " + fmt(daily) + " POR DIA (" + (d.rate * 100).toFixed(1) + "%/mês)"));
      }
      if (d.desc) card.appendChild(el("div", "card-desc", d.desc));
      const row = el("div", "btn-row");
      const p200 = el("button", "mini-btn", "Pagar R$ 200");
      p200.onclick = () => Actions.payDebt(d.id, 200);
      const pall = el("button", "mini-btn", "Quitar (" + fmt(d.total) + ")");
      pall.onclick = () => Actions.payDebt(d.id, "all");
      row.appendChild(p200); row.appendChild(pall);
      if (d.id === "rotativo") {
        const neg = el("button", "mini-btn hot", "NEGOCIAR");
        neg.onclick = () => { Sfx.click(); UI.negotiateModal(d); };
        row.appendChild(neg);
      }
      card.appendChild(row);
      dv.appendChild(card);
    }

    const rrow = $id("bk-reserve-btns");
    rrow.replaceChildren();
    [["Guardar R$ 100", () => Actions.toReserve(100)],
     ["Guardar R$ 500", () => Actions.toReserve(500)],
     ["Guardar tudo", () => Actions.toReserve(Math.floor(G.cash))],
     ["Resgatar R$ 200", () => Actions.fromReserve(200)]].forEach(([t, fn]) => {
      const b = el("button", "mini-btn", t); b.onclick = fn; rrow.appendChild(b);
    });

    const sb = $id("bk-subs");
    sb.replaceChildren();
    for (const s of G.subs.filter(x => x.active)) {
      const row = el("div", "sub-row");
      row.appendChild(icon(s.ico || "i-card"));
      row.appendChild(el("div", "sub-name", s.name + (s.monthsLeft ? " (" + s.monthsLeft + "x restantes)" : "")));
      row.appendChild(el("div", "sub-cost", "–" + fmt(s.cost) + "/mês"));
      if (!s.monthsLeft) {
        const x = el("button", "mini-btn danger", "Cancelar");
        x.onclick = () => Actions.cancelSub(s.id);
        row.appendChild(x);
      }
      sb.appendChild(row);
    }
    if (!G.subs.some(x => x.active)) sb.appendChild(el("div", "empty", "Nenhuma assinatura ativa. Carteira blindada."));

    const ex = $id("bk-log");
    ex.replaceChildren();
    for (const l of G.log.slice(0, 25)) {
      const row = el("div", "log-row");
      row.appendChild(el("span", "log-day", "d" + l.day));
      row.appendChild(el("span", "log-text", l.text));
      row.appendChild(el("span", "log-val " + (l.val > 0 ? "pos" : l.val < 0 ? "neg" : ""), l.val ? (l.val > 0 ? "+" : "") + fmt(l.val) : ""));
      ex.appendChild(row);
    }
  },

  negotiateModal(d) {
    const m = $id("modal");
    m.classList.add("active");
    const box = $id("modal-box");
    box.replaceChildren();
    box.appendChild(el("h3", null, "Mesa de negociação"));
    box.appendChild(el("p", "modal-sub", "Dívida atual: " + fmt(d.total) + " a 13,5%/mês. O banco PREFERE receber menos a não receber. Suas cartas:"));

    const opt1 = el("div", "card option");
    opt1.appendChild(el("div", "card-title", "Quitar À VISTA com 25% de desconto"));
    opt1.appendChild(el("div", "card-desc", "Paga " + fmt(d.total * 0.75) + " agora e a dívida MORRE. Melhor negócio — se o caixa aguentar."));
    const b1 = el("button", "mini-btn hot", G.cash >= d.total * 0.75 ? "Fechar acordo" : "Faltam " + fmt(d.total * 0.75 - G.cash));
    b1.disabled = G.cash < d.total * 0.75;
    b1.onclick = () => { m.classList.remove("active"); Actions.negotiate("vista"); };
    opt1.appendChild(b1);

    const opt2 = el("div", "card option");
    const parcela = Math.ceil((d.total * 1.22) / 18);
    opt2.appendChild(el("div", "card-title", "Parcelar em 18x de " + fmt(parcela)));
    opt2.appendChild(el("div", "card-desc", "Total: " + fmt(parcela * 18) + " (22% a mais que hoje) — MAS o juro de 13,5%/mês CONGELA. Sem acordo, a dívida dobra em ~6 meses."));
    const b2 = el("button", "mini-btn", "Fechar acordo");
    b2.onclick = () => { m.classList.remove("active"); Actions.negotiate("parcelar"); };
    opt2.appendChild(b2);

    const opt3 = el("div", "card option");
    opt3.appendChild(el("div", "card-title", "Deixar como está"));
    opt3.appendChild(el("div", "card-desc", "A dívida segue crescendo " + fmt(d.total * 0.135 / 30) + " por dia. (A Rê desaconselha FORTEMENTE.)"));
    const b3 = el("button", "mini-btn danger", "Sair sem negociar");
    b3.onclick = () => m.classList.remove("active");
    opt3.appendChild(b3);

    box.appendChild(opt1); box.appendChild(opt2); box.appendChild(opt3);
  },

  /* ---------------- METAS ---------------- */
  renderMissions() {
    const box = $id("mi-list");
    box.replaceChildren();
    box.appendChild(el("div", "section-label", "MISSÕES ATIVAS"));
    for (const msn of activeMissions()) {
      const card = el("div", "card mission");
      const title = el("div", "card-title");
      title.appendChild(icon(msn.ico || "i-target"));
      title.appendChild(document.createTextNode(msn.title));
      card.appendChild(title);
      card.appendChild(el("div", "card-desc", msn.desc));
      card.appendChild(el("div", "mission-how", msn.how));
      if (msn.goal && msn.goalKey) {
        const cur = msn.goalKey === "reserve" ? G.reserve : Math.max(0, passiveMonthly());
        const pct = clamp(Math.round(cur / msn.goal * 100), 0, 100);
        const track = el("div", "goal-track");
        const fill = el("div", "goal-fill");
        fill.style.width = pct + "%";
        track.appendChild(fill);
        card.appendChild(track);
        card.appendChild(el("div", "goal-nums", fmt(cur) + " / " + fmt(msn.goal) + " (" + pct + "%)"));
      }
      card.appendChild(el("div", "mission-xp", "+" + msn.xp + " XP"));
      box.appendChild(card);
    }
    const done = MISSIONS.filter(m => G.missions.done.includes(m.id));
    if (done.length) {
      box.appendChild(el("div", "section-label", "CONCLUÍDAS (" + done.length + "/" + MISSIONS.length + ")"));
      for (const msn of done) {
        const row = el("div", "done-row");
        row.appendChild(icon("i-check"));
        row.appendChild(document.createTextNode(msn.title));
        box.appendChild(row);
      }
    }
    if (G.badges.length) {
      box.appendChild(el("div", "section-label", "BADGES"));
      const bd = el("div", "badge-grid");
      for (const id of G.badges) {
        const b = BADGES[id];
        if (!b) continue;
        const c = el("div", "badge-card");
        c.appendChild(icon(b.ico || "i-star"));
        c.appendChild(el("div", "badge-name", b.name));
        bd.appendChild(c);
      }
      box.appendChild(bd);
    }
    $id("mi-xp").textContent = G.xp + " XP";
  },

  /* ---------------- TRAMPO ---------------- */
  renderWork() {
    $id("tr-salary").textContent = fmt(G.salary) + "/mês (cai todo dia " + PERSONA.payday + ")";
    $id("tr-status").textContent = G.day <= G.blockExtraUntil
      ? "De atestado por mais " + (G.blockExtraUntil - G.day) + " dia(s)"
      : isWeekend() ? "Fim de semana — dia de freela" : "Dia útil";
    $id("btn-extra").disabled = G.lastExtraDay === G.day || G.day <= G.blockExtraUntil;
    $id("btn-freela").disabled = !isWeekend() || G.lastFreelaWeek === Math.floor(G.day / 7) || G.day <= G.blockExtraUntil;
    $id("tr-freela-pay").textContent = G.flags.curso ? "R$ 290 (com curso!)" : "R$ 180";
  },

  /* ---------------- INVEST ---------------- */
  renderInvest() {
    const box = $id("iv-list");
    box.replaceChildren();
    $id("iv-total").textContent = fmt(investTotal());
    for (const inv of INVESTMENTS) {
      const card = el("div", "card");
      const top = el("div", "card-top");
      const title = el("div", "card-title");
      title.appendChild(icon(inv.ico || "i-chart"));
      title.appendChild(document.createTextNode(inv.name));
      top.appendChild(title);
      let held = inv.id === "fii" ? G.invest.fiiUnits * G.prices.fii : (G.invest[inv.id] || 0);
      top.appendChild(el("div", "debt-val pos", fmt(held)));
      card.appendChild(top);
      card.appendChild(el("div", "card-desc", inv.desc));
      if (inv.id === "fii") card.appendChild(el("div", "mission-how", "Cota hoje: " + fmt(G.prices.fii) + " · dividendo todo dia 1º"));
      if (inv.id === "cdb" && G.day < G.cdbLockUntil) card.appendChild(el("div", "debt-warn", "Travado por mais " + (G.cdbLockUntil - G.day) + " dias"));
      const row = el("div", "btn-row");
      [100, 500].forEach(v => {
        const b = el("button", "mini-btn", "+" + v);
        b.onclick = () => Actions.invest(inv.id, v);
        row.appendChild(b);
      });
      const ball = el("button", "mini-btn", "Aplicar tudo");
      ball.onclick = () => Actions.invest(inv.id, Math.floor(G.cash));
      row.appendChild(ball);
      if (held > 0) {
        const r = el("button", "mini-btn danger", "Resgatar");
        r.onclick = () => Actions.redeem(inv.id, "all");
        row.appendChild(r);
      }
      card.appendChild(row);
      box.appendChild(card);
    }
  },

  /* ---------------- IMÓVEIS ---------------- */
  renderProps() {
    const banner = $id("pr-banner");
    banner.replaceChildren();
    const locked = !G.flags.imoveis;
    if (locked) {
      const bn = el("div", "locked-banner");
      bn.appendChild(icon("i-lock"));
      const falta = Math.max(0, 6900 - G.reserve);
      bn.appendChild(el("div", null, "Modo vitrine: o LarLar destrava com R$ 6.900 de reserva. Faltam " + fmt(falta) + " — cada depósito te aproxima daqui."));
      banner.appendChild(bn);
    }

    const own = $id("pr-owned");
    own.replaceChildren();
    if (G.properties.length) {
      own.appendChild(el("div", "section-label", "SEUS IMÓVEIS"));
      for (const p of G.properties) {
        const card = el("div", "card");
        const img = document.createElement("img");
        img.className = "prop-img"; img.src = p.img; img.alt = "";
        card.appendChild(img);
        const top = el("div", "card-top");
        top.appendChild(el("div", "card-title", p.name));
        top.appendChild(el("div", "debt-val pos", fmt(p.value * G.prices.market)));
        card.appendChild(top);
        const st = p.reformEnd > G.day ? "Em reforma — pronta em " + (p.reformEnd - G.day) + " dia(s)"
          : p.rentPending ? "Anunciado — inquilino a caminho"
          : p.renting ? "ALUGADO: +" + fmt(p.rent * 0.92) + "/mês líquidos" : "Vazio";
        card.appendChild(el("div", "mission-how", st + " · comprado por " + fmt(p.boughtFor)));
        const row = el("div", "btn-row");
        const rentBtn = el("button", "mini-btn " + (p.renting || p.rentPending ? "" : "hot"), p.renting ? "Desocupar" : p.rentPending ? "Anunciado…" : "Alugar");
        rentBtn.disabled = p.rentPending;
        rentBtn.onclick = () => Actions.toggleRent(p.pid);
        row.appendChild(rentBtn);
        if (!p.reformed) {
          const rf = el("button", "mini-btn", "Reformar (" + fmt(p.value * REFORM.costPct) + ")");
          rf.onclick = () => Actions.reform(p.pid);
          row.appendChild(rf);
        }
        const sell = el("button", "mini-btn danger", "Vender");
        sell.onclick = () => Actions.sellProperty(p.pid);
        row.appendChild(sell);
        card.appendChild(row);
        own.appendChild(card);
      }
    }

    const mk = $id("pr-market");
    mk.replaceChildren();
    mk.appendChild(el("div", "section-label", "À VENDA · mercado a " + (G.prices.market * 100).toFixed(0) + "% da média"));
    for (const l of G.listings) {
      const card = el("div", "card" + (l.auction ? " auction" : ""));
      const img = document.createElement("img");
      img.className = "prop-img"; img.src = l.img; img.alt = "";
      card.appendChild(img);
      const top = el("div", "card-top");
      top.appendChild(el("div", "card-title", l.name));
      top.appendChild(el("div", "debt-val", fmt(l.price)));
      card.appendChild(top);
      card.appendChild(el("div", "card-desc", l.desc));
      card.appendChild(el("div", "mission-how", "Aluga por ~" + fmt(l.rent) + "/mês brutos (" + (l.rent / l.price * 100).toFixed(2) + "% a.m.)"));
      const row = el("div", "btn-row");
      const bv = el("button", "mini-btn hot", "À vista");
      bv.disabled = locked;
      bv.onclick = () => Actions.buyProperty(l.lid, false);
      row.appendChild(bv);
      const entry = Math.round(l.price * FIN.entryPct);
      const bf = el("button", "mini-btn", "Financiar (entrada " + fmt(entry) + ")");
      bf.disabled = locked;
      bf.onclick = () => Actions.buyProperty(l.lid, true);
      row.appendChild(bf);
      card.appendChild(row);
      mk.appendChild(card);
    }
  },

  /* ---------------- SHOP ---------------- */
  renderShop() {
    const box = $id("sh-list");
    box.replaceChildren();
    const groups = [["util", "GASTO INTELIGENTE (se paga sozinho)"], ["mood", "LAZER (saúde mental tem retorno)"], ["trap", "TENTAÇÕES (o teste é seu)"], ["sub", "ASSINATURAS"]];
    for (const [kind, label] of groups) {
      box.appendChild(el("div", "section-label", label));
      for (const item of SHOP.filter(i => i.kind === kind)) {
        const bought = item.kind === "util" && G.flags[item.id];
        const card = el("div", "card");
        const top = el("div", "card-top");
        const title = el("div", "card-title");
        title.appendChild(icon(item.ico || "i-bag"));
        title.appendChild(document.createTextNode(item.name));
        top.appendChild(title);
        top.appendChild(el("div", "debt-val", item.price ? fmt(item.price) + (item.kind === "sub" ? "/mês" : "") : "GRÁTIS"));
        card.appendChild(top);
        card.appendChild(el("div", "card-desc", item.desc));
        const b = el("button", "mini-btn " + (kind === "trap" ? "danger" : kind === "util" ? "hot" : ""), bought ? "Comprado" : "Comprar");
        b.disabled = bought;
        b.style.marginTop = "10px";
        b.onclick = () => Actions.buyShopItem(item.id);
        card.appendChild(b);
        box.appendChild(card);
      }
    }
  },

  /* ---------------- Efeitos / Overlays ---------------- */
  toast(msg) {
    const t = $id("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(UI._tt);
    UI._tt = setTimeout(() => t.classList.remove("show"), 2600);
  },

  confetti() {
    const box = $id("confetti");
    for (let i = 0; i < 26; i++) {
      const p = el("div", "conf");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = ["#ff5a1f", "#ffd166", "#4ade80", "#7ef0ff", "#ff2f8f"][i % 5];
      p.style.animationDelay = (Math.random() * 0.4) + "s";
      p.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      box.appendChild(p);
      setTimeout(() => p.remove(), 2400);
    }
  },

  /* Relatório da manhã após dormir */
  morningReport() {
    const night = $id("night");
    $id("night-day").textContent = "Dia " + G.day;
    night.classList.add("active");
    setTimeout(() => {
      night.classList.remove("active");
      Sfx.wake();
      const r = G.lastReport;
      if (!r) { UI.renderAll(); return; }
      const m = $id("modal");
      m.classList.add("active");
      const box = $id("modal-box");
      box.replaceChildren();
      box.appendChild(el("h3", null, r.to - r.from > 1 ? "Semana " + r.from + " → " + r.to : "Bom dia — Dia " + r.to));
      const l1 = el("div", "report-line");
      l1.appendChild(el("span", null, "Variação no bolso"));
      const v1 = el("b", r.delta >= 0 ? "pos" : "neg", (r.delta >= 0 ? "+" : "") + fmt(r.delta));
      l1.appendChild(v1);
      box.appendChild(l1);
      if (r.interest > 0.5) {
        const l2 = el("div", "report-line");
        l2.appendChild(el("span", null, "Juros comeram"));
        l2.appendChild(el("b", "neg", "–" + fmt(r.interest)));
        box.appendChild(l2);
      }
      const l3 = el("div", "report-line");
      l3.appendChild(el("span", null, "Novidades no ZapZap"));
      l3.appendChild(el("b", r.events > 0 ? "pos" : "", String(r.events)));
      box.appendChild(l3);
      const b = el("button", "mini-btn hot", "Começar o dia");
      b.onclick = () => { m.classList.remove("active"); if (r.events > 0) UI.go("zapzap"); else UI.renderAll(); };
      box.appendChild(b);
      UI.renderAll();
    }, 750);
  },

  /* Momento épico (nome limpo, escritura, FIRE) */
  bigMoment(title, text, art) {
    const m = $id("modal");
    m.classList.add("active");
    const box = $id("modal-box");
    box.replaceChildren();
    if (art) {
      const img = document.createElement("img");
      img.className = "modal-art wide"; img.src = art; img.alt = "";
      box.appendChild(img);
    }
    box.appendChild(el("h3", null, title));
    box.appendChild(el("p", "modal-sub", text));
    const b = el("button", "mini-btn hot", "Seguir em frente");
    b.onclick = () => m.classList.remove("active");
    box.appendChild(b);
    UI.confetti();
    setTimeout(UI.confetti, 500);
  },

  fireScreen() {
    const m = $id("modal");
    m.classList.add("active");
    const box = $id("modal-box");
    box.replaceChildren();
    const img = document.createElement("img");
    img.className = "modal-art wide"; img.src = "assets/art/wp5.svg"; img.alt = "";
    box.appendChild(img);
    box.appendChild(el("h3", null, "F.I.R.E. ALCANÇADO"));
    box.appendChild(el("p", "modal-sub",
      G.name + " saiu de R$ 8.000 no vermelho para a INDEPENDÊNCIA FINANCEIRA em " + G.day + " dias.\n\n" +
      "Renda passiva líquida: " + fmt(passiveMonthly()) + "/mês\nPatrimônio: " + fmt(netWorth()) +
      "\nRadar anti-golpe: " + Math.round(G.radar) + "%\n\nO trabalho agora é escolha. A chama é sua."));
    const b = el("button", "mini-btn hot", "Continuar construindo o império");
    b.onclick = () => m.classList.remove("active");
    box.appendChild(b);
    UI.confetti(); setTimeout(UI.confetti, 600); setTimeout(UI.confetti, 1200);
  },

  introScreen() {
    const m = $id("modal");
    m.classList.add("active");
    const box = $id("modal-box");
    box.replaceChildren();
    const img = document.createElement("img");
    img.className = "modal-art"; img.src = PERSONA.avatar; img.alt = "Jô";
    box.appendChild(img);
    box.appendChild(el("h3", null, "Este é o celular de " + PERSONA.name));
    box.appendChild(el("p", "modal-sub", PERSONA.bio + "\n\nDívida: R$ 8.000 (crescendo TODO DIA)\nNa conta: " + fmt(PERSONA.cash) + "\n\nSua missão: assumir esta vida e levá-la do vermelho ao F.I.R.E. — a independência financeira.\n\nA Rê, consultora da Flamma, te acompanha pelo ZapZap. As missões ficam no app Metas. Pra passar o tempo, toque em DORMIR."));
    const b = el("button", "mini-btn hot", "Assumir a vida de " + PERSONA.name);
    b.onclick = () => {
      G.flags.introSeen = true;
      save();
      m.classList.remove("active");
      Sfx.unlock();
      UI.go("metas");
    };
    box.appendChild(b);
  }
};

/* ---------------- Boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  const has = load();
  if (!has) newGame();

  const soundPref = localStorage.getItem("flammers_sound");
  Sfx.set(soundPref !== "off");

  document.querySelectorAll(".app-ico[data-app]").forEach(a => {
    a.onclick = () => {
      const app = a.dataset.app;
      Sfx.unlock(); Sfx.click();
      if (app === "invest" && !G.flags.invest) {
        UI.toast("Trancado: complete a missão 'Os primeiros R$ 500' pra destravar.");
        UI.go("metas");
        return;
      }
      UI.go(app);
    };
  });
  document.querySelectorAll(".back-btn").forEach(b => b.onclick = () => { Sfx.click(); UI.go("home"); });
  $id("conv-back").onclick = () => { Sfx.click(); currentChat = null; UI.renderZap(); };
  $id("btn-sleep").onclick = () => { Sfx.unlock(); Actions.sleep(1); };
  $id("btn-sleep7").onclick = () => { Sfx.unlock(); Actions.sleep(7); };
  $id("btn-extra").onclick = () => Actions.extraShift();
  $id("btn-freela").onclick = () => Actions.freela();
  $id("btn-folga").onclick = () => Actions.folga();

  const syncSound = () => { $id("btn-sound").textContent = Sfx.on ? "Ligado" : "Desligado"; };
  $id("btn-sound").onclick = () => {
    Sfx.set(!Sfx.on);
    localStorage.setItem("flammers_sound", Sfx.on ? "on" : "off");
    syncSound();
    Sfx.click();
  };
  syncSound();

  $id("btn-reset").onclick = () => {
    const m = $id("modal");
    m.classList.add("active");
    const box = $id("modal-box");
    box.replaceChildren();
    box.appendChild(el("h3", null, "Recomeçar do zero?"));
    box.appendChild(el("p", "modal-sub", "Todo o progresso de " + G.name + " será apagado: dívidas de volta, patrimônio zerado, dia zero. Sem volta."));
    const row = el("div", "btn-row");
    row.style.justifyContent = "center";
    const yes = el("button", "mini-btn danger", "Apagar tudo e recomeçar");
    yes.onclick = () => { m.classList.remove("active"); resetGame(); UI.go("home"); UI.introScreen(); };
    const no = el("button", "mini-btn", "Cancelar");
    no.onclick = () => m.classList.remove("active");
    row.appendChild(yes); row.appendChild(no);
    box.appendChild(row);
  };

  document.querySelectorAll(".meter").forEach(mt => {
    mt.onclick = () => { UI.toast(EXPLAIN[mt.dataset.explain] || ""); Sfx.click(); };
  });

  $id("modal").onclick = (e) => {
    if (e.target.id === "modal" && G.flags.introSeen && !G.won) $id("modal").classList.remove("active");
  };

  UI.go("home");
  if (!G.flags.introSeen) UI.introScreen();
  else realDayCheck();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
    let swRefreshed = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (swRefreshed) return;
      swRefreshed = true;
      location.reload();
    });
  }
});
