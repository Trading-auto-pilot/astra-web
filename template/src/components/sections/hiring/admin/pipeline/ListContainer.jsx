import { isWindows } from 'react-device-detect';
import Stack from '@mui/material/Stack';
import ListHeader from './ListHeader';
import PipelineItems from './PipelineItems';

const ListContainer = ({ list, listeners }) => {
  const { items } = list;

  return (
    <Stack
      {...listeners}
      direction="column"
      gap={1}
      sx={[{ height: 1, width: 305, px: 1, flexShrink: 0 }]}
    >
      <ListHeader list={list} />
      <Stack
        direction="column"
        gap={1}
        sx={{
          height: `calc(100% - 63px)`,
          overflowY: 'auto',
          ...(isWindows && {
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }),
        }}
      >
        <PipelineItems pipelines={items} />
      </Stack>
    </Stack>
  );
};

export default ListContainer;
