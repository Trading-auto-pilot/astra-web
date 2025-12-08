import { Stack } from '@mui/material';
import { recentProjects, sharedProjects, userProjects } from 'data/kanban/boards';
import BoardsSlider from 'components/sections/kanban/boards/boards-slider/BoardsSlider';
import KanbanBoardsHeader from 'components/sections/kanban/boards/page-header/KanbanBoardsHeader';

const KanbanBoards = () => {
  return (
    <>
      <KanbanBoardsHeader />
      <Stack direction="column">
        <BoardsSlider boardList={recentProjects} size="small" />
        <BoardsSlider boardList={userProjects} />
        <BoardsSlider boardList={sharedProjects} />
      </Stack>
    </>
  );
};

export default KanbanBoards;
