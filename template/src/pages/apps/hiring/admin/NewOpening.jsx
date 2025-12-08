import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import NewOpeningStepper from 'components/sections/hiring/admin/new-opening/NewOpeningStepper';

const NewOpening = () => {
  return (
    <Paper sx={{ height: 1, p: { xs: 3, md: 5 } }}>
      <Container maxWidth="sm" disableGutters>
        <Typography variant="h4" mb={3}>
          New Opening
        </Typography>
        <NewOpeningStepper />
      </Container>
    </Paper>
  );
};

export default NewOpening;
