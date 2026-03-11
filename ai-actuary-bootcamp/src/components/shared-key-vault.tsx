"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

type SharedKeys = {
  gemini: string;
  zai: string;
};

export function SharedKeyVault() {
  const { user } = useAuth();
  const [keys, setKeys] = useState<SharedKeys | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    async function fetchKeys() {
      if (!user) return;
      try {
        const docRef = doc(db, "config", "keys");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setKeys(docSnap.data() as SharedKeys);
        } else {
          setError("As chaves ainda nao foram configuradas pelo administrador.");
        }
      } catch (err) {
        setError("Nao foi possivel carregar as chaves de acesso.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchKeys();
  }, [user]);

  const copyToClipboard = (keyId: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">A carregar cofre...</p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-subtle)] text-[var(--accent)]">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-[var(--foreground)]">Chaves do Bootcamp</h3>
          <p className="text-xs text-[var(--muted-foreground)]">Uso exclusivo para desenvolvimento local durante o curso.</p>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p>{error}</p>
          <p className="mt-3 text-xs leading-6 text-red-700">
            Para concluir o setup do Dia 0, cria o documento `config/keys` no Firestore com os
            campos `gemini` e `zai`.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <div className="flex items-center justify-between">
               <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">Gemini API Key</span>
               <button
                onClick={() => copyToClipboard('gemini', keys?.gemini || '')}
                 className="text-xs font-semibold text-[var(--accent)] hover:underline"
               >
                {copiedKey === 'gemini' ? 'Copiado!' : 'Copiar'}
               </button>
             </div>
             <div className="mt-2 font-mono text-sm text-[var(--muted-foreground)] break-all">
              {keys?.gemini ? (keys.gemini.substring(0, 12) + "...") : "..."}
             </div>
           </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">Z.ai API Key</span>
              <button 
                onClick={() => copyToClipboard('zai', keys?.zai || '')}
                className="text-xs font-semibold text-[var(--accent)] hover:underline"
              >
                {copiedKey === 'zai' ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <div className="mt-2 font-mono text-sm text-[var(--muted-foreground)] break-all">
              {keys?.zai ? (keys.zai.substring(0, 12) + "...") : "..."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
