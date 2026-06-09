"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  ChevronRight,
  Home,
  LogOut,
  MessageSquare,
  Pencil,
  Plus,
  Quote,
  Search,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import {
  Briefing,
  INITIAL_BRIEFINGS,
  INITIAL_RECOMMENDATIONS,
  PERGAMINHOS,
  PergaminhoWork,
  Recommendation,
} from "../data/mockData";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Modal } from "./ui/modal";

interface DashboardProps {
  onLogout: () => void;
  userEmail: string;
}

type ActiveTab = "home" | "library" | "pergaminhos" | "recommendations";
type WorkStatus = "Lendo" | "Lido" | "Dropado";

const NAV_ITEMS: { id: ActiveTab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "library", label: "Biblioteca" },
  { id: "pergaminhos", label: "Pergaminhos" },
  { id: "recommendations", label: "Recomendações" },
];

const STATUS_OPTIONS: WorkStatus[] = ["Lendo", "Lido", "Dropado"];

const getStatusBadgeClasses = (status: WorkStatus) => {
  if (status === "Lido") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
  if (status === "Dropado") return "border-rose-500/30 bg-rose-500/10 text-rose-200";
  return "border-amber-500/30 bg-amber-500/10 text-amber-200";
};

const normalizeStatus = (status: string): WorkStatus => {
  if (status === "Concluído") return "Lido";
  if (status === "Pausado" || status === "Abandonado") return "Dropado";
  return "Lendo";
};

const loadStoredCollection = <T,>(key: string, fallback: T[]) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    return JSON.parse(storedValue) as T[];
  }

  localStorage.setItem(key, JSON.stringify(fallback));
  return fallback;
};

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const createCoverDataUri = (title: string, subtitle: string, seed: string) => {
  const palettes = [
    ["#52280f", "#9e5f2f", "#e8be77"],
    ["#11243b", "#28456a", "#93b8dc"],
    ["#2b163d", "#523172", "#b99ad9"],
    ["#3f1a1f", "#7d2f3f", "#e8a3b1"],
    ["#143024", "#2f6a4e", "#9fd6be"],
  ] as const;
  const palette = palettes[hashString(seed) % palettes.length];
  const escapedTitle = title.replace(/&/g, "&amp;").slice(0, 22);
  const escapedSubtitle = subtitle.replace(/&/g, "&amp;").slice(0, 26);

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='300' viewBox='0 0 480 300'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${palette[0]}' />
        <stop offset='55%' stop-color='${palette[1]}' />
        <stop offset='100%' stop-color='${palette[2]}' />
      </linearGradient>
    </defs>
    <rect width='480' height='300' fill='url(#g)' />
    <rect x='18' y='18' width='444' height='264' fill='rgba(15,8,4,.34)' stroke='rgba(255,255,255,.18)' rx='16' />
    <text x='42' y='120' fill='rgba(255,255,255,.95)' font-size='30' font-family='Georgia, serif' font-weight='700'>📚 ☕</text>
    <text x='42' y='170' fill='rgba(255,255,255,.95)' font-size='28' font-family='Georgia, serif'>${escapedTitle}</text>
    <text x='42' y='204' fill='rgba(255,255,255,.8)' font-size='18' font-family='Inter, sans-serif'>${escapedSubtitle}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const createBriefingFromPergaminho = (work: PergaminhoWork): Briefing => {
  const now = new Date().toISOString();
  return {
    id: `lib-${Date.now()}`,
    title: work.title,
    author: work.author,
    materialType: work.materialType,
    status: "Lendo",
    summary: work.synopsis,
    characters: "Detalhes de personagens ainda não preenchidos.",
    themes: "Temas ainda não preenchidos.",
    quotes: [],
    personalNotes: "",
    rating: work.rating,
    genre: work.genre,
    protagonistPersonality: "Não informado",
    worldType: "Não informado",
    createdAt: now,
    updatedAt: now,
  };
};

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, userEmail }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [briefings, setBriefings] = useState<Briefing[]>(() =>
    loadStoredCollection("btp_briefings", INITIAL_BRIEFINGS).map((briefing) => ({
      ...briefing,
      status: normalizeStatus(briefing.status),
    }))
  );
  const [pergaminhos, setPergaminhos] = useState<PergaminhoWork[]>(() => loadStoredCollection("btp_pergaminhos", PERGAMINHOS));
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() =>
    loadStoredCollection("btp_recommendations", INITIAL_RECOMMENDATIONS)
  );
  const [librarySearch, setLibrarySearch] = useState("");
  const [pergaminhoSearch, setPergaminhoSearch] = useState("");
  const [selectedBriefing, setSelectedBriefing] = useState<Briefing | null>(null);
  const [selectedBriefingNotes, setSelectedBriefingNotes] = useState("");
  const [selectedBriefingStatus, setSelectedBriefingStatus] = useState<WorkStatus>("Lendo");
  const [selectedPergaminho, setSelectedPergaminho] = useState<PergaminhoWork | null>(null);

  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [libTitle, setLibTitle] = useState("");
  const [libAuthor, setLibAuthor] = useState("");
  const [libType, setLibType] = useState<Briefing["materialType"]>("Livro");
  const [libGenre, setLibGenre] = useState("");
  const [libSummary, setLibSummary] = useState("");
  const [libStatus, setLibStatus] = useState<WorkStatus>("Lendo");
  const [libNotes, setLibNotes] = useState("");

  const [isPergaminhoModalOpen, setIsPergaminhoModalOpen] = useState(false);
  const [newPergTitle, setNewPergTitle] = useState("");
  const [newPergAuthor, setNewPergAuthor] = useState("");
  const [newPergType, setNewPergType] = useState<PergaminhoWork["materialType"]>("Novel");
  const [newPergGenre, setNewPergGenre] = useState("");
  const [newPergClassification, setNewPergClassification] = useState("");
  const [newPergSynopsis, setNewPergSynopsis] = useState("");
  const [newPergRating, setNewPergRating] = useState(4.2);

  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false);
  const [editingRecommendationId, setEditingRecommendationId] = useState<string | null>(null);
  const [recBriefingId, setRecBriefingId] = useState("");
  const [recAuthorName, setRecAuthorName] = useState("");
  const [recContent, setRecContent] = useState("");
  const [recRating, setRecRating] = useState(5);

  useEffect(() => {
    if (!selectedBriefing) return;
    setSelectedBriefingNotes(selectedBriefing.personalNotes ?? "");
    setSelectedBriefingStatus(normalizeStatus(selectedBriefing.status));
  }, [selectedBriefing]);

  const filteredBriefings = useMemo(() => {
    const query = librarySearch.toLowerCase();

    return briefings.filter((briefing) =>
      [briefing.title, briefing.author, briefing.summary, briefing.genre, briefing.materialType]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [briefings, librarySearch]);

  const filteredPergaminhos = useMemo(() => {
    const query = pergaminhoSearch.toLowerCase();

    return pergaminhos.filter((work) =>
      [work.title, work.author, work.genre, work.materialType, work.classification]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [pergaminhos, pergaminhoSearch]);

  const recommendationOptions = useMemo(
    () => [
      ...briefings.map((briefing) => ({
        id: briefing.id,
        title: briefing.title,
        author: briefing.author,
        genre: briefing.genre,
        source: "Biblioteca",
      })),
      ...pergaminhos.map((work) => ({
        id: work.id,
        title: work.title,
        author: work.author,
        genre: work.genre,
        source: "Pergaminhos",
      })),
    ],
    [briefings, pergaminhos]
  );

  const recommendationCovers = useMemo(() => {
    const covers = new Map<string, string>();
    recommendationOptions.forEach((work) => {
      covers.set(work.title, createCoverDataUri(work.title, work.genre, work.id));
    });
    return covers;
  }, [recommendationOptions]);

  const saveBriefings = (updatedBriefings: Briefing[]) => {
    setBriefings(updatedBriefings);
    localStorage.setItem("btp_briefings", JSON.stringify(updatedBriefings));
  };

  const savePergaminhos = (updatedPergaminhos: PergaminhoWork[]) => {
    setPergaminhos(updatedPergaminhos);
    localStorage.setItem("btp_pergaminhos", JSON.stringify(updatedPergaminhos));
  };

  const saveRecommendations = (updatedRecommendations: Recommendation[]) => {
    setRecommendations(updatedRecommendations);
    localStorage.setItem("btp_recommendations", JSON.stringify(updatedRecommendations));
  };

  const navigateToTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab !== "pergaminhos") {
      setSelectedPergaminho(null);
    }
  };

  const resetRecommendationForm = () => {
    setRecBriefingId("");
    setRecAuthorName("");
    setRecContent("");
    setRecRating(5);
    setEditingRecommendationId(null);
  };

  const openNewRecommendationModal = (workId = "") => {
    resetRecommendationForm();
    setRecBriefingId(workId);
    setIsRecommendationModalOpen(true);
  };

  const openEditRecommendationModal = (recommendation: Recommendation) => {
    setEditingRecommendationId(recommendation.id);
    setRecBriefingId(recommendation.briefingId);
    setRecAuthorName(recommendation.authorName);
    setRecContent(recommendation.content);
    setRecRating(recommendation.ratingGiven);
    setIsRecommendationModalOpen(true);
  };

  const handleRecommendationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const linkedWork = recommendationOptions.find((work) => work.id === recBriefingId);
    if (!linkedWork || !recAuthorName.trim() || !recContent.trim()) {
      alert("Preencha obra, nome e recomendação antes de publicar.");
      return;
    }

    if (editingRecommendationId) {
      const updatedRecommendations = recommendations.map((recommendation) =>
        recommendation.id === editingRecommendationId
          ? {
              ...recommendation,
              briefingId: linkedWork.id,
              briefingTitle: linkedWork.title,
              authorName: recAuthorName.trim(),
              content: recContent.trim(),
              ratingGiven: recRating,
            }
          : recommendation
      );

      saveRecommendations(updatedRecommendations);
    } else {
      const newRecommendation: Recommendation = {
        id: Date.now().toString(),
        briefingId: linkedWork.id,
        briefingTitle: linkedWork.title,
        authorName: recAuthorName.trim(),
        content: recContent.trim(),
        ratingGiven: recRating,
        createdAt: new Date().toISOString(),
      };

      saveRecommendations([newRecommendation, ...recommendations]);
    }

    resetRecommendationForm();
    setIsRecommendationModalOpen(false);
  };

  const deleteRecommendation = (recommendationId: string) => {
    if (confirm("Tem certeza de que deseja excluir esta recomendação?")) {
      saveRecommendations(recommendations.filter((recommendation) => recommendation.id !== recommendationId));
    }
  };

  const handleAddLibraryWork = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!libTitle.trim() || !libAuthor.trim() || !libSummary.trim()) {
      alert("Preencha título, autor e resumo.");
      return;
    }

    const now = new Date().toISOString();
    const newBriefing: Briefing = {
      id: `lib-${Date.now()}`,
      title: libTitle.trim(),
      author: libAuthor.trim(),
      materialType: libType,
      status: libStatus,
      summary: libSummary.trim(),
      characters: "Personagens ainda não preenchidos.",
      themes: "Temas ainda não preenchidos.",
      quotes: [],
      personalNotes: libNotes.trim(),
      rating: 4,
      genre: libGenre.trim() || "Gênero não informado",
      protagonistPersonality: "Não informado",
      worldType: "Não informado",
      createdAt: now,
      updatedAt: now,
    };

    saveBriefings([newBriefing, ...briefings]);
    setIsLibraryModalOpen(false);
    setLibTitle("");
    setLibAuthor("");
    setLibGenre("");
    setLibSummary("");
    setLibStatus("Lendo");
    setLibNotes("");
  };

  const handleAddPergaminho = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newPergTitle.trim() || !newPergAuthor.trim() || !newPergSynopsis.trim()) {
      alert("Preencha título, autor e sinopse para criar a história.");
      return;
    }

    const newWork: PergaminhoWork = {
      id: `p${Date.now()}`,
      title: newPergTitle.trim(),
      author: newPergAuthor.trim(),
      materialType: newPergType,
      genre: newPergGenre.trim() || "Fantasia",
      classification: newPergClassification.trim() || "Classe B — obra recém-adicionada",
      rating: Math.max(1, Math.min(5, newPergRating)),
      synopsis: newPergSynopsis.trim(),
      recommendations: [
        {
          userName: "Lia Codex",
          role: "Arquivista de Fantasia",
          content: `Nova história adicionada ao catálogo: ${newPergTitle.trim()}.`,
        },
        {
          userName: "Theo Margem",
          role: "Leitor de Intrigas",
          content: "Vale acompanhar os próximos capítulos e evolução dos personagens.",
        },
        {
          userName: "Nina Folhas",
          role: "Curadora de Novels",
          content: "Tem potencial para entrar na sua lista de leituras desta semana.",
        },
      ],
    };

    savePergaminhos([newWork, ...pergaminhos]);
    setIsPergaminhoModalOpen(false);
    setNewPergTitle("");
    setNewPergAuthor("");
    setNewPergGenre("");
    setNewPergClassification("");
    setNewPergSynopsis("");
    setNewPergRating(4.2);
  };

  const addPergaminhoToLibrary = (work: PergaminhoWork) => {
    const alreadyExists = briefings.some(
      (briefing) =>
        briefing.title.trim().toLowerCase() === work.title.trim().toLowerCase() &&
        briefing.author.trim().toLowerCase() === work.author.trim().toLowerCase()
    );

    if (alreadyExists) {
      alert("Esta obra já está na sua biblioteca.");
      return;
    }

    saveBriefings([createBriefingFromPergaminho(work), ...briefings]);
    alert("Obra adicionada à biblioteca.");
  };

  const saveSelectedBriefingDetails = () => {
    if (!selectedBriefing) return;

    const updatedBriefings = briefings.map((briefing) =>
      briefing.id === selectedBriefing.id
        ? {
            ...briefing,
            status: selectedBriefingStatus,
            personalNotes: selectedBriefingNotes.trim(),
            updatedAt: new Date().toISOString(),
          }
        : briefing
    );

    const updatedSelected = updatedBriefings.find((briefing) => briefing.id === selectedBriefing.id) ?? null;
    saveBriefings(updatedBriefings);
    setSelectedBriefing(updatedSelected);
  };

  const renderStars = (rating: number, size = 14) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className={index < Math.round(rating) ? "text-gold fill-gold" : "text-white/15"}
        />
      ))}
    </div>
  );

  const renderTabButton = (item: { id: ActiveTab; label: string }) => (
    <button
      key={item.id}
      onClick={() => navigateToTab(item.id)}
      className={`rounded px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
        activeTab === item.id
          ? "bg-gradient-to-r from-gold to-gold-light text-[#1a0c05]"
          : "text-white/60 hover:text-white"
      }`}
    >
      {item.label}
    </button>
  );

  const renderHome = () => (
    <div className="flex flex-col gap-8">
      <section className="gold-glass relative overflow-hidden rounded-2xl border border-gold/20 p-8 md:p-10">
        <div className="absolute right-8 top-8 hidden h-40 w-40 rounded-full bg-gold/10 blur-3xl md:block" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-[#2a1810]/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-light">
              <Home size={12} /> Aba Home
            </span>
            <h2 className="font-serif text-4xl font-bold italic text-gold-light md:text-5xl">Bem-vindo ao Beyond The Pages</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Organize leituras, publique recomendações e descubra novas histórias com uma navegação mais fluida.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigateToTab("pergaminhos")}>
              <BookMarked size={16} /> Explorar Pergaminhos
            </Button>
            <Button variant="secondary" onClick={() => navigateToTab("library")}>
              <BookOpen size={16} /> Ir para Biblioteca
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Obras na biblioteca", value: briefings.length, icon: BookOpen },
          { label: "Pergaminhos aleatórios", value: pergaminhos.length, icon: BookMarked },
          { label: "Recomendações feitas", value: recommendations.length, icon: Sparkles },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/35">{stat.label}</p>
                  <strong className="font-serif text-3xl text-gold-light">{stat.value}</strong>
                </div>
                <Icon className="text-gold/70" size={28} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderLibrary = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 border-b border-white/5 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-bold italic text-gold-light">
            <BookOpen size={20} /> Biblioteca
          </h2>
          <p className="text-xs text-white/45">Adicione obras, ajuste status e salve anotações pessoais.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:min-w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input
              type="text"
              placeholder="Pesquisar por título, autor ou gênero..."
              value={librarySearch}
              onChange={(event) => setLibrarySearch(event.target.value)}
              className="w-full rounded border border-white/10 bg-[#2a1810]/40 py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-gold"
            />
          </div>
          <Button onClick={() => setIsLibraryModalOpen(true)}>
            <Plus size={16} /> Adicionar obra
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredBriefings.map((briefing) => (
          <Card
            key={briefing.id}
            hoverEffect
            className="flex cursor-pointer flex-col justify-between"
            onClick={() => setSelectedBriefing(briefing)}
          >
            <div className="h-36 w-full overflow-hidden border-b border-white/5">
              <img
                src={createCoverDataUri(briefing.title, briefing.genre, briefing.id)}
                alt={`Capa da obra ${briefing.title}`}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader>
              <CardDescription>{briefing.materialType}</CardDescription>
              <CardTitle className="line-clamp-1">{briefing.title}</CardTitle>
              <span className="text-xs italic text-white/60">por {briefing.author}</span>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <p className="line-clamp-3 text-xs leading-relaxed text-white/70">{briefing.summary}</p>
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/5 pt-3">
                <span className="text-[11px] text-gold-light">{briefing.genre}</span>
                <span
                  className={`rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusBadgeClasses(
                    normalizeStatus(briefing.status)
                  )}`}
                >
                  {normalizeStatus(briefing.status)}
                </span>
              </div>
            </CardContent>
            <CardFooter className="py-3">
              {renderStars(briefing.rating)}
              <span className="text-[10px] text-white/35">Abrir perfil</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPergaminhos = () => {
    if (selectedPergaminho) {
      return (
        <div className="flex flex-col gap-6">
          <Button variant="ghost" size="sm" className="w-fit" onClick={() => setSelectedPergaminho(null)}>
            <ArrowLeft size={14} /> Voltar para Pergaminhos
          </Button>

          <Card>
            <div className="h-48 w-full overflow-hidden border-b border-white/5">
              <img
                src={createCoverDataUri(selectedPergaminho.title, selectedPergaminho.genre, selectedPergaminho.id)}
                alt={`Capa da obra ${selectedPergaminho.title}`}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader className="border-b border-white/5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <CardDescription>
                    {selectedPergaminho.materialType} • {selectedPergaminho.genre}
                  </CardDescription>
                  <CardTitle className="text-2xl italic text-gold-light md:text-3xl">{selectedPergaminho.title}</CardTitle>
                  <p className="text-sm italic text-white/60">por {selectedPergaminho.author}</p>
                </div>
                <div className="rounded border border-gold/20 bg-[#1a0c05]/70 p-3 text-right">
                  <p className="text-[10px] uppercase tracking-widest text-white/35">Classificação fictícia</p>
                  <strong className="font-serif text-sm italic text-gold-light">{selectedPergaminho.classification}</strong>
                  <div className="mt-2 flex justify-end">{renderStars(selectedPergaminho.rating, 16)}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 pt-5">
              <p className="text-sm leading-relaxed text-white/75">{selectedPergaminho.synopsis}</p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => addPergaminhoToLibrary(selectedPergaminho)}>
                  <BookOpen size={14} /> Adicionar à biblioteca
                </Button>
                <Button variant="secondary" onClick={() => openNewRecommendationModal(selectedPergaminho.id)}>
                  <MessageSquare size={14} /> Recomendar obra
                </Button>
              </div>
              <div>
                <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold italic text-gold-light">
                  <MessageSquare size={18} /> Recomendações fictícias da obra
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {selectedPergaminho.recommendations.map((recommendation) => (
                    <div key={recommendation.userName} className="rounded-lg border border-white/5 bg-[#2a1810]/35 p-4">
                      <p className="font-serif text-base font-bold italic text-gold-light">{recommendation.userName}</p>
                      <p className="mb-3 text-[10px] uppercase tracking-widest text-white/35">{recommendation.role}</p>
                      <p className="text-xs leading-relaxed text-white/75">{recommendation.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 border-b border-white/5 pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 font-serif text-2xl font-bold italic text-gold-light">
              <BookMarked size={20} /> Pergaminhos
            </h2>
            <p className="text-xs text-white/45">Adicione histórias, leve para a biblioteca e recomende com um clique.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:min-w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input
                type="text"
                placeholder="Pesquisar obras, autores, tipos ou gêneros..."
                value={pergaminhoSearch}
                onChange={(event) => setPergaminhoSearch(event.target.value)}
                className="w-full rounded border border-white/10 bg-[#2a1810]/40 py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-gold"
              />
            </div>
            <Button onClick={() => setIsPergaminhoModalOpen(true)}>
              <Plus size={16} /> Nova história
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filteredPergaminhos.map((work) => (
            <Card
              key={work.id}
              hoverEffect
              className="flex cursor-pointer flex-col justify-between"
              onClick={() => setSelectedPergaminho(work)}
            >
              <div className="h-36 w-full overflow-hidden border-b border-white/5">
                <img
                  src={createCoverDataUri(work.title, work.genre, work.id)}
                  alt={`Capa da obra ${work.title}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <CardDescription>
                  {work.materialType} • {work.genre}
                </CardDescription>
                <CardTitle className="line-clamp-2">{work.title}</CardTitle>
                <span className="text-xs italic text-white/60">por {work.author}</span>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="line-clamp-3 text-xs leading-relaxed text-white/70">{work.synopsis}</p>
                <span className="mt-auto rounded border border-gold/15 bg-gold/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-gold-light">
                  {work.classification}
                </span>
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-2 border-t border-white/5 py-3">
                <div className="flex items-center justify-between">
                  {renderStars(work.rating)}
                  <span className="flex items-center gap-1 text-[10px] text-white/30">
                    Abrir <ChevronRight size={12} />
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(event) => {
                      event.stopPropagation();
                      addPergaminhoToLibrary(work);
                    }}
                  >
                    <BookOpen size={12} /> Biblioteca
                  </Button>
                  <Button
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      openNewRecommendationModal(work.id);
                    }}
                  >
                    <MessageSquare size={12} /> Recomendar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderRecommendations = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 border-b border-white/5 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-bold italic text-gold-light">
            <Sparkles size={20} /> Recomendações
          </h2>
          <p className="text-xs text-white/45">Agora você pode recomendar obras da Biblioteca e dos Pergaminhos.</p>
        </div>
        <Button onClick={() => openNewRecommendationModal()}>
          <Plus size={16} /> Nova recomendação
        </Button>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="flex flex-col justify-between">
              <div className="h-32 w-full overflow-hidden border-b border-white/5">
                <img
                  src={
                    recommendationCovers.get(recommendation.briefingTitle) ??
                    createCoverDataUri(recommendation.briefingTitle, "Recomendação", recommendation.id)
                  }
                  alt={`Capa da obra ${recommendation.briefingTitle}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="border-b border-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardDescription>Recomendação de obra</CardDescription>
                    <CardTitle className="italic">{recommendation.briefingTitle}</CardTitle>
                    <span className="text-[10px] text-white/40">
                      Escrito por <strong className="text-gold-light">{recommendation.authorName}</strong>
                    </span>
                  </div>
                  {renderStars(recommendation.ratingGiven, 12)}
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-5">
                <div className="relative pl-7">
                  <Quote className="absolute left-0 top-0 rotate-180 text-gold-dark/40" size={18} />
                  <p className="font-serif text-xs italic leading-relaxed text-white/85">{recommendation.content}</p>
                </div>
              </CardContent>
              <CardFooter className="py-3">
                <span className="text-[10px] text-white/30">
                  {new Date(recommendation.createdAt).toLocaleDateString("pt-BR")}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openEditRecommendationModal(recommendation)}>
                    <Pencil size={12} /> Alterar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => deleteRecommendation(recommendation.id)}>
                    <Trash2 size={12} /> Excluir
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <MessageSquare size={44} className="text-white/15" />
            <div>
              <h3 className="font-serif text-lg italic text-white/70">Nenhuma recomendação escrita</h3>
              <p className="text-xs text-white/35">Publique a primeira recomendação para uma obra da Biblioteca ou Pergaminhos.</p>
            </div>
            <Button variant="secondary" onClick={() => openNewRecommendationModal()}>
              Escrever recomendação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gold/15 bg-[#1e0f07]/90 px-6 py-4 backdrop-blur-md">
        <button className="flex items-center gap-3 text-left" onClick={() => navigateToTab("home")}>
          <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-gold/30 shadow-[0_0_12px_rgba(197,160,89,0.28)]">
            <Image src="/logo_app.png" alt="Ícone Beyond The Pages" fill sizes="56px" className="object-cover scale-110" priority />
          </span>
          <span>
            <span className="block font-serif text-2xl font-bold tracking-wide text-gold">Beyond The Pages</span>
          </span>
        </button>

        <nav className="hidden rounded-md border border-white/5 bg-[#1a0c05] p-1 md:flex">{NAV_ITEMS.map(renderTabButton)}</nav>

        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-white/40 lg:block">{userEmail}</span>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut size={14} /> Sair
          </Button>
        </div>
      </header>

      <nav className="grid grid-cols-4 gap-1 border-b border-white/5 bg-[#1a0c05]/80 p-2 md:hidden">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => navigateToTab(item.id)}
            className={`rounded px-2 py-2 text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === item.id ? "bg-[#2a1810] text-gold-light" : "text-white/40"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-6">
        <div key={activeTab} className="tab-smooth-enter">
          {activeTab === "home" && renderHome()}
          {activeTab === "library" && renderLibrary()}
          {activeTab === "pergaminhos" && renderPergaminhos()}
          {activeTab === "recommendations" && renderRecommendations()}
        </div>
      </main>

      <footer className="mt-auto border-t border-white/5 bg-[#1a0c05] py-4 text-center text-[10px] uppercase tracking-widest text-white/20">
        © MMXXVI BEYOND THE PAGES
      </footer>

      <Modal isOpen={selectedBriefing !== null} onClose={() => setSelectedBriefing(null)} title="Perfil da Obra" maxWidth="lg">
        {selectedBriefing && (
          <div className="flex flex-col gap-5">
            <div className="h-40 w-full overflow-hidden rounded-lg border border-white/10">
              <img
                src={createCoverDataUri(selectedBriefing.title, selectedBriefing.genre, selectedBriefing.id)}
                alt={`Capa da obra ${selectedBriefing.title}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="border-b border-white/5 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold/60">{selectedBriefing.materialType}</span>
              <h2 className="font-serif text-2xl font-bold italic text-gold-light">{selectedBriefing.title}</h2>
              <p className="text-sm italic text-white/60">por {selectedBriefing.author}</p>
            </div>

            <p className="text-sm leading-relaxed text-white/80">{selectedBriefing.summary}</p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded border border-white/5 bg-[#2a1810]/20 p-4">
                <p className="mb-2 text-[10px] uppercase tracking-wider text-white/45">Status</p>
                <select
                  value={selectedBriefingStatus}
                  onChange={(event) => setSelectedBriefingStatus(event.target.value as WorkStatus)}
                  className="w-full rounded border border-white/10 bg-[#2a1810] p-3 text-sm text-white outline-none transition-colors focus:border-gold"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded border border-white/5 bg-[#2a1810]/20 p-4">
                <p className="mb-2 text-[10px] uppercase tracking-wider text-white/45">Avaliação</p>
                <div className="flex items-center justify-between">
                  {renderStars(selectedBriefing.rating, 18)}
                  <span className="text-xs text-white/50">{selectedBriefing.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <Input
              label="Suas anotações"
              placeholder="Escreva observações, pontos fortes e trechos importantes..."
              value={selectedBriefingNotes}
              onChange={(event) => setSelectedBriefingNotes(event.target.value)}
              isTextArea
              rows={4}
            />

            <div className="flex flex-wrap justify-end gap-3 border-t border-white/5 pt-4">
              <Button variant="secondary" onClick={() => openNewRecommendationModal(selectedBriefing.id)}>
                <MessageSquare size={14} /> Recomendar obra
              </Button>
              <Button variant="secondary" onClick={saveSelectedBriefingDetails}>
                <Pencil size={14} /> Salvar alterações
              </Button>
              <Button onClick={() => setSelectedBriefing(null)}>Fechar</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isLibraryModalOpen} onClose={() => setIsLibraryModalOpen(false)} title="Adicionar obra à Biblioteca" maxWidth="lg">
        <form onSubmit={handleAddLibraryWork} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Título *" value={libTitle} onChange={(event) => setLibTitle(event.target.value)} required />
            <Input label="Autor *" value={libAuthor} onChange={(event) => setLibAuthor(event.target.value)} required />
            <div className="flex flex-col gap-1.5">
              <label className="font-serif text-base italic tracking-wide text-gold-light">Tipo</label>
              <select
                value={libType}
                onChange={(event) => setLibType(event.target.value as Briefing["materialType"])}
                className="w-full rounded border border-white/10 bg-[#2a1810] p-3.5 text-sm text-white outline-none transition-colors focus:border-gold"
              >
                <option value="Livro">Livro</option>
                <option value="Novel">Novel</option>
                <option value="Light Novel">Light Novel</option>
                <option value="Mangá">Mangá</option>
                <option value="HQ">HQ</option>
                <option value="Artigo">Artigo</option>
                <option value="Texto Livre">Texto Livre</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-serif text-base italic tracking-wide text-gold-light">Status</label>
              <select
                value={libStatus}
                onChange={(event) => setLibStatus(event.target.value as WorkStatus)}
                className="w-full rounded border border-white/10 bg-[#2a1810] p-3.5 text-sm text-white outline-none transition-colors focus:border-gold"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input label="Gênero" value={libGenre} onChange={(event) => setLibGenre(event.target.value)} />
          <Input
            label="Resumo *"
            value={libSummary}
            onChange={(event) => setLibSummary(event.target.value)}
            isTextArea
            rows={4}
            required
          />
          <Input
            label="Anotações da obra"
            value={libNotes}
            onChange={(event) => setLibNotes(event.target.value)}
            isTextArea
            rows={3}
          />

          <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsLibraryModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar obra</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isPergaminhoModalOpen} onClose={() => setIsPergaminhoModalOpen(false)} title="Adicionar nova história" maxWidth="lg">
        <form onSubmit={handleAddPergaminho} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Título *" value={newPergTitle} onChange={(event) => setNewPergTitle(event.target.value)} required />
            <Input label="Autor *" value={newPergAuthor} onChange={(event) => setNewPergAuthor(event.target.value)} required />
            <div className="flex flex-col gap-1.5">
              <label className="font-serif text-base italic tracking-wide text-gold-light">Tipo</label>
              <select
                value={newPergType}
                onChange={(event) => setNewPergType(event.target.value as PergaminhoWork["materialType"])}
                className="w-full rounded border border-white/10 bg-[#2a1810] p-3.5 text-sm text-white outline-none transition-colors focus:border-gold"
              >
                <option value="Novel">Novel</option>
                <option value="Livro">Livro</option>
                <option value="Light Novel">Light Novel</option>
              </select>
            </div>
            <Input label="Gênero" value={newPergGenre} onChange={(event) => setNewPergGenre(event.target.value)} />
          </div>

          <Input
            label="Classificação fictícia"
            value={newPergClassification}
            onChange={(event) => setNewPergClassification(event.target.value)}
            placeholder="Ex: Classe A — fantasia estratégica"
          />

          <Input
            label="Sinopse *"
            value={newPergSynopsis}
            onChange={(event) => setNewPergSynopsis(event.target.value)}
            isTextArea
            rows={4}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="font-serif text-base italic tracking-wide text-gold-light">Nota da obra</label>
            <input
              type="number"
              min={1}
              max={5}
              step={0.1}
              value={newPergRating}
              onChange={(event) => setNewPergRating(Number(event.target.value))}
              className="w-full rounded border border-white/10 bg-[#2a1810]/70 p-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-gold focus:ring-1 focus:ring-gold/30"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsPergaminhoModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar história</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isRecommendationModalOpen}
        onClose={() => {
          setIsRecommendationModalOpen(false);
          resetRecommendationForm();
        }}
        title={editingRecommendationId ? "Alterar recomendação" : "Escrever recomendação"}
        maxWidth="md"
      >
        <form onSubmit={handleRecommendationSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-serif text-base italic tracking-wide text-gold-light">Selecione a obra *</label>
            <select
              value={recBriefingId}
              onChange={(event) => setRecBriefingId(event.target.value)}
              className="w-full rounded border border-white/10 bg-[#2a1810] p-3.5 text-sm text-white outline-none transition-colors focus:border-gold"
              required
            >
              <option value="">-- Escolha uma obra --</option>
              {recommendationOptions.map((work) => (
                <option key={work.id} value={work.id}>
                  [{work.source}] {work.title} ({work.author})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Seu nome / apelido *"
            placeholder="Ex: Bibliotecário de Alexandria"
            value={recAuthorName}
            onChange={(event) => setRecAuthorName(event.target.value)}
            required
          />

          <Input
            label="Sua recomendação *"
            placeholder="Escreva por que outras pessoas deveriam ler esta obra..."
            value={recContent}
            onChange={(event) => setRecContent(event.target.value)}
            isTextArea
            rows={5}
            required
          />

          <div className="flex items-center justify-between gap-4 rounded border border-white/5 bg-[#2a1810]/40 p-4">
            <span className="font-serif text-base italic text-gold-light">Nota de recomendação:</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((stars) => (
                <button
                  type="button"
                  key={stars}
                  onClick={() => setRecRating(stars)}
                  className="transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star size={20} className={stars <= recRating ? "text-gold fill-gold" : "text-white/20"} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsRecommendationModalOpen(false);
                resetRecommendationForm();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">{editingRecommendationId ? "Salvar alterações" : "Publicar recomendação"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
