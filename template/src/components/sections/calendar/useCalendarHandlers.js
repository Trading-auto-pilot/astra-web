import { useCallback, useMemo } from 'react';
import { useTheme } from '@mui/material';
import { categoryColorMap } from 'data/calendar';
import dayjs from 'dayjs';
import { useCalendarContext } from 'providers/CalendarProvider';
import {
  HANDLE_SELECT,
  SELECT_EVENT,
  SET_CALENDAR_STATE,
  UPDATE_EVENT,
  UPDATE_TASK,
} from 'reducers/CalendarReducer';

const useCalendarHandlers = () => {
  const { events, tasks, calendarDispatch } = useCalendarContext();
  const { vars } = useTheme();

  const getCategoryColor = useCallback(
    (category) => {
      if (!category) return vars.palette.primary.main;
      const colorKey = categoryColorMap[category];

      return colorKey ? vars.palette[colorKey].main : vars.palette.error.main;
    },
    [vars.palette],
  );

  const handleDateSelect = (selectInfo) => {
    const calendarApi = selectInfo.view.calendar;
    const viewType = calendarApi.view.type;
    const startDate = dayjs(selectInfo.startStr);
    let endDate = dayjs(selectInfo.endStr);

    if (viewType === 'dayGridMonth') {
      endDate = endDate.hour(23).minute(59).second(59).subtract(1, 'day');
    }

    calendarDispatch({
      type: HANDLE_SELECT,
      payload: {
        startDate: startDate.format('YYYY-MM-DD HH:mm:ss'),
        endDate: endDate.format('YYYY-MM-DD HH:mm:ss'),
      },
    });

    calendarDispatch({
      type: SET_CALENDAR_STATE,
      payload: { openNewEventModal: true },
    });
  };

  const handleEventClick = (info) => {
    if (info.event.url) {
      window.open(info.event.url);
      info.jsEvent.preventDefault();
    }
    calendarDispatch({
      type: SELECT_EVENT,
      payload: {
        id: info.event.id,
        title: info.event.title,
        start: dayjs(info.event.start).format('YYYY-MM-DD HH:mm:ss'),
        end: dayjs(info.event.end ? info.event.end : info.event.start).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
        allDay: info.event.allDay,
        ...info.event.extendedProps,
      },
    });
  };

  const handleEventDrop = (info) => {
    const { event } = info;

    const updatedItem = {
      id: event.id,
      title: event.title,
      start: event.start ? dayjs(event.start).format('YYYY-MM-DD HH:mm:ss') : '',
      end: event.end ? dayjs(event.end).format('YYYY-MM-DD HH:mm:ss') : '',
      allDay: event.allDay,
      ...event.extendedProps,
    };

    if (event.extendedProps.selectedList) {
      calendarDispatch({ type: UPDATE_TASK, payload: updatedItem });
    } else {
      calendarDispatch({ type: UPDATE_EVENT, payload: updatedItem });
    }
  };

  const calendarEvents = useMemo(() => {
    return [
      ...events.map((event) => ({
        ...event,
        backgroundColor: getCategoryColor(event.category),
        className: 'event',
      })),
      ...tasks.map((task) => ({
        ...task,
        className: 'task',
        backgroundColor: vars.palette.neutral.lighter,
        textColor: vars.palette.text.primary,
        boxShadow: 'none',
      })),
    ];
  }, [events, tasks, getCategoryColor, vars.palette]);

  return {
    calendarEvents,
    handleDateSelect,
    handleEventClick,
    getCategoryColor,
    handleEventDrop,
  };
};

export default useCalendarHandlers;
