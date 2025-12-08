import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import StyledTextField from 'components/styled/StyledTextField';

const TimeSelect = () => {
  const [time, setTime] = useState('10 min');

  return (
    <StyledTextField
      select
      value={time}
      onChange={(e) => setTime(e.target.value)}
      sx={{ flexShrink: 0 }}
    >
      {['10 min', '30 min', 'all'].map((item) => (
        <MenuItem key={item} value={item} autoFocus={false}>
          {item}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default TimeSelect;
