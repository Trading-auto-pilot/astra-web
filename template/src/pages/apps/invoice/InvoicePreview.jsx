import { useParams } from 'react-router';
import { Button, Paper, Stack } from '@mui/material';
import { invoiceData } from 'data/invoice';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import InvoicePreviewContainer from 'components/sections/Invoice/invoice-preview/Index';
import PageHeader from 'components/sections/ecommerce/admin/common/PageHeader';

const InvoicePreview = () => {
  const { id } = useParams();

  return (
    <>
      <Stack direction="column">
        <PageHeader
          title={`Invoice #${id || invoiceData.invoiceDetails.invoiceNumber}`}
          breadcrumb={[
            { label: 'Home', url: '/' },
            { label: 'Invoice', url: paths.createInvoice },
            { label: 'Invoice preview', active: true },
          ]}
          actionComponent={
            <Stack sx={{ flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 } }}>
              <Button variant="contained" color="primary">
                Send invoice
              </Button>
              <Button variant="soft" shape="square" color="neutral">
                <IconifyIcon icon="mdi:edit-outline" sx={{ fontSize: 20 }} />
              </Button>
              <Button variant="soft" shape="square" color="neutral">
                <IconifyIcon icon="mdi:visibility-outline" sx={{ fontSize: 20 }} />
              </Button>
              <Button variant="soft" shape="square" color="neutral">
                <IconifyIcon icon="mdi:tray-download" sx={{ fontSize: 20 }} />
              </Button>
              <Button variant="soft" shape="square" color="neutral">
                <IconifyIcon icon="mdi:printer-outline" sx={{ fontSize: 20 }} />
              </Button>
              <Button variant="soft" shape="square" color="neutral">
                <IconifyIcon icon="mdi:share-variant-outline" sx={{ fontSize: 20 }} />
              </Button>
            </Stack>
          }
          sx={{
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'flex-end' },
          }}
        />
        <Paper
          variant="elevation"
          elevation={0}
          background={1}
          sx={{ width: 1, p: { xs: 3, lg: 5 }, mt: '1px', borderRadius: 0 }}
        >
          <InvoicePreviewContainer invoiceData={invoiceData} />
        </Paper>
      </Stack>
    </>
  );
};

export default InvoicePreview;
