/* =========================================================
   FLAMMERS Jornada — dados (elenco, sonhos, lojinha, mapa)
   ========================================================= */

const CAST = {
  re: { name: "Rê", role: "mentora do Clube Flammers", img: "assets/art/re.svg" },
  mae: { name: "Mãe", role: "", img: "assets/art/mae.svg" },
  betinho: { name: "Betinho", role: "primo", img: "assets/art/betinho.svg" },
  golpista: { name: "???", role: "online", img: "assets/art/golpista.svg" },
  cida: { name: "Dona Cida", role: "cantina", img: "assets/art/cida.svg" },
  barbosa: { name: "Seu Barbosa", role: "lojista", img: "assets/art/barbosa.svg" }
};

const HEROES = {
  duda: { name: "Duda", img: "assets/art/duda.svg" },
  kai: { name: "Kai", img: "assets/art/kai.svg" }
};

const DREAMS = [
  { id: "bike", name: "Bike nova", cost: 400, img: "assets/art/dream-bike.svg" },
  { id: "game", name: "Videogame", cost: 500, img: "assets/art/dream-game.svg" },
  { id: "cel", name: "Celular novo", cost: 450, img: "assets/art/dream-cel.svg" },
  { id: "show", name: "Ingressos do show", cost: 350, img: "assets/art/dream-show.svg" }
];

const STICKERS = [
  { id: "st-fone", name: "Fone lendário", ico: "i-headphones", cost: 60 },
  { id: "st-star", name: "Estrela dourada", ico: "i-star", cost: 40 },
  { id: "st-flame", name: "Chama do clube", ico: "i-flame", cost: 80 },
  { id: "st-radar", name: "Radar anti-golpe", ico: "i-radar", cost: 100 },
  { id: "st-coroa", name: "Título: Lenda da Mesada", ico: "i-coin", cost: 150 },
  { id: "st-key", name: "Chave do futuro", ico: "i-key", cost: 120 }
];

/* posições dos nós no mapa (% da tela) — caminho serpenteando de baixo pra cima */
const MAP_NODES = [
  { x: 50, y: 83 }, { x: 25, y: 76 }, { x: 66, y: 69 }, { x: 30, y: 62 }, { x: 70, y: 55 },
  { x: 36, y: 48 }, { x: 64, y: 41 }, { x: 28, y: 34 }, { x: 60, y: 27 }, { x: 42, y: 20 }
];
const VIDA_NODE = { x: 60, y: 11 };

const JCONFIG = {
  baseCoins: 30,
  quizBonus: 20,
  replayFactor: 0.4
};
