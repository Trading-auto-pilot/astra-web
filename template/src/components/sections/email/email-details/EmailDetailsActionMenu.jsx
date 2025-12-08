import { useState } from 'react';
import { IconButton, Menu, MenuItem, listClasses } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const EmailDetailsActionMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id="email-more-btn"
        aria-controls={open ? 'email-more-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ ml: 1 }}
      >
        <IconifyIcon
          icon="material-symbols:more-horiz"
          sx={{ fontSize: 20, color: 'text.primary' }}
        />
      </IconButton>
      <Menu
        id="email-more-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'email-more-btn',
          },
        }}
        sx={{
          [`& .${listClasses.root}`]: {
            minWidth: 150,
          },
        }}
      >
        <MenuItem onClick={handleClose}>Reply</MenuItem>
        <MenuItem onClick={handleClose}>Forward</MenuItem>
        <MenuItem onClick={handleClose}>Print</MenuItem>
        <MenuItem onClick={handleClose}>Block</MenuItem>
      </Menu>
    </>
  );
};

export default EmailDetailsActionMenu;
