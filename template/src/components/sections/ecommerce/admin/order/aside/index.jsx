import { Box, Divider, Paper, Stack } from '@mui/material';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import AdditionalDetails from './AdditionalDetails';
import Address from './Address';
import ConversionSummary from './ConversionSummary';
import Customer from './Customer';
import FraudAnalysis from './FraudAnalysis';
import Tags from './Tags';

const OrderAside = () => {
  const { topbarHeight } = useNavContext();

  const { only } = useBreakpoints();
  const onlySm = only('sm');

  return (
    <Paper background={1} sx={{ height: 1 }}>
      <Box sx={() => ({ position: 'sticky', top: topbarHeight })}>
        <Stack direction="column" divider={<Divider flexItem orientation="horizontal" />}>
          <Stack
            direction={{ xs: 'column', sm: 'row', md: 'column' }}
            divider={<Divider flexItem orientation={onlySm ? 'vertical' : 'horizontal'} />}
          >
            <Customer sx={{ flex: 1 }} />
            <Address sx={{ flex: 1 }} />
          </Stack>
          <Stack
            direction={{ xs: 'column', sm: 'row', md: 'column' }}
            divider={<Divider flexItem orientation={onlySm ? 'vertical' : 'horizontal'} />}
          >
            <ConversionSummary sx={{ flex: 1 }} />
            <FraudAnalysis sx={{ flex: 1 }} />
          </Stack>
          <Tags />
          <AdditionalDetails />
        </Stack>
      </Box>
    </Paper>
  );
};

export default OrderAside;
