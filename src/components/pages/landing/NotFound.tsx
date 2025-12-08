import LandingLayout from "../../../layouts/LandingLayout";
import Title from "../../atoms/typography/Title";
import BodyText from "../../atoms/typography/BodyText";
import BaseButton from "../../atoms/base/buttons/BaseButton";

export default function NotFound() {
  return (
    <LandingLayout>
      <section className="flex flex-col items-center gap-4 py-16 text-center">
        <Title className="text-4xl">404</Title>
        <BodyText muted>La pagina che cerchi non esiste.</BodyText>
        <BaseButton onClick={() => (window.location.href = "/")}>Torna alla home</BaseButton>
      </section>
    </LandingLayout>
  );
}
