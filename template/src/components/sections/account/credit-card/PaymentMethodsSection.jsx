import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack } from '@mui/material';
import { cards } from 'data/account/credit-cards';
import { useSnackbar } from 'notistack';
import { useSettingsContext } from 'providers/SettingsProvider';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import CardFormDialog from './CardFormDialog';
import CreditCard from './CreditCard';

const cardFormSchema = yup.object().shape({
  cardNumber: yup
    .string()
    .matches(/^\d{4} \d{4} \d{4} \d{4}$/, 'Invalid card number')
    .required('Card number is required'),
  cardHolder: yup.string().required('Name is required'),
  expireDate: yup.string().required('Expire date is required'),
  cvc: yup
    .string()
    .matches(/^\d{3,4}$/, 'Invalid CVC')
    .required('CVC is required'),
});
const PaymentMethodsSection = () => {
  const {
    config: { assetsDir },
  } = useSettingsContext();
  const [creditCards, setCreditCards] = useState(cards);
  const [selectedCard, setSelectedCard] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expireDate: '',
      cvc: '',
    },
    resolver: yupResolver(cardFormSchema),
  });
  const { reset } = methods;

  useEffect(() => {
    if (selectedCard) {
      reset(selectedCard);
    } else {
      reset({
        cardNumber: '',
        cardHolder: '',
        expireDate: '',
        cvc: '',
      });
    }
  }, [selectedCard, reset]);

  const handleOpenDialog = (card) => {
    setSelectedCard(card);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setSelectedCard(null);
    setDialogOpen(false);
  };

  const handleFormSubmit = (data) => {
    console.log({ data });
    if (selectedCard) {
      setCreditCards((prev) =>
        prev.map((card) => (card.id === selectedCard.id ? { ...card, ...data } : card)),
      );
      enqueueSnackbar('Payment method updated successfully!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
    } else {
      setCreditCards((prev) => [
        ...prev,
        {
          ...data,
          id: creditCards.length + 1,
          cardName: 'MasterCard',
          subscriptions: 0,
          icon: `${assetsDir}/images/logo/8.svg`,
        },
      ]);
      enqueueSnackbar('Payment method added successfully!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
    }
    handleCloseDialog();
  };

  return (
    <>
      <Stack direction="column" spacing={1} mb={3}>
        {creditCards.map((card) => (
          <CreditCard key={card.id} card={card} handleOpenDialog={handleOpenDialog} />
        ))}
      </Stack>
      <Button
        variant="soft"
        color="neutral"
        fullWidth
        startIcon={<IconifyIcon icon="material-symbols:add" sx={{ fontSize: 20 }} />}
        onClick={() => handleOpenDialog(null)}
      >
        Add new payment method
      </Button>
      <FormProvider {...methods}>
        <CardFormDialog
          open={dialogOpen}
          card={selectedCard || null}
          handleDialogClose={handleCloseDialog}
          onSubmit={handleFormSubmit}
        />
      </FormProvider>
    </>
  );
};

export default PaymentMethodsSection;
