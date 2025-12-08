import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import Deals from './Deals';

const Account = ({ accountData }) => {
  return (
    <Paper component={Stack} direction="column" sx={{ p: { xs: 3, md: 5 }, gap: 3, height: 1 }}>
      <Typography variant="h5">Account</Typography>
      <Stack direction="column" gap={3}>
        <Stack direction="column" gap={2}>
          <Stack gap={1.5}>
            <Image src={accountData.logo} width={44} height={44} />
            <Stack direction="column" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {accountData.name}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                since {dayjs(accountData.dateCreated).format('YYYY')}
              </Typography>
            </Stack>
          </Stack>
          <Stack gap={1}>
            {accountData.tags.map((tag) => (
              <Chip key={tag} label={tag} variant="soft" />
            ))}
          </Stack>
        </Stack>
        <Stack gap={1}>
          {accountData.contactIcons.map((icon) => (
            <Button
              href={
                icon === 'material-symbols:mail-outline'
                  ? 'mailto:?'
                  : icon === 'material-symbols:call-outline'
                    ? 'tel:?'
                    : '#!'
              }
              key={icon}
              shape="square"
              variant="soft"
              size="large"
              color="neutral"
            >
              <IconifyIcon icon={icon} sx={{ fontSize: 24 }} />
            </Button>
          ))}
        </Stack>
      </Stack>
      <Deals deals={accountData.ongoingDeals} />
      <Deals deals={accountData.pastDeals} />
    </Paper>
  );
};

export default Account;
