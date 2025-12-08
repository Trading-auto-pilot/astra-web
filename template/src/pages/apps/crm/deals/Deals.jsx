import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import DealsKanbanProvider from 'providers/DealsProvider';
import SimpleBar from 'components/base/SimpleBar';
import DealsKanban from 'components/sections/crm/deals/DealsKanban';
import CreateDealDialog from 'components/sections/crm/deals/deal-card/CreateDealDialog';
import DealsHeader from 'components/sections/crm/deals/page-header/DealsHeader';

const index = () => {
  return (
    <DealsKanbanProvider>
      <Deals />
    </DealsKanbanProvider>
  );
};

const Deals = () => {
  const { topbarHeight } = useNavContext();
  const { up } = useBreakpoints();
  const upSm = up('sm');

  return (
    <Paper>
      <DealsHeader />
      <Paper
        sx={{
          height: ({ mixins }) =>
            mixins.contentHeight(
              topbarHeight,
              (upSm ? mixins.footer.sm : mixins.footer.xs) + (upSm ? 117 : 161),
            ),
        }}
      >
        <SimpleBar>
          <Stack sx={{ height: 1 }}>
            <DealsKanban />
          </Stack>
        </SimpleBar>
      </Paper>
      <CreateDealDialog />
    </Paper>
  );
};

export default index;
