import { Box, Typography } from '@mui/material';

const TextMessage = ({ messageType, children }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="body2"
        sx={{
          color: messageType === 'sent' ? 'primary.contrastText' : 'text.secondary',
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

export default TextMessage;
