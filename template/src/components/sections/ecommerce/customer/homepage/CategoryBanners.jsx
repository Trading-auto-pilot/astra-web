import { Box, Link, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Image from 'components/base/Image';

const CategoryBanners = ({ banners }) => {
  return (
    <Box sx={{ px: { xs: 3, md: 5 }, py: 5, overflow: 'hidden' }}>
      <Grid
        container
        spacing={3}
        columns={{ xs: 1, md: 3 }}
        sx={{
          justifyContent: 'center',
        }}
      >
        {banners.map(({ id, title, image, url }) => (
          <Grid key={id} size={1}>
            <Link
              href={url}
              underline="none"
              sx={{
                height: 1,
                display: 'block',
                p: { xs: 3, lg: 5 },
                borderRadius: 6,
                bgcolor: 'background.elevation1',
                '&:hover': {
                  bgcolor: 'background.elevation2',
                },
              }}
            >
              <Stack
                direction="column"
                sx={{
                  rowGap: 8,
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: 'text.secondary',
                    textAlign: 'center',
                    typography: { xs: 'h5', sm: 'h4', md: 'h6', lg: 'h4' },
                    maxWidth: 360,
                  }}
                >
                  {title}
                </Typography>
                <Image
                  src={image}
                  alt={`category-banner-${id}"`}
                  sx={{ maxHeight: 290, width: 1, objectFit: 'contain' }}
                />
              </Stack>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoryBanners;
