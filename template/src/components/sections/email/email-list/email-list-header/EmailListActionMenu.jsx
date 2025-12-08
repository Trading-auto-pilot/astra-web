import { useState } from 'react';
import { IconButton, Menu, MenuItem, listClasses } from '@mui/material';
import { useBulkSelect } from 'providers/BulkSelectProvider';
import { useEmailContext } from 'providers/EmailProvider';
import { UPDATE_MESSAGE_STATUS } from 'reducers/EmailReducer';
import IconifyIcon from 'components/base/IconifyIcon';

const EmailListActionMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { selectedIds } = useBulkSelect();
  const { emailDispatch } = useEmailContext();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleReadStatus = (actionType) => {
    emailDispatch({
      type: UPDATE_MESSAGE_STATUS,
      payload: { ids: selectedIds, actionType: actionType },
    });
  };

  return (
    <>
      <IconButton
        size="small"
        sx={{ ml: 'auto' }}
        id="email-list-more-btn"
        aria-controls={open ? 'email-list-more-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disabled={!selectedIds.length}
      >
        <IconifyIcon
          icon="material-symbols:more-horiz"
          sx={{ fontSize: 20, color: `${!selectedIds.length ? 'text.disabled' : 'text.primary'}` }}
        />
      </IconButton>
      <Menu
        id="email-list-more-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'email-list-more-btn',
          },
        }}
        sx={{
          [`& .${listClasses.root}`]: {
            minWidth: 150,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            toggleReadStatus('mark_as_read');
          }}
        >
          Mark as read
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            toggleReadStatus('mark_as_unread');
          }}
        >
          Mark as unread
        </MenuItem>
        <MenuItem onClick={handleClose}>Print</MenuItem>
        <MenuItem onClick={handleClose}>Block</MenuItem>
      </Menu>
    </>
  );
};

export default EmailListActionMenu;
