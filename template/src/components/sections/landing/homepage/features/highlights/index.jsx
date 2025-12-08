import { useRef } from 'react';
import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import APIS from './APIS';
import { BentoCard } from './BentoCard';
import LanguageSupport from './LanguageSupport';
import LogoCard from './LogoCard';
import MobileFriendly from './MobileFriendly';
import ModernUI from './ModernUI';
import RealTimeChat from './RealTimeChat';

const FeaturesHighlight = () => {
  const gridRef = useRef(null);

  const handleMouseMove = (e) => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('[data-bento-card]');

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;

        const cardElement = card;
        cardElement.style.setProperty('--mouse-x', `${x}px`);
        cardElement.style.setProperty('--mouse-y', `${y}px`);
      });
    }
  };

  return (
    <Box sx={{ px: { xs: 3, md: 5 }, pt: 5, pb: { xs: 8, sm: 16 } }}>
      <Container maxWidth={false} sx={{ maxWidth: { xs: 300, sm: 600, md: 1000 }, px: { xs: 0 } }}>
        <Grid container columns={12} spacing={2} ref={gridRef} onMouseMove={handleMouseMove}>
          <Grid container size={12} columns={12} spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3.7 }}>
              <BentoCard>
                <LanguageSupport />
              </BentoCard>
            </Grid>

            <Grid
              container
              size={{ xs: 12, md: 4.6 }}
              columns={12}
              spacing={2}
              height={{ xs: 'auto', md: 1 }}
              order={{ xs: 0, sm: 1, md: 0 }}
            >
              <Grid size={{ xs: 12, sm: 12 }}>
                <BentoCard>
                  <ModernUI />
                </BentoCard>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <BentoCard>
                  <LogoCard />
                </BentoCard>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3.7 }}>
              <BentoCard>
                <MobileFriendly />
              </BentoCard>
            </Grid>
          </Grid>

          <Grid container size={12} columns={12} spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <BentoCard>
                <RealTimeChat />
              </BentoCard>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <BentoCard>
                <APIS />
              </BentoCard>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesHighlight;
