import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useCalendarContext } from 'providers/CalendarProvider';
import { SET_CALENDAR_STATE } from 'reducers/CalendarReducer';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';

const CalendarTop = () => {
  const { calendarApi, updateView, calendarDispatch } = useCalendarContext();
  const { down } = useBreakpoints();
  const downMd = down('md');

  const handleAddEventClick = () => {
    calendarDispatch({
      type: SET_CALENDAR_STATE,
      payload: {
        openNewEventModal: true,
        selectedItem: null,
        selectedStartDate: dayjs().toISOString(),
        selectedEndDate: dayjs().add(1, 'day').toISOString(),
      },
    });
  };

  return (
    <Box sx={{ py: 3, px: { xs: 3, md: 5 } }}>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexWrap="wrap"
        sx={{ justifyContent: 'space-between' }}
      >
        <Stack
          alignItems={{ xs: 'flex-end', sm: 'center' }}
          flexWrap="wrap"
          spacing={2}
          sx={{ justifyContent: 'space-between' }}
        >
          <Typography variant="h6" fontWeight={400}>
            <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>
              {dayjs(calendarApi?.getDate()).format('dddd')},&nbsp;
            </Box>

            <Box component="span">{dayjs(calendarApi?.getDate()).format('DD MMM, YYYY')}</Box>
          </Typography>

          <Button
            size="medium"
            color="neutral"
            variant="outlined"
            onClick={() => updateView('calendar', 'today')}
            sx={{ flexGrow: 1 }}
          >
            Today
          </Button>
        </Stack>

        <Stack
          spacing={1}
          sx={{
            width: { xs: 1, sm: 'auto' },
            justifyContent: { xs: 'space-between', xl: 'flex-end' },
            flexDirection: { xs: 'row-reverse', md: 'row' },
          }}
        >
          <Tooltip title="Create Schedule" arrow disableHoverListener={!downMd}>
            <Button
              href={paths.scheduler}
              variant="soft"
              size="medium"
              color="neutral"
              shape={downMd ? 'square' : undefined}
              sx={{ flexShrink: 1 }}
            >
              {downMd ? (
                <IconifyIcon
                  color="neutral.dark"
                  icon="material-symbols:calendar-add-on"
                  sx={{ fontSize: 18, display: 'inline-block' }}
                />
              ) : (
                'Create Schedule'
              )}
            </Button>
          </Tooltip>
          <Button
            variant="contained"
            size="medium"
            startIcon={
              <IconifyIcon
                icon="material-symbols:add-rounded"
                sx={{ fontSize: '20px !important' }}
              />
            }
            onClick={handleAddEventClick}
          >
            Add Event/Task
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CalendarTop;
