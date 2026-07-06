/* FLAMMERS Jornada — roteiros das 10 fases (gerado + curado + minigames) */
const JLEVELS = [
 {
  "id": "f1",
  "n": 1,
  "title": "A Mesada",
  "topic": "Necessidade vs desejo",
  "bg": "sc-quarto",
  "lesson": "Divida a grana entre gastar e guardar — e aprenda a separar o que você PRECISA do que você só QUER.",
  "steps": [
   {
    "t": "say",
    "who": "nar",
    "text": "Sábado de manhã. Seu quarto. Dia de mesada — oficialmente o melhor dia do mês."
   },
   {
    "t": "say",
    "who": "mae",
    "text": "Toma, meu amor: R$ 50. Esse mês você administra sozinho, combinado?"
   },
   {
    "t": "say",
    "who": "voce",
    "text": "R$ 50?! Tô rico! Digo... tô com uma quantia interessante."
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Seu celular vibra. É o Betinho. Claro que é o Betinho."
   },
   {
    "t": "chat",
    "who": "betinho",
    "text": "PRIMO. soube da mesada 👀"
   },
   {
    "t": "chat",
    "who": "betinho",
    "text": "torra tudo hoje. saiu skin nova no jogo. dinheiro parado é dinheiro triste"
   },
   {
    "t": "choice",
    "prompt": "R$ 50 na mão e o Betinho no ouvido. Qual é o plano?",
    "options": [
     {
      "label": "Torrar tudo na skin",
      "coins": -30,
      "fb": "Skin linda. A alegria durou um domingo. Segunda-feira: R$ 0 e um mês inteiro pela frente."
     },
     {
      "label": "Guardar TUDO, não gastar nem R$ 1",
      "coins": 0,
      "fb": "Três dias depois você surtou e gastou sem plano nenhum. Aperto demais estoura."
     },
     {
      "label": "Dividir: uma parte pra gastar, outra pra guardar",
      "coins": 30,
      "fb": "R$ 30 pra curtir, R$ 20 guardados. O Betinho te chamou de 'contador mirim'. Você aceitou o título.",
      "best": true
     }
    ]
   },
   {
    "t": "mini",
    "kind": "split",
    "total": 50,
    "min": 30,
    "max": 70,
    "prompt": "Desafio prático: arrasta a barrinha e divide os R$ 50 da mesada. Quanto vai pra GASTAR e quanto vai pra GUARDAR?",
    "sub": "Dica: nem 8, nem 80 — quem guarda entre 30% e 70% mantém o plano E a vida.",
    "win": "Divisão equilibrada! Dá pra curtir o mês e o cofre cresce. É exatamente assim que se faz.",
    "lose": "Hmm, ficou desequilibrado: ou aperta demais (e você desiste), ou não sobra nada pro sonho."
   },
   {
    "t": "chat",
    "who": "re",
    "text": "aí, mesada chegou? teste rápido do clube: skin de jogo é necessidade ou desejo? 😄"
   },
   {
    "t": "say",
    "who": "voce",
    "text": "Hmm... desejo. Mas um desejo MUITO convincente."
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Mais tarde, um anúncio invade seu celular: fone gamer com luzinha RGB. R$ 45. 'SÓ HOJE'."
   },
   {
    "t": "choice",
    "prompt": "O fone tem luzinha. LUZINHA. E aí?",
    "options": [
     {
      "label": "Comprar AGORA, é só hoje!",
      "coins": -25,
      "fb": "Spoiler: semana seguinte tinha 'SÓ HOJE' de novo. É sempre só hoje."
     },
     {
      "label": "Print e esperar 7 dias pra ver se ainda quer",
      "coins": 25,
      "fb": "Sete dias depois você nem lembrava do fone. A luzinha apagou sozinha da sua cabeça.",
      "best": true
     },
     {
      "label": "Pedir pra mãe pagar metade",
      "coins": -5,
      "fb": "Ela riu por 40 segundos e disse: 'a mesada é sua, a decisão também'. Justo."
     }
    ]
   },
   {
    "t": "quiz",
    "q": "Qual dessas é uma NECESSIDADE de verdade?",
    "options": [
     {
      "label": "Fone com luzinha RGB"
     },
     {
      "label": "Material da escola que acabou"
     },
     {
      "label": "Skin nova do jogo"
     }
    ],
    "correct": 1,
    "why": "Necessidade é o que você precisa pra viver e estudar; o resto é desejo — pode ter, mas entra depois no plano."
   },
   {
    "t": "say",
    "who": "re",
    "text": "O segredo que ninguém te conta: não é sobre nunca gastar. É sobre gastar sabendo. Dividiu, curtiu, guardou? Tá jogando o jogo certo."
   }
  ]
 },
 {
  "id": "f2",
  "n": 2,
  "title": "Missão Lanche",
  "topic": "Orçamento da semana",
  "bg": "sc-cantina",
  "lesson": "Planejar antes de gastar: R$ 25 dividido por 5 dias só fecha se VOCÊ mandar no dinheiro, não a tentação.",
  "steps": [
   {
    "t": "say",
    "who": "nar",
    "text": "Segunda-feira. Sua mãe te deu R$ 25 pra semana inteira de lanche. Cinco dias. Uma cantina. Mil tentações."
   },
   {
    "t": "say",
    "who": "mae",
    "text": "R$ 25 até sexta. Se acabar antes, o lanche vira água da torneira e força de vontade."
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Na cantina, Dona Cida já te viu chegando de longe."
   },
   {
    "t": "say",
    "who": "cida",
    "text": "Cheguei com novidade! Combo Turbo: hambúrguer, batata e refri por R$ 12. Tá voando, meu bem!"
   },
   {
    "t": "say",
    "who": "voce",
    "text": "R$ 12... isso é quase metade da minha semana num lanche só."
   },
   {
    "t": "choice",
    "prompt": "Segunda-feira, R$ 25 no bolso. Qual vai ser?",
    "options": [
     {
      "label": "Combo Turbo, óbvio. Segunda pede.",
      "coins": -25,
      "fb": "Delícia absoluta. Mas agora sobraram R$ 13 pra 4 dias. A matemática te encarou feio."
     },
     {
      "label": "Salgado + suco: R$ 5 cravado",
      "coins": 30,
      "fb": "R$ 5 por dia, 5 dias, conta fechada. Dona Cida piscou tipo 'esse aí vai longe'.",
      "best": true
     },
     {
      "label": "Não como nada, economizo tudo",
      "coins": -10,
      "fb": "Na terceira aula seu estômago fez som de baleia. Você comprou o dobro no desespero."
     }
    ]
   },
   {
    "t": "mini",
    "kind": "budget",
    "budget": 25,
    "prompt": "Agora é com você: monte a semana de lanches da cantina. Toca em cada dia pra trocar o lanche. Fecha em R$ 25 ou menos!",
    "sub": "Toque nos dias pra trocar: fruta R$ 3 · salgado+suco R$ 5 · brownie R$ 8 · Combo Turbo R$ 12",
    "win": "Semana fechada dentro do orçamento! Você acabou de fazer o que metade dos adultos não faz.",
    "lose": "Estourou o orçamento… quinta e sexta iam ser no pão com vento. Bora reequilibrar na próxima!"
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Quarta-feira. Você segue vivo e com dinheiro no bolso. Mas Dona Cida tem planos."
   },
   {
    "t": "say",
    "who": "cida",
    "text": "Saiu brownie AGORA do forno. R$ 6. Sinta esse cheiro. SINTA."
   },
   {
    "t": "chat",
    "who": "betinho",
    "text": "primo compra 2 brownie e guarda 1 pra mim. te pago dps, confia"
   },
   {
    "t": "choice",
    "prompt": "O cheiro do brownie é uma arma. Você tem R$ 15 pra 3 dias.",
    "options": [
     {
      "label": "Dois brownies, um 'fiado' pro Betinho",
      "coins": -30,
      "fb": "R$ 12 a menos, e o 'te pago dps' do Betinho nunca chegou. Guarda essa informação."
     },
     {
      "label": "Um brownie hoje, lanche mais barato amanhã",
      "coins": 20,
      "fb": "Comeu o brownie SEM culpa, porque já sabia de onde o dinheiro ia sair. Isso tem nome: plano.",
      "best": true
     },
     {
      "label": "Brownie todo dia até sexta",
      "coins": -20,
      "fb": "Quinta-feira: R$ 0. O cheiro do brownie virou só lembrança."
     }
    ]
   },
   {
    "t": "quiz",
    "q": "R$ 25 pra 5 dias de lanche. Quanto dá pra gastar por dia sem furar?",
    "options": [
     {
      "label": "R$ 5"
     },
     {
      "label": "R$ 10"
     },
     {
      "label": "R$ 12"
     }
    ],
    "correct": 0,
    "why": "25 dividido por 5 dá 5 — se gastar mais num dia, tem que gastar menos no outro."
   },
   {
    "t": "say",
    "who": "re",
    "text": "Orçamento é isso: decidir ANTES pra não chorar depois. O brownie pode entrar, sim — desde que seja você mandando no dinheiro, e não o cheiro mandando em você."
   }
  ]
 },
 {
  "id": "f3",
  "n": 3,
  "title": "O Sonho",
  "topic": "Meta de poupança",
  "bg": "sc-quarto",
  "lesson": "Sonho vira projeto quando ganha valor e prazo — e um quanto-por-mês que cabe na sua vida.",
  "steps": [
   {
    "t": "say",
    "who": "nar",
    "text": "Noite de domingo. Você, o teto do quarto e um pensamento gigante: 'eu QUERO muito uma coisa'."
   },
   {
    "t": "say",
    "who": "voce",
    "text": "Uma bike nova... ou aquele jogo... Sonhar é grátis. Realizar é que custa."
   },
   {
    "t": "chat",
    "who": "re",
    "text": "boa noite, clube! tarefa da semana: escolher UM sonho e botar preço nele 💰"
   },
   {
    "t": "chat",
    "who": "re",
    "text": "abre o Cofre dos Sonhos no app: você define valor e prazo, ele mostra quanto guardar por mês. mágica? não. matemática."
   },
   {
    "t": "say",
    "who": "voce",
    "text": "Cofre dos Sonhos... beleza, vamos ver se essa mágica-matemática funciona."
   },
   {
    "t": "choice",
    "prompt": "Primeiro passo: qual sonho entra no Cofre?",
    "options": [
     {
      "label": "Console novo: R$ 4.000 em 1 mês",
      "coins": -20,
      "fb": "O app calculou: R$ 1.000 por semana. Sua mesada chorou. Meta impossível não motiva — desanima."
     },
     {
      "label": "Bike usada: R$ 600 em 6 meses",
      "coins": 30,
      "fb": "R$ 100 por mês. Difícil? Sim. Impossível? Não. O Cofre até soltou confete na tela.",
      "best": true
     },
     {
      "label": "Vou guardando aí, sem meta, o que der",
      "coins": -10,
      "fb": "Sem valor e sem prazo, 'o que der' deu em nada. Três semanas depois você nem lembrava do sonho."
     }
    ]
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Meta escolhida. Agora a pergunta que separa sonhadores de realizadores: quanto guardar da mesada?"
   },
   {
    "t": "choice",
    "prompt": "R$ 50 de mesada por mês. Quanto vai pro Cofre?",
    "options": [
     {
      "label": "Os R$ 50 inteiros, sem dó",
      "coins": -15,
      "fb": "Durou um mês. No segundo, sem nenhum real pra vida, você desistiu do plano todo. Aperto demais quebra."
     },
     {
      "label": "R$ 25: metade pro sonho, metade pra viver",
      "coins": 30,
      "fb": "Sustentável: dá pra manter por meses sem sofrer. Somando o que você economiza no lanche, a bike se aproxima.",
      "best": true
     },
     {
      "label": "R$ 5, só pra dizer que guardei",
      "coins": -5,
      "fb": "Nesse ritmo a bike chega quando você tiver 24 anos. E já tiver carro."
     }
    ]
   },
   {
    "t": "chat",
    "who": "betinho",
    "text": "primo ouvi dizer q vc ta POUPANDO 😂 sábado tem rolê no shopping, vai fugir?"
   },
   {
    "t": "say",
    "who": "voce",
    "text": "Vou no rolê. Mas o Cofre vai junto, na minha cabeça."
   },
   {
    "t": "quiz",
    "q": "O que uma meta de verdade precisa ter?",
    "options": [
     {
      "label": "Valor e prazo"
     },
     {
      "label": "Sorte e paciência"
     },
     {
      "label": "Um nome bonito"
     }
    ],
    "correct": 0,
    "why": "Sem valor você não sabe quanto falta; sem prazo, não sabe quanto guardar por mês."
   },
   {
    "t": "say",
    "who": "re",
    "text": "Sonho sem plano é só desejo dando voltas na cabeça. Botou valor e prazo? Virou projeto. E projeto, meu bem, a gente executa."
   }
  ]
 },
 {
  "id": "f4",
  "n": 4,
  "title": "Empresta aí!",
  "topic": "Empréstimos e juros",
  "bg": "sc-escola",
  "lesson": "Só empreste o que pode perder sem drama — e desconfie de qualquer 'lucro fácil': juros são o aluguel do dinheiro.",
  "steps": [
   {
    "t": "say",
    "who": "nar",
    "text": "Terça-feira, recreio. Você está com R$ 20 na mochila — parte do plano da bike. O Betinho estuda na mesma escola. Infelizmente pra sua carteira."
   },
   {
    "t": "say",
    "who": "betinho",
    "text": "Primo! Negócio da China: me empresta R$ 10 que semana que vem te devolvo R$ 15. LUCRO. Você basicamente vira um banco."
   },
   {
    "t": "say",
    "who": "voce",
    "text": "R$ 5 de graça...? Espera. Por que ninguém MAIS te emprestou?"
   },
   {
    "t": "say",
    "who": "betinho",
    "text": "Detalhes, primo. Foca no lucro."
   },
   {
    "t": "choice",
    "prompt": "Virar o 'banco do Betinho'. Aceita?",
    "options": [
     {
      "label": "Empresto R$ 20: lucro em dobro!",
      "coins": -30,
      "fb": "'Semana que vem' virou 'mês que vem'. O lucro em dobro virou prejuízo inteiro — e o plano da bike sangrou."
     },
     {
      "label": "Empresto os R$ 10 combinados",
      "coins": -15,
      "fb": "Betinho sumiu igual promessa de ano novo. Os R$ 10 viraram lenda urbana."
     },
     {
      "label": "Empresto R$ 5 — o que dá pra perder sem chorar",
      "coins": 15,
      "fb": "Você emprestou já sabendo que podia não voltar. Não voltou. Mas seu plano continuou de pé.",
      "best": true
     }
    ]
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Uma semana depois. Nenhum real devolvido. E o Betinho reaparece... sorrindo."
   },
   {
    "t": "say",
    "who": "betinho",
    "text": "Primo, deu um imprevisto. MAS tenho a solução: me empresta mais R$ 20 que aí te devolvo R$ 40 de uma vez. DOBROU!"
   },
   {
    "t": "say",
    "who": "voce",
    "text": "Deixa eu ver se entendi: você me deve... e a solução é me dever MAIS?"
   },
   {
    "t": "choice",
    "prompt": "A nova oferta 'imperdível' do Betinho. E agora?",
    "options": [
     {
      "label": "Empresto de novo pra recuperar o que perdi",
      "coins": -30,
      "fb": "Emprestar de novo pra quem não pagou é jogar dinheiro bom atrás de dinheiro perdido. Adivinha: perdeu de novo."
     },
     {
      "label": "Cobro numa boa e não empresto mais nada",
      "coins": 25,
      "fb": "'Betinho, primeiro o que você me deve. Depois a gente conversa.' Ele reclamou, mas te olhou com respeito.",
      "best": true
     },
     {
      "label": "Faço barraco no meio do pátio",
      "coins": -10,
      "fb": "Virou meme da escola por três dias. O dinheiro? Continua sem voltar."
     }
    ]
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Na saída, você encontra a Rê e conta a saga completa."
   },
   {
    "t": "say",
    "who": "re",
    "text": "Deixa eu adivinhar: 'te devolvo mais do que peguei'? Isso tem nome: juros. É o preço de usar o dinheiro dos outros. Banco cobra, cartão cobra... e o Betinho prometeu e não pagou."
   },
   {
    "t": "quiz",
    "q": "O que são juros?",
    "options": [
     {
      "label": "Um valor extra pago em cima do dinheiro emprestado"
     },
     {
      "label": "Uma taxa que só banco pode cobrar"
     },
     {
      "label": "Multa por atrasar a lição de casa"
     }
    ],
    "correct": 0,
    "why": "Juros são o 'aluguel' do dinheiro: quem pega emprestado paga a mais pelo tempo que usou."
   },
   {
    "t": "say",
    "who": "re",
    "text": "Regra de ouro: só empresta o que pode perder sem drama. E quando alguém oferecer lucro fácil demais... segura a carteira e pergunta o porquê."
   }
  ]
 },
 {
  "id": "f5",
  "n": 5,
  "title": "O Golpe da Skin",
  "topic": "golpe online",
  "bg": "sc-quarto",
  "lesson": "Preço bom demais + urgência + PIX antecipado = golpe. Ninguém honesto te proíbe de pensar antes de pagar.",
  "steps": [
   {
    "t": "say",
    "who": "nar",
    "text": "Sexta à noite. Você tá no quarto grindando no jogo quando chega uma mensagem de um perfil que você nunca viu na vida."
   },
   {
    "t": "chat",
    "who": "golpista",
    "text": "opa!! vi q vc quer a skin DRAGÃO NEBULOSO neh... tenho uma conta com ela pra vender"
   },
   {
    "t": "chat",
    "who": "golpista",
    "text": "na loja custa R$250. te faço por R$25 no pix. mas tem q ser AGORA pq tem 2 caras me chamando"
   },
   {
    "t": "say",
    "who": "voce",
    "text": "R$ 25?? Eu tô juntando pra essa skin há DOIS MESES. Isso é um sinal do universo... ou não?"
   },
   {
    "t": "say",
    "who": "betinho",
    "text": "Compra, primo! 90% de desconto! Eu compraria com o SEU dinheiro sem nem piscar."
   },
   {
    "t": "choice",
    "prompt": "O cara tá esperando sua resposta. O que você faz?",
    "options": [
     {
      "label": "Fazer o PIX agora antes que acabe",
      "coins": -30,
      "fb": "Você paga. Três segundos depois: bloqueado. A skin nunca existiu, e seu dinheiro virou lenda urbana."
     },
     {
      "label": "Pedir print da skin como prova",
      "coins": -10,
      "fb": "Ele manda um print... tirado do Google. Você gastou meia hora negociando com um golpista que nem sabe recortar imagem."
     },
     {
      "label": "Dizer: 'só pago depois de receber'",
      "coins": 10,
      "fb": "Ele muda na hora: começa a te apressar e te xingar. Golpista ODEIA gente que pensa antes de pagar.",
      "best": true
     }
    ]
   },
   {
    "t": "mini",
    "kind": "spot",
    "flags": 3,
    "prompt": "Olha o print do anúncio da tal skin. Toca nos 3 sinais de GOLPE escondidos nele!",
    "pieces": [
     {
      "t": "⭐ SKIN LENDÁRIA DRAGON FIRE ⭐",
      "flag": false
     },
     {
      "t": "de R$ 80 por R$ 9,90 (88% OFF!!)",
      "flag": true
     },
     {
      "t": "Vendedor: DragonSeller_2026 (conta criada ontem)",
      "flag": true
     },
     {
      "t": "“entrego em 5 minutos”",
      "flag": false
     },
     {
      "t": "SÓ HOJE!! Pague AGORA no PIX antes que acabe!!",
      "flag": true
     },
     {
      "t": "+3.000 curtidas no post",
      "flag": false
     }
    ],
    "win": "TRÊS sinais achados: desconto absurdo, conta recém-criada e pressa + PIX. Golpista não passa por você!",
    "lose": "Alguns sinais passaram batido. Grava o trio do golpe: preço bom DEMAIS + vendedor sem histórico + URGÊNCIA no PIX."
   },
   {
    "t": "chat",
    "who": "golpista",
    "text": "mano vc vai PERDER, últimos 5 minutos!!! o outro comprador já ta com o pix aberto, decide LOGO"
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Seu coração acelera. A pressa dele virou a sua pressa. É exatamente assim que funciona."
   },
   {
    "t": "choice",
    "prompt": "Ele tá apertando. Decisão final:",
    "options": [
     {
      "label": "Tá bom!! Fazendo o PIX",
      "coins": -30,
      "fb": "Adeus, R$ 25. O 'outro comprador' nunca existiu. A pressa era o produto."
     },
     {
      "label": "Propor pagar metade antes, metade depois",
      "coins": -15,
      "fb": "Ele aceita NA HORA. Golpista aceita qualquer plano que comece com você pagando. A metade sumiu junto com ele."
     },
     {
      "label": "Bloquear e denunciar o perfil",
      "coins": 20,
      "fb": "Você denuncia. No dia seguinte o perfil já era — junto com o dinheiro de quem caiu. O seu continua no lugar.",
      "best": true
     }
    ]
   },
   {
    "t": "quiz",
    "q": "Qual combinação grita GOLPE?",
    "options": [
     {
      "label": "Desconto absurdo + pressa + PIX antecipado"
     },
     {
      "label": "Loja oficial com preço normal"
     },
     {
      "label": "Vendedor que aceita você pagar depois de receber"
     }
    ],
    "correct": 0,
    "why": "O golpista precisa que você pague rápido, sem pensar e sem garantia nenhuma — os três juntos são a receita clássica."
   },
   {
    "t": "say",
    "who": "re",
    "text": "Anota aí: R$ 250 por R$ 25 não é desconto, é isca. E quando alguém te proíbe de pensar, é porque pensar estraga o plano DELE. Skin rara você compra na loja; história triste é de graça."
   }
  ]
 },
 {
  "id": "f6",
  "n": 6,
  "title": "Brigadeiro S.A.",
  "topic": "empreendedorismo e precificação",
  "bg": "sc-escola",
  "lesson": "Preço certo = custo dos ingredientes + seu trabalho + lucro justo. Quem não conhece o próprio custo vende prejuízo com sorriso.",
  "steps": [
   {
    "t": "say",
    "who": "nar",
    "text": "Semana da festa junina na escola. Você teve uma ideia: vender brigadeiro no intervalo. Hora de virar CEO da panela."
   },
   {
    "t": "say",
    "who": "voce",
    "text": "Brigadeiro se vende sozinho. Eu só preciso descobrir... tipo, tudo sobre como vender brigadeiro."
   },
   {
    "t": "say",
    "who": "mae",
    "text": "Vamos às contas: leite condensado, chocolate, manteiga e forminha deram R$ 24. Rende 40 brigadeiros. Ou seja: cada um te custa 60 centavos ANTES de você ganhar qualquer coisa."
   },
   {
    "t": "say",
    "who": "betinho",
    "text": "Vende a 50 centavos! Mais barato que todo mundo, vende os 40 em dez minutos. Confia no primo, eu quase fiz um curso de negócios."
   },
   {
    "t": "choice",
    "prompt": "Qual vai ser o preço do seu brigadeiro?",
    "options": [
     {
      "label": "R$ 0,50 — o plano do Betinho",
      "coins": -20,
      "fb": "Vendeu TUDO em dez minutos. Detalhe: cada um custou 0,60 e você vendeu por 0,50. Parabéns, você pagou pra trabalhar."
     },
     {
      "label": "R$ 2,00 — custo + trabalho + lucro",
      "coins": 30,
      "fb": "0,60 de custo, o resto paga seu tempo mexendo panela e ainda sobra lucro de verdade. Vendeu bem e saiu no azul.",
      "best": true
     },
     {
      "label": "R$ 5,00 — é GOURMET, uai",
      "coins": -10,
      "fb": "Duas pessoas compraram por curiosidade. O resto da fila foi comprar da menina do 8º ano que cobra R$ 2."
     }
    ]
   },
   {
    "t": "mini",
    "kind": "price",
    "cost": 2,
    "goal": 90,
    "prompt": "Hora de precificar o brigadeiro! Cada um custa R$ 2 pra fazer. Ajusta o preço e olha o que acontece com as vendas.",
    "sub": "Preço alto = vende menos. Preço baixo = lucro fininho. Ache o ponto certo!",
    "win": "Preço redondo: cobre o custo, o cliente paga sorrindo e o lucro aparece. Empreendedor nato!",
    "lose": "Esse preço não fecha a conta: ou espanta a clientela, ou você trabalha de graça. Ajusta na próxima fornada!"
   },
   {
    "t": "say",
    "who": "cida",
    "text": "Vendendo na porta da minha cantina, é? Vou deixar... porque gostei de você. Trinta anos nesse balcão me ensinaram uma coisa: quem não sabe quanto custa o que vende, tá distribuindo prejuízo com sorriso no rosto."
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Fim do intervalo. Você olha o dinheiro na mão: deu bom. Agora vem a parte que separa negócio de festa."
   },
   {
    "t": "choice",
    "prompt": "E o dinheiro da venda, faz o quê com ele?",
    "options": [
     {
      "label": "Gastar tudo em açaí pra comemorar",
      "coins": -15,
      "fb": "O açaí estava ótimo. Amanhã você quer produzir de novo e... cadê o dinheiro do leite condensado? A empresa faliu de felicidade."
     },
     {
      "label": "Separar o custo de amanhã primeiro, lucro depois",
      "coins": 25,
      "fb": "Isso tem nome chique: capital de giro. Amanhã você compra ingrediente com o dinheiro do negócio e o lucro é seu de verdade.",
      "best": true
     },
     {
      "label": "Fazer promoção 'leve 3, pague 1' pra bombar",
      "coins": -20,
      "fb": "A fila te amou. Sua carteira, nem tanto: você basicamente doou o lucro pra parecer popular."
     }
    ]
   },
   {
    "t": "quiz",
    "q": "O preço certo de um produto precisa cobrir o quê?",
    "options": [
     {
      "label": "Só os ingredientes"
     },
     {
      "label": "Ingredientes + seu trabalho + um lucro justo"
     },
     {
      "label": "O que der na cabeça, preço é vibe"
     }
    ],
    "correct": 1,
    "why": "Se o preço só cobre o ingrediente, seu trabalho saiu de graça — e sem lucro não existe negócio, existe hobby caro."
   },
   {
    "t": "say",
    "who": "re",
    "text": "Viu o que aconteceu com o preço do Betinho? Vender rápido é fácil: difícil é vender e SOBRAR dinheiro. Custo, trabalho, lucro. Essa continha de três partes vale pra brigadeiro e vale pra empresa gigante."
   }
  ]
 },
 {
  "id": "f7",
  "n": 7,
  "title": "Black Friday Gamer",
  "topic": "promoção real vs falsa",
  "bg": "sc-shopping",
  "lesson": "Antes de comprar em promoção: pesquise o histórico de preço e a reputação da loja. Desconto absurdo em loja desconhecida é armadilha, não sorte.",
  "steps": [
   {
    "t": "say",
    "who": "nar",
    "text": "Novembro. O shopping virou um festival de cartaz amarelo gritando OFERTA. Seu alvo: o jogo dos sonhos, Cyber Quest, que custa R$ 300."
   },
   {
    "t": "say",
    "who": "voce",
    "text": "Cyber Quest na Black Friday. Hoje eu não sou uma pessoa, sou uma missão."
   },
   {
    "t": "say",
    "who": "betinho",
    "text": "Primo! Achei um site com 70% OFF: R$ 89! Chama 'MegaGamerBaratasso.net'. Nunca ouvi falar, mas barato desse jeito não pode ser mentira, né?"
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Enquanto isso, a loja de games do shopping — aquela que existe desde sempre — anuncia 20% off: R$ 240."
   },
   {
    "t": "choice",
    "prompt": "70% off no site misterioso ou 20% na loja de verdade. E agora?",
    "options": [
     {
      "label": "Comprar no site com 70% off, óbvio",
      "coins": -30,
      "fb": "Seu pedido está 'em processamento'... até hoje. O site sumiu e o CNPJ era de uma loja de ração que fechou em 2019."
     },
     {
      "label": "Pesquisar histórico de preço e reputação antes",
      "coins": 20,
      "fb": "Cinco minutos de pesquisa: o jogo nunca custou menos de R$ 200, e o site tem 47 reclamações de 'pagou e nunca chegou'. Bala desviada.",
      "best": true
     },
     {
      "label": "Comprar direto na loja do shopping, sem pesquisar",
      "coins": 0,
      "fb": "Deu certo, mas você nem sabe se os 20% eram desconto real. Dessa vez foi sorte — e sorte não é método."
     }
    ]
   },
   {
    "t": "mini",
    "kind": "catch",
    "time": 12,
    "goal": 40,
    "goods": [
     "-20% real",
     "cupom OK",
     "preço justo"
    ],
    "bads": [
     "70% OFF??",
     "loja.shop",
     "só no PIX"
    ],
    "prompt": "Chuva de ofertas de Black Friday! TOCA nas promoções DE VERDADE e deixa as furadas caírem!",
    "sub": "Ofertas reais valem +10. Tocar em furada custa −15. Faça 40 pontos!",
    "win": "Olho clínico! Você separou promoção real de teatro de desconto.",
    "lose": "Algumas furadas te fisgaram. Na dúvida: pesquisa o histórico de preço ANTES de tocar no botão de comprar."
   },
   {
    "t": "say",
    "who": "re",
    "text": "Sabia que tem loja que AUMENTA o preço em outubro pra 'baixar' em novembro? É o famoso 'metade do dobro'. Por isso quem manda não é o cartaz, é o histórico de preço."
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Você checa um site de histórico de preços: Cyber Quest custava R$ 260 mês passado. Ou seja, os R$ 240 da loja conhecida são desconto de verdade — pequeno, mas real."
   },
   {
    "t": "choice",
    "prompt": "Com a pesquisa na mão, qual é a jogada?",
    "options": [
     {
      "label": "Comprar na loja conhecida por R$ 240",
      "coins": 25,
      "fb": "Desconto real confirmado, nota fiscal, loja que existe fisicamente. Comprar sem emoção e com recibo: isso é Black Friday adulta.",
      "best": true
     },
     {
      "label": "Esperar cair pra 90% off, vai que",
      "coins": -10,
      "fb": "O estoque acabou, a Black Friday também, e o preço voltou pros R$ 300. Esperar um desconto que não existe também custa caro."
     },
     {
      "label": "Arriscar o site misterioso com o cartão da mãe",
      "coins": -30,
      "fb": "Combo perfeito: jogo que não chega + dados do cartão da sua mãe vazados. Agora você deve dinheiro E explicações."
     }
    ]
   },
   {
    "t": "quiz",
    "q": "Como saber se um desconto de Black Friday é real?",
    "options": [
     {
      "label": "Se o número for bem grande, é real"
     },
     {
      "label": "Comparando com o histórico de preço do produto"
     },
     {
      "label": "Se a loja tiver luz piscando e locutor gritando"
     }
    ],
    "correct": 1,
    "why": "Desconto só existe em relação ao preço de antes — se você não sabe o preço de antes, o cartaz pode inventar qualquer número."
   },
   {
    "t": "say",
    "who": "re",
    "text": "Moral da Black Friday: o desconto gigante do site fantasma custava R$ 89 e entregava zero jogo. Os 20% chatinhos entregaram o jogo, a nota e a paz. Pesquisar 5 minutos rende mais que qualquer cupom."
   }
  ]
 },
 {
  "id": "f8",
  "n": 8,
  "title": "A Pirâmide de Figurinhas",
  "topic": "Esquema de pirâmide (Ponzi)",
  "bg": "sc-escola",
  "lesson": "Quando o ganho vem de trazer gente nova, e não de um produto de verdade, é pirâmide — e alguém sempre fica sem cadeira.",
  "steps": [
   {
    "t": "say",
    "who": "nar",
    "text": "Segunda-feira. A escola inteira só fala de uma coisa: o Clube da Figurinha Dourada."
   },
   {
    "t": "say",
    "who": "betinho",
    "text": "Primo! Entra no Clube da Figurinha Dourada. Você põe 10 figurinhas raras e recebe 30 de volta. TRINTA."
   },
   {
    "t": "say",
    "who": "voce",
    "text": "Peraí. Eu dou 10 e recebo 30? Quem tá pagando essa conta?"
   },
   {
    "t": "say",
    "who": "betinho",
    "text": "Ninguém paga, é o sistema! Você só precisa trazer 2 amigos. Cada um traz mais 2. É matemática, primo."
   },
   {
    "t": "choice",
    "prompt": "O Betinho tá esperando sua resposta. E a fila pra entrar no clube só cresce.",
    "options": [
     {
      "label": "Entro! 30 figurinhas é 30 figurinhas",
      "coins": -25,
      "fb": "Você entregou suas 10 raras. Agora 'só' falta convencer 2 amigos... e torcer muito."
     },
     {
      "label": "Pergunto: de onde saem as figurinhas extras?",
      "coins": 10,
      "fb": "Silêncio. O Betinho gaguejou. Ninguém no clube sabia responder. Suspeito.",
      "best": true
     },
     {
      "label": "Entro e já chamo a sala inteira",
      "coins": -30,
      "fb": "Você virou garoto-propaganda de graça. Se der ruim, a culpa vai vir com o seu nome."
     }
    ]
   },
   {
    "t": "say",
    "who": "re",
    "text": "Deixa eu te fazer UMA pergunta: esse clube vende alguma coisa? Produz figurinha? Não? Então o prêmio de quem entrou antes sai do bolso de quem entra depois."
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Duas semanas depois. A escola tem 500 alunos. Pelas contas do sistema, o clube já precisa de 1000 membros novos pra pagar todo mundo."
   },
   {
    "t": "chat",
    "who": "betinho",
    "text": "primo. socorro. ngm mais quer entrar"
   },
   {
    "t": "chat",
    "who": "betinho",
    "text": "se eu não trouxer 2 pessoas até sexta eu perco minhas 10 raras 😭"
   },
   {
    "t": "choice",
    "prompt": "O Betinho implora: 'convence a galera do futsal, você é popular!'",
    "options": [
     {
      "label": "Convenço a galera do futsal",
      "coins": -20,
      "fb": "Eles entraram, perderam tudo, e agora te encaram estranho no treino. Clima ótimo."
     },
     {
      "label": "Falo pro Betinho aceitar o prejuízo e sair",
      "coins": 15,
      "fb": "Doeu, mas ele perdeu só 10 figurinhas. Quem insistiu perdeu 10... e os amigos.",
      "best": true
     },
     {
      "label": "Ponho mais 10 figurinhas pra segurar o clube",
      "coins": -30,
      "fb": "Você jogou figurinha boa em cima de figurinha perdida. O clube caiu do mesmo jeito."
     }
    ]
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Sexta-feira. O fundador do clube sumiu com uma mochila cheia de figurinhas raras. Fim do Clube da Figurinha Dourada."
   },
   {
    "t": "say",
    "who": "betinho",
    "text": "Perdi minhas raras, primo. A do goleiro holográfico... ela nem tinha ido pro álbum ainda."
   },
   {
    "t": "quiz",
    "q": "Como você descobre que um 'clube' é, na verdade, uma pirâmide?",
    "options": [
     {
      "label": "O prêmio só existe se você trouxer gente nova"
     },
     {
      "label": "O logo é feio e mal desenhado"
     },
     {
      "label": "Quem entra primeiro não ganha nada"
     }
    ],
    "correct": 0,
    "why": "Sem produto de verdade, o dinheiro dos últimos paga os primeiros — até acabar gente pra entrar."
   },
   {
    "t": "say",
    "who": "re",
    "text": "Pirâmide é isso: firme embaixo, brilhando em cima... até faltar gente pra segurar. Você saiu com suas figurinhas E suas amizades. Isso vale mais que 30 raras."
   }
  ]
 },
 {
  "id": "f9",
  "n": 9,
  "title": "O Cofrinho que Cresce",
  "topic": "Rendimento e juros compostos",
  "bg": "sc-rua",
  "lesson": "Dinheiro guardado no lugar certo trabalha sozinho: rende, e depois rende sobre o que já rendeu.",
  "steps": [
   {
    "t": "say",
    "who": "nar",
    "text": "A caminho da padaria com sua mãe, você acha na mochila as 100 moedas que vinha guardando. Elas estão paradas. Só existindo."
   },
   {
    "t": "say",
    "who": "voce",
    "text": "100 moedas há três meses na gaveta. Se dinheiro desse cria, o meu tá de castigo."
   },
   {
    "t": "say",
    "who": "mae",
    "text": "Na gaveta ele não cria mesmo, amor. Mas tem um lugar onde ele trabalha enquanto você dorme: o cofrinho que rende."
   },
   {
    "t": "say",
    "who": "voce",
    "text": "Dinheiro que cresce sozinho? Depois de tudo que eu já passei, isso tá com MUITA cara de golpe."
   },
   {
    "t": "say",
    "who": "mae",
    "text": "Boa desconfiança! Mas olha os números: 100 moedas rendendo 1% viram 101 no mês. Aí o próximo 1% é sobre 101. Depois sobre 102. É pouquinho... que nunca para."
   },
   {
    "t": "choice",
    "prompt": "Suas 100 moedas na mão. Qual o destino delas?",
    "options": [
     {
      "label": "Gaveta. Onde eu vejo, ninguém pega",
      "coins": 0,
      "fb": "Seguras? Sim. Três meses depois: exatamente 100. O tempo passou e elas nem perceberam."
     },
     {
      "label": "Cofrinho que rende",
      "coins": 10,
      "fb": "100 viraram 103 sem você mexer um dedo. Pouco? O pouquinho de hoje rende em cima amanhã.",
      "best": true
     },
     {
      "label": "Gasto metade agora, garantido é o que já comi",
      "coins": -25,
      "fb": "O lanche foi bom por 10 minutos. As 50 moedas que sobraram te olham decepcionadas."
     }
    ]
   },
   {
    "t": "mini",
    "kind": "catch",
    "time": 12,
    "goal": 40,
    "goods": [
     "+ juros",
     "rendeu!",
     "+ R$"
    ],
    "bads": [
     "gaveta",
     "embaixo do colchão",
     "parado"
    ],
    "prompt": "O dinheiro tá caindo! Pega o que RENDE e foge do que fica PARADO perdendo valor!",
    "sub": "Dinheiro rendendo vale +10. Dinheiro parado custa −15. Faça 40 pontos!",
    "win": "Você pegou a manha: dinheiro bem guardado trabalha sozinho enquanto você vive.",
    "lose": "Muito dinheiro parado escapou… lembra: na gaveta ele ENCOLHE (a inflação morde um pedaço todo ano)."
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Três meses depois. Cofrinho: 103 moedas. Você não fez nada. Elas trabalharam sozinhas."
   },
   {
    "t": "say",
    "who": "voce",
    "text": "Gente. Eu ganhei 3 moedas DORMINDO."
   },
   {
    "t": "chat",
    "who": "golpista",
    "text": "Oi!! Vi que vc curte investir 😍 no MEU cofrinho seu dinheiro rende 50% AO DIA. 100 hoje = 150 amanhã!! últimas vagas"
   },
   {
    "t": "choice",
    "prompt": "50% ao dia contra o seu 1% ao mês. A tentação é matemática.",
    "options": [
     {
      "label": "50%?? Mando tudo!",
      "coins": -30,
      "fb": "O 'cofrinho' dele sumiu junto com o perfil. Suas moedas renderam 100%... pro golpista."
     },
     {
      "label": "Mando só 20 pra testar",
      "coins": -20,
      "fb": "As 20 'renderam' na tela por dois dias. Quando você pediu de volta, o chat virou fumaça."
     },
     {
      "label": "Bloqueio. Rendimento gigante e garantido não existe",
      "coins": 15,
      "fb": "Seu 1% parece pequeno, mas é o único que amanhece na SUA conta.",
      "best": true
     }
    ]
   },
   {
    "t": "quiz",
    "q": "Por que o cofrinho que rende cresce cada vez mais rápido?",
    "options": [
     {
      "label": "Porque o rendimento rende em cima do que já rendeu"
     },
     {
      "label": "Porque o banco dobra tudo todo mês"
     },
     {
      "label": "Porque moeda guardada junta cria filhote"
     }
    ],
    "correct": 0,
    "why": "São os juros compostos: cada mês o rendimento é calculado sobre um valor um pouquinho maior."
   },
   {
    "t": "say",
    "who": "re",
    "text": "Regra de ouro: dinheiro parado envelhece, dinheiro bem guardado trabalha. E se alguém prometer que ele vai correr maratona da noite pro dia... ele tá trabalhando pra outra pessoa."
   }
  ]
 },
 {
  "id": "f10",
  "n": 10,
  "title": "O Grande Dia",
  "topic": "Revisão e celebração da meta",
  "bg": "sc-parque",
  "lesson": "Chegar na meta não é sorte: é o resultado de cada escolha. Dinheiro fácil promete; escolha certa entrega.",
  "steps": [
   {
    "t": "say",
    "who": "nar",
    "text": "Domingo de sol no parque. O Clube Flammers marcou o encontro do semestre. E o seu cofre está a 40 moedas do seu grande sonho."
   },
   {
    "t": "say",
    "who": "re",
    "text": "Olha quem chegou! A pessoa que sobreviveu a boleto, golpe no chat, parcelinha traiçoeira e pirâmide de figurinha. Tô quase emocionada. QUASE."
   },
   {
    "t": "say",
    "who": "voce",
    "text": "Faltam 40 moedas. QUARENTA. Eu consigo sentir o cheiro da meta."
   },
   {
    "t": "say",
    "who": "betinho",
    "text": "Primo!! Festão hoje à noite aqui no parque. Vaquinha de 60 moedas: open pastel, open guaraná e um DJ que é meu parça. Vai ser HISTÓRICO."
   },
   {
    "t": "choice",
    "prompt": "60 moedas. Seu cofre inteiro balança. A festa é hoje; o sonho é logo ali.",
    "options": [
     {
      "label": "Torro o cofre. YOLO, a vida é agora",
      "coins": -30,
      "fb": "A festa foi boa. Aí você acordou: sem moedas, sem festa e com o sonho de volta pra estaca zero."
     },
     {
      "label": "Vou na festa, mas com 15 moedas contadas",
      "coins": 10,
      "fb": "Você comeu pastel, dançou e voltou com o sonho intacto. Dá pra ter os dois quando o limite é definido ANTES.",
      "best": true
     },
     {
      "label": "Não vou. Diversão é inimiga da meta",
      "coins": 0,
      "fb": "Você economizou 15 moedas e passou a noite vendo os stories da festa. Meta não precisa de sofrimento."
     }
    ]
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Na festa, o pastel estava honesto e o DJ parça do Betinho tocou a mesma música quatro vezes. Ninguém reclamou."
   },
   {
    "t": "chat",
    "who": "golpista",
    "text": "EI!! sumido 😢 promoção de despedida: me manda suas moedas q eu DOBRO em 1 hora. é só hoje. confia"
   },
   {
    "t": "choice",
    "prompt": "O golpista de sempre, com o golpe de sempre, na hora mais perigosa: quando falta pouco.",
    "options": [
     {
      "label": "Dobrar em 1 hora resolveria minha vida...",
      "coins": -30,
      "fb": "Resolveu a vida DELE. Você conhecia esse golpe de trás pra frente e quase tropeçou na porta do final."
     },
     {
      "label": "Respondo só pra zoar ele",
      "coins": -10,
      "fb": "Você zoou, ele mandou um link 'pra provar'. Você quase clicou. Golpista não merece nem sua atenção."
     },
     {
      "label": "Bloqueio, printo e aviso o Clube Flammers",
      "coins": 20,
      "fb": "A Rê postou o print no mural do clube. Você não só escapou: virou escudo pros outros.",
      "best": true
     }
    ]
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Segunda-feira. Cantina da escola. Você conta as moedas do cofre pela última vez."
   },
   {
    "t": "say",
    "who": "cida",
    "text": "Pelo brilho nesse olho, ou você tirou 10 em matemática ou fechou a meta. Toma um suco, esse é por conta da casa."
   },
   {
    "t": "say",
    "who": "nar",
    "text": "Meta batida. As moedas do sonho estão completas, e cada uma tem uma história: a que você não torrou, a que rendeu sozinha, a que o golpista não levou."
   },
   {
    "t": "quiz",
    "q": "Olhando pra trás: 'clube que paga quem traz amigo', 'renda 50% ao dia', 'promoção só hoje'. O que tudo isso tem em comum?",
    "options": [
     {
      "label": "Prometem dinheiro fácil e rápido — o aviso clássico de furada"
     },
     {
      "label": "São oportunidades boas pra quem chega cedo"
     },
     {
      "label": "Só funcionam pra adulto"
     }
    ],
    "correct": 0,
    "why": "Quanto mais fácil, rápido e urgente o dinheiro parece, maior a chance de ele estar saindo do SEU bolso."
   },
   {
    "t": "say",
    "who": "mae",
    "text": "Eu vi você recusar festa cara, golpe bonito e atalho esperto. Vem cá, que hoje o abraço é dos apertados."
   },
   {
    "t": "say",
    "who": "betinho",
    "text": "Primo, sério... me ensina? Depois das figurinhas eu tô começando do zero. Literalmente do zero."
   },
   {
    "t": "say",
    "who": "re",
    "text": "Escuta aqui. Qualquer um tem sorte um dia. Mas chegar na meta escolha por escolha, sem depender de sorte — isso é ser FLAMMER. O sonho era o prêmio? Não. O prêmio é saber que você consegue de novo. Agora vai lá buscar o que é seu. Eu? Tô orgulhosa DEMAIS pra disfarçar."
   }
  ]
 }
];
