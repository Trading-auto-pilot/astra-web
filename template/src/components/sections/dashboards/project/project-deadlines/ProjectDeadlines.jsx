import { useEffect, useRef } from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { getPercentage } from 'lib/utils';
import SectionHeader from 'components/common/SectionHeader';
import DeadlineChart from 'components/sections/dashboards/project/project-deadlines/DeadlineChart';

export const getCompletionColor = (completed) => {
  switch (completed) {
    case 'before':
      return 'success.main';
    case 'after':
      return 'warning.main';
    case 'on':
      return 'primary.main';
    default:
      return 'text.secondary';
  }
};

const ProjectDeadlines = ({ deadlineMetrics }) => {
  const scrollableContainerRef = useRef(null);

  useEffect(() => {
    const scrollableContainer = scrollableContainerRef.current;
    if (scrollableContainer) {
      scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
    }
  }, [deadlineMetrics]);

  return (
    <Paper
      background={1}
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        py: { xs: 3, md: 5 },
        px: { xs: 3, md: 4 },
      }}
    >
      <SectionHeader
        title="Project deadlines"
        subTitle="Status of completion for all tasks"
        sx={{ mb: 0 }}
      />
      <DeadlineChart
        data={deadlineMetrics}
        sx={{ width: 1, flexShrink: 0, height: { md: '229px !important' } }}
      />
      <Box
        ref={scrollableContainerRef}
        sx={{
          flexGrow: 1,
          flexBasis: { lg: 0 },
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <Stack spacing={1} direction="column">
          {deadlineMetrics.map((metricData) => {
            const { prevCompleteCount, count, completed } = metricData;
            const percentageIncrement = getPercentage(count - prevCompleteCount, prevCompleteCount);

            return (
              <Box
                key={metricData.id}
                sx={{
                  p: 3,
                  display: 'flex',
                  gap: 2,
                  bgcolor: 'background.elevation2',
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    backgroundColor: getCompletionColor(completed),
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.25 }}>
                    Complete {completed} deadline: {count}
                  </Typography>
                  {prevCompleteCount === 0 ? (
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 400 }}>
                      No previous data available
                    </Typography>
                  ) : (
                    <Stack spacing={0.5} alignItems="center" flexWrap="wrap">
                      <Chip
                        label={`${percentageIncrement > 0 ? '+' : ''}${percentageIncrement}%`}
                        color={percentageIncrement > 0 ? 'success' : 'warning'}
                      />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ fontWeight: 400 }}
                      >
                        than previous {prevCompleteCount} projects
                      </Typography>
                    </Stack>
                  )}
                </div>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Paper>
  );
};
export default ProjectDeadlines;
