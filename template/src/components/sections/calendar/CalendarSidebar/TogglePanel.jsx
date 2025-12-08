import { useState } from 'react';
import { Box, ButtonBase, Collapse, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const TogglePanel = ({ children, title, defaultOpen, sx }) => {
  const [open, setOpen] = useState(defaultOpen);
  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Stack
        component={ButtonBase}
        disableRipple
        onClick={handleToggle}
        sx={{
          px: { xs: 3, md: 5 },
          width: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography fontWeight={700} variant="overline" color="text.disabled">
          {title}
        </Typography>
        <IconifyIcon
          icon="material-symbols:expand-more-rounded"
          color="text.secondary"
          fontSize={24}
          sx={{
            rotate: open ? '180deg' : '0deg',
          }}
        />
      </Stack>

      <Collapse in={open} unmountOnExit>
        <Box sx={{ pt: 2, px: { xs: 3, md: 5 }, ...sx }}>{children}</Box>
      </Collapse>
    </Box>
  );
};

export default TogglePanel;
