import { useState } from 'react';
import { keyframes } from '@emotion/react';
import { Box, Link, alpha } from '@mui/material';
import { green } from 'theme/palette/colors';
import IconifyIcon from 'components/base/IconifyIcon';

const btnGlow = keyframes`
  0% { background-position: 0 100%; }
  100% { background-position: 0 300%; }
`;

const GradientButton = ({ variant = 'outlined', icon, mode = 'dark', sx, children, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDark = mode === 'dark';

  return (
    <Link
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variant="subtitle2"
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          position: 'relative',
          width: { xs: 160, sm: 200 },
          height: { xs: 42, sm: 56 },
          borderRadius: '30px !important',
          color: ({ vars }) => (isDark ? vars.palette.common.white : '#020202'),
          background:
            variant === 'text'
              ? 'transparent'
              : `linear-gradient(to bottom, ${green[500]}, ${alpha(green[500], 0.1)})`,
          verticalAlign: 'middle',
          textAlign: 'center',
          transition: 'background 0.3s ease',
          fontWeight: 600,

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 7.5,
            background: `linear-gradient(to bottom, ${green[500]}, ${green[500]})`,
            opacity: variant === 'text' && isHovered ? 1 : variant !== 'text' && isHovered ? 1 : 0,
            transition:
              variant === 'text'
                ? `opacity 0.2s ease ${isHovered ? '0.15s' : '0s'}`
                : 'opacity 0.2s ease',
          },

          '&::after': {
            content: '""',
            position: 'absolute',
            inset: '1px',
            zIndex: 2,
            borderRadius: '29px',
            bgcolor: ({ vars }) =>
              isHovered
                ? isDark
                  ? vars.palette.grey[950]
                  : vars.palette.common.white
                : variant === 'text'
                  ? 'transparent'
                  : isDark
                    ? vars.palette.grey[950]
                    : vars.palette.common.white,
            backgroundBlendMode: 'overlay',
            transition:
              variant === 'text'
                ? `background ${isHovered ? '0.1s' : '0.3s'} ease`
                : 'background 0.4s ease',
          },
        },

        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <Box
        component="span"
        sx={(theme) => ({
          position: 'relative',
          zIndex: 5,
          bgcolor: 'transparent',
          willChange: 'transform',
          transition: 'transform 0.2s ease',
          ...(isHovered && { transform: `translate3d(-${theme.spacing(2)}, 0, 0)` }),
        })}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1 },
            transition: 'all 0.2s ease',
            ...(isHovered && { transform: 'translateX(-12px)' }),
          }}
        >
          {icon &&
            (typeof icon === 'string' ? (
              <IconifyIcon icon={icon} sx={{ fontSize: { xs: 16, sm: 20 } }} />
            ) : (
              icon
            ))}
          {children}
        </Box>

        <IconifyIcon
          icon="material-symbols:arrow-forward-rounded"
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: { xs: 16, sm: 20 },
            opacity: 0,
            willChange: 'right, opacity',
            transition: 'all 0.2s ease',
            ...(isHovered && { opacity: 1, right: { xs: -10, sm: -14 } }),
          }}
        />
      </Box>

      <Box
        component="span"
        sx={{
          position: 'absolute',
          inset: 0,

          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 7.5,
            opacity: 0,
            animation: `${btnGlow} 5s linear infinite`,
            filter: 'blur(5px)',
          },

          '&::before': {
            zIndex: 0,
            background:
              'linear-gradient(-20deg,#00FFA2,#00FFA220 16.5%,#00FFA2 33%,#00FFA210 49.5%,#00FFA2 66%,#00FFA200 85.5%,#00FFA2 100%) 0 100% / 100% 200%',
            ...(isHovered && {
              opacity: 1,
              transition: 'opacity 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) 0s',
            }),
          },

          '&::after': {
            zIndex: 3,
            background:
              'linear-gradient(20deg,#00FFA2,transparent 16.5%,transparent 33%,transparent 49.5%,#00FFA2 66%,#00FFA260 85.5%,transparent 100%) 0 100% / 100% 200%',
            ...(isHovered && {
              opacity: 0.2,
              transition: 'opacity 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) 0s',
            }),
          },
        }}
      />
    </Link>
  );
};

export default GradientButton;
