import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const ActionBtns = () => {
  return (
    <Stack justifyContent="space-between" gap={2} sx={{ mt: 'auto' }}>
      <Button color="neutral">Cancel</Button>
      <Stack gap={1}>
        <Button variant="soft" color="neutral">
          Save
        </Button>
        <Button type="submit" variant="contained">
          Submit Now
        </Button>
      </Stack>
    </Stack>
  );
};

export default ActionBtns;
