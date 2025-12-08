import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormGroup,
  Link,
  Rating,
  Stack,
  Typography,
  dividerClasses,
  ratingClasses,
} from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const FrequentProducts = ({ frequentProducts }) => {
  const { numberFormat, currencyFormat } = useNumberFormat();

  return (
    <div>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
        }}
      >
        Frequently bought together with
      </Typography>
      <FormGroup sx={{ mb: 5, gap: 2 }}>
        {frequentProducts.map(({ id, images, name, ratings, sold, price }) => (
          <Stack
            key={id}
            sx={{
              gap: { xs: 2, sm: 4, lg: 2, xl: 4 },
              alignItems: 'center',
              p: 3,
              bgcolor: 'background.elevation1',
              borderRadius: 6,
            }}
          >
            <Checkbox name={`product${id}`} sx={{ p: 0, flexShrink: 0 }} />
            <Stack
              direction={{ xs: 'column', md: 'row', lg: 'column' }}
              sx={{
                alignItems: { md: 'center', lg: 'flex-start' },
                justifyContent: 'space-between',
                flex: 1,
                columnGap: 5,
                rowGap: 1,
              }}
            >
              <Stack
                sx={{
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    p: 1,
                    bgcolor: 'background.elevation2',
                  }}
                >
                  <Image
                    alt={`product${id}`}
                    src={images[0].src}
                    sx={{ width: 1, objectFit: 'contain' }}
                  />
                </Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    lineClamp: 2,
                  }}
                >
                  <Link
                    href={paths.productDetails(String(id))}
                    sx={{
                      color: 'currentcolor',
                    }}
                  >
                    {name}
                  </Link>
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'row', md: 'column', xl: 'row' }}
                sx={{
                  rowGap: 1,
                  columnGap: 2,
                  textAlign: { md: 'end', lg: 'start' },
                }}
              >
                <Typography variant="h6">{currencyFormat(price.discounted)}</Typography>
                <Stack
                  sx={{
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <Rating
                    name="product-rating"
                    size="small"
                    color="warning"
                    value={ratings}
                    readOnly
                    icon={<IconifyIcon icon="material-symbols:star-rounded" />}
                    sx={{
                      [`& .${ratingClasses.iconFilled}`]: {
                        color: 'warning.main',
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      flexShrink: 0,
                      color: 'text.secondary',
                    }}
                  >
                    ({numberFormat(sold)} sold)
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </FormGroup>
      <Divider sx={{ [`& .${dividerClasses.wrapper}`]: { p: 0 } }}>
        <Button
          color="neutral"
          variant="soft"
          endIcon={<IconifyIcon icon="material-symbols:chevron-right-rounded" />}
          sx={{ borderRadius: 10 }}
        >
          Show similar products
        </Button>
      </Divider>
    </div>
  );
};

export default FrequentProducts;
