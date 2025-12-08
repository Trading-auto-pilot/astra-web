import { useState } from 'react';
import { Paper } from '@mui/material';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  accountData,
  activitySummary,
  analyticsData,
  assignedToData,
  associatedContactData,
  dealInformation,
  salesPipelineData,
} from 'data/crm/deal-details';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import SimpleBar from 'components/base/SimpleBar';
import AssignedTo from 'components/sections/crm/deal-details/AssignedTo';
import FloatingBar from 'components/sections/crm/deal-details/FloatingBar';
import SalesPipeline from 'components/sections/crm/deal-details/SalesPipeline';
import Account from 'components/sections/crm/deal-details/account';
import ActivityMonitoring from 'components/sections/crm/deal-details/activity-monitoring';
import ActivitySummary from 'components/sections/crm/deal-details/activity-summary';
import Analytics from 'components/sections/crm/deal-details/analytics';
import AssociatedContact from 'components/sections/crm/deal-details/associated-contact';
import DealInformation from 'components/sections/crm/deal-details/deal-information';
import DealDetailsHeader from 'components/sections/crm/deal-details/page-header/DealDetailsHeader';

const DealDetails = () => {
  const { topbarHeight } = useNavContext();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setDrawerOpen(true);

  const handleDrawerClose = () => setDrawerOpen(false);

  const drawerContent = (
    <Stack direction="column" sx={{ height: 1 }}>
      <DealInformation dealInformation={dealInformation} />
      <ActivitySummary activitySummary={activitySummary} />
      <Analytics analyticsData={analyticsData} />
    </Stack>
  );

  return (
    <Stack direction="column">
      <DealDetailsHeader title="Replica Badidas Futbol" />

      <Grid container>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            [`& .${drawerClasses.paper}`]: {
              maxWidth: 400,
              width: 1,
            },
            display: { xs: 'block', lg: 'none' },
          }}
        >
          <SimpleBar>
            <Stack
              gap={1}
              sx={{
                py: 3,
                px: { xs: 3, md: 5 },
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'background.elevation1',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                More information
              </Typography>
              <IconButton color="default" size="small" onClick={handleDrawerClose}>
                <IconifyIcon
                  icon="material-symbols:close-small-rounded"
                  sx={{ fontSize: 20, color: 'neutral.dark' }}
                />
              </IconButton>
            </Stack>
            {drawerContent}
          </SimpleBar>
        </Drawer>

        <Paper
          sx={{
            display: { xs: 'none', lg: 'block' },
            maxWidth: 400,
            width: 1,
            height: ({ mixins }) => mixins.contentHeight(topbarHeight),
            overflow: 'hidden',
            position: 'sticky',
            top: topbarHeight,
          }}
        >
          <SimpleBar>{drawerContent}</SimpleBar>
        </Paper>

        <Grid container size="grow" direction="column" alignContent="flex-start">
          <Grid size={12}>
            <SalesPipeline salesPipelineData={salesPipelineData} />
          </Grid>

          <Grid container size={12}>
            <Grid container direction="column" size={{ xs: 12, md: 6, lg: 12, xl: 6 }}>
              <Grid size={12}>
                <AssignedTo assignedToData={assignedToData} />
              </Grid>
              <Grid size={12} flexGrow={1}>
                <AssociatedContact associatedContactData={associatedContactData} />
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 12, xl: 6 }}>
              <Account accountData={accountData} />
            </Grid>
          </Grid>

          <Grid size={12} flexGrow={1}>
            <ActivityMonitoring />
          </Grid>
        </Grid>
      </Grid>

      <FloatingBar contactInfo={assignedToData[0]} handleDrawerOpen={handleDrawerOpen} />
    </Stack>
  );
};

export default DealDetails;
