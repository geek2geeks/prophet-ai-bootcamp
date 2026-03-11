import * as React from "react";

type Props = {
  text: string;
  glossary: Record<string, string>;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function GlossaryText({ text, glossary }: Props) {
  const terms = Object.keys(glossary).sort((left, right) => right.length - left.length);

  if (!terms.length) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${terms.map(escapeRegex).join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        const matched = terms.find((term) => term.toLowerCase() === part.toLowerCase());

        if (!matched) {
          return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
        }

        return (
          <span
            key={`${matched}-${index}`}
            title={glossary[matched]}
            tabIndex={0}
            className="cursor-help rounded-[0.35rem] bg-[rgba(124,63,88,0.09)] px-1 text-[var(--foreground)] underline decoration-dotted decoration-[var(--accent)] underline-offset-4"
          >
            {part}
          </span>
        );
      })}
    </>
  );
}
