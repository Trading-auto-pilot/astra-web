import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

const NewJoiner = ({ hire }) => {
  return (
    <ListItem disableGutters sx={{ gap: 1 }}>
      <ListItemAvatar sx={{ minWidth: 0 }}>
        <Avatar src={hire.avatar} sx={{ width: 32, height: 32 }} />
      </ListItemAvatar>

      <ListItemText
        disableTypography
        sx={{ m: 0 }}
        primary={
          <Typography variant="body2" fontWeight={600} lineHeight={1.6}>
            {hire.name}
          </Typography>
        }
        secondary={
          <Stack gap={1}>
            <Typography variant="caption" color="text.secondary" fontWeight={500} lineHeight={1.5}>
              {hire.designation}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500} lineHeight={1.5}>
              {hire.location}
            </Typography>
          </Stack>
        }
      />

      <Typography variant="caption" fontWeight={600} color="text.primary">
        {dayjs(hire.joiningDate).format('DD MMM, YYYY')}
      </Typography>
    </ListItem>
  );
};

export default NewJoiner;
