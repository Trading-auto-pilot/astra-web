import Paper from '@mui/material/Paper';
import Activities from './activities/Activities';
import ScreencastsHeader from './header/ScreencastsHeader';

const Screencasts = ({ screencasts }) => {
  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, height: 1 }}>
      <ScreencastsHeader />
      {screencasts.map((screencast, index) => (
        <Activities
          key={screencast.id}
          screencast={screencast}
          isLast={screencasts.length - 1 === index}
        />
      ))}
    </Paper>
  );
};

export default Screencasts;
