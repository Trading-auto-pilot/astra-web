import LandingLayout from "../../../layouts/LandingLayout";
import Title from "../../atoms/typography/Title";
import BodyText from "../../atoms/typography/BodyText";
import TextInput from "../../atoms/form/TextInput";
import BaseButton from "../../atoms/base/buttons/BaseButton";

export default function Contact() {
  return (
    <LandingLayout>
      <section className="mx-auto max-w-2xl space-y-4 py-10">
        <Title as="h1" className="text-center text-3xl">
          Contattaci
        </Title>
        <BodyText muted className="text-center">
          Scrivici per demo, supporto o partnership. Ti risponderemo rapidamente.
        </BodyText>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <TextInput label="Nome" placeholder="Il tuo nome" />
          <TextInput label="Email" type="email" placeholder="you@example.com" />
          <TextInput label="Messaggio" placeholder="Scrivi qui..." />
          <BaseButton className="w-full">Invia</BaseButton>
        </div>
      </section>
    </LandingLayout>
  );
}
