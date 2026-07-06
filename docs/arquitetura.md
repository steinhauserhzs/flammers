# 🏗️ Arquitetura — Flammers

## Princípios
1. **Zero dependências, zero build** — HTML+CSS+JS puros; deploy = copiar arquivos; roda em qualquer CDN/static host.
2. **Conteúdo separado do motor** — roteiros, elenco e economia vivem em módulos de dados (`j-data.js`, `j-levels.js`, `data.js`); trocar conteúdo não toca em engine (base do white-label).
3. **Offline-first** — PWA com service worker; arte vetorial (SVG) para peso mínimo e nitidez infinita.

## Módulos

### Jornada (jogo principal)
- **`js/j-data.js`** — `CAST` (elenco com avatar), `HEROES` (Duda/Kai), `DREAMS`, `STICKERS`, `MAP_NODES` (posições % dos nós), `JCONFIG` (economia).
- **`js/j-levels.js`** — `JLEVELS`: array de fases. Cada fase: `{id, n, title, bg, lesson, steps[]}`. Steps: `say` (who/text), `chat` (text), `choice` (prompt/options com coins/fb/best), `quiz` (q/options/correct/why), `mini` (kind + config).
- **`js/jornada.js`** — estado `J` (localStorage `flammersj_save`), telas (título/mapa/fase/resultado), runner de steps com typewriter, fila de feedbacks com emoções, `renderMini` (registry de minigames: `split`, `budget`, `catch`, `spot`, `price`), estrelas/moedas/cofre.

### Vida Real (16+)
- **`js/data.js`** — persona, dívidas, contas, eventos com `effect(api)`, follow-ups agendados, missões, imóveis, loja.
- **`js/engine.js`** — `advanceDay()` (juros diários, salário, contas, mercado, eventos, consequências emocionais), ações do jogador, save `flammers3_save`.
- **`js/ui.js`** — telas do "FlammaPhone" (apps: ZapZap, FlaBank, Metas, Trampo, InvestFla, LarLar, Shoppz, Ajustes).

### Compartilhado
- **`js/audio.js`** — `Sfx` (efeitos), `Music` (sequenciador por humor), `Ambience` (plinks por cenário). Tudo sintetizado (WebAudio), sem arquivos.
- **`sw.js`** — cache `flammers-v5`: **HTML network-first** (updates instantâneos, fallback offline) + assets cache-first. Páginas escutam `controllerchange` e recarregam 1x quando um SW novo assume.
- **Versionamento de assets** — referências `?v=N` nos HTML; **bump ao editar qualquer JS/CSS**.

## Arte (pipeline de geração)
40 SVGs gerados com **Recraft V4.1 (model_type: vector)** via Higgsfield MCP, com consistência garantida por: (1) paleta fixa passada por parâmetro `colors`, (2) `background_color` travado, (3) template de prompt por categoria (personagem/cena/ícone). Para novos assets, reusar o mesmo trio. Ícones de UI: sprite SVG autoral inline (~45 símbolos, stroke 2.2, cantos redondos).

## Save / dados
- Jornada: `flammersj_save` — `{char, name, age, dream, cofre, coins, stars{}, stickers[]}`
- Vida Real: `flammers3_save` — estado completo da simulação
- Migração futura p/ Supabase: shape JSON 1:1; ranking = tabela `scores(company_id, name, stars, cofre)`.

## Deploy
Vercel (projeto `flammers` → https://flammers-sepia.vercel.app). `vercel deploy --prod --yes` na raiz. Sem etapa de build.
