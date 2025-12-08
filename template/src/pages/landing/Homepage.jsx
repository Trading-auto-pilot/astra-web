import {
  blogData,
  faqData,
  featuresData,
  galleryData,
  showcaseData,
  statsData,
  testimonialData,
} from 'data/landing/homepage';
import OurMission from 'components/sections/landing/about-us/OurMission';
import Team from 'components/sections/landing/about-us/Team';
import FAQContact from 'components/sections/landing/faq/FAQContact';
import Blog from 'components/sections/landing/homepage/Blog';
import Clients from 'components/sections/landing/homepage/Clients';
import FAQSection from 'components/sections/landing/homepage/FAQSection';
import Gallery from 'components/sections/landing/homepage/Gallery';
import Hero from 'components/sections/landing/homepage/Hero';
import Newsletter from 'components/sections/landing/homepage/Newsletter';
import Pricing from 'components/sections/landing/homepage/Pricing';
import Stats from 'components/sections/landing/homepage/Stats';
import Testimonial from 'components/sections/landing/homepage/Testimonial';
import WhoWeAre from 'components/sections/landing/homepage/WhoWeAre';
import Features from 'components/sections/landing/homepage/features';
import Showcase from 'components/sections/landing/homepage/showcase';

const LandingHomepage = () => {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <Clients />
      <Showcase data={showcaseData} />
      <Features data={featuresData} />
      <Gallery data={galleryData} />
      <OurMission sx={{ background: 'none', py: { xs: 0, sm: 8 } }} />
      <Stats data={statsData} />
      <Pricing />
      <Testimonial data={testimonialData} />
      <Blog data={blogData} />
      <Team diamond />
      <Newsletter />
      <FAQSection data={faqData} />
      <FAQContact
        sx={{
          '&:after': {
            content: 'none',
          },
        }}
      />
    </>
  );
};

export default LandingHomepage;
