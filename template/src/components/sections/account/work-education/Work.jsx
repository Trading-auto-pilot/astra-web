import { Box, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import InfoCard from '../common/InfoCard';

const Work = ({ work, handleOpenDialog }) => {
  const { companyLogo, companyName, designation, location, startDate, endDate, currentlyWorking } =
    work;

  return (
    <InfoCard onClick={() => handleOpenDialog(work)} sx={{ p: 3 }}>
      <Stack spacing={2}>
        {companyLogo && <Image src={companyLogo} alt="" width={40} height={40} />}
        {!companyLogo && (
          <IconifyIcon
            icon="material-symbols:account-balance-outline-rounded"
            sx={{ fontSize: 40 }}
          />
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>
            {designation}{' '}
            <Typography component="span" variant="subtitle2" sx={{ fontWeight: 400 }}>
              at
            </Typography>{' '}
            {companyName}
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 400, color: 'text.secondary' }}>
            {location}
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {dayjs(startDate).format('MMM, YYYY')} -{' '}
            {currentlyWorking ? 'Present' : dayjs(endDate).format('MMM, YYYY')}
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

export default Work;
