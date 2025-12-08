import { Typography, useTheme } from '@mui/material';

const GradientText = ({
  gradient,
  gradientOrientation = 'center',
  sx,
  children,
  ref,
  ...props
}) => {
  const theme = useTheme();

  const getBackground = () => {
    if (gradient) return gradient;
    if (gradientOrientation === 'none') return theme.vars.palette.common.white;

    const gradients = {
      ltr: `linear-gradient(90deg, ${theme.vars.palette.common.white} 0%, transparent 167.18%)`,
      rtl: `linear-gradient(90deg, transparent -29.16%, ${theme.vars.palette.common.white} 40.65%)`,
      center: `linear-gradient(90deg, transparent -29.16%, ${theme.vars.palette.common.white} 49.53%, transparent 126.65%)`,
    };

    return gradients[gradientOrientation] || gradients.center;
  };

  return (
    <Typography
      ref={ref}
      dir="ltr"
      sx={{
        background: getBackground(),
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textFillColor: 'transparent',
        display: 'inline-block',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default GradientText;
