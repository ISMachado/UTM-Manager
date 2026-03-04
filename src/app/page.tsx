"use client";

import { useState, useEffect } from "react";
import UTMForm from "@/components/UTMForm";
import LinkHistory from "@/components/LinkHistory";
import { Zap } from "lucide-react";

interface LinkHistory {
  id: string;
  url: string;
  createdAt: string;
}

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleGenerateLink = (link: string) => {
    // Salvar no localStorage
    try {
      const existingLinks = localStorage.getItem("utm_links_history");
      const links: LinkHistory[] = existingLinks
        ? JSON.parse(existingLinks)
        : [];

      const newLink: LinkHistory = {
        id: Date.now().toString(),
        url: link,
        createdAt: new Date().toISOString(),
      };

      links.push(newLink);
      localStorage.setItem("utm_links_history", JSON.stringify(links));

      // Trigger refresh do histórico
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Erro ao salvar link:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  V4 UTM Manager
                </h1>
                <p className="text-slate-400 text-sm">
                  Gerenciador e Padronizador de UTMs
                </p>
              </div>
            </div>
            <div className="text-slate-500 text-sm">
              Equipes de Marketing Digital V4 Company
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div>
            <UTMForm onGenerateLink={handleGenerateLink} />
          </div>

          {/* Histórico */}
          <div>
            <LinkHistory refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-slate-900/50 rounded-2xl border border-slate-800/50 p-8">
          <h3 className="text-xl font-bold text-white mb-4">Como funciona?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-red-400 font-bold">1</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Preencha os Campos
              </h4>
              <p className="text-slate-400 text-sm">
                Informe a URL, fonte, meio e campanha
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-red-400 font-bold">2</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Gere o Link</h4>
              <p className="text-slate-400 text-sm">
                Clique para gerar e copiar o link UTM
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-red-400 font-bold">3</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Acompanhe o Histórico
              </h4>
              <p className="text-slate-400 text-sm">
                Visualize e reutilize links anteriores
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-slate-500 text-sm">
            © 2024 V4 Company. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
