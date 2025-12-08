import { Chip, Paper, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import DashboardSelectMenu from 'components/common/DashboardSelectMenu';
import SectionHeader from 'components/common/SectionHeader';
import SessionByOSChart from './SessionByOSChart';

const SessionByOS = ({ data }) => {
  return (
    <Paper component={Stack} sx={{ height: 1, flexDirection: 'column' }}>
      <SectionHeader
        title="Session by OS"
        subTitle={
          <Stack gap={1} alignItems="center">
            <Chip
              label="1.52%"
              color="success"
              variant="soft"
              size="small"
              icon={<IconifyIcon icon="material-symbols:trending-up-rounded" />}
              sx={{
                flexDirection: 'row-reverse',
              }}
            />

            <Typography variant="caption" color="text.secondary">
              more than last week (on average)
            </Typography>
          </Stack>
        }
        actionComponent={
          <DashboardSelectMenu
            defaultValue="windows"
            options={[
              {
                value: 'windows',
                label: 'Windows',
              },
              {
                value: 'linux',
                label: 'Linux',
              },
              {
                value: 'mac',
                label: 'MacOS',
              },
            ]}
          />
        }
        sx={{ p: { xs: 3, md: 5 }, pb: '0 !important', flexWrap: 'wrap' }}
      />

      <SessionByOSChart
        data={data}
        sx={{
          flex: 1,
          minHeight: 130,
          width: '100%',
          '&:not(&.echart-map)': {
            '> div': {
              '&:first-of-type': {
                height: 'unset !important',
              },
            },
          },
        }}
      />
    </Paper>
  );
};

export default SessionByOS;
