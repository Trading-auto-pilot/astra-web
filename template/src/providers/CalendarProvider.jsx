import { createContext, use, useReducer } from 'react';
import { eventList, taskList } from 'data/calendar';
import { SET_CALENDAR_STATE, calendarReducer } from 'reducers/CalendarReducer';

export const CalendarContext = createContext({});

const CalendarProvider = ({ children }) => {
  const initialState = {
    calendarApi: null,
    schedulerApi: null,
    title: '',
    selectedItem: null,
    view: 'dayGridMonth',
    openNewEventModal: false,
    selectedStartDate: '',
    selectedEndDate: '',
    events: eventList,
    tasks: taskList,
  };

  const [calendarState, calendarDispatch] = useReducer(calendarReducer, initialState);

  const updateView = (type, action) => {
    const api = type === 'calendar' ? calendarState.calendarApi : calendarState.schedulerApi;
    if (!api) return;
    if (action === 'next') api.next();
    else if (action === 'prev') api.prev();
    else api.today();

    calendarDispatch({
      type: SET_CALENDAR_STATE,
      payload: { title: api.view.title },
    });
  };

  const navigateToDate = (date) => {
    if (calendarState.calendarApi) {
      calendarState.calendarApi.gotoDate(date);
    }
  };

  return (
    <CalendarContext
      value={{
        ...calendarState,
        calendarDispatch,
        updateView,
        navigateToDate,
      }}
    >
      {children}
    </CalendarContext>
  );
};

export const useCalendarContext = () => use(CalendarContext);

export default CalendarProvider;
