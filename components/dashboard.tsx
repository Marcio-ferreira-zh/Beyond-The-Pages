"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
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

// Removed createCoverDataUri to stop creating fake covers

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Obras na biblioteca", value: briefings.length, icon: BookOpen, color: "text-gold-light" },
          { label: "Pergaminhos disponíveis", value: pergaminhos.length, icon: BookMarked, color: "text-gold" },
          { label: "Recomendações feitas", value: recommendations.length, icon: Sparkles, color: "text-gold-accent" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-gold/10">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-lg bg-gold/5 p-3 ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">{stat.label}</p>
                  <strong className="font-serif text-2xl text-gold-light">{stat.value}</strong>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold italic text-gold-light">Lendo agora</h3>
            <Button variant="ghost" size="sm" onClick={() => navigateToTab("library")}>
              Ver tudo <ChevronRight size={14} />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {briefings.filter(b => b.status === "Lendo").slice(0, 2).map(briefing => (
              <Card key={briefing.id} hoverEffect onClick={() => openBriefingProfile(briefing)} className="cursor-pointer">
                <CardHeader>
                  <CardDescription>{briefing.materialType} • {briefing.genre}</CardDescription>
                  <CardTitle>{briefing.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-xs text-white/60">{briefing.summary}</p>
                </CardContent>
              </Card>
            ))}
            {briefings.filter(b => b.status === "Lendo").length === 0 && (
              <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5">
                <p className="text-xs text-white/30 italic">Nenhuma leitura em andamento</p>
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold italic text-gold-light">Novos Pergaminhos</h3>
            <Button variant="ghost" size="sm" onClick={() => navigateToTab("pergaminhos")}>
              Explorar <ChevronRight size={14} />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {pergaminhos.slice(0, 2).map(work => (
              <Card key={work.id} hoverEffect onClick={() => setSelectedPergaminho(work)} className="cursor-pointer">
                <CardHeader>
                  <CardDescription>{work.materialType} • {work.genre}</CardDescription>
                  <CardTitle>{work.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-xs text-white/60">{work.synopsis}</p>
                  <div className="mt-3 inline-block rounded border border-gold/20 bg-gold/5 px-2 py-1 text-[9px] font-bold uppercase tracking-tighter text-gold-light">
                    {work.classification}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
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
          <p className="text-xs text-white/45">Sua coleção pessoal de obras e anotações.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:min-w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input
              type="text"
              placeholder="Pesquisar na biblioteca..."
              value={librarySearch}
              onChange={(event) => setLibrarySearch(event.target.value)}
              className="w-full rounded border border-white/10 bg-[#2a1810]/40 py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-gold"
            />
          </div>
          <Button onClick={() => setIsLibraryModalOpen(true)}>
            <Plus size={16} /> Adicionar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredBriefings.map((briefing) => (
          <Card
            key={briefing.id}
            hoverEffect
            className="flex cursor-pointer flex-col justify-between"
            onClick={() => openBriefingProfile(briefing)}
          >
            <CardHeader>
              <CardDescription>{briefing.materialType} • {briefing.genre}</CardDescription>
              <CardTitle className="line-clamp-1">{briefing.title}</CardTitle>
              <span className="text-[11px] italic text-white/50">por {briefing.author}</span>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              <p className="line-clamp-3 text-xs leading-relaxed text-white/70">{briefing.summary}</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <span
                  className={`rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeClasses(
                    normalizeStatus(briefing.status)
                  )}`}
                >
                  {normalizeStatus(briefing.status)}
                </span>
                {renderStars(briefing.rating, 12)}
              </div>
            </CardContent>
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
            <ArrowLeft size={14} /> Voltar
          </Button>

          <Card>
            <CardHeader className="border-b border-white/5 pb-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <CardDescription>
                    {selectedPergaminho.materialType} • {selectedPergaminho.genre}
                  </CardDescription>
                  <CardTitle className="text-2xl italic text-gold-light md:text-3xl">{selectedPergaminho.title}</CardTitle>
                  <p className="text-sm italic text-white/60">por {selectedPergaminho.author}</p>
                </div>
                <div className="rounded-lg border border-gold/20 bg-[#1a0c05]/70 p-4 text-right">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Classificação</p>
                  <strong className="font-serif text-base italic text-gold-light">{selectedPergaminho.classification}</strong>
                  <div className="mt-2 flex justify-end">{renderStars(selectedPergaminho.rating, 16)}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-8 pt-6">
              <div className="max-w-3xl">
                <h4 className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Sinopse</h4>
                <p className="text-sm leading-relaxed text-white/80">{selectedPergaminho.synopsis}</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => addPergaminhoToLibrary(selectedPergaminho)}>
                  <BookOpen size={14} /> Biblioteca
                </Button>
                <Button variant="secondary" onClick={() => openNewRecommendationModal(selectedPergaminho.id)}>
                  <MessageSquare size={14} /> Recomendar
                </Button>
              </div>

              <div>
                <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold italic text-gold-light">
                  <MessageSquare size={18} /> Críticas da Obra
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {selectedPergaminho.recommendations.map((recommendation) => (
                    <div key={recommendation.userName} className="rounded-xl border border-white/5 bg-[#2a1810]/35 p-5">
                      <p className="font-serif text-base font-bold italic text-gold-light">{recommendation.userName}</p>
                      <p className="mb-3 text-[10px] uppercase tracking-widest text-white/40">{recommendation.role}</p>
                      <p className="text-xs leading-relaxed text-white/70 italic">"{recommendation.content}"</p>
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
            <p className="text-xs text-white/45">Explore novas histórias e autores independentes.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:min-w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input
                type="text"
                placeholder="Pesquisar pergaminhos..."
                value={pergaminhoSearch}
                onChange={(event) => setPergaminhoSearch(event.target.value)}
                className="w-full rounded border border-white/10 bg-[#2a1810]/40 py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-gold"
              />
            </div>
            <Button onClick={() => setIsPergaminhoModalOpen(true)}>
              <Plus size={16} /> Nova História
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredPergaminhos.map((work) => (
            <Card
              key={work.id}
              hoverEffect
              className="flex cursor-pointer flex-col justify-between"
              onClick={() => setSelectedPergaminho(work)}
            >
              <CardHeader>
                <CardDescription>{work.materialType} • {work.genre}</CardDescription>
                <CardTitle className="line-clamp-2">{work.title}</CardTitle>
                <span className="text-[11px] italic text-white/50">por {work.author}</span>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="line-clamp-3 text-xs leading-relaxed text-white/70">{work.synopsis}</p>
                <div className="mt-auto rounded-lg border border-gold/15 bg-gold/5 px-3 py-2">
                   <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Classificação</p>
                   <p className="text-[10px] font-bold text-gold-light truncate">{work.classification}</p>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-3 pt-3">
                <div className="flex items-center justify-between">
                  {renderStars(work.rating, 12)}
                  <span className="flex items-center gap-1 text-[10px] text-white/30">
                    Detalhes <ChevronRight size={12} />
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 text-[10px]"
                    onClick={(event) => {
                      event.stopPropagation();
                      addPergaminhoToLibrary(work);
                    }}
                  >
                    Biblioteca
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-[10px]"
                    onClick={(event) => {
                      event.stopPropagation();
                      openNewRecommendationModal(work.id);
                    }}
                  >
                    Recomendar
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
          <p className="text-xs text-white/45">Compartilhe suas obras favoritas com a comunidade.</p>
        </div>
        <Button onClick={() => openNewRecommendationModal()}>
          <Plus size={16} /> Recomendar
        </Button>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="flex flex-col justify-between">
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardDescription>Recomendação</CardDescription>
                    <CardTitle className="italic">{recommendation.briefingTitle}</CardTitle>
                    <span className="text-[10px] text-white/40">
                      Por <strong className="text-gold-light">{recommendation.authorName}</strong>
                    </span>
                  </div>
                  {renderStars(recommendation.ratingGiven, 12)}
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-5">
                <div className="relative pl-7">
                  <Quote className="absolute left-0 top-0 rotate-180 text-gold-dark/30" size={18} />
                  <p className="font-serif text-sm italic leading-relaxed text-white/80">{recommendation.content}</p>
                </div>
              </CardContent>
              <CardFooter className="py-3">
                <span className="text-[10px] text-white/30">
                  {new Date(recommendation.createdAt).toLocaleDateString("pt-BR")}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="h-7 px-3 text-[10px]" onClick={() => openEditRecommendationModal(recommendation)}>
                    <Pencil size={10} /> Editar
                  </Button>
                  <Button size="sm" variant="danger" className="h-7 px-3 text-[10px]" onClick={() => deleteRecommendation(recommendation.id)}>
                    <Trash2 size={10} /> Excluir
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-center p-8">
           <Sparkles className="text-white/10 mb-4" size={48} />
           <p className="text-white/40 font-serif italic">Nenhuma recomendação publicada ainda.</p>
           <Button variant="ghost" className="mt-4" onClick={() => openNewRecommendationModal()}>Publicar primeira</Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#1a0c05]">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#1a0c05]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 p-1.5">
              <Image src="/logo_app.png" alt="Beyond The Pages Logo" width={40} height={40} className="object-contain" />
            </div>
            <h1 className="hidden font-serif text-xl font-bold italic tracking-tight text-gold-light sm:block">
              Beyond The Pages
            </h1>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map(renderTabButton)}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <p className="text-[10px] uppercase tracking-widest text-white/30">Membro da Ordem</p>
              <p className="text-xs font-bold text-gold-light">{userEmail}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-white/40 hover:text-rose-400">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
        
        {/* Mobile Nav */}
        <div className="flex items-center justify-center border-t border-white/5 px-2 py-2 md:hidden">
          <div className="flex w-full items-center justify-around">
             {NAV_ITEMS.map(item => (
               <button 
                 key={item.id}
                 onClick={() => navigateToTab(item.id)}
                 className={`p-2 transition-colors ${activeTab === item.id ? 'text-gold' : 'text-white/30'}`}
               >
                 {item.id === 'home' && <Home size={20} />}
                 {item.id === 'library' && <BookOpen size={20} />}
                 {item.id === 'pergaminhos' && <BookMarked size={20} />}
                 {item.id === 'recommendations' && <Sparkles size={20} />}
               </button>
             ))}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6">
        <div className="tab-smooth-enter">
          {activeTab === "home" && renderHome()}
          {activeTab === "library" && renderLibrary()}
          {activeTab === "pergaminhos" && renderPergaminhos()}
          {activeTab === "recommendations" && renderRecommendations()}
        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={selectedBriefing !== null}
        onClose={() => setSelectedBriefing(null)}
        title="Detalhes da Obra"
        footer={
          <div className="flex w-full justify-between gap-3">
            <Button variant="danger" size="sm" onClick={() => {
              if (confirm("Excluir esta obra da biblioteca?")) {
                saveBriefings(briefings.filter(b => b.id !== selectedBriefing?.id));
                setSelectedBriefing(null);
              }
            }}>
              Excluir
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedBriefing(null)}>
                Fechar
              </Button>
              <Button size="sm" onClick={saveSelectedBriefingDetails}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        }
      >
        {selectedBriefing && (
          <div className="flex flex-col gap-6 py-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{selectedBriefing.materialType} • {selectedBriefing.genre}</p>
              <h3 className="font-serif text-2xl font-bold italic text-gold-light">{selectedBriefing.title}</h3>
              <p className="text-sm italic text-white/60">por {selectedBriefing.author}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-white/30">Status de Leitura</label>
                <select
                  value={selectedBriefingStatus}
                  onChange={(e) => setSelectedBriefingStatus(e.target.value as WorkStatus)}
                  className="w-full rounded border border-white/10 bg-[#1a0c05] p-2 text-xs text-white outline-none focus:border-gold"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-white/30">Sua Avaliação</label>
                <div className="flex h-9 items-center px-1">
                   {renderStars(selectedBriefing.rating, 16)}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30">Resumo da Obra</label>
              <p className="text-xs leading-relaxed text-white/70 bg-white/5 p-3 rounded-lg border border-white/5">
                {selectedBriefing.summary}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30">Notas Pessoais</label>
              <textarea
                value={selectedBriefingNotes}
                onChange={(e) => setSelectedBriefingNotes(e.target.value)}
                placeholder="O que você está achando desta leitura? Anote pensamentos, teorias ou citações..."
                className="min-h-32 w-full rounded border border-white/10 bg-[#1a0c05] p-3 text-xs text-white outline-none focus:border-gold"
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        title="Adicionar à Biblioteca"
      >
        <form onSubmit={handleAddLibraryWork} className="flex flex-col gap-4 py-2">
          <Input label="Título da Obra" value={libTitle} onChange={e => setLibTitle(e.target.value)} placeholder="Ex: O Nome do Vento" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Autor" value={libAuthor} onChange={e => setLibAuthor(e.target.value)} placeholder="Ex: Patrick Rothfuss" />
            <Input label="Gênero" value={libGenre} onChange={e => setLibGenre(e.target.value)} placeholder="Ex: Fantasia Épica" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/30">Tipo de Material</label>
            <select
              value={libType}
              onChange={(e) => setLibType(e.target.value as Briefing["materialType"])}
              className="w-full rounded border border-white/10 bg-[#1a0c05] p-2.5 text-xs text-white outline-none focus:border-gold"
            >
              {["Livro", "Mangá", "HQ", "Novel", "Light Novel", "Artigo"].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/30">Sinopse/Resumo</label>
            <textarea
              value={libSummary}
              onChange={(e) => setLibSummary(e.target.value)}
              placeholder="Uma breve descrição da história..."
              className="min-h-24 w-full rounded border border-white/10 bg-[#1a0c05] p-3 text-xs text-white outline-none focus:border-gold"
            />
          </div>
          <Button type="submit" className="mt-2">Salvar na Biblioteca</Button>
        </form>
      </Modal>

      <Modal
        isOpen={isPergaminhoModalOpen}
        onClose={() => setIsPergaminhoModalOpen(false)}
        title="Publicar Nova História"
      >
        <form onSubmit={handleAddPergaminho} className="flex flex-col gap-4 py-2">
          <Input label="Título" value={newPergTitle} onChange={e => setNewPergTitle(e.target.value)} placeholder="Título da sua história" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Autor" value={newPergAuthor} onChange={e => setNewPergAuthor(e.target.value)} placeholder="Seu nome ou pseudônimo" />
            <Input label="Gênero" value={newPergGenre} onChange={e => setNewPergGenre(e.target.value)} placeholder="Ex: Cyberpunk" />
          </div>
          <Input label="Classificação de Impacto" value={newPergClassification} onChange={e => setNewPergClassification(e.target.value)} placeholder="Ex: Classe S — Épico" />
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/30">Sinopse</label>
            <textarea
              value={newPergSynopsis}
              onChange={(e) => setNewPergSynopsis(e.target.value)}
              placeholder="Do que se trata a obra?"
              className="min-h-24 w-full rounded border border-white/10 bg-[#1a0c05] p-3 text-xs text-white outline-none focus:border-gold"
            />
          </div>
          <Button type="submit" className="mt-2">Publicar nos Pergaminhos</Button>
        </form>
      </Modal>

      <Modal
        isOpen={isRecommendationModalOpen}
        onClose={() => setIsRecommendationModalOpen(false)}
        title={editingRecommendationId ? "Editar Recomendação" : "Nova Recomendação"}
      >
        <form onSubmit={handleRecommendationSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/30">Obra para Recomendar</label>
            <select
              value={recBriefingId}
              onChange={(e) => setRecBriefingId(e.target.value)}
              className="w-full rounded border border-white/10 bg-[#1a0c05] p-2.5 text-xs text-white outline-none focus:border-gold"
            >
              <option value="">Selecione uma obra...</option>
              {recommendationOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.title} ({opt.source})</option>
              ))}
            </select>
          </div>
          <Input label="Seu Nome" value={recAuthorName} onChange={e => setRecAuthorName(e.target.value)} placeholder="Como quer ser identificado" />
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/30">Sua Recomendação</label>
            <textarea
              value={recContent}
              onChange={(e) => setRecContent(e.target.value)}
              placeholder="Por que você recomenda esta obra?"
              className="min-h-32 w-full rounded border border-white/10 bg-[#1a0c05] p-3 text-xs text-white outline-none focus:border-gold"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/30">Nota (1 a 5)</label>
            <input 
              type="range" min="1" max="5" step="1" 
              value={recRating} 
              onChange={e => setRecRating(parseInt(e.target.value))}
              className="accent-gold"
            />
            <div className="flex justify-center mt-1">{renderStars(recRating, 20)}</div>
          </div>
          <Button type="submit" className="mt-2">
            {editingRecommendationId ? "Atualizar" : "Publicar"} Recomendação
          </Button>
        </form>
      </Modal>
    </div>
  );
};
