import { Box, useTheme } from '@mui/material';

const GradientDivider = ({
  orientation = 'horizontal',
  gradientOrientation = 'center',
  gradient,
  thickness = '1px',
  ...props
}) => {
  const theme = useTheme();
  const isHorizontal = orientation === 'horizontal';
  const baseColor = theme.vars.palette.grey[600];

  const getBackground = () => {
    if (gradient) return gradient;
    if (gradientOrientation === 'none') return baseColor;

    const gradients = {
      ltr: `linear-gradient(to ${isHorizontal ? 'right' : 'bottom'}, ${baseColor} 0%, ${baseColor} 95%, transparent 100%)`,
      rtl: `linear-gradient(to ${isHorizontal ? 'right' : 'bottom'}, transparent 0%, ${baseColor} 5%, ${baseColor} 100%)`,
      center: `linear-gradient(to ${isHorizontal ? 'right' : 'bottom'}, transparent 0%, ${baseColor} 5%, ${baseColor} 95%, transparent 100%)`,
    };

    return gradients[gradientOrientation] || gradients.center;
  };

  const getMaskImage = () => {
    const direction = isHorizontal ? '90deg' : '0deg';

    return `repeating-linear-gradient(${direction}, black 0, black 2px, transparent 2px, transparent 4px)`;
  };

  return (
    <Box
      {...props}
      sx={[
        {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            zIndex: 10,
            top: isHorizontal ? '50%' : 0,
            left: isHorizontal ? 0 : '50%',
            width: isHorizontal ? 1 : thickness,
            height: isHorizontal ? thickness : 1,
            background: getBackground(),
            ...(gradient
              ? {}
              : {
                  maskImage: getMaskImage(),
                  WebkitMaskImage: getMaskImage(),
                }),
          },
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
};

export default GradientDivider;
