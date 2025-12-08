import { Box, useTheme } from '@mui/material';

const DashedLine = ({
  orientation = 'horizontal',
  gradientOrientation = 'center',
  gradient,
  thickness = '1px',
  ...props
}) => {
  const theme = useTheme();
  const isHorizontal = orientation === 'horizontal';
  const baseColor = theme.vars.palette.divider;

  const getGradientMask = () => {
    if (gradient) return undefined;
    if (gradientOrientation === 'none') return undefined;

    const gradients = {
      ltr: `linear-gradient(to ${isHorizontal ? 'right' : 'bottom'}, black 0%, black 65%, transparent 100%)`,
      rtl: `linear-gradient(to ${isHorizontal ? 'right' : 'bottom'}, transparent 0%, black 35%, black 100%)`,
      center: `linear-gradient(to ${isHorizontal ? 'right' : 'bottom'}, transparent 0%, black 10%, black 90%, transparent 100%)`,
    };

    return gradients[gradientOrientation] || gradients.center;
  };

  const getDashMask = () => {
    const direction = isHorizontal ? '90deg' : '0deg';

    return `repeating-linear-gradient(${direction}, black 0, black 4px, transparent 4px, transparent 8px)`;
  };

  const getCombinedMask = () => {
    const gradientMask = getGradientMask();
    const dashMask = getDashMask();

    if (gradient) {
      return dashMask;
    }

    if (gradientOrientation === 'none') {
      return dashMask;
    }

    return `${dashMask}, ${gradientMask}`;
  };

  const getBackground = () => {
    if (gradient) return gradient;

    return baseColor;
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
            maskImage: getCombinedMask(),
            WebkitMaskImage: getCombinedMask(),
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          },
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
};

export default DashedLine;
