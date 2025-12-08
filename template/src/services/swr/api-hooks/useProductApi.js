import { apiEndpoints } from 'routes/paths';
import useSWR from 'swr';
import { productFetcher } from '../dummyFetcher';

export const useGetProduct = (productId, config) => {
  const swr = useSWR(
    [apiEndpoints.getProduct(productId), { productId }],
    //In your real project use axiosFetcher instead of dummy productFetcher
    productFetcher,
    {
      suspense: true,
      ...config,
    },
  );

  return swr;
};
