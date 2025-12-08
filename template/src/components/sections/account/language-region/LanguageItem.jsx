import { Stack, Typography } from '@mui/material';

const LanguageItem = ({ name, label, isPrimary }) => {
  return (
    <Stack spacing={3}>
      <Typography variant="body2" sx={{ minWidth: 120 }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {isPrimary ? `${label} - Primary` : label}
      </Typography>
    </Stack>
  );
};

export default LanguageItem;
