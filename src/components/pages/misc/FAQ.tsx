import MainLayout from "../../../layouts/MainLayout";
import SectionHeader from "../../molecules/content/SectionHeader";
import BodyText from "../../atoms/typography/BodyText";

const faqItems = [
  { q: "Posso usare AstraAI in produzione?", a: "Sì, i componenti sono tipizzati e pronti per Tailwind." },
  { q: "Serve MUI?", a: "No, tutti i componenti usano solo Tailwind e Iconify." },
];

export default function FAQ() {
  return (
    <MainLayout title="FAQ">
      <div className="space-y-4">
        <SectionHeader title="FAQ" subTitle="Domande frequenti" />
        <div className="space-y-3">
          {faqItems.map((item) => (
            <div key={item.q} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">{item.q}</div>
              <BodyText muted>{item.a}</BodyText>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
