import { useFormContext } from 'react-hook-form';
import { Box, MenuList, Tooltip, Typography } from '@mui/material';
import { cssVarRgba } from 'lib/utils';
import ConfigMenuItem from './ConfigMenuItem';

const ConfigMenu = ({ data, isDark, sx, layoutValue }) => {
  const { watch } = useFormContext();
  const currentValue = watch(data.fieldname);

  const disabled =
    (data.fieldname === 'sidenavShape' && layoutValue === 'topnav') ||
    (data.fieldname === 'topnavShape' && layoutValue === 'sidenav');

  const disabledReason = disabled
    ? layoutValue === 'topnav'
      ? 'Under "LAYOUT", select "Sidenav" or "Combo" to enable.'
      : 'Under "LAYOUT", select "Topnav" or "Combo" to enable.'
    : 'undefined';

  const menuContent = (
    <Box
      sx={{
        position: 'relative',
        zIndex: 99,
        p: 2,
        borderRadius: { xs: 4, sm: 6 },
        bgcolor: ({ vars }) =>
          isDark
            ? cssVarRgba(vars.palette.common.whiteChannel, 0.04)
            : cssVarRgba(vars.palette.grey['950Channel'], 0.7),
        backdropFilter: 'blur(74px)',
        overflow: 'hidden',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: { xs: 4, sm: 6 },
          p: '1px',
          background: 'linear-gradient(to top right, #ffffff00, #ffffff50)',
          mask: 'linear-gradient(#ffffff 0 0) content-box, linear-gradient(#ffffff 0 0)',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        },

        cursor: disabled ? 'not-allowed' : 'default',

        ...sx,
      }}
    >
      <Typography
        component="p"
        variant="overline"
        sx={{
          textAlign: 'left',
          fontWeight: 500,
          color: ({ vars }) => cssVarRgba(vars.palette.common.whiteChannel, disabled ? 0.3 : 0.7),
          mb: 2,
          pl: 1.25,
        }}
      >
        {data.title.toUpperCase()}
      </Typography>

      <MenuList disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {data.options.map((option) => (
          <ConfigMenuItem
            key={option.value}
            value={option.value}
            fieldName={data.fieldname}
            active={!disabled && currentValue === option.value}
            disabled={disabled}
          >
            {option.label}
          </ConfigMenuItem>
        ))}
      </MenuList>
    </Box>
  );

  if (disabled) {
    return (
      <Tooltip
        slotProps={{
          tooltip: {
            sx: {
              maxWidth: 240,
              textAlign: 'center',
              lineHeight: 1.5,
            },
          },
        }}
        title={disabledReason}
        arrow
        placement="top"
      >
        {menuContent}
      </Tooltip>
    );
  }

  return menuContent;
};

export default ConfigMenu;
