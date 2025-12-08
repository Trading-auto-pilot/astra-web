import { Stack, Typography } from '@mui/material';
import ThemeSwitcher from './ThemeSwitcher';

const Contrast = () => {
  return (
    <Stack direction="column" spacing={1} mb={5}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
        Themes
      </Typography>
      <ThemeSwitcher />
    </Stack>
  );
};

export default Contrast;
