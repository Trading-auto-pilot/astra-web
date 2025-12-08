import { listItemTextClasses } from '@mui/material';
import { Box, Button, Link, List, Stack, Typography } from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import { useEcommerce } from 'providers/EcommerceProvider';
import paths from 'routes/paths';
import Image from 'components/base/Image';
import ProductVariantListItem from 'components/sections/ecommerce/admin/common/ProductVariantListItem';

const CartSummary = () => {
  const { cartItems } = useEcommerce();
  const { currencyFormat } = useNumberFormat();

  return (
    <div>
      <Stack
        sx={{
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
          }}
        >
          Summary
        </Typography>
        <Button variant="soft" color="neutral" href={paths.cart}>
          Edit cart
        </Button>
      </Stack>
      <Stack
        direction="column"
        sx={{
          gap: 4,
        }}
      >
        {cartItems.map((cartItem) => (
          <Box key={cartItem.id}>
            <Stack
              sx={{
                gap: 2,
                flex: 1,
                flexDirection: { md: 'column', lg: 'row' },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: 2,
                  bgcolor: 'background.elevation2',
                  p: 0.5,
                }}
              >
                <Image
                  src={cartItem.images[0].src}
                  alt=""
                  sx={{ width: 1, objectFit: 'contain' }}
                />
              </Box>
              <Box
                sx={{
                  flex: 1,
                }}
              >
                <Stack
                  sx={{
                    width: 1,
                    gap: 2,
                    mb: 4,
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      lineClamp: 2,
                    }}
                  >
                    <Link
                      href={paths.productDetails(String(cartItem.id))}
                      sx={{
                        color: 'currentcolor',
                      }}
                    >
                      {cartItem.name}
                    </Link>
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {currencyFormat(cartItem.price.discounted)}
                  </Typography>
                </Stack>

                <List dense disablePadding>
                  {cartItem.variants?.map((variant) => (
                    <ProductVariantListItem
                      key={variant.label}
                      label={variant.label}
                      value={variant.value}
                      sx={{
                        mb: 1,
                        [`& .${listItemTextClasses.primary}`]: {
                          minWidth: 70,
                        },
                      }}
                    />
                  ))}
                  <ProductVariantListItem
                    label="Quantity"
                    value={cartItem.quantity}
                    sx={{
                      mb: 1,
                      [`& .${listItemTextClasses.primary}`]: {
                        minWidth: 70,
                      },
                    }}
                  />
                </List>
              </Box>
            </Stack>
          </Box>
        ))}
      </Stack>
    </div>
  );
};

export default CartSummary;
