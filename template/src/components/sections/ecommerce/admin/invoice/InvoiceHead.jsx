import { Stack, Typography } from '@mui/material';
import Logo from 'components/common/Logo';

const InvoiceHead = () => {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{
        gap: 2,
        justifyContent: 'space-between',
      }}
    >
      <Logo showName={false} sx={{ width: 50, height: 80 }} />
      <Typography variant="h6">Tax invoice / Bill of supply / Cash memo</Typography>
    </Stack>
  );
};

export default InvoiceHead;
