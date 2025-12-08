import { Stack, Typography } from '@mui/material';

const InfoCardAttribute = ({ label, value }) => {
  return (
    <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
      <Typography variant="subtitle2" sx={{ minWidth: 120, fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography variant="subtitle2" sx={{ fontWeight: 400, overflowWrap: 'anywhere' }}>
        {value}
      </Typography>
    </Stack>
  );
};

export default InfoCardAttribute;
