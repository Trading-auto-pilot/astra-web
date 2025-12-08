import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconifyIcon from 'components/base/IconifyIcon';
import AddNewListDialog from './AddNewListDialog';

const AddNewList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Box sx={{ p: 2, width: 464, flexShrink: 0 }}>
        <Box sx={{ p: 2, borderRadius: 4, bgcolor: 'background.elevation1' }}>
          <Button
            variant="text"
            color="neutral"
            onClick={() => setIsDialogOpen(true)}
            startIcon={
              <IconifyIcon
                icon="material-symbols:add-2-rounded"
                sx={{ fontSize: '21px !important' }}
              />
            }
            fullWidth
          >
            Add new List
          </Button>
        </Box>
      </Box>

      <AddNewListDialog
        isDialogOpen={isDialogOpen}
        handleDialogClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default AddNewList;
