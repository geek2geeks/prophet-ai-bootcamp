"use client";

import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
    }
  };

  return (
    <main className="page-shell flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
        <h1 className="font-serif text-3xl font-semibold text-[var(--foreground)]">
          {isLogin ? "Entrar na plataforma" : "Criar conta"}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Aceda ao seu progresso, roteiro e caderno.
        </p>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full rounded-2xl border border-[var(--border-strong)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full rounded-2xl border border-[var(--border-strong)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--accent)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            {isLogin ? "Entrar" : "Registar"}
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
      </div>
    </main>
  );
}
