import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from './IconifyIcon';

const DateRangePicker = ({
  defaultStartDate = null,
  defaultEndDate = null,
  selectsMultiple,
  onChange,
  sx,
  ...rest
}) => {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const { up } = useBreakpoints();

  const upSm = up('sm');

  const handleChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (onChange) {
      onChange(dates);
    }
  };

  return (
    <Box sx={{ ...sx }}>
      <ReactDatePicker
        selected={startDate}
        startDate={startDate || undefined}
        endDate={endDate || undefined}
        onChange={handleChange}
        popperPlacement={upSm ? 'bottom-start' : undefined}
        showPopperArrow={false}
        selectsRange
        wrapperClassName={rest.isClearable && (startDate || endDate) ? 'clearable' : ''}
        customInput={<TextField label="Select Date Range" fullWidth />}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <Stack sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button
              shape="square"
              color="neutral"
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
            >
              <IconifyIcon icon="material-symbols:chevron-left-rounded" sx={{ fontSize: 20 }} />
            </Button>

            <Typography variant="button">
              {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
            </Typography>

            <Button
              shape="square"
              color="neutral"
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
            >
              <IconifyIcon icon="material-symbols:chevron-right-rounded" sx={{ fontSize: 20 }} />
            </Button>
          </Stack>
        )}
        {...rest}
      />
    </Box>
  );
};

export default DateRangePicker;
