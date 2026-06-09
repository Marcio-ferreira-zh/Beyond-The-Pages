export interface Briefing {
  id: string;
  title: string;
  author: string;
  materialType: "Livro" | "Mangá" | "HQ" | "Artigo" | "Light Novel" | "Texto Livre";
  status: "Lendo" | "Concluído" | "Pausado" | "Abandonado";
  summary: string;
  characters: string; // Personagens importantes e suas descrições
  themes: string; // Temas centrais
  quotes: string[]; // Citações marcantes
  personalNotes: string; // Notas de leitura
  rating: number; // 1 a 5 estrelas
  genre: string; // Gênero (ex: Fantasia, Ficção Científica, Drama, Ação, Filosofia)
  protagonistPersonality: string; // Personalidade do Protagonista (ex: INTJ, Frio e Calculista, Determinado, Melancólico, Otimista)
  worldType: string; // Tipo de Mundo (ex: Isekai, Distopia, Cyberpunk, Fantasia Medieval, Realista, Onírico)
  createdAt: string;
  updatedAt: string;
}

export interface Recommendation {
  id: string;
  briefingId: string; // Obra vinculada
  briefingTitle: string; // Título da obra
  authorName: string; // Quem recomendou
  content: string; // Texto da recomendação
  ratingGiven: number; // Nota da recomendação
  createdAt: string;
}

export interface PergaminhoRecommendation {
  userName: string;
  role: string;
  content: string;
}

export interface PergaminhoWork {
  id: string;
  title: string;
  author: string;
  materialType: "Livro" | "Novel" | "Light Novel";
  genre: string;
  classification: string;
  rating: number;
  synopsis: string;
  recommendations: PergaminhoRecommendation[];
}

export const INITIAL_BRIEFINGS: Briefing[] = [
  {
    id: "1",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    materialType: "Livro",
    status: "Concluído",
    summary: "A obra narra a história de Bento Santiago, o Bentinho, apelidado de Dom Casmurro, que relembra sua vida desde a infância na Rua de Matacavalos até a velhice. O foco central é a sua relação obsessiva com Capitu e as suspeitas de traição com seu melhor amigo, Escobar.",
    characters: "Bento Santiago (narrador ciumento e inseguro), Capitu (olhos de ressaca, enigmática e decidida), Escobar (amigo leal e prático), Dona Glória (mãe possessiva).",
    themes: "Ciúme patológico, ambiguidade da verdade, memória seletiva, sociedade imperial brasileira.",
    quotes: [
      "Olhos de ressaca? Vá, de ressaca. É o que me dá a ideia daquela feição nova.",
      "A terra lhes seja leve, enquanto nós passamos o resto do dia na rua..."
    ],
    personalNotes: "Uma obra-prima absoluta sobre a narrativa em primeira pessoa. Nunca saberemos se Capitu traiu ou não, pois vemos apenas os olhos doentios de ciúme de Bentinho. A psicologia humana é descrita com precisão cirúrgica.",
    rating: 5,
    genre: "Drama / Clássico",
    protagonistPersonality: "Melancólico / Inseguro",
    worldType: "Realista",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-06-01T14:30:00Z"
  },
  {
    id: "2",
    title: "Solo Leveling",
    author: "Chugong",
    materialType: "Mangá",
    status: "Lendo",
    summary: "Em um mundo onde caçadores lutam contra monstros invasores em masmorras mágicas, Sung Jin-Woo é conhecido como o caçador mais fraco da humanidade. Após uma expedição desastrosa em uma masmorra dupla, ele ganha a habilidade única de subir de nível sem limites por meio de uma interface semelhante a um jogo.",
    characters: "Sung Jin-Woo (protagonista que evolui de frágil a soberano supremo), Cha Hae-In (caçadora classe S), Yoo Jin-Ho (companheiro leal).",
    themes: "Superação pessoal, a solidão do poder absoluto, sobrevivência do mais forte.",
    quotes: [
      "Eu não sou mais o caçador mais fraco da humanidade.",
      "Erga-se!"
    ],
    personalNotes: "Ritmo frenético e arte de tirar o fôlego (na adaptação Webtoon). É a clássica fantasia de poder, mas extremamente bem executada. Jin-Woo torna-se cada vez mais frio à medida que seu poder escala, o que traz uma tensão interessante.",
    rating: 4,
    genre: "Ação / Fantasia",
    protagonistPersonality: "Frio e Calculista / Determinado",
    worldType: "Fantasia Urbana",
    createdAt: "2026-05-20T08:00:00Z",
    updatedAt: "2026-06-07T19:15:00Z"
  },
  {
    id: "3",
    title: "Duna",
    author: "Frank Herbert",
    materialType: "Livro",
    status: "Concluído",
    summary: "Situado em um império intergaláctico feudal distante, Duna conta a história do jovem Paul Atreides, cuja família aceita o controle do planeta deserto Arrakis, a única fonte da substância mais valiosa do universo: o mélange ('especiaria'). O livro aborda intrigas políticas, religião e ecologia.",
    characters: "Paul Atreides (Messias relutante, herdeiro da Casa Atreides), Jessica Atreides (Bene Gesserit e mãe de Paul), Barão Harkonnen (antagonista cruel e manipulador), Stilgar (líder Fremen).",
    themes: "Messianismo perigoso, controle ecológico, feudalismo espacial, evolução humana sob substâncias psicodélicas.",
    quotes: [
      "Não devo temer. O medo é o assassino da mente.",
      "Aquele que controla a especiaria controla o universo."
    ],
    personalNotes: "Um épico magnífico. Frank Herbert desconstrói o arquétipo do 'escolhido' mostrando as consequências aterradoras do fanatismo religioso em torno de um líder carismático.",
    rating: 5,
    genre: "Ficção Científica",
    protagonistPersonality: "INTJ / Estratégico",
    worldType: "Ficção Científica Planetária",
    createdAt: "2026-04-10T12:00:00Z",
    updatedAt: "2026-05-30T18:00:00Z"
  },
  {
    id: "4",
    title: "Sandman: Prelúdios e Noturnos",
    author: "Neil Gaiman",
    materialType: "HQ",
    status: "Concluído",
    summary: "Após passar mais de sete décadas aprisionado por uma ordem ocultista britânica, Morfeu, o Rei dos Sonhos, escapa. Ele deve agora recuperar suas três ferramentas de poder (a algibeira de areia, o elmo e o rubi) para restaurar a ordem em seu reino decadente, o Sonhar.",
    characters: "Morfeu / Sonho (Senhor do Sonhar, orgulhoso e estoico), Morte (irmã mais velha e empática de Sonho), Lúcifer Estrela da Manhã (Rei do Inferno).",
    themes: "Responsabilidade do dever, a natureza dos mitos e histórias, a imortalidade, reabilitação.",
    quotes: [
      "Eu sou o Rei dos Sonhos. E voltei para reivindicar o que é meu.",
      "As pessoas acreditam que os sonhos não são reais apenas porque não são feitos de matéria."
    ],
    personalNotes: "Gaiman mistura mitologia clássica, terror contemporâneo e drama gótico de forma genial. O protagonista Morfeu é fascinante: um imortal muito rígido que aos poucos percebe a necessidade de mudar.",
    rating: 5,
    genre: "Fantasia Sombria",
    protagonistPersonality: "Estoico / Melancólico",
    worldType: "Onírico / Mitológico",
    createdAt: "2026-05-01T15:00:00Z",
    updatedAt: "2026-05-10T20:00:00Z"
  },
  {
    id: "5",
    title: "Overlord",
    author: "Kugane Maruyama",
    materialType: "Light Novel",
    status: "Pausado",
    summary: "No ano de 2138, o jogo de realidade virtual DMMO-RPG Yggdrasil está prestes a ser desativado. O jogador veterano Momonga decide permanecer logado até o último segundo. Em vez de ser desconectado, ele se vê transportado para um novo mundo com sua guilda de monstros NPC reais e leais, assumindo a identidade do mago morto-vivo Ainz Ooal Gown.",
    characters: "Ainz Ooal Gown / Momonga (humano comum no corpo de um lich supremo), Albedo (supervisora leal e apaixonada), Demiurge (estrategista demoníaco extremamente inteligente).",
    themes: "A moralidade sob o ponto de vista de um monstro, simulação de império, paranoia do poder.",
    quotes: [
      "Eu sou Ainz Ooal Gown. E nenhuma criatura neste mundo pode me desafiar.",
      "A justiça sem força é impotente, mas a força sem justiça é apenas tirania."
    ],
    personalNotes: "Engraçado e tenso ao mesmo tempo. A graça reside no contraste entre o protagonista (que por dentro é um assalariado japonês assustado) e suas ações externas como um imperador morto-vivo frio e impiedoso.",
    rating: 4,
    genre: "Fantasia / Isekai",
    protagonistPersonality: "INTJ / Calculista (Internamente Nervoso)",
    worldType: "Isekai / Fantasia de RPG",
    createdAt: "2026-05-25T11:00:00Z",
    updatedAt: "2026-06-03T16:40:00Z"
  }
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "r1",
    briefingId: "1",
    briefingTitle: "Dom Casmurro",
    authorName: "Clarice L.",
    content: "Se você quer entender a literatura brasileira profunda, este é o ponto de partida. Machado de Assis usa a psicologia e a ironia de maneira impecável. Recomendo ler prestando atenção nas entrelinhas de Bentinho. É simplesmente genial!",
    ratingGiven: 5,
    createdAt: "2026-06-02T16:00:00Z"
  },
  {
    id: "r2",
    briefingId: "3",
    briefingTitle: "Duna",
    authorName: "Arthur C.",
    content: "Uma obra-prima da ficção científica que transcende o gênero. Não é apenas sobre naves ou desertos, mas sobre a ascensão de impérios e religiões. Paul Atreides é um protagonista fascinante com seu dilema trágico de ver o futuro e tentar evitá-lo. Leitura obrigatória!",
    ratingGiven: 5,
    createdAt: "2026-06-04T12:00:00Z"
  },
  {
    id: "r3",
    briefingId: "2",
    briefingTitle: "Solo Leveling",
    authorName: "Lucas Caçador",
    content: "Ideal para quem gosta de ação pura e uma progressão de poder impecável. Jin-Woo é focado e determinado, não fica enrolando. O ritmo do mangá te prende do início ao fim. Se você gosta de RPGs e masmorras, vai devorar!",
    ratingGiven: 4,
    createdAt: "2026-06-08T09:30:00Z"
  }
];

export const PERGAMINHOS: PergaminhoWork[] = [
  {
    id: "p1",
    title: "O Jardim das Lâminas Azuis",
    author: "Helena Sato",
    materialType: "Novel",
    genre: "Fantasia Política",
    classification: "Classe A — intriga nobre com magia ritual",
    rating: 4.6,
    synopsis: "Uma herdeira sem trono precisa vencer duelos diplomáticos em uma capital onde flores guardam memórias de assassinatos.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "A ambientação tem perfume de corte decadente e cada capítulo termina com uma revelação elegante." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "Recomendo para quem gosta de personagens que vencem mais pela estratégia do que pela força." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "A protagonista é afiada, vulnerável e fácil de acompanhar mesmo em meio à política complexa." },
    ],
  },
  {
    id: "p2",
    title: "Crônicas do Farol Submerso",
    author: "Mateus Valença",
    materialType: "Livro",
    genre: "Mistério Oceânico",
    classification: "Classe B+ — suspense atmosférico e melancólico",
    rating: 4.3,
    synopsis: "Um investigador retorna à ilha natal para decifrar mensagens emitidas por um farol que desapareceu no fundo do mar.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "A escrita é lenta no melhor sentido: cada pista parece molhada de sal e culpa." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "Boa escolha para quem quer um mistério mais emocional do que policialesco." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "O final fictício entrega respostas sem quebrar a aura sobrenatural da obra." },
    ],
  },
  {
    id: "p3",
    title: "Imperador dos Sete Eclipse",
    author: "Akira Montel",
    materialType: "Light Novel",
    genre: "Isekai / Estratégia",
    classification: "Classe S — progressão imperial de alto impacto",
    rating: 4.8,
    synopsis: "Depois de renascer como conselheiro de um império em ruínas, um tático tenta impedir sete eclipses profetizados.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "O ritmo de evolução é viciante e a escala cresce sem perder o tabuleiro político." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "As batalhas são vencidas no planejamento, então agrada muito fãs de estratégia." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "Os coadjuvantes têm objetivos próprios, o que deixa o império vivo." },
    ],
  },
  {
    id: "p4",
    title: "Manual de Sobrevivência para Bruxas Urbanas",
    author: "Camila Orvalho",
    materialType: "Livro",
    genre: "Fantasia Urbana",
    classification: "Classe A- — magia cotidiana com humor ácido",
    rating: 4.1,
    synopsis: "Uma bruxa recém-formada administra uma lavanderia encantada enquanto investiga maldições presas em roupas esquecidas.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "É leve sem ser raso, com magia muito criativa nos objetos comuns." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "Os casos episódicos ajudam a leitura fluir e revelam bem a protagonista." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "Perfeito para alternar entre obras densas e algo confortável." },
    ],
  },
  {
    id: "p5",
    title: "A Biblioteca no Fim do Relâmpago",
    author: "Rafael Kuroda",
    materialType: "Novel",
    genre: "Aventura Arcana",
    classification: "Classe S- — jornada mágica e bibliotecas impossíveis",
    rating: 4.7,
    synopsis: "Um aprendiz encontra uma biblioteca que só abre durante tempestades capazes de reescrever eventos do passado.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "A ideia central é encantadora e combina muito com leitores que amam livros dentro de livros." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "Há boas escolhas morais quando mexer no passado cobra preços pessoais." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "O protagonista aprende sem virar invencível rápido demais, o que melhora a jornada." },
    ],
  },
  {
    id: "p6",
    title: "Neon para Deuses Mortos",
    author: "Bianca Voss",
    materialType: "Livro",
    genre: "Cyberpunk Mitológico",
    classification: "Classe A — noir futurista com panteões quebrados",
    rating: 4.4,
    synopsis: "Em uma megacidade governada por corporações divinas, uma hacker negocia com deuses falidos para salvar seu bairro.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "Mistura mitologia e neon com personalidade visual muito forte." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "A crítica social fictícia é direta, mas funciona porque os conflitos são pessoais." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "A protagonista tem voz sarcástica e um ótimo senso de sobrevivência." },
    ],
  },
  {
    id: "p7",
    title: "O Monge que Colecionava Dragões",
    author: "João Mirel",
    materialType: "Livro",
    genre: "Fantasia Filosófica",
    classification: "Classe B — contemplativo e poético",
    rating: 4.0,
    synopsis: "Um monge viaja por montanhas espirituais catalogando dragões que representam medos humanos.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "A leitura pede calma, mas recompensa com imagens belíssimas." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "É menos ação e mais reflexão, então funciona para quem gosta de alegorias." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "Os dragões são memoráveis porque cada um tem uma metáfora clara." },
    ],
  },
  {
    id: "p8",
    title: "Rainha de Vidro e Ferrugem",
    author: "Marina Locke",
    materialType: "Novel",
    genre: "Steampunk",
    classification: "Classe A+ — rebelião mecânica e drama real",
    rating: 4.5,
    synopsis: "Uma rainha mecânica descobre que sua memória foi montada por inimigos e lidera uma rebelião contra seus criadores.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "O conflito de identidade da protagonista sustenta muito bem o espetáculo steampunk." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "Tem reviravoltas políticas fortes e aliados com lealdades duvidosas." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "A estética de vidro, engrenagens e ferrugem cria cenas fáceis de imaginar." },
    ],
  },
  {
    id: "p9",
    title: "Café para Necromantes Iniciantes",
    author: "Igor Pimenta",
    materialType: "Light Novel",
    genre: "Comédia Sobrenatural",
    classification: "Classe B+ — humor macabro e acolhedor",
    rating: 4.2,
    synopsis: "Um necromante atrapalhado abre uma cafeteria para espíritos e sem querer vira conselheiro dos mortos da cidade.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "É divertido, carismático e usa o sobrenatural para falar de despedidas." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "Os capítulos curtos tornam a obra ótima para leitura casual." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "O elenco de fantasmas é o grande charme, cada cliente traz uma história." },
    ],
  },
  {
    id: "p10",
    title: "A Última Estação de Marte",
    author: "Sofia Brandão",
    materialType: "Livro",
    genre: "Ficção Científica",
    classification: "Classe A — sobrevivência espacial intimista",
    rating: 4.4,
    synopsis: "A equipe de uma estação marciana abandonada precisa decidir se espera resgate ou inicia uma travessia quase impossível.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "A tensão vem tanto da ciência quanto das relações desgastadas da tripulação." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "Recomendo para fãs de ficção científica humana, com tecnologia servindo ao drama." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "A sensação de isolamento marciano é muito bem construída." },
    ],
  },
  {
    id: "p11",
    title: "Caçadores de Auroras Negras",
    author: "Tainá Borges",
    materialType: "Novel",
    genre: "Ação / Fantasia",
    classification: "Classe S — combates elementais e equipe carismática",
    rating: 4.7,
    synopsis: "Mercenários mágicos rastreiam auroras que transformam regiões inteiras em labirintos vivos.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "A equipe tem química e cada missão revela uma regra nova do mundo." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "As lutas são claras, rápidas e cheias de criatividade elemental." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "Boa porta de entrada para quem quer aventura sem perder emoção." },
    ],
  },
  {
    id: "p12",
    title: "Sussurros da Casa Cartógrafa",
    author: "Otávia Reis",
    materialType: "Livro",
    genre: "Gótico / Mistério",
    classification: "Classe A- — mansão viva e segredos familiares",
    rating: 4.3,
    synopsis: "Uma cartógrafa herda uma casa cujos corredores mudam conforme mentiras antigas são reveladas.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "A casa é praticamente uma personagem, cheia de mapas impossíveis." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "O mistério familiar é bem dosado e mantém curiosidade constante." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "A atmosfera gótica é elegante sem depender de sustos fáceis." },
    ],
  },
  {
    id: "p13",
    title: "Meu Rival é o Rei Demônio",
    author: "Kenji Avelar",
    materialType: "Light Novel",
    genre: "Romance / Isekai",
    classification: "Classe B+ — rivalidade romântica e fantasia leve",
    rating: 4.1,
    synopsis: "Uma heroína convocada para derrotar o Rei Demônio descobre que ele é o único disposto a negociar a paz.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "A dinâmica de rivais funciona porque ambos têm razões compreensíveis." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "É divertido ver diplomacia substituir a batalha final esperada." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "A química é fofa e o tom leve combina com leitura de conforto." },
    ],
  },
  {
    id: "p14",
    title: "O Arquivo das Estrelas Queimadas",
    author: "Davi Elian",
    materialType: "Livro",
    genre: "Space Opera",
    classification: "Classe A+ — império galáctico e memória cósmica",
    rating: 4.6,
    synopsis: "Uma historiadora espacial descobre arquivos sobre estrelas apagadas artificialmente para esconder um genocídio imperial.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "A escala é enorme, mas a investigação histórica mantém tudo ancorado." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "Tem conspiração, frota imperial e dilemas éticos interessantes." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "A protagonista é movida por memória e justiça, não por glória." },
    ],
  },
  {
    id: "p15",
    title: "Pétalas para um Samurai Fantasma",
    author: "Yumi Andrade",
    materialType: "Novel",
    genre: "Fantasia Histórica",
    classification: "Classe B — honra, luto e duelos espirituais",
    rating: 4.2,
    synopsis: "Uma florista conversa com o fantasma de um samurai que protege sua vila de espíritos vingativos.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "A delicadeza das cenas contrasta bem com os duelos espirituais." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "O passado do samurai dá força ao mistério central." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "É uma obra fictícia ótima para quem procura fantasia mais emocional." },
    ],
  },
  {
    id: "p16",
    title: "A Garota que Vendia Mundos",
    author: "Priscila Nox",
    materialType: "Livro",
    genre: "Fantasia Surreal",
    classification: "Classe S- — imaginação alta e tom onírico",
    rating: 4.5,
    synopsis: "Uma jovem mercadora comercializa pequenos mundos engarrafados enquanto foge de colecionadores celestiais.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "Cada mundo engarrafado parece render um conto próprio, com muita inventividade." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "A perseguição dá movimento a uma premissa bem poética." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "Recomendo para leitores que gostam de fantasia estranha e bela." },
    ],
  },
  {
    id: "p17",
    title: "Sistema Solar de Bolso",
    author: "Caio Nakamura",
    materialType: "Light Novel",
    genre: "Aventura Científica",
    classification: "Classe B+ — humor, ciência e exploração",
    rating: 4.0,
    synopsis: "Um estudante recebe um sistema solar miniaturizado e precisa impedir que planetas temperamentais destruam seu quarto.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "A premissa é absurda de um jeito muito divertido." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "O humor visual funciona bem e há pequenas ideias científicas interessantes." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "É leve, criativo e tem cara de série confortável." },
    ],
  },
  {
    id: "p18",
    title: "Oráculo em Chamas",
    author: "Isadora Vale",
    materialType: "Livro",
    genre: "Fantasia Épica",
    classification: "Classe A — profecia trágica e guerra sagrada",
    rating: 4.4,
    synopsis: "Uma sacerdotisa que prevê desastres precisa convencer reinos inimigos a acreditar em uma visão que a condena.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "A profecia tem peso dramático real porque exige sacrifícios pessoais." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "As alianças entre reinos dão complexidade sem travar a narrativa." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "A protagonista é forte justamente por ter medo." },
    ],
  },
  {
    id: "p19",
    title: "O Clube dos Vilões Redimidos",
    author: "Larissa Fen",
    materialType: "Novel",
    genre: "Comédia / Fantasia",
    classification: "Classe B — found family de ex-antagonistas",
    rating: 4.1,
    synopsis: "Ex-vilões formam um clube de apoio para evitar recaídas enquanto salvam a cidade de heróis narcisistas.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "A graça vem de personagens tentando ser melhores sem perder personalidade." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "A inversão herói/vilão é simples, mas muito funcional." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "É uma obra fictícia simpática, ideal para quem ama found family." },
    ],
  },
  {
    id: "p20",
    title: "Coração de Obsidiana Lunar",
    author: "Mirella Frost",
    materialType: "Light Novel",
    genre: "Romantasia",
    classification: "Classe A- — magia lunar e pacto perigoso",
    rating: 4.3,
    synopsis: "Uma curandeira faz pacto com um príncipe lunar amaldiçoado e descobre que seu coração guarda uma guerra antiga.",
    recommendations: [
      { userName: "Lia Codex", role: "Arquivista de Fantasia", content: "A romantasia equilibra bem mistério, magia e tensão emocional." },
      { userName: "Theo Margem", role: "Leitor de Intrigas", content: "O pacto cria conflitos bons porque nenhum dos dois pode confiar totalmente." },
      { userName: "Nina Folhas", role: "Curadora de Novels", content: "A estética lunar combina com a promessa de uma leitura dramática e envolvente." },
    ],
  },
];

export const GENRES = [
  "Drama / Clássico",
  "Ação / Fantasia",
  "Ficção Científica",
  "Fantasia Sombria",
  "Fantasia / Isekai",
  "Suspense / Mistério",
  "Filosofia / Ensaio"
];

export const PROTAGONIST_PERSONALITIES = [
  "INTJ / Estratégico",
  "Frio e Calculista / Determinado",
  "Estoico / Melancólico",
  "Melancólico / Inseguro",
  "INTJ / Calculista (Internamente Nervoso)",
  "Otimista / Altruísta",
  "Impulsivo / Corajoso"
];

export const WORLD_TYPES = [
  "Realista",
  "Fantasia Urbana",
  "Ficção Científica Planetária",
  "Onírico / Mitológico",
  "Isekai / Fantasia de RPG",
  "Distopia / Cyberpunk",
  "Pós-apocalíptico"
];
