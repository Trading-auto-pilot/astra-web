import Hero from 'components/sections/landing/about-us/Hero';
import OurMission from 'components/sections/landing/about-us/OurMission';
import Overview from 'components/sections/landing/about-us/Overview';
import Team from 'components/sections/landing/about-us/Team';
import Clients from 'components/sections/landing/homepage/Clients';

const AboutUs = () => {
  return (
    <>
      <Hero />
      <Overview />
      <OurMission />
      <Clients />
      <Team />
    </>
  );
};

export default AboutUs;
