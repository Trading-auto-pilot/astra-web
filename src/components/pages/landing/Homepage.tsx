import { useState } from "react";
import LandingLayout from "../../../layouts/LandingLayout";
import Title from "../../atoms/typography/Title";
import { useRelease } from "../../../hooks/useReleaseInfo";

export default function Homepage() {
  const release = useRelease();
  const notes: string[] = Array.isArray((release as any)?.note)
    ? (release as any).note.map((item: unknown) => String(item))
    : [];
  const latestNote = notes.length ? notes[notes.length - 1] : null;
  const remainingNotes = notes.length > 1 ? notes.slice(0, -1).reverse() : [];
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <LandingLayout backgroundImage="/background/landing/space.jpeg">
      <section className="relative flex min-h-[70vh] items-end justify-start px-6 pb-10 pt-20 text-white">
        <div className="absolute right-6 top-6 z-20 flex items-center gap-4 text-sm font-medium text-white">
          <a href="#/contact" className="hover:text-white/80">
            Contacts
          </a>
          <a href="#/login" className="hover:text-white/80">
            Login
          </a>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 pt-12 text-center pointer-events-none">
          <Title as="h1" className="text-6xl font-semibold !text-white drop-shadow-lg sm:text-7xl">
            Astra Trading AI
          </Title>

        </div>
      </section>

      <section className="relative z-20 -mt-12 px-6 pb-12">
        <div className="mx-auto max-w-3xl h-64 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Release info</h2>
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Aggiornata
            </span>
          </div>
          <div className="divide-y divide-slate-200 text-sm text-slate-800 flex-1 overflow-hidden">
            <div className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-3 sm:items-center">
              <div className="font-medium text-slate-600">Versione</div>
              <div className="sm:col-span-2 flex items-center gap-3 text-slate-900">
                <span>{(release as any)?.version ?? "-"}</span>
                {remainingNotes.length > 0 && (
                  <button
                    type="button"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    onClick={() => setShowDrawer(true)}
                  >
                    (mostra altro)
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-3 sm:items-center">
              <div className="font-medium text-slate-600">Ultimo aggiornamento</div>
              <div className="sm:col-span-2 text-slate-900">
                {(release as any)?.lastUpdate ?? "-"}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-3 sm:items-start">
              <div className="font-medium text-slate-600">Note</div>
              <div className="sm:col-span-2 text-slate-900">
                {latestNote ? (
                  <div className="rounded-md bg-slate-50 px-3 py-2 line-clamp-3">
                    {latestNote}
                  </div>
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {showDrawer && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/40" onClick={() => setShowDrawer(false)} />
          <div className="w-full max-w-sm bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-900">Note precedenti</h3>
              <button
                type="button"
                className="text-xs font-semibold text-slate-600 hover:text-slate-800"
                onClick={() => setShowDrawer(false)}
              >
                Chiudi
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-4 space-y-2 text-sm text-slate-800">
              {remainingNotes.length ? (
                remainingNotes.map((note, idx) => (
                  <div key={idx} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {note}
                  </div>
                ))
              ) : (
                <div className="text-slate-500">Nessuna nota precedente</div>
              )}
            </div>
          </div>
        </div>
      )}
    </LandingLayout>
  );
}
