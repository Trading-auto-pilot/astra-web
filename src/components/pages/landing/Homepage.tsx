import LandingLayout from "../../../layouts/LandingLayout";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import BodyText from "../../atoms/typography/BodyText";
import Title from "../../atoms/typography/Title";

export default function Homepage() {
  return (
    <LandingLayout backgroundImage="/background/landing/space.jpeg">
      <section className="relative flex min-h-[50vh] items-end justify-start px-6 pb-10 pt-20 text-white">
        <div className="absolute right-6 top-6 flex items-center gap-4 text-sm font-medium text-white">
          <a href="#/contact" className="hover:text-white/80">
            Contacts
          </a>
          <a href="#/login" className="hover:text-white/80">
            Login
          </a>
        </div>

        <div className="absolute inset-0 flex items-start justify-center pt-12 text-center">
          <Title as="h1" className="text-6xl font-semibold !text-white drop-shadow-lg sm:text-7xl">
            Astra Trading AI
          </Title>
        </div>

        <div className="relative z-10 mb-2 max-w-xl rounded-3xl border border-white/30 bg-white/15 px-8 py-10 shadow-2xl backdrop-blur-md">
          <BodyText className="text-lg text-slate-100">
            Automatizza i workflow di trading con insight in tempo reale.
          </BodyText>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <BaseButton
              className="bg-white text-slate-900 hover:bg-slate-100"
              onClick={() => {
                window.location.hash = "/contact";
              }}
            >
              Contact
            </BaseButton>
            <BaseButton
              variant="outline"
              color="neutral"
              className="border-white/70 text-white hover:bg-white/10"
              onClick={() => {
                window.location.hash = "/login";
              }}
            >
              Login
            </BaseButton>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
