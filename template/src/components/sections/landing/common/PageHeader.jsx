import { Box, Container, Stack } from '@mui/material';
import { cssVarRgba } from 'lib/utils';
import DashedLine from './DashedLine';
import { StripedBackground } from './StripedBackground';

export const Dot = ({ placement }) => {
  const placements = placement.split('-');

  return (
    <Box
      sx={{
        height: 8,
        width: 8,
        bgcolor: 'divider',
        borderRadius: '50%',
        position: 'absolute',
        zIndex: 10,
        [placements[0]]: -4,
        [placements[1]]: -4,
      }}
    />
  );
};

const PageHeader = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        pt: 5,
        pb: 1,
        px: { xs: 3, md: 5 },
      }}
    >
      <Container
        sx={{
          maxWidth: '1400px !important',
          position: 'relative',
          px: { xs: 0 },

          '&::after': {
            content: '""',
            position: 'absolute',
            width: 260,
            height: 96,
            top: -96,
            right: -260,
            background: (theme) =>
              `linear-gradient(to top right, ${cssVarRgba(theme.vars.palette.background.elevation2Channel, 1)} 0%, transparent 50%)`,
          },
        }}
      >
        <Dot placement="top-left" />
        <Dot placement="top-right" />
        <Dot placement="bottom-left" />
        <Dot placement="bottom-right" />
        <DashedLine
          orientation="vertical"
          gradientOrientation="rtl"
          sx={{
            height: '120%',
            zIndex: 10,
            position: 'absolute',
            left: 0,
            bottom: 0,
          }}
        />
        <DashedLine
          orientation="vertical"
          gradientOrientation="rtl"
          sx={{
            height: '120%',
            position: 'absolute',
            right: 0,
            bottom: 0,
          }}
        />
        <DashedLine
          sx={{
            width: '140%',
            zIndex: 20,
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%)',
            top: 0,
          }}
        />
        <DashedLine
          sx={{
            width: '140%',
            position: 'absolute',
            left: '50%',
            zIndex: -10,
            transform: 'translate(-50%)',
            bottom: 0,
          }}
        />

        <StripedBackground>
          <Stack
            direction="column"
            sx={{ alignItems: 'center', position: 'relative', zIndex: 10, p: { xs: 3, sm: 8 } }}
          >
            {children}
          </Stack>
        </StripedBackground>
      </Container>
    </Box>
  );
};

export default PageHeader;
