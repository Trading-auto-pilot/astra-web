import { useState } from 'react';
import { Alert, Box, Button, Collapse, IconButton, alertClasses } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const PromoAlert = () => {
  const [isAlertOpen, setIsAlertOpen] = useState(true);

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
  };

  return (
    <Collapse in={isAlertOpen} data-aurora-color-scheme="light">
      <Alert
        icon={false}
        variant="filled"
        severity="success"
        action={
          <IconButton
            sx={{ color: 'common.white' }}
            aria-label="close alert"
            edge="start"
            onClick={handleCloseAlert}
          >
            <IconifyIcon icon="material-symbols:close-rounded" fontSize={24} />
          </IconButton>
        }
        sx={{
          px: { xs: 3, md: 5 },
          alignItems: 'center',
          borderRadius: 0,
          [`& .${alertClasses.message}`]: {
            fontWeight: 700,
            color: 'common.white',
            fontSize: { xs: 18, sm: 21 },
          },
        }}
      >
        Get 20% off in your first{' '}
        <Box
          component="span"
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
          purchase
          <Button color="neutral" variant="contained" sx={{ ml: 2 }}>
            Sign up
          </Button>
        </Box>
      </Alert>
    </Collapse>
  );
};

export default PromoAlert;
