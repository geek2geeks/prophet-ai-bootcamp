"use client";

import { useState } from "react";
import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, googleLoginEnabled } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const googleProvider = new GoogleAuthProvider();

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (err: unknown) {
      if (
        err instanceof FirebaseError &&
        (err.code === "auth/invalid-credential" ||
          err.code === "auth/user-not-found" ||
          err.code === "auth/wrong-password")
      ) {
        setError("Credenciais invalidas.");
      } else if (err instanceof FirebaseError && err.code === "auth/email-already-in-use") {
        setError("Email ja esta em uso.");
      } else {
        setError("Ocorreu um erro. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleSubmitting(true);

    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof FirebaseError && err.code === "auth/popup-closed-by-user") {
        setError("O popup Google foi fechado antes da autenticacao terminar.");
      } else if (err instanceof FirebaseError && err.code === "auth/operation-not-allowed") {
        setError("Google login ainda nao esta ativado neste projeto Firebase.");
      } else {
        setError("Nao foi possivel entrar com Google.");
      }
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <main className="page-shell px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[78vh] max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="panel-tech shell-frame soft-grid relative overflow-hidden rounded-[2.4rem] px-6 py-8 sm:px-8 sm:py-10">
          <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_left,rgba(108,143,185,0.18),transparent_52%)]" />
          <div className="relative">
            <p className="kicker">Acesso ao workspace</p>
            <h1 className="mt-4 max-w-3xl font-serif text-[3rem] leading-[0.92] tracking-[-0.04em] text-[var(--foreground)] sm:text-[4.25rem]">
              Entra para continuar a construir.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
              O login liga progresso, entregas, notas e portfolio ao teu perfil para que o teu
              trabalho de build fique guardado de sessao para sessao.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                "Checklists e progresso sincronizados",
                "Entregas e artefactos ligados a cada missao",
                "Notas adesivas persistentes durante o bootcamp",
              ].map((item) => (
                <div key={item} className="metric-card rounded-[1.35rem] px-4 py-4 text-sm leading-6 text-[var(--foreground)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel shell-frame rounded-[2.1rem] p-6 sm:p-8">
          <p className="kicker">{isLogin ? "Entrar" : "Criar conta"}</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {isLogin ? "Retoma o teu bootcamp" : "Abre o teu workspace"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
            Usa email e password para aceder ao progresso, roteiro e caderno de build.
          </p>

          {googleLoginEnabled ? (
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleSubmitting || submitting}
                className="button-secondary flex w-full gap-3 px-4 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-xs font-bold text-[var(--accent)]">
                  G
                </span>
                {googleSubmitting ? "A entrar com Google..." : "Continuar com Google"}
              </button>
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                <span className="h-px flex-1 bg-[var(--border)]" />
                ou email
                <span className="h-px flex-1 bg-[var(--border)]" />
              </div>
            </div>
          ) : (
            <div className="panel-soft mt-6 rounded-[1.4rem] p-4 text-sm leading-7 text-[var(--muted-foreground)]">
              Google login nao esta ativo neste ambiente. Se quiseres esse botao visivel e funcional,
              temos de ativar o provider Google no Firebase Auth e definir `NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN=true`.
            </div>
          )}

          {error ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="panel-soft rounded-[1.4rem] p-4">
              <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-3 block w-full rounded-2xl border border-[var(--border-strong)] bg-white px-4 py-3 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                required
              />
            </div>

            <div className="panel-soft rounded-[1.4rem] p-4">
              <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Password
              </label>
              <input
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-3 block w-full rounded-2xl border border-[var(--border-strong)] bg-white px-4 py-3 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || googleSubmitting}
              className="button-primary w-full px-4 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "A processar..." : isLogin ? "Entrar" : "Registar"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
            {isLogin ? "Nao tem conta? " : "Ja tem conta? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-[var(--accent)] hover:underline"
            >
              {isLogin ? "Registar agora" : "Entrar aqui"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
