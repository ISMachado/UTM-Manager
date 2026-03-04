"use client";

import { useState } from "react";
import { Copy, Link2 } from "lucide-react";

interface UTMFormData {
  url: string;
  source: string;
  medium: string;
  campaign: string;
}

interface UTMFormProps {
  onGenerateLink: (link: string) => void;
}

const sources = [
  "facebook",
  "google",
  "tiktok",
  "linkedin",
  "pinterest",
  "email",
  "instagram",
  "twitter",
  "youtube",
  "whatsapp",
  "blog",
  "site",
];
const mediums = [
  "cpc",
  "stories",
  "reels",
  "feed",
  "organic",
  "crm",
  "bio",
  "post",
  "link",
  "ebook",
  "webinar",
  "newsletter",
];

export default function UTMForm({ onGenerateLink }: UTMFormProps) {
  const [formData, setFormData] = useState<UTMFormData>({
    url: "",
    source: "",
    medium: "",
    campaign: "",
  });

  const [showCopied, setShowCopied] = useState(false);

  const formatCampaign = (campaign: string): string => {
    return campaign.toLowerCase().replace(/\s+/g, "_");
  };

  const generateUTMLink = (): string => {
    const { url, source, medium, campaign } = formData;

    if (!url || !source || !medium || !campaign) {
      return "";
    }

    const formattedCampaign = formatCampaign(campaign);
    const urlObj = new URL(url);

    urlObj.searchParams.set("utm_source", source);
    urlObj.searchParams.set("utm_medium", medium);
    urlObj.searchParams.set("utm_campaign", formattedCampaign);

    return urlObj.toString();
  };

  const handleGenerateAndCopy = async () => {
    const link = generateUTMLink();

    if (!link) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      setShowCopied(true);
      onGenerateLink(link);

      setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Erro ao copiar o link:", err);
      alert("Erro ao copiar o link. Por favor, copie manualmente.");
    }
  };

  const handleInputChange = (field: keyof UTMFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
          <Link2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Gerador de UTM</h2>
          <p className="text-slate-400 text-sm">
            Crie links rastreáveis para suas campanhas
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            URL Final
          </label>
          <input
            type="url"
            placeholder="https://site.com.br"
            value={formData.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Source (Fonte)
            </label>
            <select
              value={formData.source}
              onChange={(e) => handleInputChange("source", e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
            >
              <option value="">Selecione uma fonte...</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source.charAt(0).toUpperCase() + source.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Medium (Meio)
            </label>
            <select
              value={formData.medium}
              onChange={(e) => handleInputChange("medium", e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
            >
              <option value="">Selecione um meio...</option>
              {mediums.map((medium) => (
                <option key={medium} value={medium}>
                  {medium.charAt(0).toUpperCase() + medium.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Campaign (Campanha)
          </label>
          <input
            type="text"
            placeholder="Black Friday"
            value={formData.campaign}
            onChange={(e) => handleInputChange("campaign", e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
          />
        </div>

        <button
          onClick={handleGenerateAndCopy}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-red-600/25"
        >
          <Copy className="w-5 h-5" />
          {showCopied ? "Link Copiado!" : "Gerar e Copiar Link"}
        </button>

        {showCopied && (
          <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4 text-center">
            <p className="text-green-400 font-medium">
              ✓ Link copiado com sucesso!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
