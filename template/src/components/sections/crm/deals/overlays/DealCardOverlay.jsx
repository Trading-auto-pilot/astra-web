import Box from '@mui/material/Box';
import DealCard from 'components/sections/crm/deals/deal-card/DealCard';

const DealCardOverlay = ({ deal }) => {
  return (
    <Box sx={{ cursor: 'grabbing', borderRadius: 4, boxShadow: (theme) => theme.vars.shadows[5] }}>
      <DealCard deal={deal} />
    </Box>
  );
};

export default DealCardOverlay;
