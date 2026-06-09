"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { BookOpen, Key, Mail, AlertCircle } from "lucide-react";
import { Dashboard } from "../components/dashboard";

const getSessionSnapshot = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem("btp_session") ?? "";
};

const subscribeToSession = (onStoreChange: () => void) => {
  window.addEventListener("btp_session_change", onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener("btp_session_change", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

export default function Home() {
  const session = useSyncExternalStore(subscribeToSession, getSessionSnapshot, () => "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    
    // Simple mock authentication (any non-empty input is accepted)
    localStorage.setItem("btp_session", email);
    window.dispatchEvent(new Event("btp_session_change"));
    setError("");
  };

  const handleLogout = () => {
    localStorage.removeItem("btp_session");
    window.dispatchEvent(new Event("btp_session_change"));
    setEmail("");
    setPassword("");
  };

  if (session) {
    return <Dashboard onLogout={handleLogout} userEmail={session} />;
  }

  return (
    <div className="min-h-screen bg-[#1a0c05] flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2a1810] to-[#1a0c05]">
      <div className="w-full max-w-md text-center animate-in fade-in duration-700">
        
        {/* Glowing Logo */}
        <div className="relative w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-2 border-gold/30 shadow-[0_0_30px_rgba(197,160,89,0.35)] bg-[#2a1810] flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent group-hover:opacity-100 transition-opacity" />
          <Image
            alt="Beyond The Pages Logo"
            width={128}
            height={128}
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            src="/app_icon.png"
            onError={(e) => {
              // If image fails, fallback to rendering the icon
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const iconContainer = document.createElement("div");
                iconContainer.className = "text-gold animate-pulse";
                iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>`;
                parent.appendChild(iconContainer);
              }
            }}
          />
        </div>

        <h1 className="text-gold font-serif text-3.5xl mb-1 tracking-wider font-extrabold text-gold-glow">
          Beyond The Pages
        </h1>
        <p className="text-white/40 text-xs mb-8 italic uppercase tracking-widest">
          Aureum Codex
        </p>

        {/* Login Form Card */}
        <div className="bg-[#2a1810]/50 p-8 rounded-xl border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
          
          <h2 className="text-white text-xl mb-6 font-serif-alegreya italic font-semibold tracking-wide">
            Retorne ao Manuscrito
          </h2>

          {error && (
            <div className="mb-5 flex items-center gap-2 p-3 bg-red-950/40 border border-red-500/20 text-red-400 rounded text-xs text-left">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* E-mail */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="block text-gold-light italic mb-1 font-serif text-base tracking-wide">
                E-MAIL OU USUÁRIO
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/20">
                  <Mail size={16} />
                </span>
                <input
                  type="text"
                  placeholder="bibliotecario@alexandria.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#2a1810] border border-white/10 pl-10 pr-4 py-3.5 text-white rounded focus:border-gold outline-none transition-colors placeholder:text-white/20 text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="block text-gold-light italic mb-1 font-serif text-base tracking-wide">
                SENHA
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/20">
                  <Key size={16} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#2a1810] border border-white/10 pl-10 pr-4 py-3.5 text-white rounded focus:border-gold outline-none transition-colors placeholder:text-white/20 text-sm"
                  required
                />
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-gold to-gold-light text-[#1a0c05] font-bold py-3.5 px-6 rounded shadow-lg hover:brightness-110 transition-all uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 w-full cursor-pointer mt-2"
            >
              Acessar Pergaminhos
              <BookOpen size={16} />
            </button>
          </form>

          {/* Academic disclaimer banner */}
          <div className="mt-6 flex items-start gap-2.5 p-3 bg-blue-500/10 border border-blue-500/20 rounded text-left">
            <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={14} />
            <p className="text-[10px] text-blue-200/70 leading-normal">
              PROTÓTIPO ACADÊMICO: Não utilize senhas reais. Este ambiente é apenas para fins de demonstração e armazenamento local.
            </p>
          </div>

          <p className="mt-8 text-white/30 text-[9px] tracking-widest uppercase">
            © MMXXVI BEYOND THE PAGES MANUSCRIPTUM
          </p>
        </div>
      </div>
    </div>
  );
}
