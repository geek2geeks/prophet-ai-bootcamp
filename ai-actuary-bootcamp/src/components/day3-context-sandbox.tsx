"use client";

import { useState } from "react";
import { ChevronRight, FileText, Settings, Bot, ArrowRight, Play } from "lucide-react";

export function Day3ContextSandbox() {
  const [hasContext, setHasContext] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const triggerRun = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 800);
  };

  return (
    <div className="panel shell-frame rounded-[1.8rem] overflow-hidden bg-white/50">
      <div className="p-6 border-b border-[var(--border)] bg-[#fdfdfc]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Simulador de Engenharia de Contexto</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Vê como a AI muda de comportamento quando lhe dás as regras certas.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">
        {/* Left Panel: Inputs */}
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[var(--muted-foreground)]">1. O Ficheiro (Dados)</p>
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-white p-3 shadow-sm">
              <FileText size={20} className="text-emerald-500" />
              <span className="text-sm font-medium">tabua_mortalidade_CSO2017.csv</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[var(--muted-foreground)]">2. O Contexto (O Segredo)</p>
              <button
                onClick={() => {
                  setHasContext(!hasContext);
                  triggerRun();
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hasContext ? "bg-[var(--accent)]" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasContext ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>

            <div className={`rounded-xl border p-4 transition-all duration-300 ${hasContext ? "border-[var(--accent)] bg-[var(--accent)]/5 shadow-sm" : "border-[var(--border)] bg-gray-50/50"}`}>
              {!hasContext ? (
                <div className="text-sm text-[var(--muted-foreground)]">
                  <p className="font-medium text-gray-500">Sem contexto atuarial definido.</p>
                  <p className="mt-1 text-xs">O modelo vai tentar adivinhar o que queres apenas olhando para os números.</p>
                </div>
              ) : (
                <div className="text-sm text-[var(--foreground)] space-y-2">
                  <div className="flex items-center gap-2 text-[var(--accent)] font-semibold mb-2">
                    <Settings size={14} />
                    <span>System Prompt Injectado:</span>
                  </div>
                  <p className="font-mono text-xs bg-white/60 p-2 rounded border border-[var(--border)]">
                    "És um atuário de pricing a avaliar risco de cauda longa. Regras: 1) Procura saltos anómalos de qx após os 80 anos. 2) Compara a suavidade da curva com expectativas normais."
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Output */}
        <div className="bg-[#111827] text-gray-300 p-6 flex flex-col font-mono text-sm">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Output do Modelo AI</span>
            <span className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
              <Play size={12} /> Prontos
            </span>
          </div>

            <div className={`flex-1 transition-opacity duration-300 ${isPlaying ? "opacity-50" : "opacity-100"}`}>
              <div className="mb-2 text-gray-500">{">"} A analisar tabua_mortalidade_CSO2017.csv...</div>

            {!hasContext ? (
              <div className="space-y-3 text-gray-400">
                <p>O ficheiro contém 120 linhas. As colunas são 'Idade' e 'qx'.</p>
                <p>A média da coluna qx é 0.045 e o valor máximo é 1.00.</p>
                <p>O ficheiro parece ser uma tabela de números sequenciais associados a idades. Não encontrei erros de formatação.</p>
                <div className="mt-4 border-l-2 border-orange-500/50 pl-3 py-1 text-orange-400/80 text-xs">
                  Resumo: Análise estatística genérica. Inútil para um atuário.
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-gray-200">
                <p className="text-emerald-400">✓ Contexto Atuarial Carregado</p>
                <p>Feedback Atuarial (Risco de Cauda Longa):</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Detetei uma aceleração severa da mortalidade a partir dos 85 anos.</li>
                  <li>O delta entre idades excede 15% na faixa 85-90 anos, o que é atípico para suavizações padrão Gompertz-Makeham.</li>
                  <li><span className="text-white font-semibold">Alerta:</span> Para um produto de Vida Inteira, isto exige um agravamento da reserva matemática nas durações finais.</li>
                </ul>
                <div className="mt-4 border-l-2 border-emerald-500/50 pl-3 py-1 text-emerald-400/80 text-xs">
                  Resumo: O modelo assumiu o papel, aplicou regras específicas e deu feedback de negócio real.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
