import { Box } from '@mui/material';
import PromoBanner from 'layouts/ecommerce-layout/app-bar/PromoBanner';
import PrimaryAppbar from './primary';
import SecondaryAppbar from './secondary';

const EcommerceAppbar = () => {
  return (
    <Box
      sx={{
        height: 1,
      }}
    >
      <PrimaryAppbar>
        <SecondaryAppbar />
        <PromoBanner />
      </PrimaryAppbar>
    </Box>
  );
};

export default EcommerceAppbar;
