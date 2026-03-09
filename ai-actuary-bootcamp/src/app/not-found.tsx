import { AppLink } from "@/components/app-link";

export default function NotFound() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center px-4 py-20 sm:px-6">
      <div className="max-w-xl rounded-[2.2rem] border border-[#e7c8d2] bg-white/90 p-8 text-center shadow-[0_24px_80px_rgba(96,42,70,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9c7181]">
          Mission not found
        </p>
        <h1 className="mt-4 font-serif text-5xl text-[#351f29]">The page slipped off the study desk.</h1>
        <p className="mt-4 text-sm leading-7 text-[#6c5560]">
          Head back to the mission grid and continue from a valid day workspace.
        </p>
        <AppLink
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#351f29] px-5 py-3 text-sm font-semibold text-[#fff5f6]"
        >
          Back home
          <span aria-hidden="true">{"->"}</span>
        </AppLink>
      </div>
    </main>
  );
}
