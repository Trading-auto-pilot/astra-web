import {
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  toggleButtonClasses,
} from '@mui/material';
import { productColorVariants } from 'data/e-commerce/products';

const Colors = ({ selectedVariantKey, handleSelectedVariantKey, sx }) => {
  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, ...sx }}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
        }}
      >
        Available in
      </Typography>
      <ToggleButtonGroup
        value={selectedVariantKey}
        exclusive
        onChange={(_, value) => handleSelectedVariantKey(value)}
        aria-label="product color selection"
        sx={{
          gap: { xs: 2, sm: 3 },
          bgcolor: 'transparent',
          [`& .${toggleButtonClasses.root}`]: {
            border: (theme) => `2px solid ${theme.vars.palette.background.default} !important`,
          },
        }}
      >
        {productColorVariants.map(({ id, name, color }) => (
          <ToggleButton
            key={id}
            value={id}
            aria-label={name}
            sx={{
              height: 56,
              width: 56,
              borderRadius: '8px !important',
              boxShadow: (theme) => `0 0 0 1px ${theme.vars.palette.divider}`,
              [`&, &:hover, &.${toggleButtonClasses.selected}, &.${toggleButtonClasses.selected}:hover`]:
                { bgcolor: `${color} !important` },
              [`&.${toggleButtonClasses.selected}`]: {
                boxShadow: (theme) => `0 0 0 2px ${theme.vars.palette.primary.main}`,
              },
            }}
          />
        ))}
      </ToggleButtonGroup>
    </Paper>
  );
};

export default Colors;
