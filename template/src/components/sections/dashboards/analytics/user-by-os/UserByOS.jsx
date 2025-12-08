import { useRef } from 'react';
import { Box, ButtonBase, Paper, Stack, Typography } from '@mui/material';
import useToggleChartLegends from 'hooks/useToggleChartLegends';
import DashboardSelectMenu from 'components/common/DashboardSelectMenu';
import SectionHeader from 'components/common/SectionHeader';
import OSUsageChart from './OSUsageChart';
import OSUsageList from './OSUsageList';

const legends = [
  { title: 'Desktop', color: 'chBlue.200' },
  { title: 'Mobile', color: 'chOrange.200' },
  { title: 'Tablet', color: 'chLightBlue.200' },
];

const UserByOS = ({ data }) => {
  const chartRef = useRef(null);
  const { legendState, handleLegendToggle } = useToggleChartLegends(chartRef);

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <SectionHeader
        title="Users by OS"
        subTitle="Categorized by devices and their OS "
        actionComponent={
          <DashboardSelectMenu
            defaultValue="subscribed"
            options={[
              {
                value: 'subscribed',
                label: 'Subscribed',
              },
              {
                value: 'unsubscribed',
                label: 'Unsubscribed',
              },
              {
                value: 'all',
                label: 'All Users',
              },
            ]}
          />
        }
        sx={{ mb: 3, flexWrap: 'wrap' }}
      />

      <Stack sx={{ gap: 3, alignItems: 'center', mb: 5 }}>
        {legends.map((item) => (
          <ButtonBase
            key={item.title}
            onClick={() => handleLegendToggle(item.title)}
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              opacity: legendState[item.title] ? 0.5 : 1,
            }}
          >
            <Box sx={{ width: 4, height: 16, borderRadius: 0.5, bgcolor: item.color }} />
            <Typography
              variant="subtitle2"
              sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'capitalize' }}
            >
              {item.title}
            </Typography>
          </ButtonBase>
        ))}
      </Stack>

      <Stack
        sx={{
          flexDirection: { xs: 'column-reverse', sm: 'row', md: 'column-reverse', xl: 'row' },
          alignItems: 'center',
          gap: 5,
        }}
      >
        <OSUsageList data={data} />

        <OSUsageChart
          ref={chartRef}
          data={data}
          sx={{ flex: 1, width: 1, minWidth: 220, height: '100% !important', minHeight: 220 }}
        />
      </Stack>
    </Paper>
  );
};

export default UserByOS;
