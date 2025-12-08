import { useState } from 'react';
import { InputAdornment } from '@mui/material';
import Button, { buttonClasses } from '@mui/material/Button';
import Menu, { menuClasses } from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { users } from 'data/users';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import Assignee from './Assignee';
import DueDate from './DueDate';
import Priority from './Priority';
import Status from './Status';

const filterData = {
  assignee: {
    title: 'Person',
    options: [...users.slice(2, 8)].map((user) => ({
      id: user.id,
      isSelected: false,
      label: user.name,
      avatar: user.avatar,
    })),
  },
  dueDate: {
    title: 'Due Date',
    options: [
      { id: 1, isSelected: false, label: 'Within 1 week' },
      { id: 2, isSelected: false, label: 'Within 1 month' },
      { id: 3, isSelected: false, label: 'Within 2 months' },
      { id: 4, isSelected: false, label: 'Within 6 months' },
    ],
  },
  status: {
    title: 'Status',
    options: [
      { id: 1, isSelected: false, label: 'Running', color: 'primary' },
      { id: 2, isSelected: false, label: 'Reviewable', color: 'info' },
      { id: 3, isSelected: false, label: 'Done', color: 'success' },
      { id: 4, isSelected: false, label: 'Stuck', color: 'error' },
      { id: 5, isSelected: false, label: 'Cancelled', color: 'neutral' },
    ],
  },
  priority: {
    title: 'Priority',
    options: [
      { id: 1, isSelected: false, label: 'Normal', color: 'primary' },
      { id: 2, isSelected: false, label: 'High', color: 'warning' },
      { id: 3, isSelected: false, label: 'Urgent', color: 'error' },
    ],
  },
};

const FilterMenu = () => {
  const [filterItems, setFilterItems] = useState(filterData);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { up } = useBreakpoints();
  const upXl = up('xl');

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    console.log(e.target.value);
  };

  const handleSelect = (type, item) => {
    setFilterItems((prevItems) => ({ ...prevItems, [type]: item }));
  };

  const handleReset = () => {
    setFilterItems(filterData);
  };

  const handleFilter = () => {
    console.log(filterItems);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Filter" disableHoverListener={upXl ? true : false}>
        <Button
          id="kanban-filter-menu"
          aria-controls={open ? 'kanban-filter-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          variant={upXl ? 'text' : 'soft'}
          size="medium"
          color="neutral"
          shape={upXl ? undefined : 'square'}
          onClick={handleOpen}
          startIcon={
            <IconifyIcon
              icon="material-symbols:filter-alt-outline"
              sx={{ fontSize: '18px !important' }}
            />
          }
          sx={[
            { flexShrink: 0 },
            !upXl && {
              [`& .${buttonClasses.startIcon}`]: {
                m: 0,
              },
            },
          ]}
        >
          {upXl && 'Filter'}
        </Button>
      </Tooltip>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'filter-menu',
            sx: { p: 0 },
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        sx={{
          mt: 1.5,
          [`& .${menuClasses.paper}`]: {
            width: 375,
            borderRadius: 6,
            overflow: 'hidden',

            [`& .${menuClasses.list}`]: {
              maxHeight: 500,
              overflow: 'auto',
            },
          },
        }}
      >
        <StyledTextField
          id="search-box"
          type="search"
          placeholder="Search with a keyword"
          onChange={handleSearch}
          sx={{ p: 3, width: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon
                    icon="material-symbols:search-rounded"
                    sx={{ fontSize: 16, color: 'text.secondary' }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        <Stack spacing={3} direction="column">
          <Assignee assignee={filterItems.assignee} handleSelect={handleSelect} />
          <DueDate dueDate={filterItems.dueDate} handleSelect={handleSelect} />
          <Status status={filterItems.status} handleSelect={handleSelect} />
          <Priority priority={filterItems.priority} handleSelect={handleSelect} />
        </Stack>

        <Stack sx={{ p: 3 }}>
          <Button color="neutral" onClick={handleReset}>
            Reset all
          </Button>
          <Button color="neutral" onClick={handleClose} sx={{ ml: 'auto' }}>
            Cancel
          </Button>
          <Button onClick={handleFilter}>Confirm</Button>
        </Stack>
      </Menu>
    </>
  );
};

export default FilterMenu;
