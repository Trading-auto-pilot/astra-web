import { Box, Stack, Tooltip, Typography } from '@mui/material';

const segmentColors = {
  Photos: 'info.main',
  Videos: 'primary.main',
  Document: 'warning.main',
  Email: 'success.main',
  Chats: 'error.main',
  Others: 'chGrey.300',
};

const StorageBar = ({ data, totalStorage = 20 }) => {
  const usedStorage = Number(data.reduce((acc, curr) => acc + curr.size, 0).toFixed(2));
  const percentUsed = Math.round((usedStorage / totalStorage) * 100);

  let cumulativePercent = 0;
  const segments = data.map((segment) => {
    const segmentPercent = (segment.size / totalStorage) * 100;
    const start = cumulativePercent;
    cumulativePercent += segmentPercent + 1;

    return {
      ...segment,
      percent: segmentPercent,
      start,
    };
  });

  return (
    <Stack direction="column" gap={1}>
      <Typography variant="subtitle2" fontWeight={600}>
        {percentUsed}% Full
      </Typography>

      <Stack
        sx={{
          position: 'relative',
          height: 8,
          width: '100%',
          borderRadius: 4,
          bgcolor: 'background.elevation2',
          overflow: 'hidden',
        }}
      >
        {segments.map((segment, index) => (
          <Tooltip key={index} title={`${segment.title}: ${segment.percent.toFixed(2)}%`}>
            <Box
              sx={{
                position: 'absolute',
                left: `${segment.start}%`,
                width: `${segment.percent}%`,
                height: '100%',
                bgcolor: segmentColors[segment.title],
                transition: 'width 0.4s ease-in-out',
              }}
            />
          </Tooltip>
        ))}
      </Stack>

      <Typography variant="caption" fontWeight={500} color="text.secondary">
        Used: {usedStorage} GB of {totalStorage} GB
      </Typography>
    </Stack>
  );
};

export default StorageBar;
