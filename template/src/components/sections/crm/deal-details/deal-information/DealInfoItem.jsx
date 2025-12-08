import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const DealInfoItem = ({ attribute, value, background = false }) => {
  return (
    <Stack
      direction="column"
      gap={1}
      sx={[
        { p: 2, borderRadius: 1, alignItems: 'flex-start' },
        background && { bgcolor: 'background.elevation1' },
      ]}
    >
      <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
        {attribute}:
      </Typography>
      {value}
    </Stack>
  );
};

export default DealInfoItem;
