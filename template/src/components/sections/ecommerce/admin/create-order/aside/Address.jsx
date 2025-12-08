import { Button, Checkbox, FormControlLabel, Stack, TextField, Typography } from '@mui/material';

const Address = () => {
  return (
    <Stack
      direction="column"
      spacing={5}
      sx={{
        p: { xs: 3, md: 5 },
      }}
    >
      <div>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          1 Shipping address
        </Typography>
        <Stack direction="column" spacing={2}>
          <Stack direction="column" spacing={1}>
            <TextField fullWidth id="streetAddress" type="text" label="Street address" />
            <TextField fullWidth id="townCity" type="text" label="Town/City" />
          </Stack>
          <Stack direction="column" spacing={1}>
            <TextField fullWidth id="postCode" type="text" label="Postcode" />
            <TextField fullWidth id="country" type="text" label="Country" />
            <TextField fullWidth id="state" type="text" label="State" />
          </Stack>
        </Stack>
      </div>
      <div>
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
            }}
          >
            1 Billing address
          </Typography>

          <Button variant="text" size="small" sx={{ flexShrink: 0, minWidth: 0 }}>
            Edit
          </Button>
        </Stack>
        <FormControlLabel control={<Checkbox />} label="Same as shipping address" />
      </div>
    </Stack>
  );
};

export default Address;
