import { useEffect, useState } from 'react';
import { Box, Divider, Stack } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import { PickersDay, pickersDayClasses } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import { useCalendarContext } from 'providers/CalendarProvider';
import { SET_CALENDAR_STATE } from 'reducers/CalendarReducer';
import CalendarFilters from 'components/sections/calendar/CalendarSidebar/CalendarFilters';
import CategoryList from 'components/sections/calendar/CalendarSidebar/CategoryList';

const CustomDay = (props) => {
  const { day, ...other } = props;
  const isCurrentDate = day.isSame(dayjs(), 'day');

  return (
    <PickersDay
      {...other}
      day={day}
      sx={{
        ...(isCurrentDate && {
          borderRadius: '50%',
        }),
      }}
    />
  );
};

const CalendarSidebarPanel = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const { navigateToDate, calendarDispatch, calendarApi } = useCalendarContext();

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    navigateToDate(newDate.toDate());
    calendarDispatch({ type: SET_CALENDAR_STATE, payload: { title: calendarApi?.view.title } });
  };
  useEffect(() => {
    if (calendarApi) {
      const newDate = dayjs(calendarApi.getDate());
      setSelectedDate(newDate);
    }
  }, [calendarApi?.view.title]);

  return (
    <Stack direction="column" divider={<Divider />}>
      <Box sx={{ p: { xs: 3, md: 5 } }}>
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          slots={{ day: CustomDay }}
          sx={{
            width: 1,
            p: 0,
            [`& .${pickersDayClasses.root}`]: {
              flex: 1,
              aspectRatio: 1,
              height: 'unset !important',
              width: 'unset !important',
              color: 'text.secondary',
              [`&.${pickersDayClasses.selected}`]: {
                color: 'primary.contrastText',
              },
            },
          }}
        />
      </Box>
      <CalendarFilters />
      <CategoryList />
    </Stack>
  );
};

export default CalendarSidebarPanel;
