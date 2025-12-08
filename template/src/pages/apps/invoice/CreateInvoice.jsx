import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import paths from 'routes/paths';
import CreateInvoiceContainer from 'components/sections/Invoice/create-invoice/Index';
import { useCreateInvoiceForm } from 'components/sections/Invoice/create-invoice/useCreateInvoiceForm';
import PageBreadcrumb from 'components/sections/common/PageBreadcrumb';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { methods } = useCreateInvoiceForm();

  const { handleSubmit, reset } = methods;

  const onSubmit = (data) => {
    console.log(data);
    navigate(paths.invoicePreview);
    reset();
  };

  return (
    <>
      <Paper sx={{ px: 5, py: 3, flex: 1 }}>
        <Box>
          <PageBreadcrumb
            items={[
              { label: 'Home', url: '/' },
              { label: 'Invoice', url: paths.createInvoice },
              { label: 'New Invoice', active: true },
            ]}
            sx={{
              mb: 2,
            }}
          />
          <Typography variant="h4">Create invoice</Typography>
        </Box>
      </Paper>
      <FormProvider {...methods}>
        <Stack
          component="form"
          id="createInvoiceFrom"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ py: { xs: 3, md: 5 } }}
        >
          <Container maxWidth={false} sx={{ maxWidth: 900 }}>
            <CreateInvoiceContainer />
          </Container>
        </Stack>
      </FormProvider>
    </>
  );
};

export default CreateInvoice;
