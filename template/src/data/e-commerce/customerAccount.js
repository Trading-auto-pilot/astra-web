import { initialConfig } from 'config';
import { users } from 'data/users';
import { products } from './products';

const image = (index) => `${initialConfig.assetsDir}/images/ecommerce/products/${index}.webp`;

export const trackOrdersList = [
  {
    id: 1,
    image: image(3),
    status: 'Delivered',
    url: '#!',
  },
  {
    id: 2,
    image: image(4),
    status: 'Pending',
    url: '#!',
  },
  {
    id: 3,
    image: image(5),
    status: 'Cancelled',
    url: '#!',
  },
];

export const customerInfo = {
  name: 'Captain Haddock',
  avatar: users[7].avatar,
  isStarMember: true,
  contactInfo: {
    email: 'anyname@email.com',
    phone: '+12514463453',
    address: {
      shipping: 'Apt: 6/B, 192 Edsel Road, Van Nuys, California, USA 96580',
      billing: 'Apt: 6/B, 192 Edsel Road, Van Nuys, California, USA 96580',
      billingAddressSameAsShipping: true,
    },
  },
  conversations: [
    {
      id: 1,
      icon: 'material-symbols:orders-outline-rounded',
      message: 'This is their 4th order',
    },
    {
      id: 2,
      icon: 'material-symbols:looks-one-outline-rounded',
      message: '1st visit was direct to your store',
    },
    {
      id: 3,
      icon: 'material-symbols:storefront-outline-rounded',
      message: '13 visits over 4 days',
    },
  ],
  stats: {
    wishlist: 5,
    favourites: 24,
    vouchers: 3,
    toPay: 0,
    toShip: 0,
    toReceive: 2,
    toReview: 1,
  },
  orderTracks: [
    {
      product: products[0],
      status: 'delivered',
    },
    {
      product: products[1],
      status: 'out_for_delivery',
    },
    {
      product: products[2],
      status: 'shipped',
    },
  ],
};

export const summaryList = [
  {
    id: 1,
    label: 'Wishlist',
    icon: 'material-symbols:favorite-outline-rounded',
    url: '#!',
  },
  {
    id: 2,
    label: 'Favourites',
    icon: 'material-symbols:store-outline-rounded',
    url: '#!',
  },
  {
    id: 3,
    label: 'Vouchers',
    icon: 'material-symbols:sell-outline',
    url: '#!',
  },
];

export const customerServices = [
  {
    id: 1,
    label: 'Login & Security',
    icon: 'material-symbols:lock-outline',
    url: '#!',
  },
  {
    id: 2,
    label: 'Gift cards',
    icon: 'material-symbols:redeem-rounded',
    url: '#!',
  },
  {
    id: 3,
    label: 'My payments',
    icon: 'material-symbols:payments-outline-rounded',
    url: '#!',
  },
  {
    id: 4,
    label: 'Digital support',
    icon: 'material-symbols:support',
    url: '#!',
  },
  {
    id: 5,
    label: 'My messages',
    icon: 'material-symbols:chat-outline-rounded',
    url: '#!',
  },
  {
    id: 6,
    label: 'My lists',
    icon: 'material-symbols:list-rounded',
    url: '#!',
  },
  {
    id: 7,
    label: 'Customer service',
    icon: 'material-symbols:support-agent-rounded',
    url: '#!',
  },
];

export const orderStatusList = [
  {
    id: 1,
    label: 'To pay',
    icon: 'material-symbols:credit-card-outline',
    count: 0,
    url: '#!',
  },
  {
    id: 2,
    label: 'To ship',
    icon: 'material-symbols:local-shipping-outline-rounded',
    count: 0,
    url: '#!',
  },
  {
    id: 3,
    label: 'To receive',
    icon: 'material-symbols:package-2-outline',
    count: 2,
    url: '#!',
  },
  {
    id: 4,
    label: 'To review',
    icon: 'material-symbols:reviews-outline-rounded',
    count: 0,
    url: '#!',
  },
];
