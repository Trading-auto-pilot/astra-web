import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import { StripedBackground } from '../../../common/StripedBackground';
import { BentoCardHeader } from './BentoCard';

const ModernUI = () => {
  return (
    <Stack
      component={StripedBackground}
      direction="column"
      gap={{ xs: 2, md: 4 }}
      fadeWidth="0%"
      sx={{ height: 1 }}
    >
      <BentoCardHeader
        title="Modern and beautiful UI"
        subtitle="Create stunning websites"
        sx={{ pt: { xs: 2, md: 3 }, px: { xs: 2, md: 3 } }}
      />

      <Box
        sx={{
          p: 2,
          borderRadius: 2.5,
          bgcolor: 'menu',
          mb: -2,
          mx: { xs: 2, md: 3 },
          zIndex: 0,
        }}
      >
        <Stack direction="column" gap={1.5}>
          <Stack direction="column" gap={1}>
            <Stack justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Birthday
              </Typography>
              <IconifyIcon icon="material-symbols:close" sx={{ fontSize: 14 }} />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, lineClamp: 2 }}>
              Provide your birthday to ensure you get the right content and features for your age .
            </Typography>
          </Stack>
          <Stack direction="column" gap={2}>
            <Stack gap={0.75}>
              <FormControl size="small" fullWidth>
                <InputLabel id="date-label">Date</InputLabel>
                <Select labelId="date-label" id="date" label="Date" disabled value="" />
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel id="month-label">Month</InputLabel>
                <Select labelId="month-label" id="month" label="Month" disabled value="" />
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel id="year-label">Year</InputLabel>
                <Select labelId="year-label" id="year" label="Date" disabled value="" />
              </FormControl>
            </Stack>
            <Stack gap={0.75} justifyContent="flex-end">
              <Button variant="soft" color="neutral">
                Discard
              </Button>
              <Button variant="contained">Confirm</Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default ModernUI;
