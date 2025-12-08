import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import { useCalendarContext } from 'providers/CalendarProvider';
import {
  ADD_NEW_EVENT,
  ADD_NEW_TASK,
  SET_CALENDAR_STATE,
  UPDATE_EVENT,
  UPDATE_TASK,
} from 'reducers/CalendarReducer';
import {
  calendarEventSchema,
  calendarTaskSchema,
} from 'components/sections/calendar/EventDialog/EventDialog';

const useEventDialog = () => {
  const [formType, setFormType] = useState('event');
  const {
    calendarDispatch,
    view,
    selectedItem,
    selectedStartDate,
    selectedEndDate,
    events,
    tasks,
  } = useCalendarContext();

  const defaultValues = useMemo(() => {
    if (selectedItem) {
      return {
        ...selectedItem,
      };
    } else {
      return {
        title: '',
        allDay: false,
        start: selectedStartDate,
        end: selectedEndDate,
      };
    }
  }, [selectedItem, selectedStartDate, selectedEndDate, view]);

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(formType === 'event' ? calendarEventSchema : calendarTaskSchema),
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (selectedItem) {
      setFormType('selectedList' in selectedItem ? 'task' : 'event');
    }
  }, [selectedItem]);

  const onSubmit = (data) => {
    const newItem = {
      ...data,
      id: data.id || `${formType}-${formType === 'event' ? events.length + 1 : tasks.length + 1}`,
      start: dayjs(data.start).format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs(data.end).format('YYYY-MM-DD HH:mm:ss'),
    };
    calendarDispatch({
      type: data.id
        ? formType === 'event'
          ? UPDATE_EVENT
          : UPDATE_TASK
        : formType === 'event'
          ? ADD_NEW_EVENT
          : ADD_NEW_TASK,
      payload: newItem,
    });
    enqueueSnackbar(`${formType === 'event' ? 'Event' : 'Task'} saved successfully!`, {
      variant: 'success',
    });

    reset(defaultValues);
    calendarDispatch({ type: SET_CALENDAR_STATE, payload: { openNewEventModal: false } });
  };

  return { methods, handleSubmit: handleSubmit(onSubmit), formType, setFormType };
};

export default useEventDialog;
