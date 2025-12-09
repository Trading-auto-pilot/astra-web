import LandingLayout from "../../../layouts/LandingLayout";
import Title from "../../atoms/typography/Title";
import { useRelease } from "../../../hooks/useReleaseInfo";

export default function Homepage() {
  const release = useRelease();
  const notes = Array.isArray((release as any)?.note) ? (release as any).note : [];

  return (
    <LandingLayout backgroundImage="/background/landing/space.jpeg">
      <section className="relative flex min-h-[50vh] items-end justify-start px-6 pb-10 pt-20 text-white">
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

      <section className="relative z-20 mt-10 px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Release info</h2>
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Aggiornata
            </span>
          </div>
          <div className="divide-y divide-slate-200 text-sm text-slate-800">
            <div className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-3 sm:items-center">
              <div className="font-medium text-slate-600">Versione</div>
              <div className="sm:col-span-2 text-slate-900">{(release as any)?.version ?? "-"}</div>
            </div>
            <div className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-3 sm:items-center">
              <div className="font-medium text-slate-600">Ultimo aggiornamento</div>
              <div className="sm:col-span-2 text-slate-900">
                {(release as any)?.lastUpdate ?? "-"}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-3 sm:items-start">
              <div className="font-medium text-slate-600">Note</div>
              <div className="sm:col-span-2 space-y-1 text-slate-900">
                {notes.length ? (
                  notes.map((item, idx) => (
                    <div key={`${idx}-${item}`} className="rounded-md bg-slate-50 px-3 py-2">
                      {item}
                    </div>
                  ))
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
