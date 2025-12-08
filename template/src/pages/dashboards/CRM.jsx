import Grid from '@mui/material/Grid';
import { dealsData, kpisData } from 'data/crm/dashboard';
import CRMGreeting from 'components/sections/dashboards/crm/CRMGreeting';
import AcquisitionCost from 'components/sections/dashboards/crm/acquisition-cost/AcquisitionCost';
import ActiveUsers from 'components/sections/dashboards/crm/active-users/ActiveUsers';
import AvgLifetimeValue from 'components/sections/dashboards/crm/avg-lifetime-value/AvgLifetimeValue';
import CustomerFeedback from 'components/sections/dashboards/crm/customer-feedback/CustomerFeedback';
import CRMGeneratedRevenue from 'components/sections/dashboards/crm/generated-revenue/CRMGeneratedRevenue';
import CRMKPIs from 'components/sections/dashboards/crm/kpi/CRMKPIs';
import LeadSources from 'components/sections/dashboards/crm/lead-sources/LeadSources';
import SaleFunnel from 'components/sections/dashboards/crm/sale-funnel/SaleFunnel';

const CRM = () => {
  return (
    <Grid container>
      <Grid size={12}>
        <CRMGreeting data={dealsData} />
      </Grid>

      <Grid container size={12}>
        <Grid container size={{ xs: 12, lg: 5, xl: 6 }}>
          <CRMKPIs data={kpisData} />
        </Grid>
        <Grid size={{ xs: 12, lg: 7, xl: 6 }}>
          <CRMGeneratedRevenue />
        </Grid>
      </Grid>

      <Grid container size={12}>
        <Grid container size={{ xs: 12, xl: 8 }}>
          <Grid container size={12}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomerFeedback />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <LeadSources />
            </Grid>
          </Grid>

          <Grid size={12}>
            <AcquisitionCost />
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, xl: 4 }}>
          <SaleFunnel />
        </Grid>
      </Grid>

      <Grid container size={12}>
        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <AvgLifetimeValue />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 8 }}>
          <ActiveUsers />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CRM;
