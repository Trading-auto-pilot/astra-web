import IconButton from '@mui/material/IconButton';
import { cssVarRgba } from 'lib/utils';

export const CustomNavButton = ({ children, onClick, sx }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={(theme) => ({
        color: theme.vars.palette.success.main,
        backgroundColor: cssVarRgba(theme.vars.palette.success.mainChannel, 0.15),
        width: 30,
        height: 30,
        '&:hover': {
          backgroundColor: cssVarRgba(theme.vars.palette.success.mainChannel, 0.25),
        },
        ...sx,
      })}
    >
      {children}
    </IconButton>
  );
};
