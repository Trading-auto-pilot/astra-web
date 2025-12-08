import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const SearchCustomer = () => {
  return (
    <Box
      sx={{
        width: 1,
        p: { xs: 3, md: 5 },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Search or create a customer
      </Typography>
      <TextField
        fullWidth
        id="searchCustomer"
        type="search"
        label="Search with name"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="material-symbols:search-rounded" />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
};

export default SearchCustomer;
