import { Button, Container, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { defaultInvoice } from 'data/e-commerce/orders';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import PageHeader from 'components/sections/ecommerce/admin/common/PageHeader';
import InvoiceContainer from 'components/sections/ecommerce/admin/invoice';

const Invoice = () => {
  return (
    <Grid container>
      <Grid size={12}>
        <PageHeader
          title="Invoice details"
          breadcrumb={[
            { label: 'Invoice list', url: paths.adminInvoiceList },
            { label: 'Invoice', active: true },
          ]}
          actionComponent={
            <Stack
              sx={{
                gap: 1,
              }}
            >
              <Button
                variant="soft"
                color="neutral"
                sx={{ whiteSpace: 'nowrap' }}
                startIcon={<IconifyIcon icon="mdi:edit-outline" fontSize="20px !important" />}
              >
                Edit invoice
              </Button>
              <Button
                variant="soft"
                color="neutral"
                sx={{ whiteSpace: 'nowrap' }}
                startIcon={
                  <IconifyIcon
                    icon="material-symbols:download-rounded"
                    fontSize="20px !important"
                  />
                }
              >
                Download
              </Button>
              <Button
                variant="soft"
                color="neutral"
                sx={{ whiteSpace: 'nowrap' }}
                startIcon={
                  <IconifyIcon
                    icon="material-symbols:print-outline-rounded"
                    fontSize="20px !important"
                  />
                }
              >
                Print
              </Button>
            </Stack>
          }
        />
      </Grid>
      <Grid size={12} sx={{ overflowX: 'scroll' }}>
        <Container maxWidth={false} sx={{ width: 1340, px: { xs: 3, md: 5 }, py: 5 }}>
          <InvoiceContainer invoice={defaultInvoice} />
        </Container>
      </Grid>
    </Grid>
  );
};

export default Invoice;
