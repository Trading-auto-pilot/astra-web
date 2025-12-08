import { useFormContext, useWatch } from 'react-hook-form';
import { Box, Button, Checkbox, Chip, Link, Rating, Stack, Typography } from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import { kebabCase } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useEcommerce } from 'providers/EcommerceProvider';
import paths from 'routes/paths';
import Image from 'components/base/Image';

const WishlistedProduct = ({ product, handleRemoveProduct }) => {
  const { addItemToCart } = useEcommerce();
  const { register, control } = useFormContext();
  const { numberFormat, currencyFormat } = useNumberFormat();

  const selectedProducts = useWatch({ control, name: 'products' });

  const { up } = useBreakpoints();
  const upSm = up('sm');

  const { id, name, images, tags, ratings, sold, price } = product;

  return (
    <Box
      sx={{
        bgcolor: 'background.elevation1',
        borderRadius: 6,
        p: { xs: 3, md: 5 },
      }}
    >
      <Stack
        sx={{
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
        }}
      >
        <Checkbox
          value={id}
          checked={selectedProducts.map((id) => Number(id)).includes(id)}
          {...register('products')}
        />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            flex: 1,
            gap: { xs: 5, lg: 8 },
            justifyContent: 'space-between',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              gap: 4,
              alignItems: { sm: 'center' },
            }}
          >
            {upSm && (
              <Box
                sx={{
                  position: 'relative',
                  width: 184,
                  flexShrink: 0,
                }}
              >
                {product.sold > 2000 && (
                  <Chip
                    variant="filled"
                    label="Best seller"
                    color="warning"
                    sx={{ position: 'absolute', left: 0, top: 0 }}
                  />
                )}
                <Image src={images[0].src} alt="" sx={{ width: 1, objectFit: 'contain' }} />
              </Box>
            )}

            <div>
              <Typography
                variant="subtitle1"
                sx={{
                  flex: 1,
                  fontWeight: 700,
                  lineClamp: 2,
                  mb: 2,
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

              <Stack
                sx={{
                  gap: 0.5,
                  flexWrap: 'wrap',
                  mb: 4,
                }}
              >
                {tags.map((tag) => (
                  <Chip key={kebabCase(tag)} variant="soft" label={tag} />
                ))}
              </Stack>

              {!upSm && (
                <Box
                  sx={{
                    position: 'relative',
                    width: 184,
                    flexShrink: 0,
                  }}
                >
                  {product.sold > 2000 && (
                    <Chip
                      variant="filled"
                      label="Best seller"
                      color="warning"
                      sx={{ position: 'absolute', left: 0, top: 0 }}
                    />
                  )}
                  <Image src={images[0].src} alt="" sx={{ width: 1, objectFit: 'contain' }} />
                </Box>
              )}

              <Stack
                sx={{
                  gap: 0.5,
                  alignItems: 'center',
                  mb: 4,
                  flexWrap: 'wrap',
                }}
              >
                <Rating size="small" value={ratings} readOnly />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  ({numberFormat(sold)} sold)
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'success.main',
                    fontWeight: 500,
                    ml: 0.5,
                  }}
                >
                  80+ bought in past month
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: 'column', lg: 'row' }}
                sx={{
                  gap: 1,
                  alignItems: { xs: 'flex-start', lg: 'center' },
                }}
              >
                <Typography variant="h4">{currencyFormat(price.discounted)}</Typography>
                <Stack
                  sx={{
                    gap: 0.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'line-through',
                    }}
                  >
                    {currencyFormat(price.regular)}
                  </Typography>
                  <Chip variant="soft" color="success" label="Save 50%" />
                </Stack>
              </Stack>
            </div>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row', md: 'column' }}
            sx={{
              flexShrink: 0,
              gap: 1,
            }}
          >
            <Stack
              direction={{ xs: 'row', md: 'column' }}
              sx={{
                gap: 1,
              }}
            >
              <Button variant="contained" color="primary" fullWidth={!upSm}>
                {upSm ? 'Buy this item' : 'Buy now'}
              </Button>
              <Button
                variant="contained"
                color="neutral"
                fullWidth={!upSm}
                onClick={() => addItemToCart(product)}
              >
                {upSm ? 'Add item to cart' : 'Add to cart'}
              </Button>
            </Stack>
            <Box
              sx={{
                ml: { sm: 'auto' },
                mt: { xs: 2, sm: 0, md: 'auto' },
              }}
            >
              <Button variant="text" color="error" onClick={() => handleRemoveProduct(product.id)}>
                Remove from wishlist
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default WishlistedProduct;
