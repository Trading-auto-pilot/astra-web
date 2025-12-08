import { Button, Paper, Stack } from '@mui/material';
import paths from 'routes/paths';
import PageHeader from 'components/sections/ecommerce/admin/common/PageHeader';
import InvoiceListContainer from 'components/sections/ecommerce/admin/invoice-list';

const InvoiceList = () => {
  return (
    <Stack direction="column" height={1}>
      <PageHeader
        title="Invoice list"
        breadcrumb={[
          { label: 'Home', url: paths.ecommerceHomepage },
          { label: 'Invoice list', active: true },
        ]}
        actionComponent={
          <Stack gap={1}>
            <Button variant="soft" color="neutral">
              Export
            </Button>
            <Button variant="soft" color="neutral">
              Import
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

export default InvoiceList;
