"use client";

import { useState, useEffect } from "react";
import {
  Copy,
  Trash2,
  History,
  ExternalLink,
  Download,
  BarChart3,
  TrendingUp,
  Filter,
} from "lucide-react";

interface LinkHistory {
  id: string;
  url: string;
  createdAt: string;
  isFavorite?: boolean;
}

interface LinkHistoryProps {
  refreshTrigger?: number;
}

interface AnalyticsData {
  totalLinks: number;
  linksThisWeek: number;
  mostUsedSource: string;
  mostUsedMedium: string;
  recentActivity: number;
}

export default function LinkHistory({ refreshTrigger }: LinkHistoryProps) {
  const [links, setLinks] = useState<LinkHistory[]>([]);
  const [showCopied, setShowCopied] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalLinks: 0,
    linksThisWeek: 0,
    mostUsedSource: "-",
    mostUsedMedium: "-",
    recentActivity: 0,
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadLinks();
  }, [refreshTrigger]);

  useEffect(() => {
    calculateAnalytics();
  }, [links]);

  const calculateAnalytics = () => {
    if (links.length === 0) {
      setAnalytics({
        totalLinks: 0,
        linksThisWeek: 0,
        mostUsedSource: "-",
        mostUsedMedium: "-",
        recentActivity: 0,
      });
      return;
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const linksThisWeek = links.filter(
      (link) => new Date(link.createdAt) >= weekAgo,
    ).length;

    const sourceCount: { [key: string]: number } = {};
    const mediumCount: { [key: string]: number } = {};

    links.forEach((link) => {
      const url = new URL(link.url);
      const source = url.searchParams.get("utm_source") || "unknown";
      const medium = url.searchParams.get("utm_medium") || "unknown";

      sourceCount[source] = (sourceCount[source] || 0) + 1;
      mediumCount[medium] = (mediumCount[medium] || 0) + 1;
    });

    const mostUsedSource =
      Object.entries(sourceCount).sort(([, a], [, b]) => b - a)[0]?.[0] || "-";

    const mostUsedMedium =
      Object.entries(mediumCount).sort(([, a], [, b]) => b - a)[0]?.[0] || "-";

    const recentActivity = links.filter((link) => {
      const linkDate = new Date(link.createdAt);
      const daysDiff =
        (now.getTime() - linkDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 1;
    }).length;

    setAnalytics({
      totalLinks: links.length,
      linksThisWeek,
      mostUsedSource,
      mostUsedMedium,
      recentActivity,
    });
  };

  const loadLinks = () => {
    try {
      const storedLinks = localStorage.getItem("utm_links_history");
      if (storedLinks) {
        const parsedLinks = JSON.parse(storedLinks);
        setLinks(
          parsedLinks.sort(
            (a: LinkHistory, b: LinkHistory) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  };

  const saveLinks = (newLinks: LinkHistory[]) => {
    try {
      localStorage.setItem("utm_links_history", JSON.stringify(newLinks));
    } catch (error) {
      console.error("Erro ao salvar histórico:", error);
    }
  };

  const copyToClipboard = async (url: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setShowCopied(linkId);

      setTimeout(() => {
        setShowCopied(null);
      }, 2000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      alert("Erro ao copiar o link. Por favor, copie manualmente.");
    }
  };

  const clearHistory = () => {
    if (window.confirm("Tem certeza que deseja limpar todo o histórico?")) {
      setLinks([]);
      localStorage.removeItem("utm_links_history");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateUrl = (url: string, maxLength: number = 60) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
            <History className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Histórico de Links
            </h2>
            <p className="text-slate-400 text-sm">
              Links gerados anteriormente
            </p>
          </div>
        </div>

        {links.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 rounded-lg transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
            Limpar Histórico
          </button>
        )}
      </div>

      {links.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 text-lg font-medium">
            Nenhum link gerado ainda
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Seus primeiros links UTM aparecerão aqui
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                  Data
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                  URL Completa
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-400">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr
                  key={link.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="text-white text-sm font-medium">
                      {formatDate(link.createdAt)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-slate-300 text-sm font-mono">
                      <span title={link.url}>{truncateUrl(link.url)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => copyToClipboard(link.url, link.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                          showCopied === link.id
                            ? "bg-green-600/20 text-green-400 border border-green-600/50"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        }`}
                      >
                        <Copy className="w-4 h-4" />
                        {showCopied === link.id ? "Copiado!" : "Copiar"}
                      </button>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {links.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Total de {links.length} link{links.length > 1 ? "s" : ""} no
            histórico
          </p>
        </div>
      )}
    </div>
  );
}
