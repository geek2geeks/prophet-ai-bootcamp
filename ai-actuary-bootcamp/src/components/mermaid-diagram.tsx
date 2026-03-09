"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    fontFamily: "system-ui, sans-serif",
    primaryColor: "#f0fdf4",
    primaryTextColor: "#0f172a",
    primaryBorderColor: "#10b981",
    lineColor: "#64748b",
    secondaryColor: "#eff6ff",
    tertiaryColor: "#fdf4ff",
  },
});

export function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    async function renderMermaid() {
      try {
        // Create a unique ID for the mermaid chart
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg: renderResult } = await mermaid.render(id, chart);
        
        if (isMounted) {
          setSvg(renderResult);
          setError(false);
        }
      } catch (e) {
        console.error("Mermaid parsing error", e);
        if (isMounted) {
          setError(true);
        }
      }
    }
    
    if (chart) {
      renderMermaid();
    }
    
    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="mt-4 p-4 border border-red-200 bg-red-50 text-red-600 rounded-md text-sm">
        Não foi possível processar o diagrama visual.
      </div>
    );
  }

  if (!svg) {
    return <div className="mt-4 h-32 animate-pulse bg-[var(--muted)]/20 rounded-xl" />;
  }

  return (
    <div 
      ref={containerRef}
      className="mt-4 flex justify-center p-4 bg-white/50 rounded-xl border border-[var(--border)] overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}
