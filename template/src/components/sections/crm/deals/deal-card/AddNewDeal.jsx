import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useDealsContext } from 'providers/DealsProvider';
import { SET_CREATE_DEAL_DIALOG } from 'reducers/DealsReducer';
import IconifyIcon from 'components/base/IconifyIcon';

const AddNewDeal = ({ listId }) => {
  const { dealsDispatch } = useDealsContext();

  return (
    <Box sx={{ p: 1, borderRadius: 4, bgcolor: 'background.elevation1' }}>
      <Button
        variant="text"
        color="neutral"
        onClick={() =>
          dealsDispatch({ type: SET_CREATE_DEAL_DIALOG, payload: { isOpen: true, listId } })
        }
        startIcon={
          <IconifyIcon icon="material-symbols:add-2-rounded" sx={{ fontSize: '20px !important' }} />
        }
        fullWidth
      >
        Add new Deal
      </Button>
    </Box>
  );
};

export default AddNewDeal;
