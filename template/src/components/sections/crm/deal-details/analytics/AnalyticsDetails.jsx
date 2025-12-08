import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getPercentageStr } from 'lib/utils';

const colors = ['warning.light', 'info.light', 'primary.light', 'success.light'];

const AnalyticsDetails = ({ data }) => {
  return (
    <Stack direction="column" gap={1.25}>
      {data.map((item, index) => (
        <Stack key={item.name} sx={{ justifyContent: 'space-between' }}>
          <Stack gap={1} sx={{ alignItems: 'center', minWidth: 170 }}>
            <Box sx={{ width: 9, height: 9, borderRadius: 999, bgcolor: colors[index] }} />
            <Typography variant="body2" sx={{ fontWeight: 500, textWrap: 'nowrap' }}>
              {item.name}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            :
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'end', minWidth: 100 }}>
            {getPercentageStr(item.value)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default AnalyticsDetails;
