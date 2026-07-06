# 🏷️ Guia White-label — Flammers para clientes Flamma

O jogo foi desenhado para ser personalizado por cliente (escola, empresa, banco parceiro) **sem tocar no motor**.

## O que se troca (e onde)

| Personalização | Arquivo | Esforço |
|---|---|---|
| Cores da marca | `css/j.css` (`:root` — 8 variáveis) | minutos |
| Logo | `assets/art/logo.svg` | minutos |
| Nome do clube/mentora | `js/j-data.js` (`CAST.re`) | minutos |
| Sonhos e valores | `js/j-data.js` (`DREAMS`) | minutos |
| Roteiros das fases | `js/j-levels.js` (JSON puro — sem código) | horas |
| Fases novas | adicionar objeto em `JLEVELS` + nó em `MAP_NODES` | horas |
| Arte de personagens/cenas | pipeline Recraft (ver arquitetura.md) | ~1 dia |
| Conteúdo do modo adulto | `js/data.js` (eventos, missões, golpes) | horas |

## Formato de uma fase (sem programação)
```json
{
  "id": "f11", "n": 11, "title": "Nome da fase", "bg": "sc-escola",
  "lesson": "Frase-resumo da lição mostrada no resultado.",
  "steps": [
    { "t": "say", "who": "re", "text": "Fala da mentora..." },
    { "t": "chat", "who": "golpista", "text": "Mensagem suspeita..." },
    { "t": "choice", "prompt": "O que você faz?", "options": [
      { "label": "Opção tentadora ruim", "coins": -20, "fb": "Consequência..." },
      { "label": "Opção sábia", "coins": 30, "fb": "Consequência boa...", "best": true }
    ]},
    { "t": "mini", "kind": "split", "total": 50, "min": 30, "max": 70,
      "prompt": "Instrução...", "win": "Feedback vitória", "lose": "Feedback derrota" },
    { "t": "quiz", "q": "Pergunta?", "options": [{"label":"A"},{"label":"B"},{"label":"C"}],
      "correct": 1, "why": "Explicação de 1 linha." }
  ]
}
```

## Minigames disponíveis (`kind`)
- `split` — slider de divisão (`total`, `min`/`max` = faixa % vencedora)
- `budget` — orçamento em slots (`budget`, `items[{n,p}]`)
- `catch` — reflexo com itens caindo (`time`, `goal`, `goods[]`, `bads[]`)
- `spot` — achar red flags num texto (`pieces[{t, flag}]`)
- `price` — precificação com demanda simulada (`cost`, `goal`)

## Checklist de entrega por cliente
1. Duplicar o repositório → projeto Vercel próprio
2. Trocar paleta, logo, mentora, sonhos
3. Revisar/adaptar roteiros (linguagem da comunidade do cliente)
4. Bump `?v=N` nos HTML + `CACHE` no `sw.js`
5. QA no celular (fluxo completo + som + offline)
