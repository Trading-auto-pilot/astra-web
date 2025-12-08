import { useMemo } from 'react';
import { Chip, Paper, Stack, Typography } from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import { useEcommerce } from 'providers/EcommerceProvider';

const Price = ({ sx }) => {
  const { product } = useEcommerce();
  const { currencyFormat } = useNumberFormat();

  const discountPrice = useMemo(() => {
    const formattedPrice = currencyFormat(product?.price.discounted || 0);

    return [formattedPrice.slice(0, 1), formattedPrice.slice(1, -3), formattedPrice.slice(-3)];
  }, [product, currencyFormat]);

  return (
    <Paper
      sx={{
        p: { xs: 3, md: 5 },
        display: 'flex',
        gap: 2,
        flexDirection: 'column',
        ...sx,
      }}
    >
      <Typography variant="h2" sx={{ fontSize: 'h1.fontSize' }}>
        <Typography variant="h5" component="span">
          {discountPrice[0]}
        </Typography>
        {discountPrice[1]}
        <Typography variant="h5" component="span">
          {discountPrice[2]}
        </Typography>
      </Typography>
      <Stack
        sx={{
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Chip
          label={`Save $${Number(product?.price.regular) - Number(product?.price.discounted)}`}
          color="success"
          variant="filled"
        />
        <Typography
          variant="h6"
          sx={{
            color: 'error.main',
            fontWeight: 'medium',
            textDecoration: 'line-through',
          }}
        >
          {currencyFormat(product?.price.regular || 0)}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default Price;
