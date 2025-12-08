import { Box, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import InfoCard from '../common/InfoCard';

const Education = ({ education, handleOpenDialog }) => {
  const { institutionLogo, institutionName, subject, location, startDate, endDate } = education;

  return (
    <InfoCard setOpen={() => handleOpenDialog(education)} sx={{ p: 3 }}>
      <Stack spacing={2}>
        {institutionLogo && <Image src={institutionLogo} alt="" width={40} height={40} />}
        {!institutionLogo && (
          <IconifyIcon
            icon="material-symbols:account-balance-outline-rounded"
            sx={{ fontSize: 40 }}
          />
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1,
              fontWeight: 400,
              textWrap: 'wrap',
              maxWidth: 235,
            }}
          >
            Studied <strong>{subject}</strong> at <strong>{institutionName}</strong>
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 400, color: 'text.secondary' }}>
            {location}
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {dayjs(startDate).format('MMM, YYYY')} - {dayjs(endDate).format('MMM, YYYY')}
          </Typography>
        </Box>
      </Stack>
      <IconifyIcon
        icon="material-symbols-light:edit-outline"
        sx={{ fontSize: 20, color: 'neutral.dark', visibility: 'hidden' }}
      />
    </InfoCard>
  );
};

export default Education;
