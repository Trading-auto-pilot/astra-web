import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import { cssVarRgba } from 'lib/utils';
import Logo from 'components/common/Logo';

const LogoCard = () => {
  return (
    <Box
      sx={({ vars }) => ({
        overflow: 'hidden',
        height: 1,
        width: 1,
        background: `
          repeating-linear-gradient(
            to right,
            ${vars.palette.dividerLight} 0,
            ${vars.palette.dividerLight} 1px,
            transparent 1px,
            transparent 12.5%
          ),
          repeating-linear-gradient(
            to bottom,
            ${vars.palette.dividerLight} 0,
            ${vars.palette.dividerLight} 1px,
            transparent 1px,
            transparent 25%
          )
        `,
      })}
    >
      <Stack
        direction="column"
        height={1}
        justifyContent="center"
        alignItems="center"
        sx={({ vars }) => ({
          background: `/* @noflip */ linear-gradient(45deg, transparent 0%, ${vars.palette.background.default} 40%, ${vars.palette.background.default} 60%, transparent 75%, ${cssVarRgba(vars.palette.success.mainChannel, 0.2)} 90%)`,
          py: { xs: 9, md: 6, lg: 9 },
        })}
      >
        <Logo />
      </Stack>
    </Box>
  );
};

export default LogoCard;
