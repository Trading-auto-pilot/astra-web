import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { Stack } from '@mui/material';
import { prefixedLayouts, preloadAssets, webApps } from 'data/showcase';
import { useAssetsLoaded } from 'components/sections/showcase/common';
import FigmaCTA from 'components/sections/showcase/cta/figma/FigmaCTA';
import ShowcaseCTA from 'components/sections/showcase/cta/showcase/ShowcaseCTA';
import CustomizeLayout from 'components/sections/showcase/customize-layout';
import ElegantCards from 'components/sections/showcase/elegant-cards';
import ShowcaseHero from 'components/sections/showcase/hero';
import ShowcaseLayout from 'components/sections/showcase/layout';
import PrefixedLayouts from 'components/sections/showcase/prefixed-layouts';
import WebApps from 'components/sections/showcase/web-apps/WebApps';

const ltrCache = createCache({
  key: 'auroraltr',
});

const ShowcaseWrapper = ({ children }) => (
  <CacheProvider value={ltrCache}>
    <div dir="ltr" data-aurora-color-scheme="dark">
      {children}
    </div>
  </CacheProvider>
);

const Showcase = () => {
  useAssetsLoaded(preloadAssets);

  return (
    <ShowcaseWrapper>
      <ShowcaseLayout>
        <ShowcaseHero />
        <Stack direction="column" pt={14}>
          <CustomizeLayout />
          <PrefixedLayouts data={prefixedLayouts} />
          <ElegantCards />
          <WebApps data={webApps} />
          <FigmaCTA />
          <ShowcaseCTA />
        </Stack>
      </ShowcaseLayout>
    </ShowcaseWrapper>
  );
};

export default Showcase;
