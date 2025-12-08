import { Box, ButtonBase, Container, Link, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { kebabCase } from 'lib/utils';
import Image from 'components/base/Image';

const PopularCategories = ({ categories }) => {
  return (
    <Box sx={{ px: { xs: 3, md: 5 }, py: 5 }}>
      <Container sx={{ px: { xs: 0 }, maxWidth: { xl: 1536, md: 900 } }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            mb: 4,
          }}
        >
          Popular categories
        </Typography>

        <Grid
          container
          sx={{
            gap: 3,
            justifyContent: 'center',
          }}
        >
          {categories.map(({ label, image, url }) => (
            <Grid
              key={kebabCase(label)}
              sx={{
                textAlign: 'center',
              }}
              size="auto"
            >
              <Link
                href={url}
                underline="none"
                sx={{
                  '&:hover': {
                    img: {
                      transform: 'scale(1.2)',
                      transition: 'transform .3s ease',
                    },
                  },
                }}
              >
                <ButtonBase
                  sx={{
                    width: 200,
                    height: 200,
                    borderRadius: 6,
                    overflow: 'hidden',
                    WebkitMaskImage: 'radial-gradient(white, black)',
                    mb: 2,
                  }}
                >
                  <Image
                    src={image}
                    alt={kebabCase(label)}
                    sx={{
                      width: 1,
                      objectFit: 'cover',
                      transition: 'transform .3s ease',
                    }}
                  />
                </ButtonBase>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                  }}
                >
                  {label}
                </Typography>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PopularCategories;
