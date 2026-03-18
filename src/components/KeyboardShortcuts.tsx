'use client';

import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onGenerateLink?: () => void;
  onToggleTheme?: () => void;
  onToggleAnalytics?: () => void;
  onClearHistory?: () => void;
  onExportCSV?: () => void;
}

export default function KeyboardShortcuts({
  onGenerateLink,
  onToggleTheme,
  onToggleAnalytics,
  onClearHistory,
  onExportCSV
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + G: Gerar link
      if ((event.ctrlKey || event.metaKey) && event.key === 'g') {
        event.preventDefault();
        onGenerateLink?.();
      }

      // Ctrl/Cmd + K: Toggle tema
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        onToggleTheme?.();
      }

      // Ctrl/Cmd + A: Toggle analytics
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        onToggleAnalytics?.();
      }

      // Ctrl/Cmd + E: Exportar CSV
      if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        onExportCSV?.();
      }

      // Ctrl/Cmd + Shift + C: Limpar histórico
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        onClearHistory?.();
      }

      // Esc: Fechar modais/previews
      if (event.key === 'Escape') {
        // Fechar previews e modais
        const modals = document.querySelectorAll('[data-modal]');
        modals.forEach(modal => {
          (modal as HTMLElement).style.display = 'none';
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onGenerateLink, onToggleTheme, onToggleAnalytics, onClearHistory, onExportCSV]);

  return null;
}
