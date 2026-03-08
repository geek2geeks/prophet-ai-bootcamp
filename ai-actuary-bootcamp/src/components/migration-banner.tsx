"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * MigrationBanner
 *
 * Shown to users who were migrated from Supabase
 * (Firestore students/{uid}/profile.password_reset_required === true).
 *
 * Offers two paths:
 *   A) Send a password-reset email (easiest)
 *   B) Set new password in-place (if already logged in via migrated temp pw)
 */
export function MigrationBanner() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const run = async () => {
      try {
        const ref = doc(db, "students", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data()?.password_reset_required === true) {
          setShow(true);
        }
      } catch {
        // silently skip — non-critical
      }
    };
    run();
  }, [user]);

  async function handleSendReset() {
    if (!user?.email) return;
    setSending(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, user.email);
      setSent(true);
      // Clear the flag in Firestore so banner doesn't show again
      await updateDoc(doc(db, "students", user.uid), {
        password_reset_required: false,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao enviar email.");
    } finally {
      setSending(false);
    }
  }

  async function handleDismiss() {
    setDismissed(true);
    // Don't clear Firestore flag — remind on next login
  }

  if (!show || dismissed) return null;

  return (
    <div
      role="alert"
      className="relative mx-auto mb-6 max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 shadow-sm"
    >
      <button
        onClick={handleDismiss}
        aria-label="Fechar aviso"
        className="absolute right-4 top-4 text-amber-400 hover:text-amber-600"
      >
        ✕
      </button>

      {sent ? (
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-xl">✅</span>
          <div>
            <p className="font-semibold text-amber-900">Email enviado!</p>
            <p className="mt-1 text-sm text-amber-800">
              Verifica a tua caixa de entrada em{" "}
              <strong>{user?.email}</strong> e clica no link para definir a
              tua palavra-passe permanente.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="text-2xl">🔑</span>
          <div className="flex-1">
            <p className="font-semibold text-amber-900">
              A tua conta foi migrada para a nova plataforma
            </p>
            <p className="mt-1 text-sm text-amber-800">
              Para garantir a segurança da tua conta, define uma nova
              palavra-passe. Basta clicar no botão — enviamos um link para o
              teu email.
            </p>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <button
              onClick={handleSendReset}
              disabled={sending}
              className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
            >
              {sending ? "A enviar…" : "Enviar link de reset"}
            </button>
            <button
              onClick={handleDismiss}
              className="text-xs text-amber-600 underline hover:text-amber-800"
            >
              Lembrar mais tarde
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
