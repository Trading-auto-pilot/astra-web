import { useRef, useState } from 'react';
import { Button, InputAdornment, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import SectionHeader from 'components/common/SectionHeader';
import StyledTextField from 'components/styled/StyledTextField';

const TaskTrackHeader = () => {
  return (
    <SectionHeader
      direction={{ xs: 'column', sm: 'row' }}
      title="Daily task track"
      subTitle=""
      actionComponent={<Actions />}
      spacing={{ xs: 1, sm: 2 }}
    />
  );
};

const Actions = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { up } = useBreakpoints();
  const upLg = up('lg');

  const handleSearch = (e) => {
    console.log(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <Stack sx={{ gap: 1, alignItems: 'center', width: { xs: 1, sm: 'auto' } }}>
      <StyledTextField
        id="search-box"
        type="search"
        size="medium"
        placeholder="Search member"
        onChange={handleSearch}
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon
                  icon="material-symbols:search-rounded"
                  sx={{
                    fontSize: 20,
                    color: 'text.secondary',
                  }}
                />
              </InputAdornment>
            ),
          },
        }}
        sx={{ ml: 'auto', maxWidth: { xs: 1, sm: 220 } }}
      />
      {upLg ? (
        <DatePicker
          format="DD MMM, YYYY"
          defaultValue={selectedDate}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              fullWidth: true,
            },
            inputAdornment: {
              position: 'start',
            },
          }}
          slots={{
            textField: StyledTextField,
          }}
          sx={{ maxWidth: 180 }}
        />
      ) : (
        <>
          <DatePicker
            open={open}
            value={selectedDate}
            onChange={handleDateChange}
            onClose={() => setOpen(false)}
            slotProps={{
              textField: { sx: { display: 'none' } },
              popper: {
                anchorEl: buttonRef.current,
                placement: 'bottom-start',
              },
            }}
          />
          <Button
            ref={buttonRef}
            variant="soft"
            shape="square"
            color="neutral"
            onClick={() => setOpen(true)}
          >
            <IconifyIcon
              icon="material-symbols:calendar-today-outline-rounded"
              sx={{ fontSize: 18, color: 'text.secondary' }}
            />
          </Button>
        </>
      )}
    </Stack>
  );
};

export default TaskTrackHeader;
