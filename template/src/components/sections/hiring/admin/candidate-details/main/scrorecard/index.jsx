import { Stack, Typography } from '@mui/material';
import FillScorecard from './FillScorecard';
import RatingCriteria from './RatingCriteria';
import ScorecardFeedback from './ScorecardFeedback';
import ScorecardSummary from './summary';

const Scorecard = () => {
  return (
    <div>
      <Stack sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Typography variant="h6">Scorecard Summary</Typography>
        <FillScorecard />
      </Stack>

      <Stack direction="column" gap={5}>
        <ScorecardSummary />
        <RatingCriteria />
        <ScorecardFeedback />
      </Stack>
    </div>
  );
};

export default Scorecard;
