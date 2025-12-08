import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

const Billable = () => {
  const [billable, setBillable] = useState(true);

  const handleChange = (event) => {
    setBillable(event.target.checked);
  };

  return (
    <Stack sx={{ gap: 0.75, alignItems: 'center' }}>
      <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
        Billable
      </Typography>
      <Switch
        checked={billable}
        onChange={handleChange}
        slotProps={{ input: { 'aria-label': 'billable' } }}
      />
    </Stack>
  );
};

export default Billable;
