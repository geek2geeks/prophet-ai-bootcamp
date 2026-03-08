"use client";

import { useAuth } from "@/lib/auth-context";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { AppLink } from "@/components/app-link";
import { isAdminEmail } from "@/lib/admin";

export function SiteHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6 lg:px-8">
      <div className="nav-pill shell-frame mx-auto max-w-7xl rounded-[1.85rem] px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <AppLink href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-[linear-gradient(145deg,#132330,#274358)] text-sm font-semibold text-white shadow-[0_16px_34px_rgba(22,34,47,0.22)]">
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
            </AppLink>
          </div>

          <nav className="hidden items-center gap-2 rounded-full border border-[rgba(17,32,46,0.08)] bg-white/58 p-1 text-sm text-[var(--muted-foreground)] md:flex">
            <AppLink href="/" className="rounded-full px-4 py-2 transition hover:bg-[var(--cool-accent-soft)] hover:text-[var(--foreground)]">Inicio</AppLink>
            <AppLink href="/#roadmap" className="rounded-full px-4 py-2 transition hover:bg-[var(--cool-accent-soft)] hover:text-[var(--foreground)]">Roteiro</AppLink>
            <AppLink href="/resources" className="rounded-full px-4 py-2 transition hover:bg-[var(--cool-accent-soft)] hover:text-[var(--foreground)]">Recursos</AppLink>
            {user ? <AppLink href="/portfolio" className="rounded-full px-4 py-2 transition hover:bg-[var(--cool-accent-soft)] hover:text-[var(--foreground)]">Portfolio</AppLink> : null}
            {isAdminEmail(user?.email) ? (
              <AppLink href="/admin" className="rounded-full px-4 py-2 font-semibold text-[var(--accent)] transition hover:bg-[var(--cool-accent-soft)]">Admin</AppLink>
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
                  className="button-secondary px-4 py-2 text-xs font-semibold text-[var(--muted-foreground)]"
                >
                  Sair
                </button>
              </div>
            ) : !loading ? (
              <AppLink
                href="/login"
                className="button-primary px-5 py-2.5 text-sm"
              >
                Entrar
              </AppLink>
            ) : null}
          </div>
        </div>

        <nav className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-[var(--muted-foreground)] md:hidden">
          <AppLink href="/" className="glass-pill shrink-0 rounded-full px-4 py-2.5 font-semibold uppercase tracking-[0.14em]">Inicio</AppLink>
          <AppLink href="/#roadmap" className="glass-pill shrink-0 rounded-full px-4 py-2.5 font-semibold uppercase tracking-[0.14em]">Roteiro</AppLink>
          <AppLink href="/resources" className="glass-pill shrink-0 rounded-full px-4 py-2.5 font-semibold uppercase tracking-[0.14em]">Recursos</AppLink>
          {user ? <AppLink href="/portfolio" className="glass-pill shrink-0 rounded-full px-4 py-2.5 font-semibold uppercase tracking-[0.14em]">Portfolio</AppLink> : null}
          {isAdminEmail(user?.email) ? <AppLink href="/admin" className="glass-pill shrink-0 rounded-full px-4 py-2.5 font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">Admin</AppLink> : null}
        </nav>
      </div>
    </header>
  );
}
