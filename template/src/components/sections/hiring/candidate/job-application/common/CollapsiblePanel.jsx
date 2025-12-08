import { useState } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

const CollapsiblePanel = ({ name, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Stack
        justifyContent="space-between"
        component={ButtonBase}
        disableRipple
        onClick={() => setOpen((prev) => !prev)}
        width={1}
      >
        <Typography variant="h6" lineHeight={1.5} fontWeight={600}>
          {name}
        </Typography>
        <IconifyIcon
          icon="material-symbols:keyboard-arrow-down"
          sx={{ fontSize: 18, rotate: open ? '180deg' : '0deg' }}
        />
      </Stack>
      <Collapse in={open} unmountOnExit>
        {children}
      </Collapse>
    </>
  );
};

export default CollapsiblePanel;
