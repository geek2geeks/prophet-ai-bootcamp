"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export function SiteHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[rgba(248,242,234,0.82)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-[linear-gradient(135deg,var(--accent),#d88657)] text-sm font-semibold text-white shadow-[0_16px_34px_rgba(181,95,50,0.28)]">
                AI
              </span>
              <span>
                <span className="block text-sm font-semibold text-[var(--foreground)] sm:text-base">
                  AI Actuary Bootcamp
                </span>
                <span className="block text-xs text-[var(--muted-foreground)]">
                  Workspace para builders atuariais
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-white/60 p-1 text-sm text-[var(--muted-foreground)] md:flex">
            <Link href="/" className="rounded-full px-4 py-2 transition hover:bg-[var(--accent-ghost)] hover:text-[var(--foreground)]">Inicio</Link>
            <Link href="/#roadmap" className="rounded-full px-4 py-2 transition hover:bg-[var(--accent-ghost)] hover:text-[var(--foreground)]">Roteiro</Link>
            <Link href="/resources" className="rounded-full px-4 py-2 transition hover:bg-[var(--accent-ghost)] hover:text-[var(--foreground)]">Recursos</Link>
            {user ? <Link href="/portfolio" className="rounded-full px-4 py-2 transition hover:bg-[var(--accent-ghost)] hover:text-[var(--foreground)]">Portfolio</Link> : null}
            {user?.email === "pedro@stratfordgeek.com" ? (
              <Link href="/admin" className="rounded-full px-4 py-2 font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-ghost)]">Admin</Link>
            ) : null}
          </nav>

          <div className="flex items-center gap-3">
            {!loading && user ? (
              <div className="flex items-center gap-3">
                <span className="hidden text-xs text-[var(--muted-foreground)] sm:block">
                  {user.email}
                </span>
                <button
                  onClick={() => signOut(auth)}
                  className="rounded-full border border-[var(--border)] bg-white/65 px-4 py-2 text-xs font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent-soft)] hover:text-[var(--foreground)]"
                >
                  Sair
                </button>
              </div>
            ) : !loading ? (
              <Link
                href="/login"
                className="inline-flex items-center rounded-full bg-[linear-gradient(135deg,var(--accent),#d88657)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(181,95,50,0.28)] transition hover:translate-y-[-1px] hover:bg-[linear-gradient(135deg,var(--accent-strong),var(--accent))]"
              >
                Entrar
              </Link>
            ) : null}
          </div>
        </div>

        <nav className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-[var(--muted-foreground)] md:hidden">
          <Link href="/" className="glass-pill shrink-0 rounded-full px-4 py-2.5 font-semibold uppercase tracking-[0.14em]">Inicio</Link>
          <Link href="/#roadmap" className="glass-pill shrink-0 rounded-full px-4 py-2.5 font-semibold uppercase tracking-[0.14em]">Roteiro</Link>
          <Link href="/resources" className="glass-pill shrink-0 rounded-full px-4 py-2.5 font-semibold uppercase tracking-[0.14em]">Recursos</Link>
          {user ? <Link href="/portfolio" className="glass-pill shrink-0 rounded-full px-4 py-2.5 font-semibold uppercase tracking-[0.14em]">Portfolio</Link> : null}
          {user?.email === "pedro@stratfordgeek.com" ? <Link href="/admin" className="glass-pill shrink-0 rounded-full px-4 py-2.5 font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">Admin</Link> : null}
        </nav>
      </div>
    </header>
  );
}
