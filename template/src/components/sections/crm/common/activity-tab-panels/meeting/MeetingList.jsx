import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import Meeting from './Meeting';

const MeetingList = ({ meetingList }) => {
  const isBeforeToday = dayjs(meetingList.date).isBefore(dayjs().subtract(1, 'hour'));
  const isToday = dayjs(meetingList.date).isToday();
  const isAfterToday = dayjs(meetingList.date).isAfter(dayjs());

  return (
    <Stack direction="column" gap={2}>
      <Stack
        direction="column"
        gap={0.5}
        sx={{
          px: 1.5,
          alignItems: 'flex-start',
          position: 'sticky',
          top: 0,
          zIndex: 5,
          pb: 1,
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 500, lineHeight: '18px' }}
        >
          {isBeforeToday && 'Already Done'}
          {isToday && 'Happening Now'}
          {isAfterToday && 'Upcoming'}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {dayjs(meetingList.date).format('DD MMM, YYYY')}
          {isToday && ', Today'}{' '}
        </Typography>
      </Stack>
      <Stack direction="column" gap={1}>
        {meetingList.meetings.map((meeting) => (
          <Meeting key={meeting.id} date={meetingList.date} meeting={meeting} isToday={isToday} />
        ))}
      </Stack>
    </Stack>
  );
};

export default MeetingList;
