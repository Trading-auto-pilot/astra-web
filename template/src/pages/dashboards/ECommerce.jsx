import { Grid } from '@mui/material';
import { orders, stats } from 'data/e-commerce/greetings';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import Greeting from 'components/sections/dashboards/e-commerce/Greeting';
import ClientsLocations from 'components/sections/dashboards/e-commerce/clients-locations/ClientsLocations';
import GeneratedRevenue from 'components/sections/dashboards/e-commerce/generated-revenue/GeneratedRevenue';
import MarketShare from 'components/sections/dashboards/e-commerce/market-share/MarketShare';
import MonthlyProfit from 'components/sections/dashboards/e-commerce/monthly-profit/MonthlyProfit';
import PromoSlider from 'components/sections/dashboards/e-commerce/promo-slider';
import RecentActivities from 'components/sections/dashboards/e-commerce/recent-activities/RecentActivities';
import StorageUsage from 'components/sections/dashboards/e-commerce/storage-usage/StorageUsage';
import TopProducts from 'components/sections/dashboards/e-commerce/top-products/TopProducts';
import VisitorRevenue from 'components/sections/dashboards/e-commerce/visitor-revenue/VisitorRevenue';

const ECommerce = () => {
  const { up } = useBreakpoints();
  const upXl = up('xl');
  const upLg = up('lg');

  return (
    <div>
      <Grid container>
        <Grid size={{ xs: 12, md: 5, lg: 4, xl: 3 }} sx={{ height: 1 }}>
          <Greeting orders={orders} stats={stats} />
        </Grid>

        <Grid container size={{ xs: 12, md: 7, lg: 8, xl: 9 }}>
          <Grid size={{ xs: 12, xl: 6.67 }} order={{ lg: 1 }}>
            <PromoSlider />
          </Grid>

          <Grid container size={{ xs: 12, xl: 5.33 }}>
            <Grid size={{ xs: 12, sm: 6, md: 12, lg: 6, xl: 12 }}>
              <MonthlyProfit />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12, lg: 6, xl: 12 }}>
              <VisitorRevenue />
            </Grid>
          </Grid>

          {upLg && (
            <Grid size={{ xs: 12 }} order={{ lg: 2 }}>
              <GeneratedRevenue />
            </Grid>
          )}
        </Grid>

        {!upLg && (
          <Grid size={{ xs: 12 }}>
            <GeneratedRevenue />
          </Grid>
        )}
      </Grid>

      <Grid container>
        <Grid size={{ xs: 12, xl: 8 }}>
          <TopProducts />
        </Grid>
        {!upXl && (
          <Grid size={{ xs: 12 }}>
            <StorageUsage />
          </Grid>
        )}
        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <MarketShare />
        </Grid>
        <Grid
          size={{ xs: 12, md: 6, xl: 6 }}
          order={{ xl: 1 }}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          {upXl && <StorageUsage />}
          <RecentActivities />
        </Grid>

        <Grid size={{ xs: 12, xl: 6 }}>
          <ClientsLocations />
        </Grid>
      </Grid>
    </div>
  );
};

export default ECommerce;
