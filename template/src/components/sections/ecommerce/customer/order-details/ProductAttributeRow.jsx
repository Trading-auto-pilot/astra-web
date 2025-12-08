import { Box, Stack, Typography } from '@mui/material';

const ProductAttributeRow = ({ label, value }) => {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{
        gap: 0.5,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.elevation2',
          p: 2,
          width: { sm: 176 },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
          }}
        >
          {label}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          bgcolor: 'background.elevation1',
          p: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textTransform: 'capitalize',
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
};

export default ProductAttributeRow;
