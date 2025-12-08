import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import SimpleBar from 'components/base/SimpleBar';
import CallRecord from './CallRecord';

const CallLogTabPanel = ({ callLogData }) => {
  return (
    <Container maxWidth={false} sx={{ maxWidth: 800, px: { xs: 0 } }}>
      <SimpleBar sx={{ maxHeight: 504 }}>
        <Stack direction="column" gap={1}>
          {callLogData.map((data) => (
            <Stack key={data.id} direction="column" gap={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {dayjs(data.date).format('DD MMM, YYYY')}
              </Typography>
              <Stack direction="column" gap={1}>
                {data.calls.map((call) => (
                  <CallRecord key={call.id} call={call} />
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </SimpleBar>
      <Button sx={{ mt: 3 }}>Load more notifications</Button>
    </Container>
  );
};

export default CallLogTabPanel;
