import { useEffect, useRef, useState } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useCalendarContext } from 'providers/CalendarProvider';
import { INITIALIZE_SCHEDULER } from 'reducers/CalendarReducer';
import FullCalendar from 'components/base/FullCalendar';
import SchedulerTop from 'components/sections/scheduler/SchedulerTop';
import SettingsDrawer from 'components/sections/scheduler/SettingsDrawer';

export const createRecurringEventsForSlot = (
  dayIndex,
  slot,
  repetition = 'weekly',
  color,
  weeksToShow = 52,
) => {
  const uniqueId = slot.id;

  const events = [];
  const [startHour, startMinute] = slot.start.split(':').map(Number);
  const [endHour, endMinute] = slot.end.split(':').map(Number);

  const today = dayjs();
  const startOfCurrentWeek = today.startOf('week');

  for (let weekOffset = 0; weekOffset < weeksToShow; weekOffset++) {
    const weekStart = startOfCurrentWeek.add(weekOffset, 'week');
    const eventDate = weekStart.add(dayIndex, 'day');

    const eventStart = eventDate.hour(startHour).minute(startMinute).second(0);

    const eventEnd = eventDate.hour(endHour).minute(endMinute).second(0);

    events.push({
      id: `${uniqueId}-${weekOffset}`,
      title: 'Appointment Slot',
      start: eventStart.toISOString(),
      end: eventEnd.toISOString(),
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        slotId: uniqueId,
        dayIndex,
        isRecurring: repetition !== 'none',
        originalSlot: slot,
      },
    });
  }

  return events;
};

const Scheduler = () => {
  const [appointments, setAppointments] = useState([]);
  const { calendarDispatch } = useCalendarContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const schedulerRef = useRef(null);
  const containerRef = useRef(null);
  const { topbarHeight } = useNavContext();
  const { up } = useBreakpoints();

  const upSm = up('sm');
  const upMd = up('md');

  const getContentHeight = () => {
    const offset = 140;
    const currentTopbarHeight = topbarHeight.md;

    return `calc(100vh - ${currentTopbarHeight}px - ${offset}px)`;
  };

  const handleEventClick = (info) => {
    if (info.event.url) {
      window.open(info.event.url);
      info.jsEvent.preventDefault();
    }
  };

  const handleAddAppointments = (events) => {
    setAppointments((prev) => {
      const existingSlots = new Map(prev.map((event) => [event.extendedProps?.slotId, true]));

      const newEvents = events.filter((event) => !existingSlots.has(event.extendedProps?.slotId));

      return [...prev, ...newEvents];
    });
  };

  const handleUpdateAppointments = (dayIndex, updatedSlot) => {
    setAppointments((prev) => {
      const filtered = prev.filter(
        (event) => !event.extendedProps?.slotId?.startsWith(updatedSlot.id),
      );

      const repetition = 'weekly';
      const newEvents = createRecurringEventsForSlot(
        dayIndex,
        updatedSlot,
        repetition,
        updatedSlot.color,
      );

      return [...filtered, ...newEvents];
    });
  };

  const handleRemoveSlot = (slotId) => {
    setAppointments((prev) => prev.filter((event) => event.extendedProps?.slotId !== slotId));
  };

  useEffect(() => {
    if (schedulerRef.current && containerRef.current) {
      const schedulerApi = schedulerRef.current.getApi();

      calendarDispatch({ type: INITIALIZE_SCHEDULER, payload: schedulerApi });

      const resizeObserver = new ResizeObserver(() => schedulerApi.updateSize());
      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <Stack flexDirection="column" sx={{ height: 1 }}>
      <SchedulerTop isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

      <Stack sx={{ flexGrow: 1, minHeight: 0 }}>
        <Box
          sx={{
            width: 375,
            display: { xs: 'none', md: 'block' },
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <SettingsDrawer
            isDrawerOpen={isDrawerOpen}
            toggleDrawer={toggleDrawer}
            onAddAppointments={handleAddAppointments}
            onUpdateAppointments={handleUpdateAppointments}
            onRemoveAppointments={handleRemoveSlot}
          />
        </Box>
        <Paper
          sx={(theme) => ({
            flexGrow: 1,
            minWidth: 0,
            zIndex: 1,
            height: '100%',
            transition: theme.transitions.create('margin', {
              duration: theme.transitions.duration.short,
            }),
            ml: { md: isDrawerOpen ? 0 : '-375px' },
          })}
        >
          <Box
            ref={containerRef}
            sx={{
              flexGrow: 1,
              minHeight: 0,
              position: 'relative',
            }}
          >
            <FullCalendar
              ref={schedulerRef}
              contentHeight={upMd ? getContentHeight() : 'auto'}
              stickyHeaderDates={!upMd ? false : false}
              expandRows={true}
              initialView={'timeGridWeek'}
              selectable
              selectMirror
              events={appointments}
              eventClick={handleEventClick}
              nowIndicator
              eventStartEditable={false}
              weekNumbers={true}
              weekNumberContent={(arg) => (
                <Stack alignItems="center" height={1}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontSize: { xs: 'unset', sm: 'subtitle1.fontSize' } }}
                  >
                    <strong>Week </strong>
                    {arg.num}
                  </Typography>
                </Stack>
              )}
              allDayText="All day"
              slotLabelContent={(arg) => {
                const isFirst = arg.date.getHours() === 0;

                return (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="medium"
                    sx={{
                      minWidth: upSm ? 70 : 40,
                      position: 'relative',
                      transform: isFirst ? 'translateY(-12px)' : 'translateY(-20px)',
                      zIndex: 10,
                    }}
                  >
                    {arg.text}
                  </Typography>
                );
              }}
              dayHeaderContent={(arg) => {
                const date = dayjs(arg.date).date();
                const day = dayjs(arg.date).format('ddd');

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
              }}
              displayEventTime
              displayEventEnd
              dayMaxEvents={true}
              weekends
              scrollTime="00:00:00"
            />
          </Box>
        </Paper>
      </Stack>
    </Stack>
  );
};

export default Scheduler;
