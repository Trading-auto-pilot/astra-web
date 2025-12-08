import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconifyIcon from 'components/base/IconifyIcon';
import AddNewTaskForm from './AddNewTaskForm';

const AddNewTask = ({ listId }) => {
  const [isFormActive, setIsFormActive] = useState(false);

  return isFormActive ? (
    <AddNewTaskForm
      listId={listId}
      position="bottom"
      handleFormClose={() => setIsFormActive(false)}
    />
  ) : (
    <Box sx={{ p: 1, borderRadius: 4, bgcolor: 'background.elevation1' }}>
      <Button
        variant="text"
        color="neutral"
        onClick={() => setIsFormActive(true)}
        startIcon={
          <IconifyIcon icon="material-symbols:add-2-rounded" sx={{ fontSize: '20px !important' }} />
        }
        fullWidth
      >
        Add New Task
      </Button>
    </Box>
  );
};

export default AddNewTask;
