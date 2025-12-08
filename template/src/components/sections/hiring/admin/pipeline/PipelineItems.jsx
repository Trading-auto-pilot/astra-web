import Stack from '@mui/material/Stack';
import SortablePipelineItem from './SortablePipelineItem';

const PipelineItems = ({ pipelines }) => {
  return (
    <Stack direction="column" sx={{ gap: 2, pb: 3 }}>
      {pipelines.map((item) => (
        <SortablePipelineItem key={item.id} pipeline={item} />
      ))}
    </Stack>
  );
};

export default PipelineItems;
