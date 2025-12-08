import { useFormContext } from 'react-hook-form';
import { Box, Button, Stack, TextField } from '@mui/material';

const InvoiceFooter = () => {
  const { register } = useFormContext();

  return (
    <>
      <Box sx={{ my: 4 }}>
        <TextField multiline rows={2} label="Note to recipient" {...register('note')} fullWidth />
      </Box>
      <Stack sx={{ justifyContent: 'end', alignItems: 'center', gap: 1 }}>
        <Button variant="soft" color="neutral">
          Save as draft
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Create & preview
        </Button>
      </Stack>
    </>
  );
};

export default InvoiceFooter;
