import { Button, Grid, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useCalendarContext } from 'providers/CalendarProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const SchedulerTop = ({ toggleDrawer, isDrawerOpen }) => {
  const { schedulerApi, updateView } = useCalendarContext();
  const { down } = useBreakpoints();
  const downSm = down('sm');
  const downMd = down('md');
  const downLg = down('lg');

  return (
    <Grid
      container
      spacing={{ xs: 0, sm: 1 }}
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: { xs: 3, md: 5 },
        py: 3,
      }}
    >
      <Grid size={{ xs: 'auto' }}>
        <Tooltip title="Create Schedule" arrow disableHoverListener={!downMd}>
          <Button
            variant="soft"
            size={downMd ? 'small' : 'medium'}
            color="neutral"
            shape={downMd ? 'square' : undefined}
            onClick={toggleDrawer}
            sx={{ mr: { xs: 1, sm: 0 } }}
          >
            {downMd ? (
              <IconifyIcon
                color="neutral.dark"
                icon="material-symbols:calendar-add-on"
                sx={{ fontSize: 20, display: 'inline-block' }}
              />
            ) : isDrawerOpen ? (
              'Hide Settings'
            ) : (
              'Show Settings'
            )}
          </Button>
        </Tooltip>
      </Grid>

      <Grid
        size={{ xs: 'auto', lg: 'grow' }}
        alignItems="center"
        textAlign="center"
        sx={{
          display: 'flex',
          flexGrow: 1,
          justifyContent: { xs: 'flex-start', md: 'flex-end', lg: 'center' },
        }}
      >
        <Typography
          variant="h6"
          fontWeight={400}
          sx={{ fontSize: { xs: 'subtitle1.fontSize', md: 'h6.fontSize' } }}
        >
          {schedulerApi?.getDate && dayjs(schedulerApi.getDate()).format('ddd, DD MMM')}
        </Typography>
        <Button
          size={downLg ? 'small' : 'medium'}
          color="neutral"
          variant="outlined"
          onClick={() => updateView('scheduler', 'today')}
          sx={{ ml: { xs: 1, md: 2 } }}
        >
          Today
        </Button>
      </Grid>

      <Grid
        size={{ xs: 'auto' }}
        alignItems="center"
        justifyContent="flex-end"
        sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, flexGrow: { xs: 1, lg: 0 } }}
      >
        <Button
          shape="square"
          color="neutral"
          size={downMd ? 'small' : 'medium'}
          onClick={() => updateView('scheduler', 'prev')}
        >
          <IconifyIcon
            icon="material-symbols:chevron-left-rounded"
            sx={{ fontSize: { xs: 18, md: 24 } }}
          />
        </Button>
        <Typography
          variant="h6"
          fontWeight={400}
          sx={{
            color: 'text.secondary',
            textWrap: 'nowrap',
            fontSize: { xs: 'subtitle1.fontSize', md: 'h6.fontSize' },
          }}
        >
          {schedulerApi?.getDate &&
            dayjs(schedulerApi.getDate()).format(downSm ? 'MMM YYYY' : 'MMMM YYYY')}
        </Typography>
        <Button
          shape="square"
          color="neutral"
          size={downMd ? 'small' : 'medium'}
          onClick={() => updateView('scheduler', 'next')}
        >
          <IconifyIcon
            icon="material-symbols:chevron-right-rounded"
            sx={{ fontSize: { xs: 18, md: 24 } }}
          />
        </Button>
      </Grid>
    </Grid>
  );
};

export default SchedulerTop;
