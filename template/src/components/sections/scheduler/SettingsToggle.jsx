import { useState } from 'react';
import { Box, Button, Collapse, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const SettingsToggle = ({ children, title, icon, defaultOpen, sx }) => {
  const [open, setOpen] = useState(defaultOpen);
  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <Box sx={{ py: 4 }}>
      <Stack
        sx={{
          px: 3,
          width: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <IconifyIcon icon={icon} sx={{ mr: 1, fontSize: 24 }} />
          {title}
        </Typography>

        <Button onClick={handleToggle} variant="text" color="neutral" size="small" shape="circle">
          <IconifyIcon
            icon="material-symbols:expand-more-rounded"
            color="text.secondary"
            fontSize={24}
            sx={{
              rotate: open ? '180deg' : '0deg',
            }}
          />
        </Button>
      </Stack>

      <Collapse in={open} unmountOnExit>
        <Box sx={{ pt: 3, pl: 7, pr: 3, ...sx }}>{children}</Box>
      </Collapse>
    </Box>
  );
};

export default SettingsToggle;
