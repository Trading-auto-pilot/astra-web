import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useNumberFormat from 'hooks/useNumberFormat';
import IconifyIcon from 'components/base/IconifyIcon';
import DashboardMenu from 'components/common/DashboardMenu';
import SectionHeader from 'components/common/SectionHeader';
import EarnedThisWeekChart from './EarnedThisWeekChart';
import ProjectsWorkedChart from './ProjectsWorkedChart';
import TotalHoursChart from './TotalHoursChart';
import WeeklyActivityChart from './WeeklyActivityChart';

const getChipStyle = (trend) => {
  switch (trend) {
    case 'increase':
      return {
        icon: 'material-symbols:trending-up-rounded',
        color: 'success',
      };

    case 'decrease':
      return {
        icon: 'material-symbols:trending-down-rounded',
        color: 'error',
      };

    default:
      return {
        icon: 'material-symbols:trending-flat-rounded',
        color: 'neutral',
      };
  }
};

const KPI = ({ data }) => {
  const { numberFormat } = useNumberFormat();
  const { title, value, changePercent, trend, since, hours, activities, earnings, projectsWorked } =
    data;
  const { icon, color } = getChipStyle(trend);
  const chartStyle = { height: '100% !important', minHeight: { xs: 160, xl: 80 } };

  return (
    <Paper
      background={1}
      component={Stack}
      direction="column"
      sx={{ p: { xs: 3, md: 5 }, height: 1 }}
    >
      <SectionHeader title={title} subTitle="" actionComponent={<DashboardMenu />} sx={{ mb: 1 }} />
      <Typography variant="h3" sx={{ mb: 1, color: 'text.secondary' }}>
        {value}
      </Typography>

      <Stack sx={{ mb: 5, gap: 1 }}>
        <Chip
          label={`${numberFormat(changePercent, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}%`}
          color={color}
          deleteIcon={<IconifyIcon icon={icon} />}
          onDelete={() => {}}
        />
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          since {since}
        </Typography>
      </Stack>

      {hours && <TotalHoursChart data={hours} sx={chartStyle} />}
      {activities && <WeeklyActivityChart data={activities} sx={chartStyle} />}
      {earnings && <EarnedThisWeekChart data={earnings} sx={chartStyle} />}
      {projectsWorked && <ProjectsWorkedChart data={projectsWorked} sx={chartStyle} />}
    </Paper>
  );
};

export default KPI;
