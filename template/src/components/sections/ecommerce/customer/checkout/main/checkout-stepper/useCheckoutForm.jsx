import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { customerInfoFormSchema } from './steps/CustomerInfo';
import { deliveryOptionFormSchema } from './steps/DeliveryOptions';
import { shippingAddressFormSchema } from './steps/ShippingAddress';

const checkoutFormSchema = [
  customerInfoFormSchema,
  shippingAddressFormSchema,
  deliveryOptionFormSchema,
  null,
];

const useCheckoutForm = (activeStep) => {
  const methods = useForm({
    //@ts-ignore
    resolver: checkoutFormSchema[activeStep]
      ? //@ts-ignore
        yupResolver(checkoutFormSchema[activeStep])
      : undefined,
    defaultValues: {
      customer: {
        email: 'anyname@email.com',
        firstName: 'Captain',
        lastName: 'Haddock',
        phoneNumber: '+12514463453',
      },
      shippingAddress: {
        street: 'Apt: 6/B, 192 Edsel Road',
        townCity: 'Van Nuys',
        postcode: '96580',
        country: 'USA',
        state: 'California',
      },
    },
  });

  return methods;
};

export default useCheckoutForm;
