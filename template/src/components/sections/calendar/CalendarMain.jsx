import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useCalendarContext } from 'providers/CalendarProvider';
import { INITIALIZE_CALENDAR, SET_CALENDAR_STATE } from 'reducers/CalendarReducer';
import FullCalendar from 'components/base/FullCalendar';
import useCalendarHandlers from 'components/sections/calendar/useCalendarHandlers';

const CalendarMain = () => {
  const calendarRef = useRef(null);
  const containerRef = useRef(null);
  const { calendarDispatch, view } = useCalendarContext();
  const { topbarHeight } = useNavContext();
  const { only, up } = useBreakpoints();
  const onlyXs = only('xs');
  const upMd = up('md');

  const getContentHeight = () => {
    const currentTopbarHeight = upMd ? topbarHeight.md : topbarHeight.xs;

    return `calc(100vh - ${currentTopbarHeight}px - 209px)`;
  };

  const { calendarEvents, handleDateSelect, handleEventClick, handleEventDrop } =
    useCalendarHandlers();

  useEffect(() => {
    if (calendarRef.current && containerRef.current) {
      const calendarApi = calendarRef.current.getApi();

      calendarDispatch({ type: INITIALIZE_CALENDAR, payload: calendarApi });

      const resizeObserver = new ResizeObserver(() => calendarApi.updateSize());
      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const newView = onlyXs ? 'timeGridDay' : 'dayGridMonth';

      if (calendarApi.view.type !== newView) {
        queueMicrotask(() => {
          calendarApi.changeView(newView);
          calendarDispatch({
            type: SET_CALENDAR_STATE,
            payload: { view: newView },
          });
        });
      }
    }
  }, [onlyXs]);

  return (
    <Box
      ref={containerRef}
      sx={(theme) => ({
        flexGrow: 1,
        minHeight: 0,
        position: 'relative',
        outline: `1px solid ${theme.vars.palette.divider}`,
      })}
    >
      <FullCalendar
        ref={calendarRef}
        height={view === 'dayGridMonth' ? getContentHeight() : 'auto'}
        expandRows={true}
        stickyHeaderDates={true}
        allDayText="All day"
        slotLabelContent={(arg) => (
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight="medium"
            sx={{
              minWidth: 70,
              position: 'relative',
              transform: 'translateY(-18px)',
              overflow: 'hidden',
            }}
          >
            {arg.text}
          </Typography>
        )}
        dayMaxEvents={2}
        selectMirror
        weekends
        allDayMaintainDuration
        events={calendarEvents}
        displayEventEnd
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        initialView={view}
        dayHeaders={view === 'timeGridDay' ? false : true}
        weekNumbers={view === 'dayGridMonth' ? false : true}
        weekNumberContent={(arg) => (
          <Typography
            variant="subtitle1"
            sx={{ fontSize: { xs: 'unset', sm: 'subtitle1.fontSize' } }}
          >
            <strong>Week </strong>
            {arg.num}
          </Typography>
        )}
        dayHeaderContent={(arg) => {
          const date = dayjs(arg.date).date();
          const day = dayjs(arg.date).format('ddd');

          if (view === 'timeGridWeek') {
            return (
              <Typography
                variant="subtitle1"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  fontSize: { xs: 'caption.fontSize', sm: 'subtitle1.fontSize' },
                }}
              >
                <strong>{day}</strong>
                {date}
              </Typography>
            );
          } else {
            return <strong>{day}</strong>;
          }
        }}
      />
    </Box>
  );
};

export default CalendarMain;
