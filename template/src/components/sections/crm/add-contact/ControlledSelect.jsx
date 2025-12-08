import { Controller } from 'react-hook-form';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  selectClasses,
} from '@mui/material';

const ControlledSelect = ({ name, label, options, control, error }) => (
  <FormControl fullWidth variant="filled" error={!!error}>
    <InputLabel id={`${name}-label`}>{label}</InputLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          labelId={`${name}-label`}
          {...field}
          value={field.value ?? ''}
          sx={{
            [`& .${selectClasses.icon}`]: {
              zIndex: 1,
              bgcolor: 'inherit',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      )}
    />
    <FormHelperText>{error}</FormHelperText>
  </FormControl>
);

export default ControlledSelect;
