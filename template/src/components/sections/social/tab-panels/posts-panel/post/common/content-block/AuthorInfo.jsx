import { Link } from '@mui/material';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';

dayjs.extend(calendar);

const AuthorInfo = ({ author, createdAt }) => {
  return (
    <div>
      <Typography
        component={Link}
        href="#!"
        variant="subtitle2"
        sx={{
          display: 'block',
          color: 'text.primary',
          width: 'max-content',
          fontWeight: 700,
          mb: 0.5,
        }}
      >
        {author}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {dayjs(createdAt).calendar(null, {
          sameDay: '[Today at] h:mm a',
          nextDay: '[Tomorrow at] h:mm a',
          nextWeek: 'dddd [at] h:mm a',
          lastDay: '[Yesterday at] h:mm a',
          lastWeek: '[Last] dddd [at] h:mm a',
          sameElse: 'MMM DD, YYYY [at] h:mm a',
        })}
      </Typography>
    </div>
  );
};

export default AuthorInfo;
