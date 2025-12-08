import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import paths from 'routes/paths';

const ActionBtns = () => {
  return (
    <Stack justifyContent="space-between" gap={2}>
      <Button color="neutral">Cancel</Button>
      <Stack gap={1}>
        <Button variant="soft" color="neutral">
          Save
        </Button>
        <Button href={paths.hiringJobApplication} variant="contained">
          Apply Now
        </Button>
      </Stack>
    </Stack>
  );
};

export default ActionBtns;
