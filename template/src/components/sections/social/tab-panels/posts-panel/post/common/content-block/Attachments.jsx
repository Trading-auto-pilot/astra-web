import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useLightbox from 'hooks/useLightbox';
import { cssVarRgba } from 'lib/utils';
import Image from 'components/base/Image';
import Lightbox from 'components/base/Lightbox';
import Video from 'components/base/Video';

const Attachments = ({ attachments, sx }) => {
  const { openLightbox, ...lightboxProps } = useLightbox();
  const lightboxSlides = attachments?.map(({ type, src }) => {
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
    <>
      {attachments && attachments.length > 0 && (
        <>
          {attachments.length === 1 && (
            <Grid
              container
              sx={{
                borderRadius: (theme) => theme.spacing(0, 3, 3, 3),
                overflow: 'hidden',
                ...sx,
              }}
            >
              {attachments.map((media, index) => (
                <Grid
                  key={media.src}
                  component={ButtonBase}
                  disableRipple
                  size={12}
                  onClick={() => openLightbox(index)}
                  sx={{
                    maxHeight: 400,
                    borderRadius: (theme) => theme.spacing(1),
                    borderStartStartRadius: 0,
                    overflow: 'hidden',
                    bgcolor: 'background.elevation1',
                  }}
                >
                  {media.type === 'image' && <Image src={media.src} alt="" loading="lazy" />}
                  {media.type === 'video' && (
                    <Video
                      key={media.src}
                      src={media.src}
                      controls
                      onClick={() => openLightbox(index)}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          )}

          {attachments.length > 1 && (
            <Grid
              container
              columns={6}
              spacing={1}
              sx={{
                borderRadius: (theme) => theme.spacing(0, 3, 3, 3),
                overflow: 'hidden',
                ...sx,
              }}
            >
              {attachments.slice(0, Math.min(5, attachments.length)).map((media, index) => {
                let gridSize = 2;

                if (attachments?.length === 2 || attachments?.length === 4) {
                  gridSize = 3;
                } else if (attachments?.length === 3) {
                  gridSize = 2;
                } else if (attachments?.length && attachments.length >= 5) {
                  gridSize = index < 2 ? 3 : 2;
                }

                return (
                  <Grid
                    key={media.src}
                    component={ButtonBase}
                    disableRipple
                    size={gridSize}
                    onClick={() => openLightbox(index)}
                    sx={{
                      maxHeight: 196,
                      borderRadius: (theme) => theme.spacing(1),
                      overflow: 'hidden',
                      '&:last-of-type': {
                        borderEndEndRadius: (theme) => theme.spacing(3),
                      },
                      position: 'relative',
                    }}
                  >
                    {attachments?.length && attachments.length > 5 && index === 4 && (
                      <Stack
                        sx={(theme) => ({
                          position: 'absolute',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 1,
                          height: 1,
                          borderRadius: 2,
                          bgcolor: cssVarRgba(theme.vars.palette.grey['800Channel'], 0.5),
                          zIndex: 2,
                        })}
                      >
                        <Typography variant="h3" sx={{ color: 'common.white' }}>
                          +{attachments.length - 5}
                        </Typography>
                      </Stack>
                    )}

                    {media.type === 'image' && <Image src={media.src} alt="" loading="lazy" />}
                    {media.type === 'video' && (
                      <Video controls src={media.src} onClick={() => openLightbox(index)} />
                    )}
                  </Grid>
                );
              })}
            </Grid>
          )}

          <Lightbox
            slides={lightboxSlides}
            extension={['caption', 'fullscreen', 'slideshow', 'thumbnails', 'video', 'zoom']}
            {...lightboxProps}
          />
        </>
      )}
    </>
  );
};

export default Attachments;
