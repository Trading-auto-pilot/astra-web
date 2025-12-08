import LandingLayout from "../../../layouts/LandingLayout";
import Title from "../../atoms/typography/Title";
import BodyText from "../../atoms/typography/BodyText";
import Badge from "../../atoms/form/Badge";

export default function AboutUs() {
  const values = ["Velocità", "Affidabilità", "Design"];
  return (
    <LandingLayout>
      <section className="space-y-6 py-10">
        <Title className="text-3xl">Chi siamo</Title>
        <BodyText muted>
          Team distribuito che costruisce AstraAI, un design system per prodotti SaaS moderni.
        </BodyText>
        <div className="flex flex-wrap gap-2">
          {values.map((v) => (
            <Badge key={v} tone="primary">
              {v}
            </Badge>
          ))}
        </div>
      </section>
    </LandingLayout>
  );
}
