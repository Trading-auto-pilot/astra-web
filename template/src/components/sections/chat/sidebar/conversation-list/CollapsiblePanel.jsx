import { useState } from 'react';
import { Box, ButtonBase, Collapse, Stack, Typography } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const CollapsiblePanel = ({ title, children, sx, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const { only } = useBreakpoints();

  const onlySm = only('sm');

  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <Box sx={{ ...sx }}>
      {onlySm ? (
        <>
          <Stack
            direction="column"
            sx={{
              py: 1,
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{
                color: 'text.disabled',
                textTransform: 'capitalize',
              }}
            >
              {title}
            </Typography>
            {children}
          </Stack>
        </>
      ) : (
        <>
          <Stack
            component={ButtonBase}
            disableRipple
            onClick={handleToggle}
            sx={{
              width: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1,
            }}
          >
            <Typography
              fontWeight={700}
              variant="subtitle1"
              sx={{
                textTransform: 'capitalize',
              }}
            >
              {title}
            </Typography>
            <IconifyIcon
              icon="material-symbols:keyboard-arrow-down-rounded"
              fontSize={20}
              sx={{
                rotate: open ? '180deg' : '0deg',
              }}
            />
          </Stack>

          <Collapse in={open} unmountOnExit>
            {children}
          </Collapse>
        </>
      )}
    </Box>
  );
};

export default CollapsiblePanel;
