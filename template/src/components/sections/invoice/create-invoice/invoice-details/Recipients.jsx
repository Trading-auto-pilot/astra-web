import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormHelperText, Grid, Paper } from '@mui/material';
import clsx from 'clsx';
import RecipientCard from './RecipientCard';
import RecipientsFormDialogue from './RecipientsFormdialogue';

const Recipients = () => {
  const {
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const [invoiceFromOpen, setInvoiceFromOpen] = useState(false);
  const [invoiceToOpen, setInvoiceToOpen] = useState(false);

  const invoiceForm = watch('invoiceFrom');
  const invoiceTo = watch('invoiceTo');
  const invoiceFormSubmitHandler = (data) => {
    setValue('invoiceFrom.name', data.name);
    setValue('invoiceFrom.phone', data.phone);
    setValue('invoiceFrom.email', data.email);
    setValue('invoiceFrom.address', data.location);

    clearErrors('invoiceFrom');
  };
  const invoiceToSubmitHandler = (data) => {
    setValue('invoiceTo.name', data.name);
    setValue('invoiceTo.email', data.email);
    setValue('invoiceTo.phone', data.phone);
    setValue('invoiceTo.address', data.location);
    clearErrors('invoiceTo');
  };

  const hasInvoiceFromError = !!errors.invoiceFrom;
  const hasInvoiceToError = !!errors.invoiceTo;

  return (
    <>
      <Paper
        variant="elevation"
        elevation={0}
        background={1}
        className={clsx({
          'Mui-error': hasInvoiceFromError || hasInvoiceToError,
        })}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          outline: 0,
          '&.MuiPaper-root.Mui-error': {
            bgcolor: 'error.lighter',
          },
        }}
      >
        <Grid container spacing={{ xs: 3, md: 5, lg: 10 }} sx={{ justifyContent: 'space-between' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <RecipientCard title="Invoice From" data={invoiceForm} setOpen={setInvoiceFromOpen} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <RecipientCard title="Invoice To" data={invoiceTo} setOpen={setInvoiceToOpen} />
          </Grid>
        </Grid>
      </Paper>
      {hasInvoiceFromError && (
        <FormHelperText error sx={{ mx: '14px' }}>
          Invoice sender information is required.
        </FormHelperText>
      )}
      {hasInvoiceToError && (
        <FormHelperText error sx={{ mx: '14px' }}>
          Invoice recipient information is required.
        </FormHelperText>
      )}
      <RecipientsFormDialogue
        open={invoiceFromOpen}
        title="Select Admin"
        handleDialogClose={() => setInvoiceFromOpen(false)}
        onSubmit={invoiceFormSubmitHandler}
        subtitle="Select a admin to continue with the process."
        mode="admin"
      ></RecipientsFormDialogue>
      <RecipientsFormDialogue
        open={invoiceToOpen}
        title="Select Customer"
        handleDialogClose={() => setInvoiceToOpen(false)}
        subtitle="Select a customer to continue with the process."
        onSubmit={invoiceToSubmitHandler}
        mode="customer"
      ></RecipientsFormDialogue>
    </>
  );
};

export default Recipients;
