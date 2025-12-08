import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

export const useScheduleColors = () => {
  const theme = useTheme();

  const colorMap = useMemo(
    () => ({
      primary: theme.vars.palette.primary.main,
      secondary: theme.vars.palette.secondary.main,
      error: theme.vars.palette.error.main,
      success: theme.vars.palette.success.main,
      warning: theme.vars.palette.warning.main,
      info: theme.vars.palette.info.main,
      neutral: theme.vars.palette.neutral.main,
    }),
    [theme],
  );

  return {
    colorMap,
  };
};
