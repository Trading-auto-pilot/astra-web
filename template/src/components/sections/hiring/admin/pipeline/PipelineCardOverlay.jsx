import Box from '@mui/material/Box';
import PipelineCard from './PipelineCard';

const PipelineCardOverlay = ({ pipeline }) => {
  return (
    <Box sx={{ cursor: 'grabbing', borderRadius: 4, boxShadow: (theme) => theme.vars.shadows[5] }}>
      <PipelineCard pipeline={pipeline} />
    </Box>
  );
};

export default PipelineCardOverlay;
