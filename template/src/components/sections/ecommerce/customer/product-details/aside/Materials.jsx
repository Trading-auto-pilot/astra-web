import { useState } from 'react';
import {
  Chip,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';

const materialGroups = {
  cover: [
    { label: 'Linen', value: 'linen' },
    { label: 'Suede', value: 'suede' },
    { label: 'Satin', value: 'satin' },
    { label: 'Silk', value: 'silk' },
    { label: 'Velvet', value: 'velvet' },
    { label: 'Cotton', value: 'cotton' },
    { label: 'Leather', value: 'leather' },
  ],
  frame: [
    { label: 'Cedar', value: 'cedar' },
    { label: 'Mahogany', value: 'mahogany' },
    { label: 'Maple', value: 'maple' },
    { label: 'Pine', value: 'pine' },
    { label: 'Teak', value: 'teak' },
    { label: 'Walnut', value: 'walnut' },
  ],
  seat: [
    { label: 'Foam ($10.00 more will be added)', value: 'foam' },
    { label: 'Cotton ($10.00 more will be added)', value: 'cotton' },
  ],
};

const Materials = () => {
  const [selectedMaterials, setSelectedMaterials] = useState({
    cover: 'linen',
    frame: 'cedar',
    seat: 'foam',
  });

  const handleMaterialChange = (group) => (event) => {
    setSelectedMaterials({ ...selectedMaterials, [group]: event.target.value });
  };

  const renderMaterialOptions = (group) => (
    <OptionsRadioGroup value={selectedMaterials[group]} onChange={handleMaterialChange(group)}>
      {materialGroups[group].map(({ label, value }) => (
        <FormControlLabel
          key={value}
          value={value}
          control={<Radio />}
          label={
            <Chip
              variant="soft"
              size="medium"
              color={selectedMaterials[group] === value ? 'primary' : 'neutral'}
              label={label}
              sx={{ textTransform: 'capitalize' }}
              onClick={() => handleMaterialChange(group)({ target: { value } })}
            />
          }
        />
      ))}
    </OptionsRadioGroup>
  );

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction="column" sx={{ gap: 5 }}>
        {['cover', 'frame', 'seat'].map((group) => (
          <div key={group}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {`${group.charAt(0).toUpperCase() + group.slice(1)} Material`}
            </Typography>
            <FormControl component="fieldset">{renderMaterialOptions(group)}</FormControl>
          </div>
        ))}
      </Stack>
    </Paper>
  );
};

const OptionsRadioGroup = ({ children, ...rest }) => (
  <RadioGroup
    row
    sx={{
      gap: 1,
      '& .MuiFormControlLabel-root': { margin: 0 },
      '& .MuiRadio-root': { display: 'none' },
    }}
    {...rest}
  >
    {children}
  </RadioGroup>
);

export default Materials;
