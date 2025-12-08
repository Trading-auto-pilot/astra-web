import { useMemo, useRef, useState } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ReactFullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { eventCategories } from 'data/project/dashboard';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import ScheduleDialog from './ScheduleDialog';

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

const EventsCalendar = ({ events, setEvents, onOpenDrawer }) => {
  const theme = useTheme();
  const calendarRef = useRef(null);
  const { up } = useBreakpoints();
  const [selectedEvent, setSelectedEvent] = useState();
  const [currentMonth, setCurrentMonth] = useState(dayjs(events[0].startDate));
  const [selectedDates, setSelectedDates] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const upSm = up('sm');
  const handleClose = () => {
    setSelectedDates(null);
    setSelectedEvent(null);
    setDialogOpen(false);
  };
  const handleDateSelect = (info) => {
    const existingEvent = events.find((event) => {
      return dayjs(info.startStr).isBetween(
        event.startDate,
        event.endDate ? event.endDate : event.startDate,
        'day',
        '[]',
      );
    });
    setSelectedEvent(existingEvent);
    setSelectedDates({
      start: info.startStr,
      end: dayjs(info.endStr).subtract(1, 'day').format('YYYY-MM-DD'),
    });
    setDialogOpen(true);
  };
  const handleSubmit = (data) => {
    if (!selectedDates) return;
    const eventCategory = eventCategories.find((option) => option.value === data.category);
    const newEvent = {
      ...data,
      id: selectedEvent?.id ?? events.length + 1,
      startDate: dayjs(data.startDate, 'DD.MM.YYYY').format('YYYY-MM-DD'),
      startTime: dayjs(data.startTime, 'h:mm a').format('h:mm a'),
      endDate:
        data.endDate === data.startDate
          ? undefined
          : dayjs(data.endDate, 'DD.MM.YYYY').format('YYYY-MM-DD'),
      endTime: dayjs(data.endTime, 'h:mm a').format('h:mm a'),
      color: eventCategory?.color,
    };
    const updatedEvents = selectedEvent
      ? events.map((event) => (event.id === selectedEvent.id ? { ...event, ...newEvent } : event))
      : [...events, newEvent];
    setEvents(updatedEvents);
    setDialogOpen(false);
  };
  const getEvents = useMemo(
    () =>
      events.map((event) => ({
        title: event.title,
        start: event.startDate,
        end: event.endDate
          ? dayjs(event.endDate).add(1, 'day').format('YYYY-MM-DD')
          : event.startDate,
        color: event.color,
        backgroundColor: theme.vars.palette[event.color].light,
        borderColor: theme.vars.palette[event.color].light,
        display: 'background',
      })),
    [events, theme],
  );

  return (
    <>
      <Box sx={{ width: 1, py: 5, px: { xs: 3, sm: 5 } }}>
        <Stack
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Stack
            spacing={1}
            sx={{
              justifyContent: { xs: 'space-between', sm: 'unset' },
              width: { xs: 1, sm: 'unset' },
            }}
          >
            <Button
              shape="square"
              color="neutral"
              onClick={onOpenDrawer}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
              }}
            >
              <IconifyIcon
                icon="material-symbols:event-note-outline-rounded"
                sx={{ color: 'text.primary', fontSize: 20 }}
              />
            </Button>
            <Button
              variant="text"
              color="neutral"
              sx={{ px: 1 }}
              startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
              onClick={() => {
                setSelectedEvent(null);
                setSelectedDates({
                  start: dayjs().format('YYYY-MM-DD'),
                  end: dayjs().format('YYYY-MM-DD'),
                });
                setDialogOpen(true);
              }}
            >
              Add Schedule
            </Button>
          </Stack>
          <Stack spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              shape="square"
              color="neutral"
              onClick={() => calendarRef.current?.getApi().prev()}
            >
              <IconifyIcon
                flipOnRTL
                icon="material-symbols:chevron-left-rounded"
                sx={{ fontSize: 20 }}
              />
            </Button>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
                textWrap: 'nowrap',
                textAlign: 'center',
                minWidth: { xs: 55, sm: 120 },
              }}
            >
              {upSm ? currentMonth.format('MMMM, YYYY') : currentMonth.format('MMM, YY')}
            </Typography>
            <Button
              shape="square"
              color="neutral"
              onClick={() => calendarRef.current?.getApi().next()}
            >
              <IconifyIcon
                flipOnRTL
                icon="material-symbols:chevron-right-rounded"
                sx={{ fontSize: 20 }}
              />
            </Button>
          </Stack>
        </Stack>
        <Box
          className="custom-calendar"
          sx={{
            width: 1,
            '& .fc': { width: 1, height: 383 },
            '& *': {
              WebkitTapHighlightColor: 'transparent',
            },
          }}
        >
          <ReactFullCalendar
            ref={calendarRef}
            events={getEvents}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={false}
            selectable
            selectLongPressDelay={0}
            eventDisplay="block"
            fixedWeekCount={false}
            dayMaxEventRows={1}
            editable
            initialDate={new Date(events[0].startDate)}
            select={handleDateSelect}
            datesSet={(dateInfo) => setCurrentMonth(dayjs(dateInfo.start).add(15, 'day'))}
          />
        </Box>
      </Box>
      <ScheduleDialog
        key={dialogOpen ? 'open' : 'close'}
        open={dialogOpen}
        handleClose={handleClose}
        selectedEvent={selectedEvent}
        selectedDates={selectedDates}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default EventsCalendar;
