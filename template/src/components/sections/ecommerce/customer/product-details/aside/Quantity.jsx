import { Link, Paper, Typography } from '@mui/material';
import { useEcommerce } from 'providers/EcommerceProvider';
import QuantityButtons from '../../common/QuantityButtons';

const Quantity = ({ sx }) => {
  const { product, setProduct } = useEcommerce();

  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, ...sx }}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
        }}
      >
        Quantity
      </Typography>
      <QuantityButtons
        defaultValue={1}
        handleChange={(quantity) => {
          if (product) {
            setProduct({ ...product, quantity: quantity });
          }
        }}
        sx={{ mb: 0.5 }}
      />
      <Link variant="caption" href="#!">
        Check availability
      </Link>
    </Paper>
  );
};

export default Quantity;
