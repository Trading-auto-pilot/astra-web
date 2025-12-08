import { useState } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import RealtimeEngagementChart from './RealtimeEngagementChart';

const EngagementPreview = () => {
  const [userCounter, setUserCounter] = useState(549);

  const updateUserCounter = (value) => {
    setUserCounter((prev) => prev - prev / 60 + value);
  };

  return (
    <Box
      sx={{
        px: { xs: 3, md: 0 },
        width: 1,
        position: 'absolute',
        bottom: { xs: 24, md: 40 },
        right: { xs: 0, md: 40 },
        maxWidth: { xs: 1, md: 404 },
      }}
    >
      <Paper
        component={Stack}
        variant="elevation"
        elevation={6}
        sx={{
          py: 5,
          px: 4,
          borderRadius: 6,
          flexDirection: 'column',
          gap: { xs: 3, md: 5 },
        }}
      >
        <div>
          <Typography variant="h6" mb={1}>
            User in Last Hour
          </Typography>

          <Typography variant="h2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {Math.round(userCounter)}
          </Typography>
        </div>

        <div>
          <Typography variant="h6" mb={3}>
            User Per Minute
          </Typography>

          <RealtimeEngagementChart
            updateUserCounter={updateUserCounter}
            sx={{ height: '80px !important', width: 1 }}
          />
        </div>
      </Paper>
    </Box>
  );
};

export default EngagementPreview;
