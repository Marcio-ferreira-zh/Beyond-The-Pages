"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  BookOpen, 
  Plus, 
  Filter, 
  MessageSquare, 
  Star, 
  Clock, 
  BookMarked, 
  User, 
  Layers, 
  Globe, 
  Compass, 
  LogOut, 
  Bookmark, 
  Quote, 
  ChevronRight, 
  Sparkles,
  RefreshCw
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Modal } from "./ui/modal";
import { 
  Briefing, 
  Recommendation, 
  INITIAL_BRIEFINGS, 
  INITIAL_RECOMMENDATIONS,
  GENRES,
  PROTAGONIST_PERSONALITIES,
  WORLD_TYPES
} from "../data/mockData";

interface DashboardProps {
  onLogout: () => void;
  userEmail: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, userEmail }) => {
  // State
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeTab, setActiveTab] = useState<"library" | "recommendations">("library");
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPersonality, setSelectedPersonality] = useState("");
  const [selectedWorldType, setSelectedWorldType] = useState("");
  const [selectedMaterialType, setSelectedMaterialType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  
  // Modals state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBriefing, setSelectedBriefing] = useState<Briefing | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);

  // Form states
  // New Briefing form
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newMaterialType, setNewMaterialType] = useState<Briefing["materialType"]>("Livro");
  const [newStatus, setNewStatus] = useState<Briefing["status"]>("Lendo");
  const [newSummary, setNewSummary] = useState("");
  const [newCharacters, setNewCharacters] = useState("");
  const [newThemes, setNewThemes] = useState("");
  const [newQuotes, setNewQuotes] = useState("");
  const [newPersonalNotes, setNewPersonalNotes] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newGenre, setNewGenre] = useState("");
  const [newPersonality, setNewPersonality] = useState("");
  const [newWorldType, setNewWorldType] = useState("");

  // New Recommendation form
  const [recBriefingId, setRecBriefingId] = useState("");
  const [recAuthorName, setRecAuthorName] = useState("");
  const [recContent, setRecContent] = useState("");
  const [recRating, setRecRating] = useState(5);

  // Hydration safety: Load from localStorage on mount
  useEffect(() => {
    const storedBriefings = localStorage.getItem("btp_briefings");
    const storedRecommendations = localStorage.getItem("btp_recommendations");

    if (storedBriefings) {
      setBriefings(JSON.parse(storedBriefings));
    } else {
      setBriefings(INITIAL_BRIEFINGS);
      localStorage.setItem("btp_briefings", JSON.stringify(INITIAL_BRIEFINGS));
    }

    if (storedRecommendations) {
      setRecommendations(JSON.parse(storedRecommendations));
    } else {
      setRecommendations(INITIAL_RECOMMENDATIONS);
      localStorage.setItem("btp_recommendations", JSON.stringify(INITIAL_RECOMMENDATIONS));
    }
  }, []);

  // Sync state helpers
  const saveBriefings = (updated: Briefing[]) => {
    setBriefings(updated);
    localStorage.setItem("btp_briefings", JSON.stringify(updated));
  };

  const saveRecommendations = (updated: Recommendation[]) => {
    setRecommendations(updated);
    localStorage.setItem("btp_recommendations", JSON.stringify(updated));
  };

  // Filter handlers
  const handleResetFilters = () => {
    setSelectedGenre("");
    setSelectedPersonality("");
    setSelectedWorldType("");
    setSelectedMaterialType("");
    setSelectedStatus("");
    setSearchQuery("");
  };

  // Filter calculation
  const filteredBriefings = briefings.filter((b) => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = selectedGenre ? b.genre === selectedGenre : true;
    const matchesPersonality = selectedPersonality ? b.protagonistPersonality === selectedPersonality : true;
    const matchesWorld = selectedWorldType ? b.worldType === selectedWorldType : true;
    const matchesMaterial = selectedMaterialType ? b.materialType === selectedMaterialType : true;
    const matchesStatus = selectedStatus ? b.status === selectedStatus : true;

    return matchesSearch && matchesGenre && matchesPersonality && matchesWorld && matchesMaterial && matchesStatus;
  });

  // Action: Create Briefing
  const handleCreateBriefing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor || !newGenre || !newPersonality || !newWorldType) {
      alert("Por favor, preencha os campos obrigatórios (Título, Autor, Gênero, Personalidade e Tipo de Mundo).");
      return;
    }

    const quotesArray = newQuotes
      ? newQuotes.split("\n").filter((q) => q.trim() !== "")
      : [];

    const newBriefingItem: Briefing = {
      id: Date.now().toString(),
      title: newTitle,
      author: newAuthor,
      materialType: newMaterialType,
      status: newStatus,
      summary: newSummary,
      characters: newCharacters,
      themes: newThemes,
      quotes: quotesArray,
      personalNotes: newPersonalNotes,
      rating: newRating,
      genre: newGenre,
      protagonistPersonality: newPersonality,
      worldType: newWorldType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newBriefingItem, ...briefings];
    saveBriefings(updated);
    setIsCreateOpen(false);

    // Reset form states
    setNewTitle("");
    setNewAuthor("");
    setNewMaterialType("Livro");
    setNewStatus("Lendo");
    setNewSummary("");
    setNewCharacters("");
    setNewThemes("");
    setNewQuotes("");
    setNewPersonalNotes("");
    setNewRating(5);
    setNewGenre("");
    setNewPersonality("");
    setNewWorldType("");
  };

  // Action: Create Recommendation
  const handleCreateRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recBriefingId || !recAuthorName || !recContent) {
      alert("Por favor, preencha todos os campos da recomendação.");
      return;
    }

    const linkedBriefing = briefings.find((b) => b.id === recBriefingId);
    if (!linkedBriefing) return;

    const newRecItem: Recommendation = {
      id: Date.now().toString(),
      briefingId: recBriefingId,
      briefingTitle: linkedBriefing.title,
      authorName: recAuthorName,
      content: recContent,
      ratingGiven: recRating,
      createdAt: new Date().toISOString(),
    };

    const updated = [newRecItem, ...recommendations];
    saveRecommendations(updated);
    setIsRecommendOpen(false);

    // Reset form states
    setRecBriefingId("");
    setRecAuthorName("");
    setRecContent("");
    setRecRating(5);
  };

  // Action: Delete Briefing
  const handleDeleteBriefing = (id: string) => {
    if (confirm("Tem certeza de que deseja excluir este briefing?")) {
      const updated = briefings.filter((b) => b.id !== id);
      saveBriefings(updated);
      setIsDetailOpen(false);
      setSelectedBriefing(null);
    }
  };

  // Open Recommendation form pre-filled with specific briefing
  const handleOpenRecommendForBriefing = (briefing: Briefing) => {
    setRecBriefingId(briefing.id);
    setIsDetailOpen(false);
    setIsRecommendOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Banner Header */}
      <header className="border-b border-gold/15 bg-[#1e0f07]/90 sticky top-0 z-40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center bg-[#2a1810] shadow-[0_0_10px_rgba(197,160,89,0.2)]">
            <BookOpen size={20} className="text-gold" />
          </div>
          <div>
            <h1 className="text-gold font-serif text-2xl font-bold tracking-wide">
              Beyond The Pages
            </h1>
            <p className="text-white/40 text-[10px] tracking-widest uppercase -mt-0.5">
              Quando a história sai do papel
            </p>
          </div>
        </div>

        {/* Header Center Nav Tabs */}
        <div className="hidden md:flex bg-[#1a0c05] p-1 rounded-md border border-white/5">
          <button
            onClick={() => setActiveTab("library")}
            className={`px-4 py-1.5 rounded text-xs tracking-wider uppercase font-semibold transition-all ${
              activeTab === "library"
                ? "bg-gradient-to-r from-gold to-gold-light text-[#1a0c05]"
                : "text-white/60 hover:text-white"
            }`}
          >
            Biblioteca
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`px-4 py-1.5 rounded text-xs tracking-wider uppercase font-semibold transition-all ${
              activeTab === "recommendations"
                ? "bg-gradient-to-r from-gold to-gold-light text-[#1a0c05]"
                : "text-white/60 hover:text-white"
            }`}
          >
            Recomendações
          </button>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-[#2a1810]/40 px-3 py-1.5 rounded border border-white/5 text-xs text-white/70">
            <User size={14} className="text-gold-light" />
            <span className="truncate max-w-[150px]">{userEmail}</span>
          </div>
          <button
            onClick={onLogout}
            className="text-white/40 hover:text-red-400 p-2 rounded transition-colors hover:bg-white/5"
            title="Sair da Biblioteca"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Mobile Tab Selectors */}
      <div className="md:hidden flex border-b border-white/5 bg-[#1a0c05]/60 p-2">
        <button
          onClick={() => setActiveTab("library")}
          className={`flex-1 text-center py-2.5 rounded text-xs uppercase font-semibold tracking-wider transition-all ${
            activeTab === "library"
              ? "bg-[#2a1810] text-gold-light border-b-2 border-gold"
              : "text-white/40"
          }`}
        >
          Biblioteca
        </button>
        <button
          onClick={() => setActiveTab("recommendations")}
          className={`flex-1 text-center py-2.5 rounded text-xs uppercase font-semibold tracking-wider transition-all ${
            activeTab === "recommendations"
              ? "bg-[#2a1810] text-gold-light border-b-2 border-gold"
              : "text-white/40"
          }`}
        >
          Recomendações
        </button>
      </div>

      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col lg:flex-row">
        
        {/* Left Sidebar - Filters Panel (Only for Library Tab) */}
        {activeTab === "library" && (
          <aside className="w-full lg:w-80 border-r lg:border-b-0 border-b border-gold/10 bg-[#1e0f07]/30 p-6 flex flex-col gap-6 shrink-0 lg:max-h-[calc(100vh-80px)] lg:overflow-y-auto custom-scroll">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-gold-light text-lg italic font-bold flex items-center gap-2">
                <Filter size={16} /> Filtros de Manuscrito
              </h2>
              <button
                onClick={handleResetFilters}
                className="text-[10px] text-white/30 hover:text-gold uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={10} /> Limpar
              </button>
            </div>

            {/* Filters Controls */}
            <div className="flex flex-col gap-4">
              
              {/* Genre Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 uppercase tracking-widest flex items-center gap-1">
                  <Compass size={12} className="text-gold/60" /> Gênero Literário
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full bg-[#2a1810] border border-white/10 rounded p-2.5 text-xs text-white focus:border-gold outline-none transition-colors"
                >
                  <option value="">Todos os Gêneros</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Protagonist Personality Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 uppercase tracking-widest flex items-center gap-1">
                  <User size={12} className="text-gold/60" /> Personalidade do Protagonista
                </label>
                <select
                  value={selectedPersonality}
                  onChange={(e) => setSelectedPersonality(e.target.value)}
                  className="w-full bg-[#2a1810] border border-white/10 rounded p-2.5 text-xs text-white focus:border-gold outline-none transition-colors"
                >
                  <option value="">Qualquer Personalidade</option>
                  {PROTAGONIST_PERSONALITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* World Type Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 uppercase tracking-widest flex items-center gap-1">
                  <Globe size={12} className="text-gold/60" /> Tipo de Mundo / Universo
                </label>
                <select
                  value={selectedWorldType}
                  onChange={(e) => setSelectedWorldType(e.target.value)}
                  className="w-full bg-[#2a1810] border border-white/10 rounded p-2.5 text-xs text-white focus:border-gold outline-none transition-colors"
                >
                  <option value="">Qualquer Mundo</option>
                  {WORLD_TYPES.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <hr className="border-white/5 my-2" />

              {/* Material Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 uppercase tracking-widest flex items-center gap-1">
                  <Layers size={12} className="text-gold/60" /> Tipo de Material
                </label>
                <select
                  value={selectedMaterialType}
                  onChange={(e) => setSelectedMaterialType(e.target.value)}
                  className="w-full bg-[#2a1810] border border-white/10 rounded p-2.5 text-xs text-white focus:border-gold outline-none transition-colors"
                >
                  <option value="">Todos os Formatos</option>
                  <option value="Livro">Livro</option>
                  <option value="Mangá">Mangá</option>
                  <option value="HQ">HQ</option>
                  <option value="Artigo">Artigo</option>
                  <option value="Light Novel">Light Novel</option>
                  <option value="Texto Livre">Texto Livre</option>
                </select>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 uppercase tracking-widest flex items-center gap-1">
                  <BookMarked size={12} className="text-gold/60" /> Status de Leitura
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-[#2a1810] border border-white/10 rounded p-2.5 text-xs text-white focus:border-gold outline-none transition-colors"
                >
                  <option value="">Qualquer Status</option>
                  <option value="Lendo">Lendo</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Pausado">Pausado</option>
                  <option value="Abandonado">Abandonado</option>
                </select>
              </div>

            </div>

            {/* Quick stats */}
            <div className="mt-auto pt-6 border-t border-white/5 hidden lg:block">
              <div className="bg-[#2a1810]/30 p-4 rounded border border-white/5 text-xs text-white/45 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>Total de Briefings:</span>
                  <span className="text-gold font-bold">{briefings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Filtrados:</span>
                  <span className="text-gold-light">{filteredBriefings.length}</span>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Center Workspace Content Area */}
        <section className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto custom-scroll lg:max-h-[calc(100vh-80px)]">
          
          {activeTab === "library" ? (
            /* TAB 1: LIBRARY */
            <>
              {/* Search and Action Bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* Search Input wrapper */}
                <div className="relative w-full sm:max-w-md">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/20">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Pesquise por título, autor, resumos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#2a1810]/40 border border-white/10 pl-10 pr-4 py-3 rounded text-sm text-white focus:border-gold outline-none transition-colors placeholder:text-white/20"
                  />
                </div>

                {/* Add new Briefing Button */}
                <Button 
                  onClick={() => setIsCreateOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Plus size={16} /> Novo Briefing
                </Button>
              </div>

              {/* Filtering badges indicators */}
              {(selectedGenre || selectedPersonality || selectedWorldType || selectedMaterialType || selectedStatus || searchQuery) && (
                <div className="flex flex-wrap gap-2 items-center bg-[#2a1810]/20 p-3 rounded border border-white/5">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mr-1">Filtros Ativos:</span>
                  {selectedGenre && <span className="bg-[#c5a059]/10 text-gold-light border border-gold/20 text-[10px] px-2 py-0.5 rounded-full font-serif italic">{selectedGenre}</span>}
                  {selectedPersonality && <span className="bg-[#c5a059]/10 text-gold-light border border-gold/20 text-[10px] px-2 py-0.5 rounded-full font-serif italic">{selectedPersonality}</span>}
                  {selectedWorldType && <span className="bg-[#c5a059]/10 text-gold-light border border-gold/20 text-[10px] px-2 py-0.5 rounded-full font-serif italic">{selectedWorldType}</span>}
                  {selectedMaterialType && <span className="bg-[#c5a059]/10 text-gold-light border border-gold/20 text-[10px] px-2 py-0.5 rounded-full font-serif italic">{selectedMaterialType}</span>}
                  {selectedStatus && <span className="bg-[#c5a059]/10 text-gold-light border border-gold/20 text-[10px] px-2 py-0.5 rounded-full font-serif italic">{selectedStatus}</span>}
                  {searchQuery && <span className="bg-[#c5a059]/10 text-gold-light border border-gold/20 text-[10px] px-2 py-0.5 rounded-full font-serif italic">Busca: "{searchQuery}"</span>}
                  <button 
                    onClick={handleResetFilters}
                    className="text-[9px] text-gold-light hover:underline uppercase ml-auto tracking-wider font-bold"
                  >
                    Remover Todos
                  </button>
                </div>
              )}

              {/* Briefings Grid */}
              {filteredBriefings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredBriefings.map((briefing) => (
                    <Card
                      key={briefing.id}
                      hoverEffect
                      className="cursor-pointer flex flex-col justify-between"
                      onClick={() => {
                        setSelectedBriefing(briefing);
                        setIsDetailOpen(true);
                      }}
                    >
                      <CardHeader className="relative">
                        {/* Status Ribbon Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`text-[9px] px-2.5 py-1 rounded font-semibold uppercase tracking-wider ${
                            briefing.status === "Lendo" ? "bg-amber-500/10 text-amber-300 border border-amber-500/20" :
                            briefing.status === "Concluído" ? "bg-green-500/10 text-green-300 border border-green-500/20" :
                            briefing.status === "Pausado" ? "bg-blue-500/10 text-blue-300 border border-blue-500/20" :
                            "bg-red-500/10 text-red-300 border border-red-500/20"
                          }`}>
                            {briefing.status}
                          </span>
                        </div>
                        
                        <CardDescription>{briefing.materialType}</CardDescription>
                        <CardTitle className="pr-16 line-clamp-1">{briefing.title}</CardTitle>
                        <span className="text-white/60 text-xs italic">por {briefing.author}</span>
                      </CardHeader>

                      <CardContent className="flex-1 flex flex-col gap-4">
                        {/* Summary preview */}
                        <p className="text-white/70 text-xs line-clamp-3 leading-relaxed">
                          {briefing.summary}
                        </p>

                        {/* Rich features badges (Genre, Personality, World) */}
                        <div className="mt-auto pt-3 border-t border-white/5 flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="text-white/35 font-bold uppercase tracking-wider w-16">Gênero:</span>
                            <span className="text-gold-light italic font-serif truncate">{briefing.genre}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="text-white/35 font-bold uppercase tracking-wider w-16">Protagonista:</span>
                            <span className="text-gold-light italic font-serif truncate">{briefing.protagonistPersonality}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="text-white/35 font-bold uppercase tracking-wider w-16">Mundo:</span>
                            <span className="text-gold-light italic font-serif truncate">{briefing.worldType}</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="bg-[#2a1810]/20 justify-between py-3">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < briefing.rating ? "text-gold fill-gold" : "text-white/10"}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-white/30 flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(briefing.updatedAt).toLocaleDateString("pt-BR")}
                        </span>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="flex-1 flex flex-col items-center justify-center py-20 bg-[#2a1810]/10 border border-dashed border-white/5 rounded-xl">
                  <Bookmark size={48} className="text-white/15 mb-4 animate-pulse" />
                  <h3 className="font-serif text-lg text-white/60 italic mb-1">Nenhum manuscrito encontrado</h3>
                  <p className="text-xs text-white/30 max-w-sm text-center mb-6">
                    Ajuste seus filtros de busca ou crie um novo briefing de leitura para começar a catalogar.
                  </p>
                  <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                    Limpar Todos os Filtros
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* TAB 2: RECOMMENDATIONS */
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h2 className="font-serif text-gold-light text-2xl italic font-bold flex items-center gap-2">
                    <Sparkles size={20} /> Recomendações do Codex
                  </h2>
                  <p className="text-white/45 text-xs">
                    Compartilhe suas análises aprofundadas sobre as obras catalogadas.
                  </p>
                </div>

                <Button onClick={() => setIsRecommendOpen(true)}>
                  <MessageSquare size={16} /> Recomendar Obra
                </Button>
              </div>

              {/* Recommendations grid */}
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.map((rec) => {
                    const linkedBriefing = briefings.find((b) => b.id === rec.briefingId);
                    return (
                      <Card key={rec.id} className="flex flex-col justify-between">
                        <CardHeader className="bg-[#2a1810]/20 pb-3 flex flex-row items-start justify-between gap-4">
                          <div>
                            <span className="text-[10px] text-gold/60 uppercase tracking-widest font-bold">
                              Recomendação de Obra
                            </span>
                            <CardTitle className="text-lg text-white font-serif italic">
                              {rec.briefingTitle}
                            </CardTitle>
                            {linkedBriefing && (
                              <span className="text-[10px] text-white/40 italic">
                                por {linkedBriefing.author} • {linkedBriefing.genre}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-0.5 bg-[#1a0c05] px-2 py-1 rounded border border-white/10">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                className={i < rec.ratingGiven ? "text-gold fill-gold" : "text-white/20"}
                              />
                            ))}
                          </div>
                        </CardHeader>

                        <CardContent className="pt-4 flex-1">
                          <div className="relative pl-6">
                            <span className="absolute top-0 left-0 text-gold-dark/40">
                              <Quote size={18} className="rotate-180" />
                            </span>
                            <p className="text-white/85 text-xs italic leading-relaxed font-serif">
                              {rec.content}
                            </p>
                          </div>
                        </CardContent>

                        <CardFooter className="py-3 justify-between text-[10px] text-white/30">
                          <span>
                            Escrito por: <strong className="text-gold-light">{rec.authorName}</strong>
                          </span>
                          <span>
                            {new Date(rec.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-[#2a1810]/10 border border-dashed border-white/5 rounded-xl">
                  <MessageSquare size={48} className="text-white/15 mb-4" />
                  <h3 className="font-serif text-lg text-white/60 italic mb-1">Nenhuma recomendação escrita</h3>
                  <p className="text-xs text-white/30 max-w-sm text-center mb-6">
                    Seja o primeiro a escrever uma recomendação para as obras catalogadas na biblioteca!
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setIsRecommendOpen(true)}>
                    Escrever Recomendação
                  </Button>
                </div>
              )}
            </div>
          )}

        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#1a0c05] py-4 text-center text-[10px] text-white/20 uppercase tracking-widest mt-auto">
        © MMXXVI BEYOND THE PAGES • Quando a história sai do papel
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: BRIEFING DETAIL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Codex Manuscrito"
        maxWidth="lg"
      >
        {selectedBriefing && (
          <div className="flex flex-col gap-6">
            
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] text-gold/60 uppercase tracking-widest font-bold">
                  {selectedBriefing.materialType}
                </span>
                <h2 className="text-gold-light font-serif text-3xl font-bold italic">
                  {selectedBriefing.title}
                </h2>
                <p className="text-white/60 text-sm italic">
                  por {selectedBriefing.author}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
                  selectedBriefing.status === "Lendo" ? "bg-amber-500/10 text-amber-300 border border-amber-500/20" :
                  selectedBriefing.status === "Concluído" ? "bg-green-500/10 text-green-300 border border-green-500/20" :
                  selectedBriefing.status === "Pausado" ? "bg-blue-500/10 text-blue-300 border border-blue-500/20" :
                  "bg-red-500/10 text-red-300 border border-red-500/20"
                }`}>
                  {selectedBriefing.status}
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < selectedBriefing.rating ? "text-gold fill-gold" : "text-white/10"}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Rich details cards (Genre, Personality, World) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#2a1810]/40 p-4 rounded border border-gold/10 flex flex-col gap-1">
                <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Gênero</span>
                <span className="text-gold-light font-serif italic text-sm">{selectedBriefing.genre}</span>
              </div>
              <div className="bg-[#2a1810]/40 p-4 rounded border border-gold/10 flex flex-col gap-1">
                <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Protagonista</span>
                <span className="text-gold-light font-serif italic text-sm">{selectedBriefing.protagonistPersonality}</span>
              </div>
              <div className="bg-[#2a1810]/40 p-4 rounded border border-gold/10 flex flex-col gap-1">
                <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Universo</span>
                <span className="text-gold-light font-serif italic text-sm">{selectedBriefing.worldType}</span>
              </div>
            </div>

            {/* Content: Summary */}
            <div className="flex flex-col gap-2">
              <h4 className="text-gold font-serif italic text-base border-b border-white/5 pb-1">Resumo da Obra</h4>
              <p className="text-white/80 text-xs leading-relaxed font-serif text-justify">
                {selectedBriefing.summary || "Sem resumo registrado."}
              </p>
            </div>

            {/* Content: Characters & Themes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <h4 className="text-gold font-serif italic text-base border-b border-white/5 pb-1">Personagens Principais</h4>
                <p className="text-white/80 text-xs leading-relaxed whitespace-pre-line font-serif">
                  {selectedBriefing.characters || "Nenhum personagem registrado."}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-gold font-serif italic text-base border-b border-white/5 pb-1">Temas Centrais</h4>
                <p className="text-white/80 text-xs leading-relaxed whitespace-pre-line font-serif">
                  {selectedBriefing.themes || "Nenhum tema registrado."}
                </p>
              </div>
            </div>

            {/* Content: Quotes */}
            {selectedBriefing.quotes && selectedBriefing.quotes.length > 0 && (
              <div className="flex flex-col gap-3">
                <h4 className="text-gold font-serif italic text-base border-b border-white/5 pb-1">Citações Memoráveis</h4>
                <div className="flex flex-col gap-3">
                  {selectedBriefing.quotes.map((quote, idx) => (
                    <div key={idx} className="relative pl-8 pr-4 py-3 bg-[#2a1810]/20 rounded border-l-2 border-gold italic text-white/90 text-xs font-serif leading-relaxed">
                      <span className="absolute top-2 left-2 text-gold-dark/30">
                        <Quote size={14} className="rotate-180" />
                      </span>
                      "{quote}"
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content: Personal Notes */}
            <div className="flex flex-col gap-2">
              <h4 className="text-gold font-serif italic text-base border-b border-white/5 pb-1">Notas Pessoais</h4>
              <p className="text-white/80 text-xs leading-relaxed font-serif text-justify bg-[#2a1810]/15 p-4 rounded border border-white/5">
                {selectedBriefing.personalNotes || "Sem anotações registradas."}
              </p>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-4">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteBriefing(selectedBriefing.id)}
              >
                Excluir
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenRecommendForBriefing(selectedBriefing)}
                >
                  <MessageSquare size={14} /> Recomendar Obra
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsDetailOpen(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>

          </div>
        )}
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: CREATE BRIEFING */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Registrar Novo Manuscrito"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateBriefing} className="flex flex-col gap-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Título da Obra *"
              placeholder="Ex: O Senhor dos Anéis"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <Input
              label="Autor *"
              placeholder="Ex: J.R.R. Tolkien"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-gold-light italic font-serif text-base tracking-wide">
                Tipo de Material *
              </label>
              <select
                value={newMaterialType}
                onChange={(e) => setNewMaterialType(e.target.value as Briefing["materialType"])}
                className="w-full bg-[#2a1810] border border-white/10 p-3.5 text-white rounded focus:border-gold outline-none transition-colors text-sm"
              >
                <option value="Livro">Livro</option>
                <option value="Mangá">Mangá</option>
                <option value="HQ">HQ</option>
                <option value="Artigo">Artigo</option>
                <option value="Light Novel">Light Novel</option>
                <option value="Texto Livre">Texto Livre</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gold-light italic font-serif text-base tracking-wide">
                Status de Leitura *
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as Briefing["status"])}
                className="w-full bg-[#2a1810] border border-white/10 p-3.5 text-white rounded focus:border-gold outline-none transition-colors text-sm"
              >
                <option value="Lendo">Lendo</option>
                <option value="Concluído">Concluído</option>
                <option value="Pausado">Pausado</option>
                <option value="Abandonado">Abandonado</option>
              </select>
            </div>
          </div>

          {/* Golden Filters Fields */}
          <div className="bg-[#2a1810]/40 p-4 rounded border border-gold/15 flex flex-col gap-4">
            <span className="text-[10px] text-gold uppercase tracking-widest font-bold border-b border-gold/10 pb-1">
              Classificação & Categorias do Além-Páginas
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Genre input/select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gold-light italic font-serif text-sm">Gênero *</label>
                <input
                  type="text"
                  placeholder="Ex: Fantasia, Ficção"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  list="genres-list"
                  className="w-full bg-[#1e0f07] border border-white/10 p-2 text-xs text-white rounded focus:border-gold outline-none"
                  required
                />
                <datalist id="genres-list">
                  {GENRES.map((g) => <option key={g} value={g} />)}
                </datalist>
              </div>

              {/* Protagonist Personality */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gold-light italic font-serif text-sm">Personalidade Protagonista *</label>
                <input
                  type="text"
                  placeholder="Ex: INTJ, Otimista"
                  value={newPersonality}
                  onChange={(e) => setNewPersonality(e.target.value)}
                  list="personalities-list"
                  className="w-full bg-[#1e0f07] border border-white/10 p-2 text-xs text-white rounded focus:border-gold outline-none"
                  required
                />
                <datalist id="personalities-list">
                  {PROTAGONIST_PERSONALITIES.map((p) => <option key={p} value={p} />)}
                </datalist>
              </div>

              {/* World Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gold-light italic font-serif text-sm">Tipo de Mundo *</label>
                <input
                  type="text"
                  placeholder="Ex: Medieval, Isekai"
                  value={newWorldType}
                  onChange={(e) => setNewWorldType(e.target.value)}
                  list="worlds-list"
                  className="w-full bg-[#1e0f07] border border-white/10 p-2 text-xs text-white rounded focus:border-gold outline-none"
                  required
                />
                <datalist id="worlds-list">
                  {WORLD_TYPES.map((w) => <option key={w} value={w} />)}
                </datalist>
              </div>
            </div>
          </div>

          <Input
            label="Resumo da Obra"
            placeholder="Breve resumo da premissa ou enredo..."
            value={newSummary}
            onChange={(e) => setNewSummary(e.target.value)}
            isTextArea
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Personagens Principais"
              placeholder="Ex: Nome (Descrição)&#10;Nome2 (Descrição)"
              value={newCharacters}
              onChange={(e) => setNewCharacters(e.target.value)}
              isTextArea
              rows={3}
            />
            <Input
              label="Temas Centrais"
              placeholder="Ex: Amizade, Sobrevivência, Traição (um por linha)..."
              value={newThemes}
              onChange={(e) => setNewThemes(e.target.value)}
              isTextArea
              rows={3}
            />
          </div>

          <Input
            label="Citações Marcantes (uma por linha)"
            placeholder="Ex: Penso, logo existo.&#10;A verdade vos libertará."
            value={newQuotes}
            onChange={(e) => setNewQuotes(e.target.value)}
            isTextArea
            rows={2}
          />

          <Input
            label="Notas Pessoais & Insights"
            placeholder="O que você achou? Qual sua lição aprendida?"
            value={newPersonalNotes}
            onChange={(e) => setNewPersonalNotes(e.target.value)}
            isTextArea
            rows={3}
          />

          <div className="flex items-center gap-4 bg-[#2a1810]/40 p-4 rounded border border-white/5 justify-between">
            <span className="text-gold-light italic font-serif text-base">Avaliação Pessoal:</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((stars) => (
                <button
                  type="button"
                  key={stars}
                  onClick={() => setNewRating(stars)}
                  className="focus:outline-none transition-transform hover:scale-125"
                >
                  <Star
                    size={24}
                    className={`${
                      stars <= newRating
                        ? "text-gold fill-gold"
                        : "text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Gravar no Codex
            </Button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: CREATE RECOMMENDATION */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isRecommendOpen}
        onClose={() => setIsRecommendOpen(false)}
        title="Escrever Recomendação"
        maxWidth="md"
      >
        <form onSubmit={handleCreateRecommendation} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-gold-light italic font-serif text-base tracking-wide">
              Selecione a Obra *
            </label>
            <select
              value={recBriefingId}
              onChange={(e) => setRecBriefingId(e.target.value)}
              className="w-full bg-[#2a1810] border border-white/10 p-3.5 text-white rounded focus:border-gold outline-none transition-colors text-sm"
              required
            >
              <option value="">-- Escolha um briefing --</option>
              {briefings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.author})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Seu Nome / Apelido *"
            placeholder="Ex: Bibliotecário de Alexandria"
            value={recAuthorName}
            onChange={(e) => setRecAuthorName(e.target.value)}
            required
          />

          <Input
            label="Sua Recomendação (Por que ler esta obra?) *"
            placeholder="Escreva seus argumentos, o que o cativou e por que outras pessoas deveriam ler..."
            value={recContent}
            onChange={(e) => setRecContent(e.target.value)}
            isTextArea
            rows={5}
            required
          />

          <div className="flex items-center gap-4 bg-[#2a1810]/40 p-4 rounded border border-white/5 justify-between">
            <span className="text-gold-light italic font-serif text-base">Nota de Recomendação:</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((stars) => (
                <button
                  type="button"
                  key={stars}
                  onClick={() => setRecRating(stars)}
                  className="focus:outline-none transition-transform hover:scale-125"
                >
                  <Star
                    size={20}
                    className={`${
                      stars <= recRating
                        ? "text-gold fill-gold"
                        : "text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsRecommendOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Publicar Recomendação
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
