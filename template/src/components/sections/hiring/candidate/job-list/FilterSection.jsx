import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';

const FilterSection = ({ name, options }) => {
  return (
    <Box sx={{ pl: 2 }}>
      <Typography variant="caption" fontWeight={500} sx={{ py: 0.5, lineHeight: 1.5 }}>
        {name}
      </Typography>
      <FormGroup
        sx={{
          pl: '9px',
          [`& .${formControlLabelClasses.label}`]: {
            fontSize: '12px !important',
            alignSelf: 'center !important',
            mt: '0 !important',
            color: 'text.secondary',
          },
        }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            label={option.label}
            value={option.value}
            control={<Checkbox />}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default FilterSection;
