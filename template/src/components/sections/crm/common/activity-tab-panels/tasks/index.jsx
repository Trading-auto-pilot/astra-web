import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import SimpleBar from 'components/base/SimpleBar';
import StyledTextField from 'components/styled/StyledTextField';
import TaskList from './TaskList';

const TaskTabPanel = ({ tasksData }) => {
  const { up } = useBreakpoints();
  const upSm = up('sm');

  return (
    <Container maxWidth={false} sx={{ maxWidth: 800, px: { xs: 0 } }}>
      <Stack gap={2} sx={{ justifyContent: 'space-between' }}>
        <StyledTextField placeholder="Search tasks" fullWidth sx={{ maxWidth: 300 }} />
        <Button shape={upSm ? undefined : 'square'} color="neutral" sx={{ ml: 'auto', gap: 0.5 }}>
          <IconifyIcon icon="material-symbols:filter-alt-outline" sx={{ fontSize: 20 }} />
          {upSm && <Box component="span">Filter</Box>}
        </Button>
        <Button shape={upSm ? undefined : 'square'} color="neutral" sx={{ gap: 0.5 }}>
          <IconifyIcon icon="material-symbols:sort-rounded" sx={{ fontSize: 20 }} />
          {upSm && <Box component="span">Sort</Box>}
        </Button>
      </Stack>

      <SimpleBar sx={{ maxHeight: 504 }}>
        <Stack direction="column" gap={1} sx={{ mt: 2 }}>
          {tasksData.map((task) => (
            <TaskList key={task.id} tasksData={task} />
          ))}
        </Stack>
      </SimpleBar>

      <Button sx={{ mt: 3 }}>Load more notifications</Button>
    </Container>
  );
};

export default TaskTabPanel;
