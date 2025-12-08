import { useState } from 'react';
import { Box, Button, ButtonBase, Grow, Stack, Typography } from '@mui/material';
import useLightbox from 'hooks/useLightbox';
import { cssVarRgba } from 'lib/utils';
import { useChatContext } from 'providers/ChatProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import Lightbox from 'components/base/Lightbox';

const Media = ({ item, index, openLightbox }) => {
  const [isHovered, setisHovered] = useState(false);

  return (
    <ButtonBase
      onClick={() => openLightbox(index)}
      onMouseEnter={() => setisHovered(true)}
      onMouseLeave={() => setisHovered(false)}
      sx={{
        borderRadius: 2,
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
        <Image
          src={item.src}
          alt=""
          loading="lazy"
          sx={{ width: 1, aspectRatio: 1, objectFit: 'cover' }}
        />
      )}

      <Grow in={isHovered} timeout={300} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 2,
            bgcolor: (theme) => cssVarRgba(theme.vars.palette.common.black, 0.5),
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

const MediaGallery = () => {
  const { currentConversation } = useChatContext();
  const { openLightbox, ...lightboxProps } = useLightbox();

  const media =
    currentConversation?.messages.flatMap(
      (conversation) =>
        conversation.attachments?.media?.filter(
          (media) => media.type === 'image' || media.type === 'video',
        ) || [],
    ) || [];

  const lightboxSlides = media.map(({ type, src }) => {
    if (type === 'video') {
      return {
        src,
        type: 'video',
        sources: [{ src, type: 'video/mp4' }],
      };
    } else {
      return {
        src,
        type: 'image',
      };
    }
  });

  return (
    <Box sx={{ px: { xs: 3, md: 5 }, py: 3 }}>
      <Stack justifyContent="space-between" alignItems="center" mb={media.length > 0 ? 4 : 2}>
        <Typography variant="h6">Media</Typography>

        <Button variant="text" disabled={!media.length} onClick={() => openLightbox(0)}>
          View all
        </Button>
      </Stack>

      {media.length > 0 ? (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(102px, 1fr))',
              gap: 1,
            }}
          >
            {media.slice(0, 6).map((item, index) => (
              <Media key={index} item={item} index={index} openLightbox={openLightbox} />
            ))}
          </Box>

          <Lightbox
            slides={lightboxSlides}
            extension={['caption', 'fullscreen', 'slideshow', 'thumbnails', 'video', 'zoom']}
            {...lightboxProps}
          />
        </>
      ) : (
        <Typography variant="subtitle2" color="text.disabled">
          No media shared yet.
        </Typography>
      )}
    </Box>
  );
};

export default MediaGallery;
