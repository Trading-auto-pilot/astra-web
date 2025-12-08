import { Box, Divider, Paper, Stack } from '@mui/material';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import Customer from '../../order/aside/Customer';
import Summary from './Summary';

const RefundAside = () => {
  const { topbarHeight } = useNavContext();
  const { only } = useBreakpoints();
  const onlySm = only('sm');

  return (
    <Paper background={1} sx={{ height: 1 }}>
      <Box sx={() => ({ position: 'sticky', top: topbarHeight })}>
        <Stack
          direction={{ xs: 'column', sm: 'row', md: 'column' }}
          sx={{ width: 1 }}
          divider={<Divider flexItem orientation={onlySm ? 'vertical' : 'horizontal'} />}
        >
          <Customer sx={{ flex: 1 }} />
          <Summary sx={{ flex: 1 }} />
        </Stack>
      </Box>
    </Paper>
  );
};

export default RefundAside;
