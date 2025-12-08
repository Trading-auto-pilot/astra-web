import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { useKanbanContext } from 'providers/KanbanProvider';
import { TASK_DETAILS_CLOSE } from 'reducers/KanbanReducer';
import TaskDetailsHeader from './TaskDetailsHeader';
import TaskSummary from './TaskSummary';
import Activity from './activity/Activity';
import Attachments from './attachments/Attachments';
import CheckList from './check-list/CheckList';
import CoverImage from './cover-image/CoverImage';
import Description from './description/Description';

const TaskDetails = () => {
  const { taskDetails, kanbanDispatch } = useKanbanContext();
  const initialData = {
    ...taskDetails,
    priority: taskDetails?.priority ?? '',
    category: taskDetails?.label ?? '',
    attachments: taskDetails?.attachments ?? [],
    subtasks: taskDetails?.subtasks ?? [],
  };

  const methods = useForm({
    defaultValues: initialData,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    reset(initialData);
  }, [taskDetails, methods]);

  const handleDiscartChanges = () => {
    reset(initialData);
    kanbanDispatch({ type: TASK_DETAILS_CLOSE });
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <Drawer
        open={!!taskDetails}
        onClose={() => kanbanDispatch({ type: TASK_DETAILS_CLOSE })}
        anchor="right"
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleSubmit(onSubmit),
          },
        }}
        sx={{
          [`& .${drawerClasses.paper}`]: {
            width: { xs: 375, md: 650 },
            overflowX: 'hidden',
          },
        }}
      >
        <TaskDetailsHeader />
        <CoverImage />
        <TaskSummary />
        <Description />
        <Attachments />
        <CheckList />
        <Activity />
        <Stack sx={{ gap: 1, px: { xs: 3, md: 5 }, py: 3, justifyContent: 'flex-end' }}>
          <Button variant="soft" color="neutral" onClick={handleDiscartChanges}>
            Discard
          </Button>
          <Button variant="contained" type="submit">
            Save
          </Button>
        </Stack>
      </Drawer>
    </FormProvider>
  );
};

export default TaskDetails;
