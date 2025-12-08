import { useTranslation } from 'react-i18next';
import { Box, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import birdDark from 'assets/json/bird-dark.json';
import bird from 'assets/json/bird.json';
import charcterDark from 'assets/json/character-dark.json';
import charcter from 'assets/json/character.json';
import { useThemeMode } from 'hooks/useThemeMode';
import Lottie from 'lottie-react';

const ComingSoon = () => {
  const { t } = useTranslation();
  const { isDark } = useThemeMode();

  return (
    <Grid
      container
      sx={{
        height: 1,
      }}
    >
      <Grid sx={{ display: { xs: 'none', lg: 'block' } }} size={3}>
        <Stack direction="column" sx={{ height: 1 }}>
          <Paper sx={{ flex: 2 }} />
          <Paper background={1} sx={{ flex: 1 }} />
        </Stack>
      </Grid>
      <Grid
        size={{
          xs: 12,
          lg: 6,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: {
              xs: 'auto max-content 100px max-content',
              md: 'max-content auto 144px 80px',
              xl: 'max-content auto 144px 144px',
            },
            height: 1,
          }}
        >
          <Paper
            sx={{
              gridColumn: 'span 2',
              gridRow: 'span 1',
              py: { xs: 3, xl: 6 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 'light',
                fontSize: { xs: 42, lg: 56 },
              }}
            >
              {t('coming_soon')}!
            </Typography>
          </Paper>

          <Paper sx={{ gridColumn: '1/2', gridRow: '2/4' }} />
          <Paper sx={{ gridColumn: '2/3', gridRow: '2/3' }} />
          <Paper sx={{ gridColumn: '1/2', gridRow: '4/5' }} />
          <Paper
            sx={{
              gridColumn: '2/3',
              gridRow: '3/5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
            }}
          >
            <Box sx={(theme) => (theme.direction === 'rtl' ? { transform: 'scaleX(-1)' } : {})}>
              <Lottie animationData={isDark ? birdDark : bird} />
            </Box>
          </Paper>
          <Box sx={{ gridColumn: '1/3', gridRow: '2/4', p: 5, justifySelf: 'center' }}>
            <Stack
              sx={{
                justifyContent: 'center',
                maxHeight: { sm: 370, md: 330, xl: 400 },
                maxWidth: '100%',
              }}
            >
              <Box sx={(theme) => (theme.direction === 'rtl' ? { transform: 'scaleX(-1)' } : {})}>
                <Lottie animationData={isDark ? charcterDark : charcter} />
              </Box>
            </Stack>
          </Box>
        </Box>
      </Grid>
      <Grid sx={{ display: { xs: 'none', lg: 'block' } }} size={3}>
        <Stack direction="column" sx={{ height: 1 }}>
          <Paper sx={{ flex: 1 }} />
          <Paper background={5} sx={{ flex: 1 }} />
          <Paper sx={{ flex: 1 }} />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ComingSoon;
