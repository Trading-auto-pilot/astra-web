import { useState } from 'react';
import { Box, Link, Typography } from '@mui/material';
import PricingHeader from 'components/sections/pricing/PricingHeader';
import PricingTableContent from 'components/sections/pricing/table/PricingTableContent';

const PricingTable = () => {
  const [isYearly, setIsYearly] = useState(false);

  const handleButtonChange = (value) => {
    setIsYearly(value);
  };

  return (
    <div>
      <PricingHeader isYearly={isYearly} onButtonChange={handleButtonChange} displayMode="table" />

      <PricingTableContent isYearly={isYearly} />

      <Box sx={{ my: 5, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Confused still?
        </Typography>
        <Typography variant="subtitle1" fontWeight={400}>
          Try the <Link href="#!">basic version of Aurora</Link>
        </Typography>
      </Box>
    </div>
  );
};

export default PricingTable;
