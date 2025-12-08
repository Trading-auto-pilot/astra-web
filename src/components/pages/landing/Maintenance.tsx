import LandingLayout from "../../../layouts/LandingLayout";
import Title from "../../atoms/typography/Title";
import BodyText from "../../atoms/typography/BodyText";

export default function Maintenance() {
  return (
    <LandingLayout>
      <section className="flex flex-col items-center gap-4 py-16 text-center">
        <Title className="text-3xl">Manutenzione in corso</Title>
        <BodyText muted>Ci scusiamo per il disagio. Torneremo online a breve.</BodyText>
      </section>
    </LandingLayout>
  );
}
