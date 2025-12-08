import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { cssVarRgba } from 'lib/utils';

const BentoCard = ({ children }) => {
  return (
    <Box
      data-bento-card
      sx={{
        overflow: 'hidden',
        borderRadius: 6,
        height: 1,
        position: 'relative',

        '&::after, &::before': {
          content: '""',
          position: 'absolute',
          pointerEvents: 'none',
          userSelect: 'none',
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          transition: 'all 0.1s ease-out',
        },

        '&::after': {
          background: (theme) =>
            `radial-gradient(circle 800px at var(--mouse-x) var(--mouse-y), ${cssVarRgba(theme.vars.palette.background.elevation4Channel, 0.2)} 0%, transparent 40%)`,
          zIndex: 10,
        },
        '&::before': {
          background: (theme) =>
            `radial-gradient(circle 600px at var(--mouse-x) var(--mouse-y), ${cssVarRgba(theme.vars.palette.primary.mainChannel, 1)} 0%, transparent 40%)`,
          zIndex: 2,
        },
      }}
    >
      <Paper
        background={1}
        sx={{
          outline: (theme) =>
            `2px solid ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.2)}`,
          height: 'calc(100% - 2px)',
          width: 'calc(100% - 2px)',
          margin: '1px',
          borderRadius: 6,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

const BentoCardHeader = ({ title, subtitle, sx }) => {
  return (
    <Stack direction="column" sx={{ ...sx }}>
      <Typography variant="subtitle1" sx={{ color: 'primary.darker', fontWeight: 700, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'primary.darker' }}>
        {subtitle}
      </Typography>
    </Stack>
  );
};

export { BentoCard, BentoCardHeader };
