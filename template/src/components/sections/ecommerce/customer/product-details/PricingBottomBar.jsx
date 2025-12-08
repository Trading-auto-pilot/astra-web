import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import useNumberFormat from 'hooks/useNumberFormat';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useEcommerce } from 'providers/EcommerceProvider';
import Image from 'components/base/Image';

const PricingBottomBar = () => {
  const { product, addItemToCart } = useEcommerce();
  const { currencyFormat } = useNumberFormat();
  const { up } = useBreakpoints();
  const upLg = up('lg');

  return (
    <Paper background={2} sx={{ py: 1 }}>
      <Grid
        container
        spacing={{ xs: 3, md: 5 }}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 3, md: 5 },
        }}
      >
        <Grid
          size={{
            xs: 'auto',
            sm: 6,
            lg: 8,
          }}
        >
          <Stack
            sx={{
              gap: 3,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {upLg && (
              <Stack
                sx={{
                  gap: 3,
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'primary.main',
                    bgcolor: 'background.elevation1',
                  }}
                >
                  <Image
                    src={product?.images[0].src}
                    alt=""
                    sx={{ width: 1, display: 'block', objectFit: 'contain' }}
                  />
                </Box>
                <Typography variant="subtitle2" sx={{ lineClamp: 1, maxWidth: 'sm' }}>
                  {product?.name}
                </Typography>
              </Stack>
            )}
            <Typography sx={{ typography: { xs: 'h5', sm: 'h4' } }}>
              {currencyFormat(product.price.discounted * product.quantity)}
            </Typography>
          </Stack>
        </Grid>

        <Grid
          sx={{ flex: { xs: 1 } }}
          size={{
            xs: 'auto',
            sm: 6,
            lg: 4,
          }}
        >
          <Stack
            sx={{
              gap: { xs: 1, sm: 2 },
              flex: 1,
              justifyContent: 'flex-end',
            }}
          >
            <Button
              color="neutral"
              variant="contained"
              sx={{ flex: 1, flexShrink: 0, whiteSpace: 'nowrap', maxWidth: 275 }}
              onClick={() => {
                if (product) {
                  addItemToCart(product);
                }
              }}
            >
              Add to Cart
            </Button>
            <Button
              color="primary"
              variant="contained"
              sx={{ flex: 1, flexShrink: 0, whiteSpace: 'nowrap', maxWidth: 275 }}
            >
              Buy now
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PricingBottomBar;
