import { Box, Paper } from '@mui/material';
import { activeUsersData } from 'data/crm/dashboard';
import DashboardSelectMenu from 'components/common/DashboardSelectMenu';
import SectionHeader from 'components/common/SectionHeader';
import ActiveUsersChart from './ActiveUsersChart';

const ActiveUsers = () => {
  return (
    <Paper
      sx={{
        height: 1,
        overflow: 'hidden',
        p: { xs: 3, md: 5 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SectionHeader
        title="Monthly Active Users"
        subTitle="Product categories occupying warehouse space"
        sx={{ mb: { xs: 2, md: 4 } }}
        actionComponent={
          <DashboardSelectMenu
            options={[
              {
                value: 15,
                label: 'Last 15 days',
              },
              {
                value: 7,
                label: 'Last 7 days',
              },
              {
                value: 30,
                label: 'Last 30 days',
              },
            ]}
            defaultValue={15}
            sx={{ minWidth: 0 }}
          />
        }
      />

      <Box
        sx={{
          overflowX: 'auto',
        }}
      >
        <ActiveUsersChart data={activeUsersData} sx={{ minHeight: 380, minWidth: 800, width: 1 }} />
      </Box>
    </Paper>
  );
};

export default ActiveUsers;
