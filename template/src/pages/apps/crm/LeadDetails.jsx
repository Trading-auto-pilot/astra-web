import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { contactInfoData, ongoingDealsData } from 'data/crm/lead-details';
import ActivityTabs from 'components/sections/crm/common/ActivityTabs';
import ContactInfo from 'components/sections/crm/lead-details/ContactInfo';
import LeadDetailsHeader from 'components/sections/crm/lead-details/LeadDetailsHeader';
import OngoingDeals from 'components/sections/crm/lead-details/OngoingDeals';

const LeadDetails = () => {
  return (
    <Stack direction="column">
      <LeadDetailsHeader />

      <Grid container>
        {contactInfoData.map((item) => (
          <Grid key={item.attribute} size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>
            <ContactInfo attribute={item.attribute} value={item.value} />
          </Grid>
        ))}

        <Grid size={{ xs: 12, lg: 6 }}>
          <OngoingDeals ongoingDeals={ongoingDealsData} />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ px: { xs: 3, md: 5 }, py: 5, height: 1 }}>
            <ActivityTabs />
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default LeadDetails;
