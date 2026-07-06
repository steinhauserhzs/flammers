# 🎲 Game Design — Flammers

## Visão
Educação financeira brasileira para 10–17 anos, competindo em engajamento com jogos casuais — não com apostilas. Princípio central: **a lição emerge da consequência**. As opções erradas são escritas para *parecerem atraentes* (urgência, desconto absurdo, "todo mundo tá fazendo"), como na vida real.

## Modo principal: A Jornada
**Loop:** Mapa → Fase (2–4 min) → Resultado (estrelas + moedas) → decisão do Cofre → Mapa.

### Estrutura de uma fase (visual novel + interação)
`say` (diálogo com retrato animado) → `chat` (mensagens de celular na cena — golpes chegam assim) → `choice` (3 opções, 1 `best`; efeitos em moedas) → `mini` (minigame) → `quiz` (1 pergunta, explicação de 1 linha) → fechamento da Rê sem sermão.

### Estrelas
- ⭐⭐⭐ todas as melhores escolhas + minigame + quiz certo
- ⭐⭐ quiz certo OU ≥1 melhor escolha
- ⭐ completou
Replay permitido (moedas a 40% — anti-farm; estrelas podem melhorar).

### As 10 fases e suas lições
| # | Fase | Cenário | Lição | Minigame |
|---|---|---|---|---|
| 1 | A Mesada | quarto | necessidade × desejo; dividir gastar/guardar | slider de divisão |
| 2 | Missão Lanche | cantina | orçamento semanal | montar a semana ≤ R$ 25 |
| 3 | O Sonho | quarto | meta com valor + prazo | — |
| 4 | Empresta aí! | escola | juros predatórios entre colegas | — |
| 5 | O Golpe da Skin | quarto | golpe online (urgência+PIX+preço absurdo) | caça-sinais no anúncio |
| 6 | Brigadeiro S.A. | escola | custo, preço e lucro justo | precificação com demanda simulada |
| 7 | Black Friday Gamer | shopping | promoção real × falsa | reflexo: pegar ofertas reais |
| 8 | Pirâmide de Figurinhas | escola | esquema Ponzi | — |
| 9 | O Cofrinho que Cresce | rua | rendimento; dinheiro parado encolhe | reflexo: dinheiro que rende |
| 10 | O Grande Dia | parque | revisão + celebração | — |

### Sistemas de meta-progressão
- **Cofre dos Sonhos**: sonho escolhido (R$ 350–500); fim de fase = decisão *guardar tudo / metade*; sonho completo = celebração + novo sonho (loop infinito).
- **Lojinha**: gasta só as "moedas livres" (o que NÃO foi pro cofre) — gastar é escolha, não pecado.
- **Emoções**: retrato do protagonista reage (feliz/triste/choque) ao resultado de cada jogada.

## Modo Vida Real (16+)
Simulador: o jogador assume o celular de **Jô** (27, CLT, R$ 8.000 no rotativo a 13,5%/mês) até o **F.I.R.E.** (renda passiva líquida ≥ custo de vida). Juros correm POR DIA; golpes com follow-up de longo prazo (a pirâmide *paga o 1º rendimento* antes do rug pull); mesa de negociação de dívida com matemática real; imóveis com leilão de risco oculto, reforma, vacância e manutenção; investimentos com liquidez travada; burnout e compra por impulso (saúde emocional é estratégia financeira); bônus diário por data real + streak.

### Balanceamento auditado
3 agentes críticos independentes auditaram economia/retención/UX; exploits corrigidos: FIRE alavancado (renda passiva agora é líquida de parcelas), loop turno-extra+folga, lazer grátis infinito, cripto com EV positivo, imóvel sem fricção, ausência de fail-state (negativação em espiral implementada).

## Trilha sonora (generativa, WebAudio)
- `theme` (mapa): sequenciador I–V–vi–IV animado · `chill` (fases normais) · `tense` (fases de golpe)
- Ambiências por cenário: plinks aleatórios parametrizados (passarinhos no parque, burburinho na escola, louça na cantina)
- Mute persistente em 3 pontos da UI (mapa, fase, ajustes)
