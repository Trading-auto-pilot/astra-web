import { Divider, Paper, Stack } from '@mui/material';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import SimpleBar from 'components/base/SimpleBar';
import AdditionalDetails from './AdditionalDetails';
import Address from './Address';
import Customer from './Customer';
import SearchCustomer from './SearchCustomer';
import Tags from './Tags';

const CreateOrderAside = () => {
  const { topbarHeight } = useNavContext();
  const { up } = useBreakpoints();
  const upSm = up('sm');

  return (
    <Paper
      background={1}
      sx={({ mixins }) => ({
        height: !upSm ? '100%' : mixins.contentHeight(topbarHeight, mixins.footer.sm),
        overflow: 'hidden',
        position: { sm: 'sticky' },
        top: topbarHeight,
        flexShrink: 0,
        width: { xs: 1, sm: 298, md: 328, lg: 404 },
      })}
    >
      <SimpleBar>
        <Stack
          direction="column"
          divider={<Divider flexItem orientation="horizontal" />}
          sx={() => ({})}
        >
          <SearchCustomer />
          <Customer />
          <Address />
          <Tags />
          <AdditionalDetails />
        </Stack>
      </SimpleBar>
    </Paper>
  );
};

export default CreateOrderAside;
