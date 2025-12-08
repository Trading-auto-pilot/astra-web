import { useImperativeHandle } from 'react';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import StyledDateCalendar from 'components/styled/StyledDateCalendar';
import CalendarDay from './CalendarDay';

const AttendanceCalendar = ({ ref, currentDate, setCurrentDate, attendance, sx }) => {
  useImperativeHandle(ref, () => ({
    goToNextMonth: () => setCurrentDate((prev) => prev.add(1, 'month')),
    goToPreviousMonth: () => setCurrentDate((prev) => prev.subtract(1, 'month')),
  }));

  return (
    <Box sx={sx}>
      <StyledDateCalendar
        value={currentDate}
        onChange={(newValue) => newValue && setCurrentDate(newValue)}
        slots={{
          calendarHeader: () => null,
          day: (dayProps) => (
            <CalendarDay
              {...dayProps}
              isDifferentMonthDay={dayProps.day.month() !== currentDate.month()}
              status={attendance.details[Number(dayjs(dayProps.day).format('D')) - 1].status}
            />
          ),
        }}
        showDaysOutsideCurrentMonth
        fixedWeekNumber={5}
        sx={{ minHeight: 300 }}
      />
    </Box>
  );
};

export default AttendanceCalendar;
