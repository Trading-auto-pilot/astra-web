import { useCallback, useState } from 'react';
import { Box, Button, Collapse, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const FilterCollapsiblePanel = ({ title, children, sx, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <>
      <Button
        variant="text"
        sx={{
          color: 'text.primary',
          width: 1,
          p: 0,
          justifyContent: 'space-between',
          '&:hover': {
            bgcolor: 'transparent !important',
          },
        }}
        disableRipple
        disableElevation
        onClick={handleToggle}
        endIcon={
          open ? (
            <IconifyIcon icon="material-symbols:arrow-drop-up-rounded" fontSize="18px !important" />
          ) : (
            <IconifyIcon
              icon="material-symbols:arrow-drop-down-rounded"
              fontSize="18px !important"
            />
          )
        }
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'medium',
          }}
        >
          {title}
        </Typography>
      </Button>
      <Collapse in={open} unmountOnExit>
        <Box sx={{ pt: '15px', pl: 1, ...sx }}>{children}</Box>
      </Collapse>
    </>
  );
};

export default FilterCollapsiblePanel;
