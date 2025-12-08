import {
  Box,
  CircularProgress,
  LinearProgress,
  Rating,
  Stack,
  Typography,
  ratingClasses,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import IconifyIcon from 'components/base/IconifyIcon';

const ratings = [
  { rating: 5, count: 110 },
  { rating: 4, count: 7 },
  { rating: 3, count: 1 },
  { rating: 2, count: 1 },
  { rating: 1, count: 12 },
];

const recommendsValue = 85;

const totalRatings = ratings.reduce((total, rating) => total + rating.count, 0);

const ProductRatings = ({ sx }) => {
  return (
    <Box sx={{ bgcolor: 'background.elevation1', p: 3, borderRadius: 4, ...sx }}>
      <Grid
        container
        spacing={5}
        sx={{
          alignItems: 'center',
        }}
      >
        <Grid
          size={{
            xs: 6,
            sm: 12,
            xl: 'auto',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: 'warning.main',
              fontWeight: 'medium',
              mb: 1,
            }}
          >
            4.87
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              gap: 1,
              alignItems: { sm: 'center' },
            }}
          >
            <Rating
              name="product-rating"
              color="warning"
              value={5}
              readOnly
              icon={<IconifyIcon icon="material-symbols:star-rounded" />}
              sx={{
                [`& .${ratingClasses.iconFilled}`]: {
                  color: 'warning.main',
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              129 reviews
            </Typography>
          </Stack>
        </Grid>
        <Grid
          sx={{
            order: { sm: 1 },
          }}
          size={{
            xs: 6,
            sm: 3,
            xl: 'auto',
          }}
        >
          <Stack
            sx={{
              justifyContent: 'flex-end',
            }}
          >
            <Box
              sx={{
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                <CircularProgress
                  variant="determinate"
                  sx={{
                    color: 'background.elevation3',
                  }}
                  size={64}
                  thickness={4}
                  value={100}
                />
                <CircularProgress
                  variant="determinate"
                  value={recommendsValue}
                  size={64}
                  thickness={4}
                  sx={{
                    color: 'neutral.dark',
                    position: 'absolute',
                    left: 0,
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: 'text.secondary',
                    }}
                  >{`${Math.round(recommendsValue)}%`}</Typography>
                </Box>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'center',
                }}
              >
                recommends this product
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid
          sx={{
            flex: { xl: 1 },
          }}
          size={{
            xs: 12,
            sm: 9,
            xl: 'auto',
          }}
        >
          {ratings.map(({ rating, count }) => (
            <Stack
              key={`${rating}Stars`}
              sx={{
                alignItems: 'center',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'text.secondary',
                  minWidth: 16,
                }}
              >
                {rating}
              </Typography>
              <IconifyIcon
                icon="material-symbols:star-rounded"
                sx={{
                  color: 'warning.main',
                  mr: 1,
                }}
              />
              <LinearProgress
                variant="determinate"
                value={(count / totalRatings) * 100}
                color="warning"
                sx={{
                  mr: 1,
                  height: 8,
                  width: 1,
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.disabled',
                  minWidth: 30,
                }}
              >
                {count}
              </Typography>
            </Stack>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductRatings;
