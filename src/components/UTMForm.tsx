"use client";

import { useState } from "react";
import { Copy, Link2, Plus, X, Eye, AlertCircle, Check } from "lucide-react";

interface UTMFormData {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

interface CampaignTemplate {
  name: string;
  campaign: string;
  description: string;
}

interface UTMFormProps {
  onGenerateLink: (link: string) => void;
}

const campaignTemplates: CampaignTemplate[] = [
  {
    name: "Black Friday",
    campaign: "black_friday",
    description: "Campanhas de Black Friday",
  },
  { name: "Natal", campaign: "natal_2024", description: "Campanhas de Natal" },
  {
    name: "Lançamento",
    campaign: "lancamento_produto",
    description: "Lançamento de novos produtos",
  },
  {
    name: "Webinar",
    campaign: "webinar_educativo",
    description: "Webinars e eventos educativos",
  },
  {
    name: "Newsletter",
    campaign: "newsletter_mensal",
    description: "Envio de newsletters",
  },
];

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
    term: "",
    content: "",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const formatCampaign = (campaign: string): string => {
    return campaign.toLowerCase().replace(/\s+/g, "_");
  };

  const validateURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const generateUTMLink = (): string => {
    const { url, source, medium, campaign, term, content } = formData;

    if (!url || !source || !medium || !campaign) {
      return "";
    }

    if (!validateURL(url)) {
      setUrlError("URL inválida. Verifique o formato.");
      return "";
    }

    setUrlError("");
    const formattedCampaign = formatCampaign(campaign);
    const urlObj = new URL(url);

    urlObj.searchParams.set("utm_source", source);
    urlObj.searchParams.set("utm_medium", medium);
    urlObj.searchParams.set("utm_campaign", formattedCampaign);

    if (term) urlObj.searchParams.set("utm_term", term);
    if (content) urlObj.searchParams.set("utm_content", content);

    return urlObj.toString();
  };

  const handleGenerateAndCopy = async () => {
    const link = generateUTMLink();

    if (!link) {
      if (
        !formData.url ||
        !formData.source ||
        !formData.medium ||
        !formData.campaign
      ) {
        alert("Por favor, preencha os campos obrigatórios!");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      setShowCopied(true);
      setGeneratedLink(link);
      setShowPreview(true);
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

    // Limpar erro de URL quando o usuário começa a digitar
    if (field === "url" && value) {
      setUrlError("");
    }
  };

  const handleTemplateSelect = (template: CampaignTemplate) => {
    handleInputChange("campaign", template.campaign);
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
            URL Final <span className="text-red-400">*</span>
          </label>
          <input
            type="url"
            placeholder="https://site.com.br"
            value={formData.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
            className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all ${
              urlError ? "border-red-500" : "border-slate-700"
            }`}
          />
          {urlError && (
            <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {urlError}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Source (Fonte) <span className="text-red-400">*</span>
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
              Medium (Meio) <span className="text-red-400">*</span>
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
            Campaign (Campanha) <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Black Friday"
              value={formData.campaign}
              onChange={(e) => handleInputChange("campaign", e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-3 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Templates de campanha"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {showAdvanced && (
            <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-slate-400 text-sm mb-2">Templates rápidos:</p>
              <div className="flex flex-wrap gap-2">
                {campaignTemplates.map((template) => (
                  <button
                    key={template.name}
                    type="button"
                    onClick={() => handleTemplateSelect(template)}
                    className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 rounded-lg text-sm transition-colors"
                    title={template.description}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Campos Avançados */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            {showAdvanced ? (
              <X className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Campos avançados (Term e Content)
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Term (Termo de Busca)
              </label>
              <input
                type="text"
                placeholder="curso de marketing digital"
                value={formData.term || ""}
                onChange={(e) => handleInputChange("term", e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Content (Conteúdo)
              </label>
              <input
                type="text"
                placeholder="botao_principal"
                value={formData.content || ""}
                onChange={(e) => handleInputChange("content", e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              />
            </div>
          </div>
        )}

        {/* Preview do Link Gerado */}
        {showPreview && generatedLink && (
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-sm font-medium">
                  Preview do Link:
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-slate-900 p-3 rounded border border-slate-600 font-mono text-sm text-slate-300 break-all">
              {generatedLink}
            </div>
            <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
              <Check className="w-4 h-4" />
              <span>Link validado e pronto para uso!</span>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerateAndCopy}
          data-generate
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
