import { initialConfig } from 'config';

const image = (index) => `${initialConfig.assetsDir}/images/logo/${index}.svg`;

export const cards = [
  {
    id: 1,
    cardName: 'MasterCard',
    cardNumber: '2412 5629 8734 8899',
    cardHolder: 'John Doe',
    expireDate: '2021-10-01',
    subscriptions: 3,
    icon: image(8),
    cvc: '123',
  },
  {
    id: 2,
    cardName: 'Visa',
    cardNumber: '2412 5629 8734 8899',
    cardHolder: 'John Doe',
    expireDate: '2021-11-01',
    subscriptions: 2,
    icon: image(10),
    cvc: '123',
  },
  {
    id: 3,
    cardName: 'Amex',
    cardNumber: '2412 5629 8734 8899',
    cardHolder: 'John Doe',
    expireDate: '2021-10-01',
    subscriptions: 0,
    icon: image(7),
    cvc: '1234',
  },
];
