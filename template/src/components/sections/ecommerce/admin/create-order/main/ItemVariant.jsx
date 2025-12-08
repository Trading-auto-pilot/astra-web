import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const ItemVariant = ({ variant }) => {
  const { label, value } = variant;

  return (
    <FormControl variant="filled" sx={{ flex: 1, maxWidth: 120 }}>
      <InputLabel id="variant-select">{label}</InputLabel>
      <Select id="variant-select" value={value.split(', ')[0]} sx={{ width: 1 }}>
        {value.split(', ').map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ItemVariant;
