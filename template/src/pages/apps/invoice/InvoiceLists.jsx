import { Button, Paper, Stack } from '@mui/material';
import paths from 'routes/paths';
import InvoiceListContainer from 'components/sections/Invoice/invoice-list/Index';
import PageHeader from 'components/sections/ecommerce/admin/common/PageHeader';

const InvoiceLists = () => {
  return (
    <Stack direction="column" height={1}>
      <PageHeader
        title="Invoice list"
        breadcrumb={[
          { label: 'Home', url: '/' },
          { label: 'Invoice', url: paths.invoiceList },
          { label: 'Invoice List', active: true },
        ]}
        actionComponent={
          <Stack gap={1}>
            <Button variant="soft" color="neutral">
              Export
            </Button>
            <Button variant="soft" color="neutral">
              Import
            </Button>
            <Button variant="contained" color="primary">
              Create Invoice
            </Button>
          </Stack>
        }
      />
      <Paper sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
        <InvoiceListContainer />
      </Paper>
    </Stack>
  );
};

export default InvoiceLists;
