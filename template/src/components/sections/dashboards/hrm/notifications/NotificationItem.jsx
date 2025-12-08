import { listItemSecondaryActionClasses } from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import CardHeaderAction from 'components/common/CardHeaderAction';
import DashboardMenu from 'components/common/DashboardMenu';

const getIconStyle = (type) => {
  switch (type) {
    case 'request':
      return {
        color: 'primary.dark',
        bgColor: 'primary.lighter',
        icon: 'material-symbols:group-outline',
      };
    case 'signature':
      return {
        color: 'success.dark',
        bgColor: 'success.lighter',
        icon: 'material-symbols:draw-outline',
      };
    case 'application':
      return {
        color: 'primary.dark',
        bgColor: 'primary.lighter',
        icon: 'material-symbols:chevron-left-rounded',
      };
    case 'task':
      return {
        color: 'primary.dark',
        bgColor: 'primary.lighter',
        icon: 'material-symbols:chevron-left-rounded',
      };
    default:
      return {
        color: 'primary.dark',
        bgColor: 'primary.lighter',
        icon: 'material-symbols:reviews-outline-rounded',
      };
  }
};

const getChipColor = (status) => {
  switch (status) {
    case 'Due':
      return 'warning';
    case 'Past Due':
      return 'error';
    default:
      return 'neutral';
  }
};

const NotificationItem = ({ item }) => {
  const icon = getIconStyle(item.type);

  return (
    <ListItem
      sx={{
        p: 1,
        mb: 1,
        gap: 2,
        borderRadius: 4,
        alignItems: 'flex-start',
        bgcolor: 'background.elevation1',
        [`& .${listItemSecondaryActionClasses.root}`]: {
          ml: 'auto',
          top: 0,
          right: 0,
          position: 'relative',
          transform: 'unset',
        },
      }}
      secondaryAction={<DashboardMenu />}
    >
      <ListItemIcon
        sx={{
          width: 48,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: icon.bgColor,
          borderRadius: 2,
          flexShrink: 0,
        }}
      >
        <IconifyIcon icon={icon.icon} sx={{ color: icon.color, fontSize: 24 }} />
      </ListItemIcon>

      <div>
        <Stack sx={{ gap: 0.5, mb: 0.5, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {item.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {item.subtitle}
          </Typography>
          {item.type === 'application' && (
            <Typography
              variant="body2"
              component={Link}
              href={item.applicationLink}
              sx={{ fontWeight: 500 }}
            >
              See applicatoin
            </Typography>
          )}
        </Stack>

        {item.timeframe && (
          <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'text.secondary' }}>
            {item.timeframe}
          </Typography>
        )}

        {item.status && (
          <Chip color={getChipColor(item.status)} label={item.status} sx={{ mb: 0.5 }} />
        )}

        {item.type === 'application' && (
          <CardHeaderAction>
            <Button size="small">Accept</Button>
            <Button size="small" color="error">
              Reject
            </Button>
          </CardHeaderAction>
        )}
      </div>
    </ListItem>
  );
};

export default NotificationItem;
