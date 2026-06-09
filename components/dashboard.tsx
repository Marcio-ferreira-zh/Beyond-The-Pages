"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  LogOut,
  MessageSquare,
  Pencil,
  Plus,
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

  const currentlyReading = useMemo(
    () =>
      briefings
        .filter((briefing) => normalizeStatus(briefing.status) === "Lendo")
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 4),
    [briefings]
  );

  const recentRecommendations = useMemo(
    () =>
      [...recommendations]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
    [recommendations]
  );

  const latestPergaminhos = useMemo(() => pergaminhos.slice(0, 4), [pergaminhos]);

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

  const openBriefingProfile = (briefing: Briefing) => {
    setSelectedBriefing(briefing);
    setSelectedBriefingNotes(briefing.personalNotes ?? "");
    setSelectedBriefingStatus(normalizeStatus(briefing.status));
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
    <div className="flex flex-col gap-6">
      <section className="gold-glass rounded-2xl border border-gold/20 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold italic text-gold-light">Seu painel de leitura</h2>
            <p className="mt-1 text-sm text-white/60">Visão rápida da sua biblioteca, recomendações e pergaminhos novos.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => navigateToTab("pergaminhos")}>
              <BookMarked size={14} /> Explorar Pergaminhos
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigateToTab("library")}>
              <BookOpen size={14} /> Abrir Biblioteca
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Lendo agora", value: currentlyReading.length, icon: BookOpen },
          { label: "Total na biblioteca", value: briefings.length, icon: BookMarked },
          { label: "Recomendações publicadas", value: recommendations.length, icon: Sparkles },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">{stat.label}</p>
                  <strong className="font-serif text-3xl text-gold-light">{stat.value}</strong>
                </div>
                <Icon className="text-gold/70" size={24} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-xl italic text-gold-light">O que está lendo</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {currentlyReading.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {currentlyReading.map((briefing) => (
                  <button
                    key={briefing.id}
                    type="button"
                    onClick={() => {
                      navigateToTab("library");
                      openBriefingProfile(briefing);
                    }}
                    className="rounded-lg border border-white/10 bg-[#2a1810]/35 p-3 text-left transition-colors hover:border-gold/35"
                  >
                    <p className="text-[10px] uppercase tracking-widest text-gold/70">
                      {briefing.materialType} • {briefing.genre}
                    </p>
                    <p className="mt-1 line-clamp-1 font-serif text-lg text-gold-light">{briefing.title}</p>
                    <p className="text-xs italic text-white/60">por {briefing.author}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/55">Nenhuma leitura em andamento. Adicione uma obra e marque como “Lendo”.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-xl italic text-gold-light">Novos pergaminhos</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col gap-3">
              {latestPergaminhos.map((work) => (
                <button
                  key={work.id}
                  type="button"
                  onClick={() => {
                    navigateToTab("pergaminhos");
                    setSelectedPergaminho(work);
                  }}
                  className="rounded-lg border border-white/10 bg-[#2a1810]/35 p-3 text-left transition-colors hover:border-gold/35"
                >
                  <p className="line-clamp-1 font-serif text-base text-gold-light">{work.title}</p>
                  <p className="text-[11px] text-white/60">{work.author}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-xl italic text-gold-light">Recomendações recentes</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {recentRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {recentRecommendations.map((recommendation) => (
                <div key={recommendation.id} className="rounded-lg border border-white/10 bg-[#2a1810]/35 p-4">
                  <p className="line-clamp-1 font-serif text-base text-gold-light">{recommendation.briefingTitle}</p>
                  <p className="text-[11px] text-white/55">por {recommendation.authorName}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/70">{recommendation.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/55">Você ainda não publicou recomendações.</p>
          )}
        </CardContent>
      </Card>
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
            onClick={() => openBriefingProfile(briefing)}
          >
            <CardHeader>
              <CardDescription>{briefing.materialType} • {briefing.genre}</CardDescription>
              <CardTitle className="line-clamp-2">{briefing.title}</CardTitle>
              <span className="text-xs italic text-white/60">por {briefing.author}</span>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <p className="line-clamp-3 text-xs leading-relaxed text-white/70">{briefing.summary}</p>
              <div className="mt-auto flex items-center justify-between gap-2">
                <span
                  className={`rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusBadgeClasses(normalizeStatus(briefing.status))}`}
                >
                  {normalizeStatus(briefing.status)}
                </span>
                <span className="text-[11px] text-gold-light">{briefing.rating.toFixed(1)}</span>
              </div>
            </CardContent>
            <CardFooter className="!grid grid-cols-2 !items-stretch !justify-normal gap-2 border-t border-white/5 py-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={(event) => {
                  event.stopPropagation();
                  openBriefingProfile(briefing);
                }}
              >
                <BookOpen size={12} /> Biblioteca
              </Button>
              <Button
                size="sm"
                onClick={(event) => {
                  event.stopPropagation();
                  openNewRecommendationModal(briefing.id);
                }}
              >
                <MessageSquare size={12} /> Recomendar
              </Button>
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
                  <p className="text-[10px] uppercase tracking-widest text-white/35">Classificação</p>
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
                  <MessageSquare size={18} /> Recomendações da obra
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
                  <span className="text-[10px] text-white/35">{work.rating.toFixed(1)}</span>
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
                <p className="font-serif text-xs italic leading-relaxed text-white/85">{recommendation.content}</p>
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
            label="Classificação"
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
