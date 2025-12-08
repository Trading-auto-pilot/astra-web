import { useState } from 'react';
import { Button, Menu, MenuItem, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const privacyOptions = [
  {
    value: 'public',
    label: 'Public',
    icon: <IconifyIcon icon="material-symbols:globe" fontSize={20} />,
  },
  {
    value: 'friends',
    label: 'Friends',
    icon: <IconifyIcon icon="material-symbols:group-outline-rounded" fontSize={20} />,
  },
  {
    value: 'private',
    label: 'Private',
    icon: <IconifyIcon icon="material-symbols:lock-outline" fontSize={20} />,
  },
];

const SharePrivacy = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPrivacy, setSelectedPrivacy] = useState(privacyOptions[0]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option) => {
    setSelectedPrivacy(option);
    handleClose();
  };

  return (
    <Stack gap={1} alignItems="center" mb={3}>
      <Typography variant="subtitle1" color="text.secondary">
        Set privacy:
      </Typography>

      <Button
        onClick={handleClick}
        variant="soft"
        color="neutral"
        startIcon={selectedPrivacy.icon}
        endIcon={<IconifyIcon icon="material-symbols:keyboard-arrow-down-rounded" fontSize={20} />}
        aria-controls="privacy-menu"
        aria-haspopup="true"
      >
        {selectedPrivacy.label}
      </Button>

      <Menu
        id="privacy-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          list: {
            dense: true,
          },
        }}
      >
        {privacyOptions.map((option) => (
          <MenuItem
            dense
            key={option.value}
            onClick={() => handleSelect(option)}
            selected={option.value === selectedPrivacy.value}
            sx={{
              minWidth: 150,
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
              },
            }}
          >
            <Stack sx={{ alignItems: 'center' }}>
              {option.icon}
              <Typography sx={{ ml: 1 }}>{option.label}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};

export default SharePrivacy;
