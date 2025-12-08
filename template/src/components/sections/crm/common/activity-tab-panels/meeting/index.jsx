import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import SimpleBar from 'components/base/SimpleBar';
import MeetingList from './MeetingList';

dayjs.extend(isToday);

const MeetingTabPanel = ({ meetingData }) => {
  return (
    <Container maxWidth={false} sx={{ maxWidth: 800, px: { xs: 0 } }}>
      <SimpleBar sx={{ maxHeight: 504 }}>
        <Stack
          direction="column"
          gap={4}
          divider={<Divider sx={{ borderColor: 'dividerLight' }} />}
        >
          {meetingData.map((data) => (
            <MeetingList key={data.id} meetingList={data} />
          ))}
        </Stack>
      </SimpleBar>

      <Button sx={{ mt: 3 }}>Load more notifications</Button>
    </Container>
  );
};

export default MeetingTabPanel;
