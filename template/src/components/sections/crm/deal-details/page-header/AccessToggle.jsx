import { useState } from 'react';
import Button, { buttonClasses } from '@mui/material/Button';
import Menu, { menuClasses } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const accessOptions = [
  {
    id: 1,
    type: 'invite-only',
    label: 'Invite Only',
    icon: 'material-symbols:lock-person-outline-rounded',
  },
  {
    id: 2,
    type: 'anyone',
    label: 'Anyone',
    icon: 'material-symbols:globe',
  },
];

const AccessToggle = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [accessMode, setAccessMode] = useState(accessOptions[0]);
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
    setAccessMode(item);
    handleClose();
  };

  return (
    <>
      <Button
        id="access-toggle-menu"
        aria-controls={open ? 'access-toggle-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        shape={upSm ? undefined : 'square'}
        variant="soft"
        color="neutral"
        disableElevation
        disableRipple
        onClick={handleOpen}
        startIcon={<IconifyIcon icon={accessMode.icon} sx={{ fontSize: '16px !important' }} />}
        sx={[
          { flexShrink: 0 },
          !upSm && {
            [`& .${buttonClasses.startIcon}`]: {
              m: 0,
            },
          },
        ]}
      >
        {upSm && accessMode.label}
      </Button>
      <Menu
        id="access-toggle"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        slotProps={{
          list: {
            'aria-labelledby': 'action-toggle',
          },
        }}
        sx={{
          [`& .${menuClasses.paper}`]: {
            minWidth: 120,
          },
        }}
      >
        {accessOptions.map((item) => (
          <MenuItem
            key={item.id}
            selected={item.type === accessMode.type}
            sx={{ textTransform: 'capitalize' }}
            onClick={() => handleClick(item)}
            disableRipple
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AccessToggle;
