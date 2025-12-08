import { Avatar, Box, Button, Grid, Stack, Tooltip, Typography } from '@mui/material';
import useLightbox from 'hooks/useLightbox';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import Lightbox from 'components/base/Lightbox';
import Screenshot from './Screenshot';

const Activities = ({ screencast, isLast }) => {
  const { currentBreakpoint } = useBreakpoints();
  const { openLightbox, ...lightboxProps } = useLightbox();
  const { name, avatar, screenshots } = screencast;

  const screenshotCount = (() => {
    switch (currentBreakpoint) {
      case 'sm':
        return 2;
      case 'lg':
        return 4;
      default:
        return 3;
    }
  })();

  const lightboxSlides = screenshots.map((item) => ({
    src: item.screenshot,
    type: 'image',
  }));

  return (
    <Box sx={{ mb: isLast ? 0 : 4 }}>
      <Stack sx={{ mb: 2, alignItems: 'center' }}>
        <Stack sx={{ gap: 1, alignItems: 'center' }}>
          <Tooltip title={name}>
            <Avatar src={avatar} sx={{ height: 32, width: 32 }} />
          </Tooltip>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {name}
          </Typography>
        </Stack>

        <Button
          size="small"
          href="#!"
          sx={{ ml: 'auto' }}
          endIcon={
            <IconifyIcon
              icon="material-symbols:chevron-right-rounded"
              sx={{ fontSize: '18px !important' }}
            />
          }
        >
          View all
        </Button>
      </Stack>

      <Grid container direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, xl: 2 }}>
        {screenshots.slice(0, screenshotCount).map((item, index) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 6, xl: 4 }}>
            <Screenshot item={item} index={index} openLightbox={openLightbox} />
          </Grid>
        ))}
        <Lightbox
          slides={lightboxSlides}
          extension={['caption', 'fullscreen', 'slideshow', 'thumbnails', 'video', 'zoom']}
          {...lightboxProps}
        />
      </Grid>
    </Box>
  );
};

export default Activities;
