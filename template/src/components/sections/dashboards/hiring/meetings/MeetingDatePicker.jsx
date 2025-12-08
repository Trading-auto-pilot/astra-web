import { useState } from 'react';
import { inputBaseClasses } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import StyledTextField from 'components/styled/StyledTextField';

const MeetingDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <DatePicker
      format="DD MMM, YYYY"
      defaultValue={selectedDate}
      onChange={handleDateChange}
      slots={{
        textField: StyledTextField,
      }}
      sx={{
        maxWidth: { lg: 150 },

        [`& .${inputBaseClasses.input}`]: {
          pr: '0px !important',
        },
      }}
    />
  );
};

export default MeetingDatePicker;
