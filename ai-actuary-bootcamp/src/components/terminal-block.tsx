"use client";

import { useState } from "react";

type Props = {
  commands: string[];
  label: string;
  prompt?: "$" | ">";
  copyLabel?: string;
};

export function TerminalBlock({ commands, label, prompt = "$", copyLabel = "Copiar" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(commands.join("\n\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#263238] bg-[#0b1220] shadow-[0_18px_40px_rgba(11,18,32,0.24)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#111a2b] px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/70">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2">{label}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-white transition hover:bg-white/14"
        >
          {copied ? "Copiado" : copyLabel}
        </button>
      </div>
      <pre className="overflow-auto whitespace-pre-wrap break-words px-4 py-4 font-mono text-xs leading-6 text-[#d6e2ff]">
        {commands.map((command, index) => (
          <div key={`${label}-${index}`}>
            <span className="select-none text-[#7ee787]">{prompt} </span>
            {command}
          </div>
        ))}
      </pre>
    </div>
  );
}
