import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CollapsiblePanel from '../common/CollapsiblePanel';
import PreScreenQuestions from './PreScreenQuestions';
import VideoResponses from './VideoResponses';

const Questionaries = () => {
  return (
    <Paper background={1} sx={{ outline: 0, p: 2, borderRadius: 4 }}>
      <CollapsiblePanel name="Questionaries">
        <Stack direction="column" gap={4} sx={{ px: 1, pt: 3 }}>
          <PreScreenQuestions />
          <VideoResponses />
        </Stack>
      </CollapsiblePanel>
    </Paper>
  );
};

export default Questionaries;
