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
