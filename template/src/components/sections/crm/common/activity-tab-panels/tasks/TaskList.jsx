import { useState } from 'react';
import Button from '@mui/material/Button';
import Collapse, { collapseClasses } from '@mui/material/Collapse';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import TaskTable from './TaskTable';

const TaskList = ({ tasksData }) => {
  const [open, setOpen] = useState(false);
  const [taskList, setTaskList] = useState(tasksData.taskList);

  const noOfCompletedTasks = taskList.filter((task) => task.completed).length;

  const handleCheck = (taskItem) => {
    setTaskList((prev) =>
      prev.map((task) =>
        task.id === taskItem.id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  return (
    <Stack
      direction="column"
      sx={{
        borderRadius: 6,
        p: 2,
        bgcolor: 'background.elevation1',
      }}
    >
      <Stack
        role="button"
        onClick={() => setOpen(!open)}
        sx={{
          cursor: 'pointer',
          bgcolor: 'background.elevation1',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack gap={1} sx={{ flexShrink: 0, alignItems: 'center', width: 220 }}>
          <IconifyIcon
            icon="material-symbols:expand-less"
            sx={({ transitions }) => ({
              fontSize: 24,
              transform: !open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: transitions.create('transform', {
                duration: transitions.duration.short,
                easing: transitions.easing.easeInOut,
              }),
            })}
          />
          <Typography variant="body1" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
            {tasksData.title}
          </Typography>
        </Stack>
        <Stack direction="column" gap={0.25} sx={{ maxWidth: 266, width: 1 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {noOfCompletedTasks}/{taskList.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(noOfCompletedTasks / taskList.length) * 100}
          />
        </Stack>
      </Stack>
      <Collapse
        in={open}
        sx={{
          [`& .${collapseClasses.wrapperInner}`]: {
            mt: 2,
          },
        }}
      >
        <TaskTable taskList={taskList} handleCheck={handleCheck} />
        <Button
          size="small"
          color="neutral"
          fullWidth
          startIcon={<IconifyIcon icon="material-symbols:add" />}
          sx={{ mt: 2 }}
        >
          Add Task
        </Button>
      </Collapse>
    </Stack>
  );
};

export default TaskList;
