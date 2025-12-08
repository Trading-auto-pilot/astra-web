import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useKanbanContext } from 'providers/KanbanProvider';
import SimpleBar from 'components/base/SimpleBar';
import KanbanApp from 'components/sections/kanban/kanban/KanbanApp';
import KanbanHeader from 'components/sections/kanban/kanban/page-header/KanbanHeader';
import TaskDetails from 'components/sections/kanban/kanban/task-details/TaskDetails';

const Kanban = () => {
  const { kanbanBoard } = useKanbanContext();
  const { backgroundOption } = kanbanBoard;
  const { topbarHeight } = useNavContext();
  const { up } = useBreakpoints();
  const upMd = up('md');
  const upSm = up('sm');

  return (
    <Paper>
      <KanbanHeader />
      <Paper
        sx={[
          {
            width: 1,
            height: ({ mixins }) =>
              mixins.contentHeight(
                topbarHeight,
                (upSm ? mixins.footer.sm : mixins.footer.xs) + (upMd ? 66 : upSm ? 61 : 105),
              ),
            bgcolor: 'background.default',
            overflow: 'hidden',
            overflowX: 'auto',
            '&::-webkit-scrollbar-track': { bgcolor: 'background.default' },
          },
          backgroundOption.type === 'image' && {
            backgroundImage: `url('${backgroundOption.background}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          },
          backgroundOption.type === 'color' && {
            background: backgroundOption.background,
          },
        ]}
      >
        <SimpleBar>
          <Stack sx={{ gap: 3, px: 3, height: 1 }}>
            <KanbanApp />
          </Stack>
        </SimpleBar>
      </Paper>
      <TaskDetails />
    </Paper>
  );
};

export default Kanban;
