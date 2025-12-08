import { useState } from 'react';
import { Box, Button, Input, Stack, Typography } from '@mui/material';

const CustomOption = ({ type, onChange, actionButton }) => {
  const [value, setValue] = useState(null);

  const handleInputChange = (event) => {
    if (type === 'color') {
      onChange(event.target.value);
      setValue(event.target.value);
    } else if (type === 'image') {
      const file = event.target.files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);
        setValue(imageUrl);
      }
    }
  };

  return (
    <Box sx={{ mt: 2, width: 1 }}>
      <Stack sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack alignItems="center" spacing={1}>
          <Typography variant="body2">or,</Typography>
          <Box sx={{ position: 'relative' }}>
            <Button
              variant="text"
              component="label"
              sx={{
                position: 'relative',
                '& .MuiInput-root': {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 1,
                  height: 1,
                  opacity: 0,
                  zIndex: 1,
                },
              }}
            >
              {value ? 'Change' : 'Add'} Custom {type === 'color' ? 'Color' : 'Image'}
              <Input
                type={type === 'color' ? 'color' : 'file'}
                inputProps={{
                  accept: type === 'color' ? undefined : 'image/*',
                }}
                onChange={handleInputChange}
              />
            </Button>
          </Box>
        </Stack>
        {actionButton}
      </Stack>
    </Box>
  );
};

export default CustomOption;
