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

const NAV_ITEMS: { id: ActiveTab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "library", label: "Biblioteca" },
  { id: "pergaminhos", label: "Pergaminhos" },
  { id: "recommendations", label: "Recomendações" },
];

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

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, userEmail }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [briefings] = useState<Briefing[]>(() => loadStoredCollection("btp_briefings", INITIAL_BRIEFINGS));
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() =>
    loadStoredCollection("btp_recommendations", INITIAL_RECOMMENDATIONS)
  );
  const [librarySearch, setLibrarySearch] = useState("");
  const [pergaminhoSearch, setPergaminhoSearch] = useState("");
  const [selectedBriefing, setSelectedBriefing] = useState<Briefing | null>(null);
  const [selectedPergaminho, setSelectedPergaminho] = useState<PergaminhoWork | null>(null);
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

    return PERGAMINHOS.filter((work) =>
      [work.title, work.author, work.genre, work.materialType, work.classification]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [pergaminhoSearch]);

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

  const openNewRecommendationModal = (briefingId = "") => {
    resetRecommendationForm();
    setRecBriefingId(briefingId);
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

    const linkedBriefing = briefings.find((briefing) => briefing.id === recBriefingId);
    if (!linkedBriefing || !recAuthorName.trim() || !recContent.trim()) {
      alert("Preencha obra, nome e recomendação antes de publicar.");
      return;
    }

    if (editingRecommendationId) {
      const updatedRecommendations = recommendations.map((recommendation) =>
        recommendation.id === editingRecommendationId
          ? {
              ...recommendation,
              briefingId: linkedBriefing.id,
              briefingTitle: linkedBriefing.title,
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
        briefingId: linkedBriefing.id,
        briefingTitle: linkedBriefing.title,
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
      className={`rounded px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
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
            <h2 className="font-serif text-4xl font-bold italic text-gold-light md:text-5xl">
              Bem-vindo ao Beyond The Pages
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Organize leituras, publique recomendações e explore pergaminhos com novels e livros fictícios selecionados para descoberta rápida.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigateToTab("pergaminhos")}>
              <BookMarked size={16} /> Explorar Pergaminhos
            </Button>
            <Button variant="secondary" onClick={() => navigateToTab("recommendations")}>
              <MessageSquare size={16} /> Ver Recomendações
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Obras na biblioteca", value: briefings.length, icon: BookOpen },
          { label: "Pergaminhos aleatórios", value: PERGAMINHOS.length, icon: BookMarked },
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
          <p className="text-xs text-white/45">Briefings salvos no seu codex pessoal.</p>
        </div>
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
          <input
            type="text"
            placeholder="Pesquisar por título, autor ou gênero..."
            value={librarySearch}
            onChange={(event) => setLibrarySearch(event.target.value)}
            className="w-full rounded border border-white/10 bg-[#2a1810]/40 py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-gold"
          />
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
            <CardHeader>
              <CardDescription>{briefing.materialType}</CardDescription>
              <CardTitle className="line-clamp-1">{briefing.title}</CardTitle>
              <span className="text-xs italic text-white/60">por {briefing.author}</span>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <p className="line-clamp-4 text-xs leading-relaxed text-white/70">{briefing.summary}</p>
              <div className="mt-auto flex flex-col gap-2 border-t border-white/5 pt-3 text-[10px]">
                <span className="text-gold-light">{briefing.genre}</span>
                <span className="text-white/40">{briefing.protagonistPersonality}</span>
              </div>
            </CardContent>
            <CardFooter className="py-3">
              {renderStars(briefing.rating)}
              <span className="text-[10px] text-white/30">{briefing.status}</span>
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
                  <CardDescription>{selectedPergaminho.materialType} • {selectedPergaminho.genre}</CardDescription>
                  <CardTitle className="text-3xl italic text-gold-light">{selectedPergaminho.title}</CardTitle>
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
              <div>
                <h3 className="mb-4 flex items-center gap-2 font-serif text-xl font-bold italic text-gold-light">
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
            <p className="text-xs text-white/45">Lista de 20 novels e livros aleatórios para explorar.</p>
          </div>
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input
              type="text"
              placeholder="Pesquisar obras, autores, tipos ou gêneros..."
              value={pergaminhoSearch}
              onChange={(event) => setPergaminhoSearch(event.target.value)}
              className="w-full rounded border border-white/10 bg-[#2a1810]/40 py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-gold"
            />
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
                <CardDescription>{work.materialType} • {work.genre}</CardDescription>
                <CardTitle className="line-clamp-2">{work.title}</CardTitle>
                <span className="text-xs italic text-white/60">por {work.author}</span>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="line-clamp-4 text-xs leading-relaxed text-white/70">{work.synopsis}</p>
                <span className="mt-auto rounded border border-gold/15 bg-gold/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-gold-light">
                  {work.classification}
                </span>
              </CardContent>
              <CardFooter className="py-3">
                {renderStars(work.rating)}
                <span className="flex items-center gap-1 text-[10px] text-white/30">
                  Abrir <ChevronRight size={12} />
                </span>
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
            <Sparkles size={20} /> Recomendações do Codex
          </h2>
          <p className="text-xs text-white/45">Altere ou exclua recomendações já publicadas.</p>
        </div>
        <Button onClick={() => openNewRecommendationModal()}>
          <Plus size={16} /> Nova Recomendação
        </Button>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="flex flex-col justify-between">
              <CardHeader className="border-b border-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardDescription>Recomendação de Obra</CardDescription>
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
              <p className="text-xs text-white/35">Publique a primeira recomendação para uma obra da biblioteca.</p>
            </div>
            <Button variant="secondary" onClick={() => openNewRecommendationModal()}>
              Escrever Recomendação
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
          <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-gold/40 bg-[#2a1810] shadow-[0_0_10px_rgba(197,160,89,0.2)]">
            <Image src="/app_icon.png" alt="Ícone Beyond The Pages" fill sizes="48px" className="object-cover" priority />
          </span>
          <span>
            <span className="block font-serif text-2xl font-bold tracking-wide text-gold">Beyond The Pages</span>
            <span className="-mt-0.5 block text-[10px] uppercase tracking-widest text-white/40">
              Quando a história sai do papel
            </span>
          </span>
        </button>

        <nav className="hidden rounded-md border border-white/5 bg-[#1a0c05] p-1 md:flex">
          {NAV_ITEMS.map(renderTabButton)}
        </nav>

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
            className={`rounded px-2 py-2 text-[10px] font-semibold uppercase tracking-wider transition-all ${
              activeTab === item.id ? "bg-[#2a1810] text-gold-light" : "text-white/40"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-6">
        {activeTab === "home" && renderHome()}
        {activeTab === "library" && renderLibrary()}
        {activeTab === "pergaminhos" && renderPergaminhos()}
        {activeTab === "recommendations" && renderRecommendations()}
      </main>

      <footer className="mt-auto border-t border-white/5 bg-[#1a0c05] py-4 text-center text-[10px] uppercase tracking-widest text-white/20">
        © MMXXVI BEYOND THE PAGES • Quando a história sai do papel
      </footer>

      <Modal isOpen={selectedBriefing !== null} onClose={() => setSelectedBriefing(null)} title="Codex Manuscrito" maxWidth="lg">
        {selectedBriefing && (
          <div className="flex flex-col gap-6">
            <div className="border-b border-white/5 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold/60">{selectedBriefing.materialType}</span>
              <h2 className="font-serif text-3xl font-bold italic text-gold-light">{selectedBriefing.title}</h2>
              <p className="text-sm italic text-white/60">por {selectedBriefing.author}</p>
            </div>
            <p className="text-sm leading-relaxed text-white/80">{selectedBriefing.summary}</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded border border-white/5 bg-[#2a1810]/20 p-4">
                <h3 className="mb-2 font-serif text-base italic text-gold-light">Personagens</h3>
                <p className="text-xs leading-relaxed text-white/70">{selectedBriefing.characters}</p>
              </div>
              <div className="rounded border border-white/5 bg-[#2a1810]/20 p-4">
                <h3 className="mb-2 font-serif text-base italic text-gold-light">Temas</h3>
                <p className="text-xs leading-relaxed text-white/70">{selectedBriefing.themes}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
              <Button variant="secondary" onClick={() => openNewRecommendationModal(selectedBriefing.id)}>
                <MessageSquare size={14} /> Recomendar Obra
              </Button>
              <Button onClick={() => setSelectedBriefing(null)}>Fechar</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isRecommendationModalOpen}
        onClose={() => {
          setIsRecommendationModalOpen(false);
          resetRecommendationForm();
        }}
        title={editingRecommendationId ? "Alterar Recomendação" : "Escrever Recomendação"}
        maxWidth="md"
      >
        <form onSubmit={handleRecommendationSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-serif text-base italic tracking-wide text-gold-light">Selecione a Obra *</label>
            <select
              value={recBriefingId}
              onChange={(event) => setRecBriefingId(event.target.value)}
              className="w-full rounded border border-white/10 bg-[#2a1810] p-3.5 text-sm text-white outline-none transition-colors focus:border-gold"
              required
            >
              <option value="">-- Escolha uma obra --</option>
              {briefings.map((briefing) => (
                <option key={briefing.id} value={briefing.id}>
                  {briefing.title} ({briefing.author})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Seu Nome / Apelido *"
            placeholder="Ex: Bibliotecário de Alexandria"
            value={recAuthorName}
            onChange={(event) => setRecAuthorName(event.target.value)}
            required
          />

          <Input
            label="Sua Recomendação *"
            placeholder="Escreva por que outras pessoas deveriam ler esta obra..."
            value={recContent}
            onChange={(event) => setRecContent(event.target.value)}
            isTextArea
            rows={5}
            required
          />

          <div className="flex items-center justify-between gap-4 rounded border border-white/5 bg-[#2a1810]/40 p-4">
            <span className="font-serif text-base italic text-gold-light">Nota de Recomendação:</span>
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
            <Button type="submit">{editingRecommendationId ? "Salvar Alterações" : "Publicar Recomendação"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
