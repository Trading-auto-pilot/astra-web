import { useState } from 'react';
import { MenuItem, Stack, selectClasses } from '@mui/material';
import { EditableInput, EditableInputHSLA, EditableInputRGBA } from '@uiw/react-color';
import StyledTextField from 'components/styled/StyledTextField';

const InputFormats = ({ hsva, hexa, updateHexaColor, handleColorChange }) => {
  const [format, setFormat] = useState('hex');

  const handleChange = (e) => {
    updateHexaColor({ ...hexa, [e.target.name]: e.target.value });
  };

  return (
    <Stack
      sx={(theme) => ({
        p: 2,
        gap: 1,
        outline: `1px solid ${theme.vars.palette.dividerLight}`,
      })}
    >
      <StyledTextField
        select
        size="small"
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        sx={{
          flex: 1,
          textTransform: 'uppercase',
          [`& .${selectClasses.select}`]: { color: 'text.secondary' },
        }}
        slotProps={{
          select: {
            MenuProps: {
              disableAutoFocusItem: true,
              disableEnforceFocus: true,
              PaperProps: {
                sx: { maxHeight: 300, overflowY: 'auto' },
              },
            },
          },
        }}
      >
        {['hex', 'rgb', 'hsl'].map((item) => (
          <MenuItem
            key={item}
            value={item}
            autoFocus={false}
            sx={{ color: 'text.secondary', textTransform: 'uppercase' }}
          >
            {item}
          </MenuItem>
        ))}
      </StyledTextField>

      {format === 'hex' && (
        <Stack sx={{ gap: 1, flex: 3 }}>
          <EditableInput name="hex" value={hexa.hex} onChange={handleChange} style={{ flex: 2 }} />
          <EditableInput
            name="alpha"
            value={hexa.alpha}
            onChange={handleChange}
            style={{ flex: 1 }}
          />
        </Stack>
      )}

      {format === 'rgb' && (
        <EditableInputRGBA hsva={hsva} onChange={handleColorChange} style={{ flex: 3 }} />
      )}
      {format === 'hsl' && (
        <EditableInputHSLA hsva={hsva} onChange={handleColorChange} style={{ flex: 3 }} />
      )}
    </Stack>
  );
};

export default InputFormats;
