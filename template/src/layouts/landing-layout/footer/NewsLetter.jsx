import { Button, Stack, Typography } from '@mui/material';
import StyledTextField from 'components/styled/StyledTextField';

const NewsLetter = () => {
  return (
    <div>
      <Typography variant="overline" component="p" fontWeight={700} color="textDisabled" mb={2}>
        Newsletter
      </Typography>

      <Stack gap={1} width={1}>
        <StyledTextField placeholder="Email" fullWidth sx={{ flexGrow: 1 }} />
        <Button variant="soft" color="neutral" sx={{ minWidth: 110 }}>
          Subscribe
        </Button>
      </Stack>
    </div>
  );
};

export default NewsLetter;
