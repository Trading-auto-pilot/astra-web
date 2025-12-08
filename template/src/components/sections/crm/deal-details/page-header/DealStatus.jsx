import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu, { menuClasses } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const getButtonColor = (status) => {
  switch (status) {
    case 'Won':
      return 'success';
    case 'Lost':
      return 'error';
    default:
      return 'primary';
  }
};

const DealStatus = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [status, setStatus] = useState('Won');
  const { up } = useBreakpoints();
  const upSm = up('sm');

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (item) => {
    setStatus(item);
    handleClose();
  };

  return (
    <>
      <Button
        id="deal-status-menu"
        aria-controls={open ? 'deal-status-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        variant="soft"
        color={getButtonColor(status)}
        disableElevation
        disableRipple
        onClick={handleOpen}
        endIcon={
          <IconifyIcon
            icon="material-symbols:expand-more-rounded"
            sx={{ fontSize: '21px !important' }}
          />
        }
      >
        {upSm ? `Status: ${status}` : status}
      </Button>
      <Menu
        id="deal-status"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        slotProps={{
          list: {
            'aria-labelledby': 'deal-status',
          },
        }}
        sx={{
          [`& .${menuClasses.paper}`]: {
            minWidth: 150,
          },
        }}
      >
        {['Won', 'Lost', 'Open'].map((item) => (
          <MenuItem
            key={item}
            selected={item === status}
            sx={{ textTransform: 'capitalize' }}
            onClick={() => handleClick(item)}
            disableRipple
          >
            {item}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DealStatus;
