import { Box } from '@mui/material';

const ThreadConnector = ({ offsetLeft = 16, elbow = false, sx }) => (
  <Box
    sx={{
      position: 'absolute',
      left: offsetLeft,
      ...(elbow
        ? {
            top: -8,
            height: 32,
            width: 24,
            zIndex: 10,
            borderInlineStart: '1px solid',
            borderBottom: '1px solid',
            borderColor: 'divider',
            borderEndStartRadius: '20px',
          }
        : {
            width: '1px',
            height: 1,
            bgcolor: 'divider',
          }),
      ...sx,
    }}
  />
);

export default ThreadConnector;
