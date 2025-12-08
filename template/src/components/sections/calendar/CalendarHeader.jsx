import { useEffect } from 'react';
import { Box, Button, MenuItem, Stack, Typography } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useCalendarContext } from 'providers/CalendarProvider';
import { SET_CALENDAR_STATE } from 'reducers/CalendarReducer';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

const CalendarHeader = ({ toggleDrawer }) => {
  const { calendarApi, view, calendarDispatch, updateView } = useCalendarContext();
  const { down } = useBreakpoints();
  const downSm = down('sm');

  const handleChangeView = (newView) => {
    if (calendarApi) {
      calendarApi.changeView(newView);
      calendarDispatch({
        type: SET_CALENDAR_STATE,
        payload: { view: newView },
      });
    }
  };

  useEffect(() => {
    if (calendarApi) {
      const currentDate = calendarApi.getDate();
      calendarDispatch({
        type: SET_CALENDAR_STATE,
        payload: { selectedStartDate: currentDate, selectedEndDate: currentDate },
      });
    }
  }, [calendarApi, calendarDispatch]);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: { xs: 1, sm: 2 },
        py: 2,
        pr: { xs: 3, md: 5 },
      }}
    >
      <Button
        shape="square"
        variant="outlined"
        color="neutral"
        sx={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderLeft: 0,
          borderColor: 'divider',

          '&:hover': {
            borderColor: 'divider',
          },
        }}
        onClick={toggleDrawer}
      >
        <IconifyIcon icon="material-symbols:filter-alt-outline" sx={{ fontSize: 20 }} />
      </Button>

      <Stack
        spacing={1}
        alignItems="center"
        sx={[!downSm && { position: 'absolute', left: '50%', transform: 'translateX(-50%)' }]}
      >
        <Button
          shape="square"
          color="neutral"
          size={downSm ? 'small' : 'medium'}
          onClick={() => updateView('calendar', 'prev')}
        >
          <IconifyIcon
            flipOnRTL
            icon="material-symbols:chevron-left-rounded"
            sx={{ fontSize: 24 }}
          />
        </Button>
        <Typography
          variant="h4"
          fontWeight={400}
          sx={{
            color: 'text.secondary',
            whiteSpace: 'nowrap',
            fontSize: { xs: 'subtitle2.fontSize', sm: 'h5.fontSize', xl: 'h4.fontSize' },
            fontWeight: { xs: 600, sm: 400 },
          }}
        >
          {calendarApi?.view.title}
        </Typography>
        <Button
          shape="square"
          color="neutral"
          size={downSm ? 'small' : 'medium'}
          onClick={() => updateView('calendar', 'next')}
        >
          <IconifyIcon
            flipOnRTL
            icon="material-symbols:chevron-right-rounded"
            sx={{ fontSize: 24 }}
          />
        </Button>
      </Stack>

      <StyledTextField
        select
        size={downSm ? 'small' : 'medium'}
        value={view}
        onChange={(e) => handleChangeView(e.target.value)}
      >
        <MenuItem value="dayGridMonth">Month View</MenuItem>
        <MenuItem value="timeGridWeek">Week View</MenuItem>
        <MenuItem value="timeGridDay">Day View</MenuItem>
      </StyledTextField>
    </Box>
  );
};

export default CalendarHeader;
