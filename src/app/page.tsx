"use client";

import { useState, useEffect } from "react";
import UTMForm from "@/components/UTMForm";
import LinkHistoryEnhanced from "@/components/LinkHistoryEnhanced";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { Zap, Sun, Moon, Keyboard } from "lucide-react";

interface LinkHistory {
  id: string;
  url: string;
  createdAt: string;
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

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
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-slate-950" : "bg-gray-50"} transition-colors duration-200`}
    >
      {/* Header */}
      <header
        className={`border-b ${theme === "dark" ? "border-slate-900 bg-slate-900/50" : "border-gray-200 bg-white"} backdrop-blur-sm sticky top-0 z-50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  V4 UTM Manager
                </h1>
                <p
                  className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}
                >
                  Gerenciador e Padronizador de UTMs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "text-slate-400 hover:text-white bg-slate-800" : "text-gray-600 hover:text-gray-900 bg-gray-100"}`}
                title="Atalhos de teclado"
              >
                <Keyboard className="w-5 h-5" />
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "text-slate-400 hover:text-white bg-slate-800" : "text-gray-600 hover:text-gray-900 bg-gray-100"}`}
                title="Alternar tema"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <div
                className={`text-sm ${theme === "dark" ? "text-slate-500" : "text-gray-500"}`}
              >
                Equipes de Marketing Digital V4 Company
              </div>
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
            <LinkHistoryEnhanced refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {/* Keyboard Help Modal */}
        {showKeyboardHelp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className={`${theme === "dark" ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"} rounded-xl border p-6 max-w-md w-full`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Atalhos de Teclado
              </h3>
              <div className="space-y-2">
                <div
                  className={`flex justify-between ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
                >
                  <span>Gerar Link</span>
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs">
                    Ctrl/Cmd + G
                  </kbd>
                </div>
                <div
                  className={`flex justify-between ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
                >
                  <span>Alternar Tema</span>
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs">
                    Ctrl/Cmd + K
                  </kbd>
                </div>
                <div
                  className={`flex justify-between ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
                >
                  <span>Toggle Analytics</span>
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs">
                    Ctrl/Cmd + A
                  </kbd>
                </div>
                <div
                  className={`flex justify-between ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
                >
                  <span>Exportar CSV</span>
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs">
                    Ctrl/Cmd + E
                  </kbd>
                </div>
                <div
                  className={`flex justify-between ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
                >
                  <span>Limpar Histórico</span>
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs">
                    Ctrl/Cmd + Shift + C
                  </kbd>
                </div>
                <div
                  className={`flex justify-between ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
                >
                  <span>Fechar Modal</span>
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs">
                    Esc
                  </kbd>
                </div>
              </div>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div
          className={`mt-12 ${theme === "dark" ? "bg-slate-900/50 border-slate-800/50" : "bg-gray-100/50 border-gray-200/50"} rounded-2xl border p-8`}
        >
          <h3
            className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            Como funciona?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-red-400 font-bold">1</span>
              </div>
              <h4
                className={`font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Preencha os Campos
              </h4>
              <p
                className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}
              >
                Informe a URL, fonte, meio e campanha
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-red-400 font-bold">2</span>
              </div>
              <h4
                className={`font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Gere o Link
              </h4>
              <p
                className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}
              >
                Clique para gerar e copiar o link UTM
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-red-400 font-bold">3</span>
              </div>
              <h4
                className={`font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Acompanhe o Histórico
              </h4>
              <p
                className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}
              >
                Visualize e reutilize links anteriores
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`border-t mt-16 ${theme === "dark" ? "border-slate-900" : "border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div
            className={`text-center text-sm ${theme === "dark" ? "text-slate-500" : "text-gray-500"}`}
          >
            © 2024 V4 Company. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onGenerateLink={() => {
          // Trigger generate button click
          const generateButton = document.querySelector(
            "button[data-generate]",
          );
          generateButton?.dispatchEvent(new MouseEvent("click"));
        }}
        onToggleTheme={toggleTheme}
        onToggleAnalytics={() => {
          // Toggle analytics in LinkHistory component
          const analyticsButton = document.querySelector(
            "button[data-analytics]",
          );
          analyticsButton?.dispatchEvent(new MouseEvent("click"));
        }}
        onClearHistory={() => {
          // Clear history
          if (
            window.confirm("Tem certeza que deseja limpar todo o histórico?")
          ) {
            localStorage.removeItem("utm_links_history");
            setRefreshTrigger((prev) => prev + 1);
          }
        }}
        onExportCSV={() => {
          // Trigger export
          const exportButton = document.querySelector("button[data-export]");
          exportButton?.dispatchEvent(new MouseEvent("click"));
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
