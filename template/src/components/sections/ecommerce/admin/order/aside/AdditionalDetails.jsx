import { Box, TextField, Typography, inputBaseClasses } from '@mui/material';

const AdditionalDetails = () => {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 4, lg: 5 },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Additional details
      </Typography>
      <TextField
        fullWidth
        id="productWarnings"
        type="text"
        label="Product warnings"
        variant="filled"
        multiline
        rows={2}
        sx={{ mb: 2, [`& .${inputBaseClasses.input}`]: { pt: 0 } }}
      />
      <TextField
        fullWidth
        id="checkoutAlerts"
        type="text"
        label="Checkout alerts"
        variant="filled"
      />
    </Box>
  );
};

export default AdditionalDetails;
