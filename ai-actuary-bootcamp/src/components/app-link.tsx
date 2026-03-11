import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

export function AppLink({ href, children, ...props }: AppLinkProps) {
  const isHashLink = href.startsWith("#");
  const isExternalLink = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href);

  if (isHashLink || isExternalLink) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
