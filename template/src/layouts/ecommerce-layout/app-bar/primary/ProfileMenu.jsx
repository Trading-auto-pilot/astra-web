import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Typography,
  listClasses,
  paperClasses,
} from '@mui/material';
import { useAuth } from 'providers/AuthProvider';
import { demoUser } from 'providers/auth-provider/AuthJwtProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import StatusAvatar from 'components/base/StatusAvatar';

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { sessionUser, signout } = useAuth();

  // Demo user data used for development purposes
  const user = useMemo(() => sessionUser || demoUser, [sessionUser]);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignout = () => {
    signout();
    handleClose();
  };

  return (
    <>
      <Button
        color="neutral"
        variant="text"
        shape="circle"
        onClick={handleClick}
        sx={{
          height: 44,
          width: 44,
        }}
      >
        <StatusAvatar
          alt="Captain Haddock"
          status="online"
          src={user.avatar || undefined}
          sx={{ width: 36, height: 36 }}
        />
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${paperClasses.root}`]: { minWidth: 267 },
          [`& .${listClasses.root}`]: { py: 0 },
        }}
      >
        <Stack
          sx={{
            alignItems: 'center',
            gap: 2,
            p: 2,
          }}
        >
          <StatusAvatar
            status="online"
            alt={user.name}
            src={user.avatar ?? undefined}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {user.name}
            </Typography>
            {user.designation && (
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'warning.main',
                }}
              >
                {user.designation}
                <IconifyIcon
                  icon="material-symbols:diamond-rounded"
                  color="warning.main"
                  sx={{ verticalAlign: 'text-bottom', ml: 0.5 }}
                />
              </Typography>
            )}
          </Box>
        </Stack>

        <Divider />
        <Box sx={{ py: 1 }}>
          <MenuItem onClick={handleClose}>Your account</MenuItem>
          <MenuItem onClick={handleClose}>Account settings</MenuItem>
        </Box>
        <Divider />
        <Box sx={{ py: 1 }}>
          <MenuItem onClick={handleClose}>Orders</MenuItem>
          <MenuItem onClick={handleClose}>Track order</MenuItem>
          <MenuItem onClick={handleClose}>Wishlist</MenuItem>
        </Box>
        <Divider />
        <Box sx={{ py: 1 }}>
          <MenuItem onClick={handleClose}>Membership</MenuItem>
        </Box>
        <Divider />
        <Box sx={{ py: 1 }}>
          <MenuItem onClick={handleClose}>Plans & Subscription</MenuItem>
          <MenuItem onClick={handleClose}>Payment methods</MenuItem>
        </Box>
        <Divider />
        <Box sx={{ py: 1 }}>
          <MenuItem onClick={handleSignout}>Log out</MenuItem>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;
