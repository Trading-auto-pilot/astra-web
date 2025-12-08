import { Avatar, Box, Stack, Typography } from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import IconifyIcon from 'components/base/IconifyIcon';

const StatCard = ({ title, subTitle, value, icon }) => {
  const { numberFormat } = useNumberFormat();

  return (
    <Box sx={{ p: 2, bgcolor: 'background.elevation1', borderRadius: 4 }}>
      <Stack direction="column" gap={0.5} sx={{ height: 1, justifyContent: 'space-between' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography variant="subtitle2" fontWeight={600}>
            {title}
          </Typography>

          <Avatar
            variant="circular"
            sx={({ vars }) => ({
              width: 40,
              height: 40,
              bgcolor: vars.palette.chBlue[50],
            })}
          >
            <IconifyIcon icon={icon} sx={{ fontSize: 24, color: 'primary.main' }} />
          </Avatar>
        </Stack>

        <Stack direction="column" gap={0.5}>
          <Typography variant="h5" fontWeight={500}>
            {typeof value === 'number' ? numberFormat(value) : value}
          </Typography>

          <Typography variant="caption" fontWeight={500} color="text.secondary">
            {subTitle}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default StatCard;
