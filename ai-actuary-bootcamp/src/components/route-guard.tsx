"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function RouteGuardInner({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && !user) {
      const query = searchParams.toString();
      const returnTo = `${pathname}${query ? `?${query}` : ""}`;
      const target = returnTo && returnTo !== "/login" ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login";
      router.replace(target);
    }
  }, [loading, pathname, router, searchParams, user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">A verificar acesso...</p>
      </div>
    );
  }

  return <>{children}</>;
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            A verificar acesso...
          </p>
        </div>
      }
    >
      <RouteGuardInner>{children}</RouteGuardInner>
    </Suspense>
  );
}
