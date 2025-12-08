import { products } from 'data/e-commerce/products';
import { getItemFromStore, setItemToStore } from 'lib/utils';

const testUser = {
  email: 'demo@aurora.com',
  id: 1,
  name: 'Demo User',
  type: 'test',
  avatar: null,
};

export const getProfileFetcher = () =>
  new Promise((resolve) => {
    const user = getItemFromStore('session_user');
    if (user) {
      resolve(testUser);
    }
    resolve(null);
  });

export const loginFetcher = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      setItemToStore('session_user', JSON.stringify(testUser));
      resolve({ user: testUser });
    }, 1000);
  });

export const sendPasswordResetLinkFetcher = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('success');
    }, 1000);
  });

export const productFetcher = (args) => {
  const [_url, { productId }] = args;

  return new Promise((resolve) => {
    setTimeout(() => {
      const product = products.find((product) => product.id === Number(productId));

      resolve(product || null);
    }, 1000);
  });
};
