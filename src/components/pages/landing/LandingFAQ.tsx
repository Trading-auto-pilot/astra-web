import LandingLayout from "../../../layouts/LandingLayout";
import Title from "../../atoms/typography/Title";
import BodyText from "../../atoms/typography/BodyText";

const faqs = [
  { q: "Cos'è AstraAI?", a: "Un design system Tailwind + React per costruire UI velocemente." },
  { q: "Posso usarlo con Vite?", a: "Sì, è ottimizzato per Vite + TypeScript." },
  { q: "È personalizzabile?", a: "Certo, tutte le classi Tailwind sono modificabili." },
];

export default function LandingFAQ() {
  return (
    <LandingLayout>
      <section className="space-y-6 py-10">
        <Title className="text-3xl">FAQ</Title>
        <div className="space-y-4">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">{item.q}</div>
              <BodyText muted>{item.a}</BodyText>
            </div>
          ))}
        </div>
      </section>
    </LandingLayout>
  );
}
