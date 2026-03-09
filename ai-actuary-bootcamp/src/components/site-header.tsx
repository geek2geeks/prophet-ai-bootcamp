"use client";

import { useAuth } from "@/lib/auth-context";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { usePathname } from "next/navigation";

import { AppLink } from "@/components/app-link";
import { isAdminEmail } from "@/lib/admin";

type NavItem = {
  href: string;
  label: string;
  requiresAuth?: boolean;
  adminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Hoje" },
  { href: "/#roadmap", label: "Percurso" },
  { href: "/resources", label: "Recursos" },
  { href: "/portfolio", label: "Provas", requiresAuth: true },
  { href: "/admin", label: "Admin", adminOnly: true },
];

function getContextLabel(pathname: string) {
  if (pathname.startsWith("/missions/")) {
    const slug = pathname.split("/").at(-1) ?? "--";
    return `Dia ${slug}`;
  }

  if (pathname.startsWith("/portfolio")) {
    return "Portfolio";
  }

  if (pathname.startsWith("/resources")) {
    return "Biblioteca";
  }

  if (pathname.startsWith("/login")) {
    return "Acesso";
  }

  if (pathname.startsWith("/admin")) {
    return "Operacoes";
  }

  return "Workspace";
}

export function SiteHeader() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isAdmin = isAdminEmail(user?.email);
  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.adminOnly) {
      return isAdmin;
    }

    if (item.requiresAuth) {
      return Boolean(user);
    }

    return true;
  });

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="nav-pill shell-frame mx-auto max-w-7xl rounded-[1.9rem] px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <AppLink href="/" className="inline-flex items-center gap-3">
              <span className="header-mark flex h-11 w-11 items-center justify-center rounded-[1rem] text-sm font-semibold text-white shadow-[0_18px_30px_rgba(6,55,63,0.18)]">
                AI
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[var(--foreground)] sm:text-base">
                  AI Actuary Bootcamp
                </span>
                <span className="block truncate text-xs text-[var(--muted-foreground)]">
                  Fluxo de aprendizagem para builders atuariais
                </span>
              </span>
            </AppLink>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="route-chip inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                {getContextLabel(pathname)}
              </span>
              {user ? (
                <span className="text-xs text-[var(--muted-foreground)]">
                  Acede rapidamente a aulas, provas e recursos.
                </span>
              ) : (
                <span className="text-xs text-[var(--muted-foreground)]">
                  Explora o bootcamp e entra para guardar progresso.
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            {!loading && user ? (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Sessao
                  </p>
                  <p className="max-w-[14rem] truncate text-sm font-medium text-[var(--foreground)]">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => signOut(auth)}
                  className="button-secondary px-4 py-2 text-sm font-semibold"
                >
                  Sair
                </button>
              </>
            ) : !loading ? (
              <AppLink href="/login" className="button-primary px-5 py-2.5 text-sm">
                Entrar
              </AppLink>
            ) : null}
          </div>
        </div>

        <nav className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-sm text-[var(--muted-foreground)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {visibleItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : item.href.startsWith("/#")
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

            return (
              <AppLink
                key={item.href}
                href={item.href}
                className={`route-link shrink-0 rounded-full px-4 py-2.5 transition ${
                  active
                    ? "bg-[var(--foreground)] text-white"
                    : "bg-white/78 text-[var(--muted-foreground)] hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </AppLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
