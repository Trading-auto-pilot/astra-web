import { Paper, Stack } from '@mui/material';
import InvoiceFooter from './InvoiceFooter';
import InvoiceHead from './InvoiceHead';
import InvoiceItemsTable from './InvoiceItemsTable';
import InvoiceOrderDetails from './InvoiceOrderDetails';

const InvoiceContainer = ({ invoice }) => {
  return (
    <Paper
      background={1}
      sx={{
        height: 1,
        p: { xs: 3, md: 5 },
        borderRadius: 6,
        outline: 'none',
      }}
    >
      <Stack
        direction="column"
        sx={{
          gap: 4,
        }}
      >
        <InvoiceHead />
        <InvoiceOrderDetails invoice={invoice} />
        <InvoiceItemsTable invoice={invoice} />
        <InvoiceFooter />
      </Stack>
    </Paper>
  );
};

export default InvoiceContainer;
