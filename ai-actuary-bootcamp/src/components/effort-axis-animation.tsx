"use client";

export function EffortAxisAnimation() {
  return (
    <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[#f8f7f2] p-4 shadow-[0_10px_24px_rgba(47,41,34,0.05)]">
      <div className="relative mx-auto max-w-3xl">
        <svg viewBox="0 0 760 240" className="w-full" aria-label="Animacao do esforco acumulado e breakthrough">
          <defs>
            <pattern id="graph-paper-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#d8d3c7" strokeWidth="1" />
            </pattern>
          </defs>

          <rect x="0" y="0" width="760" height="240" fill="url(#graph-paper-grid)" />

          <g className="axis-shell">
            <line x1="70" y1="170" x2="700" y2="170" stroke="#2f2922" strokeWidth="2.5" />
            <line x1="70" y1="190" x2="70" y2="40" stroke="#8f8778" strokeWidth="1.5" />
            <text x="42" y="48" fontSize="12" fill="#6b6458">impacto</text>
            <text x="580" y="196" fontSize="12" fill="#6b6458">quantidade de esforco</text>
          </g>

          <g fill="#766d60" fontSize="11">
            <text x="108" y="188">baixo</text>
            <text x="255" y="188">medio</text>
            <text x="422" y="188">alto</text>
            <text x="575" y="188">excecional</text>
          </g>

          <polyline
            className="effort-line"
            points="70,170 130,166 190,156 250,144 310,125 370,110 430,92 490,70 550,48 610,30"
            fill="none"
            stroke="#1f6feb"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <g className="effort-dots" fill="#1f6feb">
            <circle cx="130" cy="166" r="4" />
            <circle cx="190" cy="156" r="4" />
            <circle cx="250" cy="144" r="4" />
            <circle cx="310" cy="125" r="4" />
            <circle cx="370" cy="110" r="4" />
            <circle cx="430" cy="92" r="4" />
            <circle cx="490" cy="70" r="4" />
            <circle cx="550" cy="48" r="4" />
            <circle cx="610" cy="30" r="4" />
          </g>

          <text className="effort-label" x="292" y="95" fontSize="13" fill="#1f6feb" fontWeight="600">
            esforco acumulado
          </text>

          <g className="goal-burst">
            <circle cx="626" cy="36" r="26" fill="#f97316" opacity="0.18" />
            <circle cx="626" cy="36" r="12" fill="#f97316" />
            <text x="642" y="28" fontSize="13" fill="#7c2d12" fontWeight="700">BREAKTHROUGH</text>
            <text x="642" y="45" fontSize="11" fill="#9a3412">algo nunca antes atingido</text>
          </g>

          <g className="obliteration-wave">
            <circle cx="626" cy="36" r="1" fill="none" stroke="#f97316" strokeWidth="4" />
          </g>

          <g className="nirvana-glow">
            <circle cx="626" cy="36" r="18" fill="#fff7ed" opacity="0.95" />
            <circle cx="626" cy="36" r="42" fill="#fef3c7" opacity="0.72" />
            <circle cx="626" cy="36" r="74" fill="#dbeafe" opacity="0.38" />
            <circle cx="626" cy="36" r="112" fill="#ffffff" opacity="0.18" />
          </g>

          <g className="nirvana-field">
            <circle cx="626" cy="36" r="14" fill="#fff7ed" opacity="0.95" />
            <circle cx="626" cy="36" r="34" fill="none" stroke="#fde68a" strokeWidth="3" opacity="0.95" />
            <circle cx="626" cy="36" r="58" fill="none" stroke="#facc15" strokeWidth="2.5" opacity="0.8" />
            <circle cx="626" cy="36" r="86" fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.55" />
            <text x="584" y="100" fontSize="16" fill="#a16207" fontWeight="700">quase nirvana</text>
          </g>

          <g className="starfield" fill="#f8fafc">
            <circle cx="590" cy="18" r="2.2" />
            <circle cx="664" cy="22" r="1.8" />
            <circle cx="650" cy="70" r="2" />
            <circle cx="608" cy="82" r="1.7" />
            <circle cx="690" cy="48" r="1.6" />
            <circle cx="560" cy="54" r="1.5" />
          </g>

          <g className="countdown-track">
            <text x="548" y="122" fontSize="24" fill="#0f172a" fontWeight="700">3</text>
            <text x="580" y="122" fontSize="24" fill="#0f172a" fontWeight="700">2</text>
            <text x="612" y="122" fontSize="24" fill="#0f172a" fontWeight="700">1</text>
          </g>
        </svg>
      </div>

      <p className="mt-3 text-center text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        A animacao foi afinada para o ponto de viragem aos 9 segundos da faixa embutida.
      </p>

      <p className="mt-2 text-center text-xs text-[var(--muted-foreground)]">
        Carrega play no Spotify e observa a mudanca quando a musica vira aos 9 segundos.
      </p>

      <style jsx>{`
        .axis-shell {
          transform-origin: 50% 70%;
          animation: axisShake 0.55s ease-in-out 9s 2;
        }

        .effort-line {
          stroke-dasharray: 740;
          stroke-dashoffset: 740;
          animation:
            drawEffort 9s cubic-bezier(0.22, 1, 0.36, 1) forwards,
            obliterateEffort 1.2s ease-in forwards;
          animation-delay: 0s, 9.05s;
        }

        .effort-dots,
        .effort-label {
          opacity: 0;
          animation: revealDots 0.6s ease forwards, obliterateOpacity 0.8s ease forwards;
          animation-delay: 3.2s, 9.05s;
        }

        .goal-burst {
          opacity: 0;
          transform-origin: 626px 36px;
          animation: goalAppear 0.55s ease-out 9s forwards;
        }

        .obliteration-wave {
          opacity: 0;
          transform-origin: 626px 36px;
          animation: waveBurst 1.1s ease-out 9s forwards;
        }

        .nirvana-glow {
          opacity: 0;
          transform-origin: 626px 36px;
          animation: glowRise 1.6s ease-out 9.05s forwards;
        }

        .nirvana-field {
          opacity: 0;
          transform-origin: 626px 36px;
          animation: nirvanaRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 9.05s forwards;
        }

        .starfield {
          opacity: 0;
          animation: starFade 1.8s ease-out 9.2s forwards;
        }

        .countdown-track {
          opacity: 0;
          animation: countdownIn 0.3s ease 6s forwards, countdownOut 0.45s ease 9s forwards;
        }

        .countdown-track text:nth-child(1) {
          animation: pulseCount 0.45s ease 6s both;
        }

        .countdown-track text:nth-child(2) {
          animation: pulseCount 0.45s ease 7s both;
        }

        .countdown-track text:nth-child(3) {
          animation: pulseCount 0.45s ease 8s both;
        }

        @keyframes drawEffort {
          0% { stroke-dashoffset: 740; }
          18% { stroke-dashoffset: 660; }
          34% { stroke-dashoffset: 560; }
          53% { stroke-dashoffset: 430; }
          70% { stroke-dashoffset: 290; }
          84% { stroke-dashoffset: 140; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes revealDots {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes goalAppear {
          0% { opacity: 0; transform: scale(0.4); }
          60% { opacity: 1; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes waveBurst {
          0% { opacity: 0; }
          10% { opacity: 1; }
          100% { opacity: 0; transform: scale(18); }
        }

        @keyframes glowRise {
          0% { opacity: 0; transform: scale(0.3); filter: blur(12px); }
          55% { opacity: 1; transform: scale(1.1); filter: blur(0); }
          100% { opacity: 0.9; transform: scale(1); filter: blur(0); }
        }

        @keyframes nirvanaRise {
          0% { opacity: 0; transform: scale(0.45); filter: blur(6px); }
          35% { opacity: 1; transform: scale(1.08); filter: blur(0); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }

        @keyframes starFade {
          0% { opacity: 0; }
          100% { opacity: 0.95; }
        }

        @keyframes countdownIn {
          from { opacity: 0; }
          to { opacity: 0.9; }
        }

        @keyframes countdownOut {
          from { opacity: 0.9; }
          to { opacity: 0; }
        }

        @keyframes pulseCount {
          0% { transform: translateY(2px) scale(0.75); opacity: 0; }
          30% { transform: translateY(0) scale(1.08); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 0.65; }
        }

        @keyframes axisShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-3px); }
          40% { transform: translateX(3px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }

        @keyframes obliterateEffort {
          0% { opacity: 1; filter: blur(0); }
          100% { opacity: 0; filter: blur(8px); }
        }

        @keyframes obliterateOpacity {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
