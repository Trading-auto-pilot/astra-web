import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'providers/SettingsProvider';
import RealtimeActivityChart from './RealtimeActivityChart';

const Profile = ({ user, role }) => {
  const {
    config: { assetsDir },
  } = useSettingsContext();

  return (
    <Paper
      component={Stack}
      direction={{ xs: 'column', sm: 'row', md: 'column', xl: 'row' }}
      sx={{
        p: { xs: 3, md: 5 },
        gap: 5,
        height: 1,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundImage: `linear-gradient(45deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${assetsDir}/images/hrm/1.webp')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <Stack
        direction={{ xs: 'row', lg: 'column', xl: 'row' }}
        sx={{ gap: 3, alignItems: { xs: 'center', lg: 'flex-start', xl: 'center' }, flexShrink: 0 }}
      >
        <Avatar alt={user.name} src={user.avatar} sx={{ height: 72, width: 72 }} />
        <div>
          <Typography
            variant="h5"
            sx={{ mb: 1, color: 'common.white', fontSize: { lg: 'h4.fontSize' } }}
          >
            {user.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
            {role}
          </Typography>
        </div>
      </Stack>

      <RealtimeActivityChart sx={{ height: '75px !important', width: 1 }} />
    </Paper>
  );
};

export default Profile;
