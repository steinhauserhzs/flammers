/* =========================================================
   FLAMMERS — Do Vermelho ao FIRE
   Módulo de CONTEÚDO (dados puros, white-label por cliente)
   Persona, eventos, golpes, missões, imóveis, loja, mentora.
   Arte: assets/art/*.svg (geração exclusiva) + sprite #i-*
   ========================================================= */

/* ---------------- Persona inicial ---------------- */
const PERSONA = {
  name: "Jô",
  age: 27,
  pronoun: "ele",
  avatar: "assets/art/jo.svg",
  bio: "CLT no comercial da Distribuidora Barbosa. Caiu no rotativo depois que o carro fundiu o motor. Nome sujo, sono ruim, mas muita vontade de virar o jogo.",
  salary: 2600,
  payday: 5,
  cash: 420,
  stress: 68,
  mood: 42,
  score: 315
};

const DEBTS_START = [
  { id: "rotativo", name: "Cartão — Rotativo", ico: "i-card", total: 6800, rate: 0.135,
    desc: "O buraco negro. 13,5% AO MÊS. Cresce enquanto você dorme." },
  { id: "tioze", name: "Empréstimo do Tio Zé", ico: "i-user", total: 1200, rate: 0,
    desc: "Sem juros, mas com cobrança emocional no almoço de domingo." }
];

const BILLS = [
  { id: "aluguel", name: "Aluguel da kitnet", day: 10, amount: 950 },
  { id: "contas", name: "Luz + água + internet", day: 15, amount: 240 },
  { id: "celular", name: "Plano do celular", day: 20, amount: 55 }
];
const GROCERY = { every: 7, amount: 130, name: "Mercado da semana" };
const DAILY_COST = 14;
const MONTHLY_COST = 2300;

const SUBS_START = [
  { id: "streamflix", name: "StreamFlix", ico: "i-film", cost: 39, active: true },
  { id: "gymtop", name: "GymTop (não vai desde março)", ico: "i-heart", cost: 89, active: true },
  { id: "cloudfoto", name: "Nuvem de fotos 2TB", ico: "i-cloud", cost: 25, active: true }
];

/* ---------------- Fases (wallpaper + título) ---------------- */
const PHASES = [
  { id: 0, title: "No Vermelho",  wp: "assets/art/wp0.svg", tint: ["#20090b", "#38100c"] },
  { id: 1, title: "Respirando",   wp: "assets/art/wp1.svg", tint: ["#1d1409", "#3a2a0e"] },
  { id: 2, title: "Construindo",  wp: "assets/art/wp2.svg", tint: ["#0c181b", "#143a34"] },
  { id: 3, title: "Investidor",   wp: "assets/art/wp3.svg", tint: ["#0c0f1d", "#182254"] },
  { id: 4, title: "Magnata",      wp: "assets/art/wp4.svg", tint: ["#160c1d", "#381456"] },
  { id: 5, title: "FIRE",         wp: "assets/art/wp5.svg", tint: ["#1d0c04", "#5e2c04"] }
];

/* ---------------- Investimentos ---------------- */
const INVESTMENTS = [
  { id: "selic", name: "Tesouro Selic", ico: "i-bank", dayRate: 0.00035, liquid: 0,
    desc: "O colchão. Rende ~1%/mês, resgata na hora — o investimento mais seguro do país." },
  { id: "cdb", name: "CDB Flamma 115% CDI", ico: "i-lock", dayRate: 0.00041, liquid: 30,
    desc: "Rende mais, MAS trava por 30 dias. Liquidez tem preço." },
  { id: "fii", name: "FII TIJOLO11", ico: "i-building", price: true, dividend: 0.0085,
    desc: "Cotas de imóveis. Preço oscila, paga aluguel todo dia 1º." },
  { id: "cripto", name: "DogeFlame", ico: "i-zap", price: true, dividend: 0,
    desc: "Montanha-russa. Pode dobrar, pode derreter. Só invista o que pode perder." }
];

/* ---------------- Imóveis (pool do LarLar) ---------------- */
const PROPERTY_POOL = [
  { id: "vaga", name: "Vaga de garagem — Centro", img: "assets/art/prop-vaga.svg", base: 8000, rent: 130,
    desc: "Ninguém pensa nela. Por isso é barata e sempre alugada." },
  { id: "kitnet", name: "Kitnet — Jd. Primavera", img: "assets/art/prop-kitnet.svg", base: 26000, rent: 420,
    desc: "Pequena, mas nunca fica vazia perto da faculdade." },
  { id: "casav", name: "Casa — Vila Flamma", img: "assets/art/prop-casav.svg", base: 55000, rent: 780,
    desc: "Precisa de carinho (e de reforma)." },
  { id: "ape2q", name: "Apê 2 quartos — Centro", img: "assets/art/prop-ape2q.svg", base: 78000, rent: 1050,
    desc: "Clássico: perto de tudo, aluga fácil." },
  { id: "leilao", name: "Sobrado em LEILÃO", img: "assets/art/prop-leilao.svg", base: 39000, rent: 900, auction: true, worth: 62000,
    desc: "Avaliado em R$ 62.000! Mas leilão é caixa-surpresa: 40% de chance de vir com dívida de condomínio (R$ 9.000)." },
  { id: "predio", name: "Prediozinho — 4 kitnets", img: "assets/art/prop-predio.svg", base: 140000, rent: 2450,
    desc: "O sonho da renda passiva parruda. 4 inquilinos, 4 aluguéis." }
];
const REFORM = { costPct: 0.18, valueBoost: 0.32, days: 10 };
const SELL_FEE = 0.05;
const FIN = { entryPct: 0.25, monthlyRate: 0.011, months: 100 };

/* ---------------- Loja (ShopZika) ---------------- */
const SHOP = [
  { id: "bike", name: "Bike usada", ico: "i-bike", price: 380, kind: "util",
    desc: "Corta R$ 4/dia de busão. Se paga em ~3 meses e vira lucro.",
    note: "Gasto BOM: reduz custo fixo. Isso é investimento disfarçado de compra." },
  { id: "curso", name: "Curso de Excel + Power BI", ico: "i-book", price: 260, kind: "util",
    desc: "Desbloqueia freelas melhores e força na hora de pedir aumento.",
    note: "Investir em você paga o melhor juro que existe." },
  { id: "marmiteira", name: "Kit marmita da semana", ico: "i-bowl", price: 120, kind: "util",
    desc: "Domingo de cozinha, semana de economia: -R$ 3/dia de comida.",
    note: "Pequenos vazamentos afundam grandes navios." },
  { id: "cinema", name: "Cineminha com pipoca", ico: "i-film", price: 45, kind: "mood", mood: 12, stress: -8,
    desc: "Respiro rápido pra cabeça." },
  { id: "churras", name: "Churrasco com a galera", ico: "i-users", price: 85, kind: "mood", mood: 20, stress: -14,
    desc: "Rir com os amigos é terapia em conta." },
  { id: "trilha", name: "Trilha no fim de semana", ico: "i-mountain", price: 0, kind: "mood", mood: 8, stress: -10,
    desc: "Grátis. O melhor custo-benefício da cidade." },
  { id: "fone", name: "Fone GamerPro X 12x \"sem juros\"", ico: "i-headphones", price: 890, kind: "trap", mood: 6,
    desc: "Seu fone atual funciona. Mas esse tem LED…",
    note: "R$ 890 por LED? Parcelinha é salário futuro pré-vendido." },
  { id: "tenis", name: "Tênis drop exclusivo", ico: "i-shoe", price: 720, kind: "trap", mood: 8,
    desc: "\"Edição limitada\" (relançam todo mês).",
    note: "Escassez fabricada é a isca mais velha do varejo." },
  { id: "cafegourmet", name: "Assinatura café gourmet", ico: "i-cup", price: 79, kind: "sub",
    desc: "R$ 79 TODO MÊS pra sempre (ou até você lembrar de cancelar).",
    note: "Assinatura é boleto voluntário. Some 12 meses antes de assinar." }
];

/* ---------------- Missões (espinha dorsal) ---------------- */
const MISSIONS = [
  { id: "m1", ico: "i-search", title: "Encare o monstro",
    desc: "Abra o FlaBank e olhe suas dívidas de frente. Dói menos do que ignorar.",
    how: "Abra o app FlaBank", xp: 60,
    mentor: "Viu? O monstro tem tamanho. E tudo que tem tamanho, tem fim. Confia no processo." },
  { id: "m2", ico: "i-handshake", title: "Estanque a sangria",
    desc: "O rotativo cresce R$ 30 POR DIA. Negocie essa dívida no FlaBank antes de qualquer outra coisa.",
    how: "FlaBank → dívida do cartão → NEGOCIAR", xp: 120,
    mentor: "Regra de ouro: primeiro para de cavar, depois sai do buraco. Dívida cara se NEGOCIA, não se convive." },
  { id: "m3", ico: "i-scissors", title: "Caça-fantasmas",
    desc: "Tem assinatura te mordendo todo mês. Cancele pelo menos uma no FlaBank.",
    how: "FlaBank → Assinaturas → cancelar", xp: 80,
    mentor: "R$ 89 de academia sem ir é R$ 1.068 por ano indo pro ralo. Fantasma exorcizado." },
  { id: "m4", ico: "i-shield", title: "Os primeiros R$ 500", goal: 500, goalKey: "reserve",
    desc: "Monte o começo da reserva de emergência: R$ 500 guardados no FlaBank (aba Reserva).",
    how: "FlaBank → Reserva → Guardar", xp: 150, unlock: "invest",
    mentor: "R$ 500 separam você do próximo golpe do destino. Liberei o InvestFla pra você — reserva rende!" },
  { id: "m5", ico: "i-star", title: "Nome limpo",
    desc: "Zere a dívida do cartão (negociada ou não) e limpe seu nome na praça.",
    how: "Quitar a dívida do cartão no FlaBank", xp: 250,
    mentor: "SEU. NOME. LIMPO. Sabe o que isso significa? Crédito barato quando você PRECISAR. Pode comemorar, você merece." },
  { id: "m6", ico: "i-shield", title: "Colchão de 1 mês", goal: 2300, goalKey: "reserve",
    desc: "Reserva de emergência de R$ 2.300 (1 mês do seu custo de vida).",
    how: "Guardar na Reserva do FlaBank", xp: 200,
    mentor: "Um mês inteiro de paz guardado. Imprevisto agora é só... previsto atrasado." },
  { id: "m7", ico: "i-sprout", title: "Primeiro investimento",
    desc: "Aplique qualquer valor em Tesouro, CDB ou FII no InvestFla.",
    how: "InvestFla → escolher ativo → Aplicar", xp: 150,
    mentor: "Bem-vindo ao outro lado dos juros. Agora eles trabalham PRA você." },
  { id: "m6b", ico: "i-shield", title: "Colchão de 2 meses", goal: 4500, goalKey: "reserve",
    desc: "Reserva de R$ 4.500. Metade do caminho até destravar o mercado imobiliário.",
    how: "Guardar na Reserva do FlaBank", xp: 200,
    mentor: "Dois meses de vida garantidos. Dá pra sentir a diferença no travesseiro, né?" },
  { id: "m8", ico: "i-bank", title: "Colchão de 3 meses", goal: 6900, goalKey: "reserve",
    desc: "Reserva de R$ 6.900. Com isso, destravo o mercado imobiliário pra você.",
    how: "Reserva ≥ R$ 6.900", xp: 300, unlock: "imoveis",
    mentor: "TRÊS meses de liberdade guardados. Abri o LarLar — hora de fazer o dinheiro criar raiz." },
  { id: "m9", ico: "i-key", title: "Primeira escritura",
    desc: "Compre seu primeiro imóvel no LarLar (a vaga de garagem conta, e muito!).",
    how: "LarLar → comprar imóvel", xp: 400,
    mentor: "Você saiu de devedor pra PROPRIETÁRIO. Sente o peso (bom) dessa palavra." },
  { id: "m10", ico: "i-tools", title: "O primeiro flip",
    desc: "Compre, reforme e venda um imóvel com lucro. O jogo dos grandes.",
    how: "LarLar → Reformar → Vender", xp: 500,
    mentor: "Comprou valor escondido, destravou, embolsou. Isso tem nome: visão." },
  { id: "m11", ico: "i-coin", title: "Dinheiro que pinga", goal: 800, goalKey: "passive",
    desc: "Alcance R$ 800/mês de renda passiva LÍQUIDA (aluguéis + dividendos − parcelas).",
    how: "Alugar imóveis / acumular FIIs", xp: 500,
    mentor: "R$ 800 por mês SEM trabalhar. Seu eu do passado não ia acreditar." },
  { id: "m12", ico: "i-flame", title: "F.I.R.E.",
    desc: "Renda passiva maior que seu custo de vida (R$ 2.300/mês). Independência financeira. O trabalho vira escolha.",
    how: "Renda passiva ≥ custo de vida", xp: 1000,
    mentor: "F. I. R. E. Você não depende mais de salário. A chama que começou numa dívida de cartão virou incêndio. Eu tô MUITO orgulhosa de você." }
];

/* ---------------- Contatos do ZapZap ---------------- */
const CONTACTS = {
  re: { name: "Rê · Flamma", avatar: "assets/art/re.svg", color: "#ff5a1f" },
  mae: { name: "Mãe", avatar: "assets/art/mae.svg", color: "#e91e63" },
  betinho: { name: "Betinho", avatar: "assets/art/betinho.svg", color: "#03a9f4" },
  chefe: { name: "Sr. Barbosa (chefe)", avatar: "assets/art/barbosa.svg", color: "#607d8b" },
  desconhecido: { name: "Número desconhecido", avatar: "assets/art/golpista.svg", color: "#9e9e9e" },
  banco: { name: "FlaBank", avatar: "assets/art/logo.svg", color: "#8e24aa" },
  vizinha: { name: "Dona Cida (vizinha)", avatar: "assets/art/cida.svg", color: "#795548" }
};

/* =========================================================
   EVENTOS — chegam pelo ZapZap. effect() recebe a API do
   engine e retorna a resposta que aparece no chat.
   ========================================================= */
const EVENTS = [

  /* ---------- GOLPES (as opções ruins parecem boas) ---------- */
  { id: "pix_errado", from: "desconhecido", weight: 3, minDay: 6, once: true, scam: true,
    text: "Oi!! Fiz um PIX de R$ 480 errado pra sua conta agora 😭 tô desesperada, é o dinheiro do aluguel! Me devolve nessa chave aqui: 11 9****-**** (é a conta da minha irmã pq a minha bloqueou)",
    choices: [
      { label: "Devolver agora, coitada", effect: (a) => {
          a.cash(-480); a.stress(8); a.radar(-5);
          a.mentorSoon("Clássico GOLPE DO PIX ERRADO: nenhum dinheiro entrou na sua conta — confere o extrato! E mesmo quando entra, devolução se faz pelo BOTÃO OFICIAL do banco, nunca pra 'outra chave'. Foram R$ 480 de aula.");
          return "Você devolveu... mas nunca tinha recebido nada. O número sumiu."; } },
      { label: "Conferir o extrato primeiro", effect: (a) => {
          a.radar(10); a.xp(40);
          a.mentorSoon("ISSO! Extrato conferido, golpe desmontado. Não caiu nada na conta, né? Devolução real se faz pelo botão oficial do app. Teu radar anti-golpe tá afiando.");
          return "Extrato limpo: nenhum PIX recebido. Era golpe. Você bloqueou o número."; } },
      { label: "Ignorar e denunciar", effect: (a) => {
          a.radar(8); a.xp(30);
          return "Denunciado e bloqueado. Menos um golpista no seu caminho."; } }
    ] },

  { id: "flacoin", from: "betinho", weight: 3, minDay: 12, once: true, scam: true,
    text: "MANO. Entrei num negócio chamado MooCoin, rende 10% AO MÊS GARANTIDO 🤑 o primo do Jeferson já sacou 3x! Se entrar com R$ 500 hoje em 3 meses tá com R$ 665. É matemática, não tem como dar errado. Vai ficar de fora?",
    choices: [
      { label: "Entrar com R$ 500", cond: (G) => G.cash >= 500, effect: (a) => {
          a.cash(-500); a.flag("moocoin", 500); a.schedule("moocoin_pay1", 30);
          return "Você entrou. O app da MooCoin mostra seu saldo 'rendendo' ao vivo. Hipnotizante..."; } },
      { label: "Entrar com R$ 1.500, all-in", cond: (G) => G.cash >= 1500, effect: (a) => {
          a.cash(-1500); a.flag("moocoin", 1500); a.schedule("moocoin_pay1", 30);
          return "ALL-IN na MooCoin. O saldo 'rende' na tela em tempo real. Betinho mandou quatro foguetes no grupo."; } },
      { label: "Perguntar: rende COMO, exatamente?", effect: (a) => {
          a.radar(12); a.xp(50);
          a.mentorSoon("A pergunta que derruba TODA pirâmide: 'de onde vem o rendimento?'. Se a resposta é 'indicando pessoas' ou 'confia'... é esquema Ponzi. 10% ao mês garantido não existe nem pra banco.");
          return "Betinho: 'ahh é tipo... trade automático com IA, sei lá mano, só sei que rende'. Sei."; } }
    ] },

  { id: "zap_clonado", from: "desconhecido", weight: 2, minDay: 20, once: true, scam: true,
    text: "Oi filho, sou eu a mãe 😘 troquei de número pq meu chip queimou. Preciso de um favor URGENTE: paga um boleto de R$ 620 pra mim que venceu hoje? Te devolvo domingo sem falta. Manda PIX nessa chave: mae.nova.conta@email.com",
    choices: [
      { label: "Pagar — mãe é mãe", effect: (a) => {
          a.cash(-620); a.stress(10); a.radar(-5);
          a.mentorSoon("Golpe do WhatsApp clonado. A regra que salva: LIGUE pro número ANTIGO antes de qualquer PIX 'urgente'. Urgência + pedido de dinheiro = 99% golpe.");
          return "Pago. ...Sua mãe de verdade te ligou à noite do número DE SEMPRE perguntando por que você tá sumido. Golpe."; } },
      { label: "Ligar pro número antigo da mãe", effect: (a) => {
          a.radar(12); a.xp(50);
          return "Sua mãe atendeu na hora: 'Que chip queimado, menino?! Tô aqui vendo novela!'. Golpista bloqueado."; } },
      { label: "Pedir áudio falando o nome do cachorro", effect: (a) => {
          a.radar(10); a.xp(40);
          return "'...oi filho, o áudio tá ruim aqui'. Sei. O Bolinha ficaria decepcionado. Bloqueado."; } }
    ] },

  { id: "iphone_promo", from: "desconhecido", weight: 2, minDay: 15, once: true, scam: true,
    text: "ÚLTIMAS UNIDADES!! iPhone 17 por R$ 1.299 (70% OFF!!) só HOJE na LojaPremiumBR.shop — pague no PIX e receba em 24h! Corre que acaba!",
    choices: [
      { label: "COMPRAR! É metade do preço!", cond: (G) => G.cash >= 1299, effect: (a) => {
          a.cash(-1299); a.stress(12); a.radar(-5);
          a.mentorSoon("Site .shop desconhecido + só PIX + urgência com contagem regressiva = a santíssima trindade do golpe. Preço bom demais É a isca. Pesquise a loja no Reclame Aqui SEMPRE.");
          return "Pagou no PIX... o site saiu do ar 2 horas depois. Sem iPhone, sem dinheiro, sem rastro."; } },
      { label: "Pesquisar a loja antes", effect: (a) => {
          a.radar(10); a.xp(40);
          return "Reclame Aqui: nota 1.2, 340 reclamações de 'paguei e não recebi' só este mês. Passou longe."; } }
    ] },

  { id: "consignado_milagre", from: "desconhecido", weight: 2, minDay: 28, once: true, scam: true,
    text: "CRÉDITO LIBERADO! Empréstimo de até R$ 15.000 SEM consulta ao SPC/Serasa, dinheiro na conta em 1h! Só precisamos de um depósito-caução de R$ 350 pra liberar o contrato. Responda JÁ.",
    choices: [
      { label: "Pagar a caução — preciso da grana", effect: (a) => {
          a.cash(-350); a.radar(-5);
          a.mentorSoon("Anota na testa: EMPRÉSTIMO DE VERDADE NUNCA PEDE DINHEIRO ADIANTADO. 'Taxa pra liberar' é golpe, sempre, sem exceção.");
          return "Caução paga... e o 'consultor' evaporou. R$ 350 de prejuízo."; } },
      { label: "Deletar. Empréstimo não pede caução.", effect: (a) => {
          a.radar(10); a.xp(40);
          return "Exato. Banco de verdade desconta do valor liberado, nunca pede PIX antes. Radar afiado."; } }
    ] },

  /* ---------- VIDA REAL (escolhas com trade-off) ---------- */
  { id: "geladeira", from: "vizinha", weight: 3, minDay: 8, once: true,
    text: "Jô, seu apartamento tá pingando água no meu! Vim ver e é sua geladeira, tá vazando por dentro. O conserto o Zé faz por R$ 280, mas na loja tem geladeira nova em 10x de R$ 190…",
    choices: [
      { label: "Consertar (R$ 280)", cond: (G) => G.cash >= 280, effect: (a) => {
          a.cash(-280); a.xp(30);
          a.mentorNote("Conserto à vista < parcela infinita. Geladeira não é status, é utilidade.");
          return "Zé consertou em 2h e ainda regulou a borracha da porta. Boa escolha."; } },
      { label: "Geladeira nova em 10x de R$ 190", effect: (a) => {
          a.subAdd("gelad10x", "Parcela geladeira nova", 190, 10); a.mood(6);
          a.mentorNote("R$ 1.900 no total por um problema de R$ 280. A parcela 'que cabe no bolso' é assim que o bolso fura.");
          return "Geladeira nova brilhando na kitnet. E 10 boletos brilhando no seu futuro."; } },
      { label: "Adiar (usar isopor por enquanto)", effect: (a) => {
          a.stress(8); a.mood(-6); a.schedule("geladeira_piora", 6);
          return "Modo isopor ativado. Sua marmita te olha com medo."; } }
    ] },

  { id: "hora_extra_domingo", from: "chefe", weight: 5, minDay: 2, cooldown: 12,
    text: "Jô, inventário no domingo. Quem topar leva R$ 220 extra. Posso contar contigo?",
    choices: [
      { label: "Topar (R$ 220, +estresse)", effect: (a) => {
          a.cash(220); a.stress(14); a.mood(-6); a.xp(20);
          return "Domingo no CT. Cansativo, mas o PIX caiu na segunda."; } },
      { label: "Recusar — preciso descansar", effect: (a) => {
          a.stress(-8); a.mood(6);
          return "Domingo de sofá e paz. Às vezes o melhor investimento é dormir."; } }
    ] },

  { id: "betinho_role", from: "betinho", weight: 5, minDay: 1, cooldown: 10,
    text: "Sextou!! Rolê hoje: bar novo, depois o barzinho da sinuca. Uns R$ 120 a noite toda. Bora? A firma agradece a presença.",
    choices: [
      { label: "Bora! (R$ 120)", cond: (G) => G.cash >= 120, effect: (a) => {
          a.cash(-120); a.mood(16); a.stress(-12);
          return "Noite boa demais. Segunda-feira você tava até simpático. Isso também é saúde."; } },
      { label: "Ir só na sinuca (R$ 40)", cond: (G) => G.cash >= 40, effect: (a) => {
          a.cash(-40); a.mood(10); a.stress(-8); a.xp(20);
          a.mentorNote("Rolê inteligente: cortou 2/3 do custo e manteve o que importa — a resenha.");
          return "Sinuca, tira-gosto e zoeira. 90% da diversão por 30% do preço."; } },
      { label: "Ficar em casa (R$ 0)", effect: (a) => {
          a.mood(-8);
          return "Economizou, mas o grupo postou os stories e bateu aquela solidão. Equilíbrio, lembra?"; } }
    ] },

  { id: "mae_aperto", from: "mae", weight: 2, minDay: 25, cooldown: 40,
    text: "Filho, tô com vergonha de pedir… o remédio da pressão subiu pra R$ 180 e esse mês apertou. Você consegue me ajudar? Se não der tudo bem, viu? ❤️",
    choices: [
      { label: "Mandar os R$ 180", cond: (G) => G.cash >= 180, effect: (a) => {
          a.cash(-180); a.mood(10); a.xp(30);
          return "'Deus te abençoe, filho'. Alguns retornos não aparecem no extrato."; } },
      { label: "Mandar R$ 100 e dividir com a tia", cond: (G) => G.cash >= 100, effect: (a) => {
          a.cash(-100); a.mood(6); a.xp(20);
          return "Você e a tia dividiram. Família é sociedade de responsabilidade solidária."; } },
      { label: "Explicar que esse mês não dá", effect: (a) => {
          a.mood(-10); a.stress(6);
          return "'Imagina filho, relaxa!'. Ela entendeu de verdade. Mas seu coração apertou igual."; } }
    ] },

  { id: "pneu_furado", from: "banco", weight: 4, minDay: 10, cooldown: 25, system: true,
    text: "Débito no cartão: R$ 160 — borracharia 24h. (O pneu furou no pior dia possível. Imprevisto clássico.)",
    choices: [
      { label: "Pagar do bolso", cond: (G) => G.cash >= 160, effect: (a) => {
          a.cash(-160); a.stress(4);
          return "Pago. Imprevisto de R$ 160 dói menos quando existe reserva, né?"; } },
      { label: "Usar a reserva de emergência", cond: (G) => G.reserve >= 160, effect: (a) => {
          a.reserve(-160); a.xp(30);
          a.mentorNote("PRA ISSO ela existe! Emergência real → reserva. Sem culpa. Depois recompõe.");
          return "Reserva usada como manda o manual. Zero drama, zero dívida nova."; } }
    ] },

  { id: "aumento_janela", from: "chefe", weight: 2, minDay: 35, once: true,
    text: "Jô, os números do trimestre fecharam bons e a diretoria abriu revisão salarial. Quem quiser pleitear aumento, agenda comigo amanhã. Vem preparado.",
    choices: [
      { label: "Pedir 15% mostrando resultados", effect: (a) => {
          const G = a.G();
          const chance = 0.45 + (G.flags.curso ? 0.25 : 0) + (G.stress < 50 ? 0.1 : 0);
          if (Math.random() < chance) { a.salary(0.15); a.mood(18); a.xp(80);
            return "Levou planilha, casos resolvidos e proposta. Barbosa segurou o café: 'Aprovado.' Mais 15%!"; }
          a.stress(8); a.mood(-6);
          return "'Agora não dá, Jô'. Doeu, mas você mostrou ambição — Barbosa anotou seu nome. (Dica da Rê: um curso aumentaria MUITO essa chance.)"; } },
      { label: "Pedir 8%, mais garantido", effect: (a) => {
          const G = a.G();
          const chance = 0.7 + (G.flags.curso ? 0.2 : 0);
          if (Math.random() < chance) { a.salary(0.08); a.mood(10); a.xp(50);
            return "'Justo. Aprovado.' Mais 8% no salário. Negociação é sobre pedir."; }
          a.stress(6);
          return "Não rolou nem os 8%. Trimestre que vem tem revanche."; } },
      { label: "Não pedir nada", effect: (a) => {
          a.mood(-4);
          return "Você ficou quieto. Quem não pede, escolhe o 'não' sozinho."; } }
    ] },

  { id: "fiador", from: "betinho", weight: 2, minDay: 45, once: true,
    text: "Mano, achei um apê top pra alugar mas o dono exige fiador com nome limpo… você tá certinho agora, né? Assina pra mim? Juro que nunca vou atrasar 🙏",
    cond: (G) => G.score > 500,
    choices: [
      { label: "Assinar — amigo é pra essas coisas", effect: (a) => {
          a.flag("fiador", true); a.schedule("fiador_cobra", 45); a.xp(10);
          return "Assinado. Que dê tudo certo…"; } },
      { label: "Recusar e sugerir seguro-fiança", effect: (a) => {
          a.radar(8); a.xp(40); a.mood(-4);
          a.mentorNote("Fiador responde com o PRÓPRIO patrimônio pela dívida do outro. Seguro-fiança existe exatamente pra isso. Amizade e aval não se misturam.");
          return "Betinho fez bico mas entendeu. O seguro-fiança dele deu R$ 60/mês. Amizade intacta, patrimônio também."; } }
    ] },

  { id: "vaquinha_formatura", from: "mae", weight: 2, minDay: 55, once: true,
    text: "Filho! Sua prima passou em MEDICINA! A família tá fazendo uma vaquinha pro material. Cada um dá o que pode.",
    choices: [
      { label: "Dar R$ 100", cond: (G) => G.cash >= 100, effect: (a) => { a.cash(-100); a.mood(8); return "A prima chorou no grupo da família. Investimento em gente também rende."; } },
      { label: "Dar R$ 30 e uma carta", cond: (G) => G.cash >= 30, effect: (a) => { a.cash(-30); a.mood(6); a.xp(10); return "'A carta valeu mais que dinheiro', disse ela. Presença > cifra."; } },
      { label: "Passar essa", effect: (a) => { a.mood(-4); return "Tudo bem. Mas a tia Marta anotou. Ela SEMPRE anota."; } }
    ] },

  { id: "feirao_serasa", from: "banco", weight: 2, minDay: 30, cooldown: 60, system: true,
    cond: (G) => G.debts.some(d => d.id === "rotativo" && d.total > 0 && !G.flags.negotiated),
    text: "FEIRÃO LIMPA NOME essa semana: seu banco topa quitação do rotativo com 40% de desconto À VISTA. Só até sexta.",
    choices: [
      { label: "Quitar com desconto!", cond: (G) => { const d = G.debts.find(x => x.id === "rotativo"); return d && G.cash >= d.total * 0.6; }, effect: (a) => {
          const val = a.debtSettle("rotativo", 0.6);
          a.xp(120); a.stress(-15);
          return "QUITADO por R$ " + val.toLocaleString("pt-BR") + " (40% off). O feirão é o melhor amigo do endividado com dinheiro na mão."; } },
      { label: "Não tenho o valor agora", effect: (a) => {
          a.mentorNote("Sem drama. Mas anota a lição: desconto de feirão é ENORME — junte munição pro próximo.");
          return "Fica pra próxima. Feirões voltam — sua dívida, infelizmente, também continua."; } }
    ] },

  { id: "black_friday", from: "banco", weight: 2, minDay: 40, cooldown: 55, system: true,
    text: "BLACK FRIDAY no ShopZika! 'Descontos de até 70%'. Sua lista de desejos tá chamando. O que você faz?",
    choices: [
      { label: "Só comprar o que JÁ estava planejado", effect: (a) => {
          a.xp(40); a.radar(5);
          a.mentorNote("A única Black Friday que compensa: lista feita ANTES da promoção. Desconto em coisa desnecessária é prejuízo com fantasia.");
          return "Você conferiu sua lista: nada essencial. Fechou o app. Isso é um superpoder."; } },
      { label: "Dar uma olhadinha só…", effect: (a) => {
          const gasto = 90 + Math.floor(Math.random() * 160);
          a.cash(-gasto); a.mood(6);
          return "'Só uma olhadinha' custou R$ " + gasto + ". A 12ª lei do varejo: ninguém sai só olhando."; } }
    ] },

  { id: "curso_gratis", from: "re", weight: 2, minDay: 22, once: true,
    text: "Jô! O SENAI abriu turma GRATUITA de logística à noite, 6 semanas. Puxado (trabalho + estudo), mas o certificado pesa no currículo. Topa?",
    choices: [
      { label: "Me inscrever!", effect: (a) => {
          a.stress(10); a.flag("curso", true); a.xp(80);
          return "Matriculado! 6 semanas de correria — e um certificado que muda conversas de aumento."; } },
      { label: "Agora não dou conta", effect: (a) => {
          a.stress(-2);
          return "Respeitado. Conhecer o próprio limite também é sabedoria (mas fica de olho na próxima turma)."; } }
    ] },

  { id: "cashback_armadilha", from: "banco", weight: 3, minDay: 18, cooldown: 30, system: true,
    text: "Seu cartão liberou SUPER CASHBACK: 5% de volta em TODAS as compras este fim de semana! (Limite disponível: R$ 2.400)",
    choices: [
      { label: "Aproveitar pra estocar compras", effect: (a) => {
          const gasto = 180 + Math.floor(Math.random() * 200);
          a.cash(-gasto); a.mood(4);
          a.mentorNote("Matemática do cashback: gastar R$ " + gasto + " pra 'ganhar' R$ " + Math.round(gasto * 0.05) + " de volta. Cashback é ótimo em gasto que EXISTIRIA de qualquer jeito — e péssimo como motivo de compra.");
          return "Estoque feito, R$ " + gasto + " a menos, R$ " + Math.round(gasto * 0.05) + " de cashback. Hmm… a conta fecha?"; } },
      { label: "Usar só no mercado que eu já ia fazer", effect: (a) => {
          a.cash(7); a.xp(30); a.radar(4);
          return "Compra que já existia + 5% de volta = R$ 7 de cashback LIMPO. É assim que se usa."; } }
    ] },

  { id: "dividendo_surpresa", from: "banco", weight: 3, minDay: 20, cooldown: 20, system: true,
    cond: (G) => G.invest.fiiUnits > 0,
    text: "Seus FIIs pagaram dividendos extraordinários hoje! Dinheiro pingou na conta. O que fazer com ele?",
    choices: [
      { label: "Reinvestir tudo (bola de neve)", effect: (a) => {
          const G = a.G(); const bonus = Math.max(20, Math.round(G.invest.fiiUnits * G.prices.fii * 0.012));
          a.investAdd("fii", bonus); a.xp(40);
          return "R$ " + bonus + " reinvestidos. Juros compostos: dividendos comprando cotas que pagam dividendos."; } },
      { label: "Sacar e curtir", effect: (a) => {
          const G = a.G(); const bonus = Math.max(20, Math.round(G.invest.fiiUnits * G.prices.fii * 0.012));
          a.cash(bonus); a.mood(6);
          return "R$ " + bonus + " no bolso. Colher um fruto de vez em quando também é o jogo."; } }
    ] },

  { id: "cripto_hype", from: "betinho", weight: 3, minDay: 26, cooldown: 35,
    cond: (G) => G.flags.invest,
    text: "MANO a DogeFlame subiu 40% na semana!!! Todo mundo entrando. Vai esperar ficar rico pra investir??",
    choices: [
      { label: "FOMO! Comprar o topo", cond: (G) => G.cash >= 300, effect: (a) => {
          a.investAdd("cripto", 300); a.G().cash -= 300;
          a.mentorNote("Comprar PORQUE subiu chama 'comprar caro'. Cripto pode ter espaço na carteira — pequeno, planejado e sem FOMO.");
          return "Comprou no hype. Agora é segurar firme na montanha-russa."; } },
      { label: "Entrar com pouco (R$ 100) por curiosidade", cond: (G) => G.cash >= 100, effect: (a) => {
          a.investAdd("cripto", 100); a.G().cash -= 100; a.xp(20);
          return "Posição de curiosidade: R$ 100. Se dobrar, ótimo; se zerar, foi o preço do aprendizado."; } },
      { label: "Ignorar o hype", effect: (a) => {
          a.xp(20); a.radar(4);
          return "Hype ignorado. Quem compra por stories, vende por pânico."; } }
    ] },

  { id: "inquilino_atrasa", from: "banco", weight: 3, minDay: 10, cooldown: 30, system: true,
    cond: (G) => G.properties.some(p => p.renting),
    text: "Seu inquilino avisou: 'vou atrasar o aluguel uns 10 dias, perdi um freela'. Como responde?",
    choices: [
      { label: "Negociar: 10 dias com multa simbólica", effect: (a) => {
          a.xp(40); a.schedule("aluguel_atrasado_paga", 10);
          return "Acordo feito por escrito. Inquilino bom se mantém com diálogo — vacância custa mais que 10 dias de atraso."; } },
      { label: "Ameaçar despejo imediato", effect: (a) => {
          a.stress(8); if (Math.random() < 0.5) { a.flag("vacancia", true); a.schedule("imovel_vago", 5);
            return "O inquilino se assustou… e avisou que sai no fim do mês. Agora é vacância + anúncio + pintura."; }
          return "Ele pagou no susto, mas a relação azedou. Inquilino ressentido é problema em câmera lenta."; } }
    ] },

  { id: "burnout_aviso", from: "re", weight: 4, minDay: 5, cooldown: 15,
    cond: (G) => G.stress >= 80,
    text: "Jô… seu estresse tá lá em cima. Corpo manda boleto também, e o juro dele é alto (médico, afastamento, besteira por impulso). Que tal um respiro?",
    choices: [
      { label: "Tirar um dia off (folga)", effect: (a) => {
          a.stress(-25); a.mood(12);
          return "Um dia inteiro de nada. O cérebro agradeceu com juros."; } },
      { label: "Aguentar mais um pouco", effect: (a) => {
          a.stress(5);
          return "Você segue no talo. A Rê te manda um 'te cuida, hein' preocupado."; } }
    ] }
];

/* ---------- Follow-ups agendados (consequências) ---------- */
const FOLLOWUPS = {
  moocoin_pay1: (a) => {
    const invested = a.G().flags.moocoin || 500;
    const pay = Math.round(invested * 0.10);
    a.cash(pay); a.schedule("moocoin_rug", 25);
    a.msg("betinho", "Viu?? Primeiro rendimento da MooCoin caiu: R$ " + pay + "! Te falei! O pessoal tá dobrando o aporte, vai deixar passar?");
  },
  moocoin_rug: (a) => {
    const invested = a.G().flags.moocoin || 500;
    a.flag("moocoin", 0);
    a.msg("betinho", "mano………… o app da MooCoin sumiu. site fora do ar. o grupo do telegram fechou. acho que a gente foi de base 😭 perdi R$ 2.400");
    a.mentorSoon("A MooCoin era um esquema Ponzi: pagava os antigos com o dinheiro dos novos. O 'primeiro rendimento' é a isca pra você dobrar a aposta. Você perdeu R$ " + invested + " no total — e o Betinho, bem mais. Rendimento garantido acima do CDI é mentira, SEMPRE.");
  },
  fiador_cobra: (a) => {
    if (Math.random() < 0.55) {
      a.cash(-850); a.stress(15);
      a.msg("banco", "COBRANÇA DE FIANÇA: aluguel do afiançado em atraso (45 dias). Débito de R$ 850 realizado conforme contrato.");
      a.mentorSoon("A dor do fiador: a dívida é do outro, o débito é seu. O Betinho jurou pagar — e a vida do Betinho tinha outros planos. Aval é empréstimo do seu nome.");
    } else {
      a.msg("betinho", "Mano, 3 meses de aluguel pago em dia! Te falei que podia confiar 🙏 valeu por assinar!");
    }
  },
  geladeira_piora: (a) => {
    a.cash(-420); a.stress(10);
    a.msg("vizinha", "Jô! A geladeira ALAGOU aqui embaixo, estragou meu tapete! O conserto agora é o motor: R$ 420. Adiar problema é comprar problema maior, viu…");
  },
  aluguel_atrasado_paga: (a) => {
    a.msg("banco", "Aluguel atrasado pago com a multinha combinada. Acordo cumprido, inquilino mantido.");
  },
  imovel_vago: (a) => {
    a.msg("banco", "Imóvel desocupado. Sem aluguel este mês + R$ 300 de pintura e anúncio. Vacância é o custo invisível do imóvel.");
    a.cash(-300);
  },
  tioze_guilt: (a) => {
    const G = a.G();
    const tio = G.debts.find(d => d.id === "tioze");
    if (tio && tio.total > 0) {
      a.mood(-5);
      a.msg("mae", "Filho… o tio Zé perguntou de você no almoço de domingo. Ele não cobra, mas eu vi na cara dele. Quando der, acerta com ele, tá?");
      a.schedule("tioze_guilt", 30);
    }
  },
  inquilino_chega: (a) => {
    const G = a.G();
    const p = G.properties.find(x => x.pid === a.payload());
    if (p && p.rentPending) {
      p.rentPending = false; p.renting = true;
      a.msg("banco", "Inquilino assinou o contrato de " + p.name + ". Aluguel de R$ " + p.rent.toLocaleString("pt-BR") + "/mês começa a pingar todo dia 3.");
    }
  }
};

/* ---------- Micro-conteúdo (beat garantido em dia sem evento) ---------- */
const FILLERS = [
  { from: "betinho", text: "mano cê viu o meme do cara que parcelou o dízimo em 12x KKKKKKK" },
  { from: "betinho", text: "descobri que o açaí da esquina dá 10% de desconto no dinheiro. tô me sentindo um lobo de wall street" },
  { from: "vizinha", text: "Jô, a Marlete do 302 vendeu a TV pra pagar a fatura e o marido só descobriu no jogo de ontem. Um drama. Fica de olho nas suas finanças, menino." },
  { from: "mae", text: "Filho, seu prato favorito no domingo. Vem almoçar que tá difícil esse mês pra todo mundo, mas comida da mãe é de graça ❤️" },
  { from: "chefe", text: "Equipe, lembrete: quem bater a meta do mês leva vale-mercado de R$ 100. Tamo junto." },
  { from: "re", text: "Curiosidade do dia: o brasileiro médio paga R$ 1.300/ano só de juros de rotativo e cheque especial. Você tá saindo dessa estatística." },
  { from: "re", text: "Passando pra lembrar: patrimônio não é o que você GANHA, é o que você SEGURA. Tem gente com salário alto e bolso furado." },
  { from: "banco", text: "Resumo semanal: seus gastos com delivery caíram 12%. Continue assim e sobra mais pro cofre." },
  { from: "betinho", text: "tava vendo um filme de assalto e pensei: os cara planeja 6 meses pra roubar 2 milhão, era só investir esse esforço num CNPJ" },
  { from: "vizinha", text: "Menino, te vi saindo cedo de novo. Trabalha muito! Não esquece de viver também, viu? A vida passa." },
  { from: "re", text: "Se hoje sobrar R$ 10, guarda R$ 10. Constância vence valor. O cofre não julga depósito pequeno." },
  { from: "mae", text: "Sua prima falou que você tá 'diferente, mais maduro'. Eu disse: tá pagando boleto em dia, é isso que faz com a pessoa." },
  { from: "banco", text: "Dica de segurança: ative a confirmação em duas etapas do seu WhatsApp. Golpista odeia isso." },
  { from: "betinho", text: "bora marcar aquela sinuca? prometo não apostar dinheiro dessa vez (mentira, aposto R$ 5)" },
  { from: "re", text: "Meta pequena do dia: abre o extrato e olha 30 segundos. Quem olha o extrato todo dia nunca é surpreendido no fim do mês." }
];

/* ---------- Níveis por XP (título no perfil) ---------- */
const LEVELS = [
  { xp: 0, title: "Devedor Anônimo" },
  { xp: 300, title: "Aprendiz do Boleto" },
  { xp: 800, title: "Caçador de Juros" },
  { xp: 1600, title: "Guardião da Reserva" },
  { xp: 2800, title: "Investidor de Bairro" },
  { xp: 4500, title: "Magnata de Kitnet" },
  { xp: 7000, title: "Lenda do FIRE" }
];

/* ---------- Manchetes de fim de mês ---------- */
const HEADLINES = [
  (G) => "Diário de Indaiatuba: \"" + G.name + " revisa assinaturas e vira exemplo no bairro\"",
  (G) => "Colunista econômico: \"Caso " + G.name + " mostra que rotativo se negocia, não se paga o mínimo\"",
  (G) => "Jornal da Cidade: \"Jovem monta reserva de emergência e dorme 2h mais cedo, diz vizinhança\"",
  (G) => "FlaNews: \"" + G.name + " descobre que boleto não morde — mas juros sim\"",
  (G) => "Revista Grana: \"De devedor a investidor: a virada silenciosa de " + G.name + "\""
];

/* ---------- Falas da Rê (dicas de contexto) ---------- */
const RE_TIPS = [
  "Dica do dia: pague-se PRIMEIRO. Salário caiu → separa a reserva ANTES de gastar. O que sobra é pro mês, não o contrário.",
  "Juro composto é neutro: destrói quem deve, enriquece quem investe. Escolha seu lado do balcão.",
  "Score sobe com boleto pago em dia e uso baixo do limite. Não existe mágica paga pra 'limpar score' — quem oferece é golpe.",
  "Renda extra acelera MUITO no começo. Cada R$ 100 de freela vale mais que 1 ano de rendimento quando o patrimônio é pequeno.",
  "Antes de comprar, pergunta: 'quantas horas de trabalho custa isso?'. Muda tudo.",
  "Reserva de emergência não é investimento, é ESCUDO. Rende pouco? O trabalho dela é existir.",
  "Imóvel alugado bom é: localização + inquilino tratado bem + fundo de manutenção. Quem esquece o terceiro, aprende caro.",
  "Diversificar não é ter 8 criptos. É ter classes DIFERENTES: reserva, renda fixa, fundos, imóvel."
];

/* ---------- Badges ---------- */
const BADGES = {
  constancia: { ico: "i-flame", name: "Chama Acesa", desc: "7 dias reais seguidos cuidando dessa vida" },
  radar50: { ico: "i-radar", name: "Radar Anti-Golpe", desc: "Farejou 3+ golpes sem cair" },
  primeiro_mil: { ico: "i-coin", name: "Primeiro Milzinho", desc: "Patrimônio líquido positivo de R$ 1.000" },
  semana_zen: { ico: "i-leaf", name: "Semana Zen", desc: "Estresse abaixo de 40 por 7 dias" },
  flipper: { ico: "i-tools", name: "Flipper", desc: "Primeiro flip imobiliário com lucro" },
  magnata: { ico: "i-building", name: "Magnata", desc: "3 imóveis no portfólio" },
  fire: { ico: "i-flame", name: "F.I.R.E.", desc: "Renda passiva > custo de vida" }
};
