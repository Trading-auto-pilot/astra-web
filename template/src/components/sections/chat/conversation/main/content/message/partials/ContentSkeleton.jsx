import { Skeleton, Stack } from '@mui/material';

const MessageSkeleton = ({ width, height = 54, alignRight = false }) => (
  <Skeleton
    variant="rounded"
    width={width}
    height={height}
    sx={{
      flexShrink: 0,
      borderRadius: (theme) => theme.spacing(alignRight ? 2 : 0, alignRight ? 0 : 2, 2, 2),
      alignSelf: alignRight ? 'flex-end' : 'flex-start',
    }}
  />
);

const ContentSkeleton = () => (
  <Stack direction="column" gap={0.5} sx={{ height: 1, width: 1, px: { xs: 3, md: 5 } }}>
    <MessageSkeleton width={280} />
    <MessageSkeleton width={210} alignRight />
    <MessageSkeleton width={300} alignRight />
    <MessageSkeleton width={290} />
    <MessageSkeleton width={260} height={120} />
    <MessageSkeleton width={290} alignRight />
    <MessageSkeleton width={180} alignRight />
  </Stack>
);

export default ContentSkeleton;
