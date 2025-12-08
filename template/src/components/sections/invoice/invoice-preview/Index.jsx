import { Container, Paper } from '@mui/material';
import SimpleBar from 'components/base/SimpleBar';
import InvoiceHistory from './InvoiceHistory';
import InvoiceTable from './InvoiceTable';

const InvoicePreviewContainer = ({ invoiceData }) => {
  return (
    <>
      <SimpleBar sx={{ mb: 4, width: 1 }}>
        <Container maxWidth={false} sx={{ width: 960 }} disableGutters>
          <Paper
            variant="elevation"
            elevation={0}
            sx={{ p: { xs: 3, md: 5 }, border: 1, borderColor: 'divider' }}
          >
            <InvoiceTable invoice={invoiceData} />
          </Paper>
        </Container>
      </SimpleBar>
      <Paper
        variant="elevation"
        elevation={0}
        sx={{ p: { xs: 3, md: 5 }, border: 1, borderColor: 'divider', maxWidth: 960, mx: 'auto' }}
      >
        <InvoiceHistory />
      </Paper>
    </>
  );
};

export default InvoicePreviewContainer;
