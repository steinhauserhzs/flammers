<div align="center">

<img src="assets/art/logo.svg" width="110" alt="Flammers" />

# 🔥 FLAMMERS

### A Jornada da Grana — educação financeira que vicia (no bom sentido)

**[▶️ JOGAR AGORA](https://flammers-sepia.vercel.app)** · [Game Design](docs/game-design.md) · [Arquitetura](docs/arquitetura.md) · [White-label](docs/white-label.md)

![PWA](https://img.shields.io/badge/PWA-instal%C3%A1vel-8b5cf6?style=for-the-badge)
![Zero deps](https://img.shields.io/badge/depend%C3%AAncias-zero-4ecdc4?style=for-the-badge)
![Offline](https://img.shields.io/badge/funciona-offline-ffd166?style=for-the-badge)
![PT-BR](https://img.shields.io/badge/idioma-PT--BR-ff5a1f?style=for-the-badge)

*Um produto **Flamma** (Fire·ce · 3 Pontos) — educação financeira como benefício.*

</div>

---

## 🎮 O que é

**Flammers** é um jogo mobile (PWA) de educação financeira para o público de **10 a 17 anos**, com um segundo modo adulto desbloqueável. Nada de aula com slide: o jogador **vive** as decisões — mesada, golpe do PIX, pirâmide de figurinhas, primeiro negócio — e a lição emerge da consequência, não do sermão.

> **A tese pedagógica:** as opções ruins *parecem boas* (como na vida real). Errar dentro do jogo custa moedas — e imuniza lá fora.

## ✨ Dois jogos em um

| | 🗺️ **A Jornada** (principal) | 📱 **Modo Vida Real** (16+, desbloqueável) |
|---|---|---|
| Público | 10–17 anos | 16+ |
| Formato | Mapa de fases estilo Candy Crush + cenas visual novel | Simulador de vida: você assume o *celular* de Jô, endividado |
| Progressão | 10 fases · 1–3 estrelas · Cofre dos Sonhos | Do rotativo de R$ 8.000 ao F.I.R.E. (renda passiva > custo de vida) |
| Onde | [`index.html`](index.html) | [`vida.html`](vida.html) |

> ➕ **[Minha Vida](minha-vida.html)** — o terceiro pilar: finanças **reais** do jogador com análise da Rê (veja abaixo).

<div align="center">
<img src="assets/art/duda.svg" width="130" alt="Duda" />
<img src="assets/art/kai.svg" width="130" alt="Kai" />
<img src="assets/art/re.svg" width="130" alt="Rê" />

*Duda e Kai (protagonistas jogáveis) e Rê, a mentora do Clube Flammers.*
</div>

## ❤️ Minha Vida — do jogo pra vida real

O diferencial do Flammers: uma seção onde o jogador aplica o que aprendeu **na própria vida** (100% privado, dados só no aparelho):

- **Carteira real** — anota ganhos e gastos por categoria; saldo do mês na cara
- **Metas reais** — o Cofre dos Sonhos da vida real: cria a meta, registra depósitos, celebra a conquista
- **Planos** — checklist de próximos passos financeiros
- **Rê Analisa** — a mentora analisa os números REAIS e devolve dicas personalizadas (taxa de poupança, categoria dominante, meta perto do fim, streak)
- **Resumo visual** — gráfico de gastos por categoria + taxa de poupança
- **Conquistas reais + streak** de dias anotando
- **Exportação** — backup JSON e planilha CSV: os dados são do usuário

## 🕹️ Destaques

- **Personalizado** — o jogador informa nome e idade; o jogo o chama pelo nome o tempo todo
- **6 minigames** — dividir a mesada (slider), orçamento da cantina, caça-sinais-de-golpe, precificação de brigadeiro, reflexo anti-cilada (×2)
- **Personagens com emoções** — os retratos reagem às jogadas (feliz · triste · choque)
- **Golpes no formato real** — chegam como mensagem de celular dentro da cena (PIX errado, skin "barata", MooCoin 10%/mês "garantido")
- **Cofre dos Sonhos** — toda fase termina decidindo: *guardar tudo ou metade?* A barra do sonho (bike, videogame…) enchendo é a lição de poupança virando dopamina
- **Trilha sonora generativa** — tema no mapa, clima tenso nas fases de golpe, ambiências por cenário (passarinho no parque, burburinho na escola) — 100% WebAudio, zero arquivos de áudio
- **Arte 100% exclusiva** — 40 SVGs gerados sob direção de arte própria (paleta ember travada) + sprite de ~45 ícones vetoriais autorais; **zero emoji na interface**
- **Instalável e offline** — service worker com HTML network-first (updates instantâneos) e assets em cache

## 🚀 Rodar localmente

```bash
git clone https://github.com/steinhauserhzs/flammers.git
cd flammers
python3 -m http.server 4173
# → http://localhost:4173
```

Sem build, sem npm install, sem framework. É abrir e jogar.

## 🏗️ Estrutura

```
flammers/
├── index.html          # 🗺️ A Jornada (jogo principal)
├── vida.html           # 📱 Modo Vida Real (simulador 16+)
├── css/                # j.css (Jornada) · style.css (Vida Real)
├── js/
│   ├── j-data.js       # elenco, sonhos, lojinha, mapa       ← ponto de white-label
│   ├── j-levels.js     # roteiros das 10 fases + minigames   ← ponto de white-label
│   ├── jornada.js      # engine da Jornada (mapa, runner de fases, minigames)
│   ├── data.js         # conteúdo do Modo Vida Real           ← ponto de white-label
│   ├── engine.js       # simulação econômica do Modo Vida Real
│   ├── ui.js           # interface do Modo Vida Real
│   └── audio.js        # SFX + música generativa + ambiências (WebAudio)
├── assets/art/         # 40 SVGs exclusivos (personagens, cenas, mapa, sonhos)
├── sw.js               # service worker (offline + updates instantâneos)
└── docs/               # game design · arquitetura · guia white-label
```

Documentação completa: **[Game Design](docs/game-design.md)** · **[Arquitetura](docs/arquitetura.md)** · **[White-label](docs/white-label.md)**

## 🗺️ Roadmap

- [ ] **Liga por escola/turma** — ranking via Supabase (hook social da versão educacional B2B)
- [ ] Personas extras no Modo Vida Real (mãe solo, MEI, recém-formado)
- [ ] Eventos sazonais (13º, Black Friday, IR)
- [ ] Integração com a IA WhatsApp da Flamma (diagnóstico → conteúdo no jogo)
- [ ] Capacitor → App Store / Play Store

## 🧾 Licença & créditos

Produto proprietário **Flamma / Fire·ce (3 Pontos)** — todos os direitos reservados.
Arte gerada com direção própria (Recraft V4.1 vector via Higgsfield). Desenvolvido com Claude Code.

<div align="center">

**Feito com 🔥 em Indaiatuba, SP**

</div>
