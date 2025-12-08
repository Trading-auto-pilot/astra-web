import { useState } from 'react';
import { Box, Button, Chip, Divider, Stack, TextField, Typography } from '@mui/material';
import { ecomCoupons } from 'data/e-commerce/products';
import useNumberFormat from 'hooks/useNumberFormat';
import { useSnackbar } from 'notistack';
import { useEcommerce } from 'providers/EcommerceProvider';

const PaymentSummary = () => {
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState(false);
  const { appliedCoupon, setAppliedCoupon, cartSubTotal, cartTotal } = useEcommerce();
  const { enqueueSnackbar } = useSnackbar();
  const { currencyFormat } = useNumberFormat();
  const appliedDiscount = appliedCoupon?.appliedDiscount || 0;

  const applyCouponCode = () => {
    const validCoupon = ecomCoupons.find(({ code }) => code === coupon);
    if (validCoupon) {
      setAppliedCoupon(validCoupon);
      setCouponError(false);
      enqueueSnackbar(`${validCoupon.code} is applied!`, { variant: 'success' });
    } else {
      setAppliedCoupon(null);
      setCouponError(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          mb: 5,
        }}
      >
        <Stack
          component="form"
          direction={{ xs: 'column', sm: 'row', md: 'column' }}
          sx={{
            gap: 1,
            mb: 1,
          }}
        >
          <TextField
            variant="filled"
            fullWidth
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            label="Enter a coupon or a reward code"
          />

          <Button variant="soft" color="neutral" sx={{ minWidth: 200 }} onClick={applyCouponCode}>
            Apply
          </Button>
        </Stack>

        {appliedCoupon && (
          <>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                mb: 0.5,
              }}
            >
              You have applied coupon <strong>{appliedCoupon?.code}</strong>
            </Typography>
            <br />
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                mb: 0.5,
              }}
            >
              Which saves you{' '}
              <Box
                component="span"
                sx={{
                  color: 'success.main',
                }}
              >
                {currencyFormat(appliedCoupon?.discount)}
              </Box>
            </Typography>
          </>
        )}
        {couponError && (
          <>
            <Typography
              variant="caption"
              component="p"
              sx={{
                color: 'error.main',
                mb: 1,
              }}
            >
              Uh-oh! Seems like this coupon does not exist.
            </Typography>

            <Typography
              variant="caption"
              component="p"
              sx={{
                color: 'text.secondary',
              }}
            >
              Please check if all the letters and numbers are keyed correctly.
            </Typography>
          </>
        )}
      </Box>
      <div>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
          }}
        >
          Summary
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
            }}
          >
            Subtotal
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
            }}
          >
            {currencyFormat(cartSubTotal)}
          </Typography>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <div>
          <Stack
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: 'text.secondary',
              }}
            >
              Shipping cost
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: 'text.secondary',
              }}
            >
              TBA
            </Typography>
          </Stack>

          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
            }}
          >
            You are only{' '}
            <Box
              component="span"
              sx={{
                color: 'success.main',
              }}
            >
              $20 away
            </Box>{' '}
            from free shipping
          </Typography>
        </div>

        <Divider sx={{ my: 3 }} />

        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
            }}
          >
            Discount
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
            }}
          >
            {currencyFormat(appliedDiscount > 0 ? -appliedDiscount : appliedDiscount)}
          </Typography>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'right' }}>
          <Stack
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
              }}
            >
              Total
            </Typography>
            <Typography variant="h4">{currencyFormat(cartTotal)}</Typography>
          </Stack>

          <Chip
            color="success"
            variant="filled"
            label="Yay! you saved 30% in total"
            sx={{ textAlign: 'right' }}
          />
        </Box>
      </div>
    </>
  );
};

export default PaymentSummary;
