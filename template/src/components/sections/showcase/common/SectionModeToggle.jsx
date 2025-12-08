import { Stack, Switch, Typography, switchClasses } from '@mui/material';
import { cssVarRgba } from 'lib/utils';

const SectionModeToggle = ({ checked, onChange }) => {
  return (
    <Stack spacing={1} sx={{ alignItems: 'center' }}>
      <Typography variant="subtitle2" fontWeight={600} color="common.white">
        Light
      </Typography>

      <Switch
        disableRipple
        checked={checked}
        onChange={onChange}
        sx={{
          [`& .${switchClasses.thumb}`]: {
            bgcolor: ({ vars }) => cssVarRgba(vars.palette.common.whiteChannel, 0.16),
          },
          [`& .${switchClasses.track}`]: {
            bgcolor: ({ vars }) => `${cssVarRgba(vars.palette.grey['950Channel'], 0.8)} !important`,
          },
          position: 'relative',
          overflow: 'visible',
          zIndex: 1,

          '&:before': {
            content: '""',
            position: 'absolute',
            zIndex: -1,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(100% + 2px)',
            height: 'calc(100% + 2px)',
            borderRadius: 3,
            background: 'linear-gradient(90deg, #ffffff10, #ffffff60)',
          },
        }}
      />

      <Typography variant="subtitle2" fontWeight={600} color="common.white">
        Dark
      </Typography>
    </Stack>
  );
};

export default SectionModeToggle;
