import { useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Grow from '@mui/material/Grow';
import { cssVarRgba } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const Media = ({ item, index, openLightbox, imageStyles }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <ButtonBase
      onClick={() => openLightbox(index)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        borderRadius: 2,
        height: 1,
        width: 1,
        bgcolor: 'background.elevation2',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {item.type === 'video' ? (
        <Box
          onClick={() => openLightbox(0)}
          component="video"
          src={item.src}
          controls
          sx={{ width: 1, aspectRatio: 1, objectFit: 'contain' }}
        />
      ) : (
        <Box
          sx={{
            width: 1,
            aspectRatio: 1,
            backgroundColor: isLoaded ? 'transparent' : 'background.neutral',
            position: 'relative',
          }}
        >
          <Image
            src={item.src}
            alt=""
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            sx={{
              width: 1,
              height: 1,
              objectFit: 'cover',
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
              position: 'absolute',
              inset: 0,
              ...imageStyles,
            }}
          />
        </Box>
      )}

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
            icon={
              item.type === 'video'
                ? 'material-symbols:play-circle-outline-rounded'
                : 'material-symbols:image-outline-rounded'
            }
            fontSize={20}
            color="common.white"
          />
        </Box>
      </Grow>
    </ButtonBase>
  );
};

export default Media;
