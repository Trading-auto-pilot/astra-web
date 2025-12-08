import Stack from '@mui/material/Stack';
import AddNewTask from 'components/sections/kanban/kanban/task-card/AddNewTask';
import AddNewTaskForm from 'components/sections/kanban/kanban/task-card/AddNewTaskForm';
import SortableTaskItem from 'components/sections/kanban/kanban/task-card/SortableTaskItem';

const TaskItems = ({ listId, tasks, isAddNewTaskFormOpen, handleAddNewTaskFormClose }) => {
  return (
    <Stack direction="column" sx={{ gap: 2, p: 1, pb: 3 }}>
      {isAddNewTaskFormOpen && (
        <AddNewTaskForm
          position="top"
          listId={listId}
          handleFormClose={handleAddNewTaskFormClose}
        />
      )}
      {tasks.map((item) => (
        <SortableTaskItem key={item.id} task={item} />
      ))}
      <AddNewTask listId={listId} />
    </Stack>
  );
};

export default TaskItems;
