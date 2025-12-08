import { useState } from 'react';
import { Box, ButtonBase, Grow } from '@mui/material';
import Chip from '@mui/material/Chip';
import { cssVarRgba } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const getChipColor = (value) => {
  return value < 40 ? 'error' : value >= 60 ? 'success' : 'warning';
};

const Screenshot = ({ item, index, openLightbox }) => {
  const [isHovered, setisHovered] = useState(false);

  return (
    <ButtonBase
      onClick={() => openLightbox(index)}
      onMouseEnter={() => setisHovered(true)}
      onMouseLeave={() => setisHovered(false)}
      sx={{
        width: 1,
        position: 'relative',
        aspectRatio: '16/9',
        overflow: 'hidden',
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.vars.palette.menuDivider}`,
      }}
    >
      <Image src={item.screenshot} sx={{ width: 1, height: 1, objectFit: 'cover' }} />
      <Chip
        variant="filled"
        label={`${item.activity}%`}
        color={getChipColor(item.activity)}
        sx={{ position: 'absolute', top: 10, left: 10 }}
      />
      <Grow in={isHovered} timeout={300} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 2,
            bgcolor: (theme) => cssVarRgba(theme.vars.palette.common.blackChannel, 0.5),
            display: 'grid',
            placeContent: 'center',
          }}
        >
          <IconifyIcon
            icon={'material-symbols:image-outline-rounded'}
            color="common.white"
            fontSize={24}
          />
        </Box>
      </Grow>
    </ButtonBase>
  );
};

export default Screenshot;
