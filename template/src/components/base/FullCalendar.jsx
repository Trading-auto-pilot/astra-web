import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ReactFullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useTheme } from '@mui/material';

const FullCalendar = ({ ref, ...rest }) => {
  const { direction } = useTheme();

  return (
    <ReactFullCalendar
      ref={ref}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      direction={direction === 'rtl' ? 'rtl' : 'ltr'}
      headerToolbar={false}
      selectable
      eventDisplay="block"
      fixedWeekCount={false}
      dayMaxEventRows={1}
      editable
      eventTimeFormat={{
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: true,
        meridiem: true,
      }}
      slotDuration="00:60:00"
      slotLabelInterval="01:00:00"
      {...rest}
    />
  );
};

FullCalendar.displayName = 'FullCalendar';

export default FullCalendar;
