import { Box, Stack, Typography } from '@mui/material';

const InvoiceDetailsFormSections = ({ title, children, sx }) => (
  <Box sx={{ ...sx }}>
    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
      {title}
    </Typography>
    <Stack gap={2} alignItems="center">
      {children}
    </Stack>
  </Box>
);

export default InvoiceDetailsFormSections;
