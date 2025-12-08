import { topProducts } from 'data/e-commerce/dashboard';
import { users } from 'data/users';

export const stats = [
  {
    icon: 'material-symbols-light:ads-click-rounded',
    value: '2,110',
    subtitle: 'Visitors',
  },
  {
    icon: 'material-symbols-light:request-quote-outline-rounded',
    value: '$8.2M',
    subtitle: 'Earnings',
  },
  {
    icon: 'material-symbols-light:shopping-cart-checkout-rounded',
    value: '1,124',
    subtitle: 'Orders',
  },
];

export const meetingSchedules = [
  {
    title: 'Collab with Tintin',
    time: '1:30pm - 2:30pm',
    attendants: [users[9], users[0]],
  },
  {
    title: 'Meeting about shipping',
    time: '2:40pm - 4:30pm',
    attendants: [users[3], users[4], users[6], users[10]],
  },
  {
    title: 'Greetings for marketing',
    time: '9:45am - 11:30am',
    attendants: [users[5], users[7], users[12]],
  },
  {
    title: 'Sales pipeline review',
    time: '5:40pm - 6:30pm',
    attendants: [users[1], users[2], users[7], users[12], users[13]],
  },
];

export const orders = [
  {
    id: 1,
    productImage: topProducts[11].product.image,
    productName: topProducts[11].product.name,
    price: `$${topProducts[11].margin.toFixed(0)}`,
    statusIcon: 'material-symbols:autorenew',
    status: 'warning',
  },
  {
    id: 2,
    productImage: topProducts[6].product.image,
    productName: topProducts[6].product.name,
    price: `$${topProducts[6].margin.toFixed(0)}`,
    statusIcon: 'material-symbols:local-shipping-outline',
    status: 'primary',
  },
  {
    id: 3,
    productImage: topProducts[2].product.image,
    productName: topProducts[2].product.name,
    price: `$${topProducts[2].margin.toFixed(0)}`,
    statusIcon: 'material-symbols:autorenew',
    status: 'warning',
  },
  {
    id: 4,
    productImage: topProducts[10].product.image,
    productName: topProducts[10].product.name,
    price: `$${topProducts[10].margin.toFixed(0)}`,
    statusIcon: 'material-symbols:inventory-2-outline',
    status: 'success',
  },

  {
    id: 5,
    productImage: topProducts[4].product.image,
    productName: topProducts[4].product.name,
    price: `$${topProducts[4].margin.toFixed(0)}`,
    statusIcon: 'material-symbols:inventory-2-outline',
    status: 'success',
  },
  {
    id: 6,
    productImage: topProducts[5].product.image,
    productName: topProducts[5].product.name,
    price: `$${topProducts[5].margin.toFixed(0)}`,
    statusIcon: 'material-symbols:autorenew',
    status: 'warning',
  },
  {
    id: 7,
    productImage: topProducts[1].product.image,
    productName: topProducts[1].product.name,
    price: `$${topProducts[1].margin.toFixed(0)}`,
    statusIcon: 'material-symbols:inventory-2-outline',
    status: 'success',
  },
  {
    id: 8,
    productImage: topProducts[7].product.image,
    productName: topProducts[7].product.name,
    price: `$${topProducts[7].margin.toFixed(0)}`,
    statusIcon: 'material-symbols:inventory-2-outline',
    status: 'success',
  },
  {
    id: 9,
    productImage: topProducts[8].product.image,
    productName: topProducts[8].product.name,
    price: `$${topProducts[8].margin.toFixed(0)}`,
    statusIcon: 'material-symbols:autorenew',
    status: 'warning',
  },
  {
    id: 10,
    productImage: topProducts[9].product.image,
    productName: topProducts[9].product.name,
    price: `$${topProducts[9].margin.toFixed(0)}`,
    statusIcon: 'material-symbols:local-shipping-outline',
    status: 'primary',
  },
  {
    id: 11,
    productImage: topProducts[3].product.image,
    productName: topProducts[3].product.name,
    price: `$${topProducts[3].margin.toFixed(0)}`,
    statusIcon: 'material-symbols:local-shipping-outline',
    status: 'primary',
  },

  {
    id: 12,
    productImage: topProducts[0].product.image,
    productName: topProducts[0].product.name,
    price: `$${topProducts[0].margin.toFixed(0)}`,
    statusIcon: 'material-symbols:local-shipping-outline',
    status: 'primary',
  },
];
