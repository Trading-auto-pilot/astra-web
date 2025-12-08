import LandingLayout from "../../../layouts/LandingLayout";
import Title from "../../atoms/typography/Title";
import BodyText from "../../atoms/typography/BodyText";
import BaseButton from "../../atoms/base/buttons/BaseButton";

export default function ComingSoon() {
  return (
    <LandingLayout>
      <section className="flex flex-col items-center gap-4 py-16 text-center">
        <Title className="text-4xl">Coming Soon</Title>
        <BodyText muted>
          Stiamo lavorando alla prossima esperienza AstraAI. Iscriviti per ricevere aggiornamenti.
        </BodyText>
        <BaseButton>Avvisami</BaseButton>
      </section>
    </LandingLayout>
  );
}
