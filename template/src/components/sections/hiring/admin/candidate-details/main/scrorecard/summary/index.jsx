import { Stack } from '@mui/material';
import AverageRating from './AverageRating';
import OverRating from './OverRating';

const ScorecardSummary = () => {
  return (
    <Stack gap={3} direction={{ lg: 'column', xl: 'row' }}>
      <AverageRating />
      <OverRating />
    </Stack>
  );
};

export default ScorecardSummary;
