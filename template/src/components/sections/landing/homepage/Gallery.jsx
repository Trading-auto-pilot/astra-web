import { useState } from 'react';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import useLightbox from 'hooks/useLightbox';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import Image from 'components/base/Image';
import Lightbox from 'components/base/Lightbox';
import SectionHeader from '../common/SectionHeader';
import { StripedBackground } from '../common/StripedBackground';

const Gallery = ({ data }) => {
  const { openLightbox, ...lightboxProps } = useLightbox();
  const { up } = useBreakpoints();

  const upSm = up('sm');
  const lightboxSlides = data.map(({ img }) => ({ src: img, type: 'image' }));

  return (
    <>
      <Box
        component={StripedBackground}
        fadeWidth="0%"
        sx={{
          px: { xs: 3, md: 5 },
          py: 5,
          '&::before': {
            maskImage: `linear-gradient(
              to bottom,
              black 0%,
              black 30%,
              transparent 100%
            )`,
          },
        }}
      >
        <SectionHeader title="Gallery" subtitle="Project showcase" sx={{ mb: 3 }} />

        <Container maxWidth={false} sx={{ maxWidth: 1448, px: { xs: 0 }, textAlign: 'center' }}>
          <Grid container columns={12} spacing={4} mb={6}>
            {upSm && (
              <Grid container size={12} columns={12} spacing={3}>
                {data.slice(0, 3).map((item, i) => (
                  <Grid key={i} size={{ xs: 12, sm: 4 }}>
                    <GalleryItem
                      item={item}
                      index={i}
                      openLightbox={openLightbox}
                      sx={{
                        [`& .media`]: {
                          maxHeight: 380,
                          aspectRatio: 1.3,
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
            <Grid container size={12} columns={12} spacing={3}>
              {data.slice(3).map((item, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <GalleryItem
                    item={item}
                    index={i + 3}
                    openLightbox={openLightbox}
                    sx={{
                      [`& .media`]: {
                        maxHeight: { xs: 360, sm: 400 },
                        aspectRatio: { xs: 1.2, sm: 0.8 },
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Button variant="soft" color="neutral">
            Load more
          </Button>
        </Container>
      </Box>
      <Lightbox
        slides={lightboxSlides}
        extension={['caption', 'fullscreen', 'slideshow', 'thumbnails', 'video', 'zoom']}
        {...lightboxProps}
      />
    </>
  );
};

export default Gallery;

const GalleryItem = ({ item, index, openLightbox, sx }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Stack
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      direction="column"
      gap={2}
      alignItems="center"
      onClick={() => openLightbox(index)}
      sx={{ height: 1, ...sx }}
    >
      <Box
        component="figure"
        className="media"
        sx={[
          { m: 0, borderRadius: 6, overflow: 'hidden', width: 1, height: 1, aspectRatio: 1 },
          isHovered && { cursor: 'pointer' },
        ]}
      >
        <Image
          src={item.img}
          sx={{
            objectFit: 'cover',
            width: 1,
            height: 1,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease-in-out',
          }}
        />
      </Box>

      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        {item.name}
      </Typography>
    </Stack>
  );
};
