import { Typography } from '@mui/material';

const InvoiceFooter = () => {
  return (
    <div>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mb: 2,
        }}
      >
        If you have any questions concerning this invoice, contact customer service{' '}
        <strong>+1 242-352-234</strong> or send an email at{' '}
        <strong>customerservice@example.com</strong>
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
        }}
      >
        Thank you for your business
      </Typography>
    </div>
  );
};

export default InvoiceFooter;
