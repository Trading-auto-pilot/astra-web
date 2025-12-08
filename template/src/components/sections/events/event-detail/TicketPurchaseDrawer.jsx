import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import useNumberFormat from 'hooks/useNumberFormat';
import { useSnackbar } from 'notistack';
import IconifyIcon from 'components/base/IconifyIcon';
import SimpleBar from 'components/base/SimpleBar';
import EventTicketForm, {
  EventTicketFormSchema,
} from 'components/sections/events/event-detail/EventTicketForm';
import EventPaymentMethod, {
  EventPaymentMethodSchema,
} from 'components/sections/events/event-detail/main/EventPaymentMethod';

const ticketOptions = [
  {
    id: 'VIP',
    price: 300,
    icon: 'material-symbols:star-outline',
    amenities: ['Frontal zone', 'Seating arrangements', 'Water stall'],
  },
  {
    id: 'Regular',
    price: 150,
    icon: 'material-symbols:person-outline',
    amenities: ['Standing arrangements', 'Water stall'],
  },
];

const CombinedEventFormSchema = EventTicketFormSchema.concat(EventPaymentMethodSchema);

const TicketPurchaseDrawer = ({ open, handleClose }) => {
  const { currencyFormat } = useNumberFormat();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    resolver: yupResolver(CombinedEventFormSchema),
    defaultValues: {
      method: 'card',
      cardDetails: {
        cardNumber: '',
        name: '',
        expiryDate: '',
        cvc: '',
      },
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitSuccessful },
  } = methods;

  const onSubmit = (data) => {
    console.log('Event Form Data:', data);
    enqueueSnackbar('Ticket purchased successfully!', {
      variant: 'success',
      autoHideDuration: 3000,
    });
    handleClose();
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={(theme) => ({
        [`& .${drawerClasses.paper}`]: {
          maxWidth: 523,
          width: 1,
          bgcolor: 'background.elevation1',
        },
        zIndex: theme.zIndex.drawer + 1,
      })}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <SimpleBar sx={{ minHeight: 0, flex: 1, height: 1 }}>
            <Box
              sx={{
                pt: 5,
                px: { xs: 3, sm: 5 },
              }}
            >
              <Stack sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Ticket price</Typography>
                <IconButton onClick={handleClose}>
                  <IconifyIcon icon="material-symbols:close" fontSize={20} />
                </IconButton>
              </Stack>

              <Controller
                rules={{ required: true }}
                defaultValue="Regular"
                name="ticketType"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} value={field.value || ''}>
                    <List
                      disablePadding
                      dense
                      sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}
                    >
                      {ticketOptions.map(({ id, icon, price, amenities }) => (
                        <ListItem
                          key={id}
                          sx={{
                            cursor: 'pointer',
                            p: 2,
                            pt: 1,
                            bgcolor:
                              field.value === id ? 'primary.lighter' : 'background.elevation2',
                            borderRadius: 6,
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            gap: 1,
                          }}
                          onClick={() => field.onChange(id)}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <IconifyIcon icon={icon} color="primary.dark" sx={{ fontSize: 24 }} />
                            <ListItemText
                              primary={id}
                              secondary={`( ${currencyFormat(price, { maximumFractionDigits: 0 })} )`}
                              slotProps={{
                                primary: {
                                  fontWeight: 700,
                                  fontSize: '16px !important',
                                  lineHeight: 1.3,
                                },
                                secondary: {
                                  fontSize: 16,
                                  fontWeight: 700,
                                  color: 'text.secondary',
                                  lineHeight: 1.3,
                                },
                              }}
                              sx={{ display: 'flex', gap: 0.5, m: 0 }}
                            />

                            <Radio checked={field.value === id} />
                          </Stack>
                          <List
                            dense
                            component="div"
                            disablePadding
                            sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}
                          >
                            {amenities.map((amenity) => (
                              <ListItem
                                component="div"
                                disablePadding
                                key={amenity}
                                sx={{
                                  pl: 4,
                                  gap: 1,
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 0 }}>
                                  <IconifyIcon
                                    icon="material-symbols:circle"
                                    color="background.elevation3"
                                    fontSize={8}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={amenity}
                                  slotProps={{
                                    primary: {
                                      variant: 'subtitle2',
                                      fontWeight: 400,
                                      color: 'text.secondary',
                                    },
                                  }}
                                  sx={{ m: 0 }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </ListItem>
                      ))}
                    </List>
                  </RadioGroup>
                )}
              />
              <EventTicketForm sx={{ mb: 3 }} />
              <EventPaymentMethod />
            </Box>
          </SimpleBar>

          <Box
            sx={{
              px: { xs: 3, sm: 5 },
              pb: 5,
              pt: 3,
              position: 'sticky',
              bottom: 0,
              bgcolor: 'background.elevation1',
            }}
          >
            <Button type="submit" fullWidth variant="contained" color="primary">
              Buy tickets
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </Drawer>
  );
};

export default TicketPurchaseDrawer;
