import { Box } from '@mui/material';
import { cssVarRgba } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const BackgroundOptionItem = ({ backgroundOption, type, selected, onClick }) => {
  return (
    <Box
      sx={{
        height: 1,
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: (theme) =>
          selected
            ? `0 0 0 3px ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.38)}`
            : `0 0 0 1px ${theme.vars.palette.divider}`,
      }}
      onClick={() => onClick(backgroundOption)}
    >
      {type === 'image' ? (
        <Image
          height="140"
          src={backgroundOption.background}
          alt={backgroundOption.label}
          sx={{ width: 1, height: 1, objectFit: 'cover' }}
        />
      ) : (
        <Box
          sx={{
            height: 1,
            background: backgroundOption.background,
            borderRadius: 2,
          }}
        />
      )}
      {selected && (
        <Box
          sx={{
            position: 'absolute',
            top: 6,
            right: 6,
          }}
        >
          <IconifyIcon
            icon="material-symbols:check-circle"
            fontSize={20}
            sx={{
              color: 'primary.main',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default BackgroundOptionItem;
