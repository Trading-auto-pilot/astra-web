import { Box, Stack, Typography } from '@mui/material';

const ContactFormSection = ({ title, children, sx }) => (
  <Box sx={{ ...sx }}>
    <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 700 }}>
      {title}
    </Typography>
    <Stack gap={2} direction="column" alignItems="center">
      {children}
    </Stack>
  </Box>
);

export default ContactFormSection;
