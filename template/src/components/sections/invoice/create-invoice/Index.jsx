import { Box, Stack, Typography } from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import InvoiceImageDropzone from './InvoiceImageDropzone';
import InvoiceDetailsForm from './invoice-details/InvoiceDetailsForm';
import Recipients from './invoice-details/Recipients';
import InvoiceFooter from './items-details/InvoiceFooter';
import ItemDetailsTableForm from './items-details/ItemDetailsForm';

const CreateInvoiceContainer = () => {
  const { currencyFormat } = useNumberFormat();

  return (
    <div>
      <Stack
        sx={{
          gap: 2,
          flexGrow: 1,
          justifyContent: { sm: 'space-between' },
          alignItems: { sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          mb: 4,
        }}
      >
        <Box
          sx={{
            textAlign: { sm: 'end' },
            order: { sm: 1 },
          }}
        >
          <Typography variant="subtitle2">Amount</Typography>
          <Typography variant="h4">{currencyFormat(1827.9)}</Typography>
        </Box>
        <InvoiceImageDropzone />
      </Stack>
      <Recipients />
      <InvoiceDetailsForm />
      <ItemDetailsTableForm />
      <InvoiceFooter />
    </div>
  );
};

export default CreateInvoiceContainer;
