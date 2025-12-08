import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const ContactInfo = ({ attribute, value }) => {
  return (
    <Paper sx={{ pt: 1.5, pb: 1, px: { xs: 3, md: 5 }, height: 1, width: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
        {attribute}
      </Typography>
      {value}
    </Paper>
  );
};

export default ContactInfo;
