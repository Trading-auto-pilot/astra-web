import { useFormContext, useWatch } from 'react-hook-form';
import { Box, Slider, Stack } from '@mui/material';
import NumberTextField from 'components/base/NumberTextField';
import FilterCollapse from './FilterCollapsiblePanel';

const valuetext = (value) => {
  return `$${value}`;
};

const PriceFilterSection = ({ defaultOpen = false, defaultValue }) => {
  const { control, setValue } = useFormContext();

  const priceRange = useWatch({ control, name: 'priceRange', defaultValue });

  const handleSliderChange = (event, newValue) => {
    setValue('priceRange', newValue);
  };

  return (
    <FilterCollapse defaultOpen={defaultOpen} title="Price">
      <Box sx={{ px: 1.25 }}>
        <Slider
          getAriaLabel={() => 'Price range'}
          value={priceRange}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          valueLabelFormat={valuetext}
          getAriaValueText={valuetext}
          min={defaultValue[0]}
          max={defaultValue[1]}
          sx={{ width: 1 }}
        />
      </Box>
      <Stack
        sx={{
          gap: 1,
          mt: 1,
        }}
      >
        <NumberTextField
          label="Min"
          value={priceRange[0]}
          onChange={(e) => {
            setValue('priceRange', [Number(e.target.value), priceRange[1]]);
          }}
        />
        <NumberTextField
          label="Max"
          value={priceRange[1]}
          onChange={(e) => {
            setValue('priceRange', [priceRange[0], Number(e.target.value)]);
          }}
        />
      </Stack>
    </FilterCollapse>
  );
};

export default PriceFilterSection;
