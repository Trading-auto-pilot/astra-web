import { Box } from '@mui/material';
import { cardClasses } from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { pricing } from 'data/pricing';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import PricingCard from 'components/sections/pricing/column/PricingCard';
import PricingCardWide from 'components/sections/pricing/column/PricingCardWide';
import RevealItems from '../common/RevealItems';
import SectionHeader from '../common/SectionHeader';

const Pricing = () => {
  const { between } = useBreakpoints();

  const isBetweenSmLg = between('sm', 'lg');

  return (
    <Box sx={{ px: { xs: 3, md: 5 }, pt: { xs: 8, sm: 16 }, pb: { xs: 0, sm: 8 } }}>
      <SectionHeader
        title="Pricing"
        subtitle="Choose the package that fit best for you"
        sx={{ mb: 3 }}
      />

      <Container maxWidth={false} sx={{ maxWidth: 1048, px: { xs: 0 } }}>
        <RevealItems
          component={Stack}
          y={0}
          direction={{ xs: 'column', lg: 'row' }}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            [`& .${cardClasses.root}`]: {
              bgcolor: 'background.default',
            },
          }}
        >
          {pricing.slice(0, 3).map((item) =>
            isBetweenSmLg ? (
              <PricingCardWide key={item.id} data={item} isYearly={false} />
            ) : (
              <PricingCard
                key={item.id}
                data={item}
                isYearly={false}
                sx={{
                  mr: { lg: item.id === pricing.slice(0, 3).length ? 0 : -5 },
                }}
              />
            ),
          )}
        </RevealItems>
      </Container>
    </Box>
  );
};

export default Pricing;
