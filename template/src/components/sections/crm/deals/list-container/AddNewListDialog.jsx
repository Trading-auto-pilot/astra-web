import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useDealsContext } from 'providers/DealsProvider';
import { ADD_NEW_LIST } from 'reducers/DealsReducer';
import IconifyIcon from 'components/base/IconifyIcon';

const AddNewListDialog = ({ isDialogOpen, handleDialogClose }) => {
  const { listItems, dealsDispatch } = useDealsContext();
  const [newList, setNewList] = useState({ title: '', columnNo: 0 });

  useEffect(() => {
    setNewList({ ...newList, columnNo: listItems.length + 1 });
  }, [listItems]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewList((prev) => ({ ...prev, [name]: value }));
  };

  const handleDiscardChanges = () => {
    setNewList({ title: '', columnNo: listItems.length + 1 });
    handleDialogClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dealsDispatch({ type: ADD_NEW_LIST, payload: newList });
    setNewList({ title: '', columnNo: listItems.length + 1 });
    handleDialogClose();
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleDialogClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      component="form"
      onSubmit={(e) => handleSubmit(e)}
      sx={{ [`& .${dialogClasses.paper}`]: { p: 3, borderRadius: 6, position: 'relative' } }}
    >
      <DialogTitle id="dialog-title" sx={{ p: 0, mb: 1, typography: 'h6' }}>
        Add new list
      </DialogTitle>
      <DialogContent sx={{ p: 0, mb: 3, overflow: 'visible' }}>
        <DialogContentText
          id="dialog-description"
          sx={{ mb: 2, color: 'text.secondary', typography: 'body2' }}
        >
          Create a new list to organize your deals.
        </DialogContentText>

        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            id="filled-basic"
            label="List Name"
            variant="filled"
            name="title"
            value={newList.title}
            onChange={handleChange}
            sx={{ minWidth: 270 }}
          />
          <FormControl sx={{ minWidth: 128 }}>
            <InputLabel id="select-filled-label">Column No</InputLabel>
            <Select
              label="Column No"
              labelId="select-filled-label"
              id="select-filled"
              name="columnNo"
              value={`${newList.columnNo}`}
              onChange={handleChange}
            >
              {[...Array.from({ length: listItems.length + 1 }, (_, i) => i + 1)].map((colNo) => (
                <MenuItem key={colNo} value={colNo}>
                  {colNo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 0 }}>
        <Button variant="soft" color="neutral" onClick={handleDiscardChanges}>
          Discard
        </Button>
        <Button type="submit" variant="contained" autoFocus>
          Confirm
        </Button>
      </DialogActions>
      <Button
        shape="square"
        variant="text"
        size="small"
        color="neutral"
        onClick={handleDialogClose}
        sx={{ position: 'absolute', top: 24, right: 24 }}
      >
        <IconifyIcon
          icon="material-symbols:close-rounded"
          sx={{ color: 'text.primary', fontSize: 20 }}
        />
      </Button>
    </Dialog>
  );
};

export default AddNewListDialog;
