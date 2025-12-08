import { apiEndpoints } from 'routes/paths';
import axiosFetcher from 'services/axios/axiosFetcher';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { sendPasswordResetLinkFetcher } from '../dummyFetcher';

export const useGetCurrentUser = (config) => {
  const result = useSWR([apiEndpoints.profile, {}, { disableThrowError: true }], axiosFetcher, {
    suspense: true,
    shouldRetryOnError: false,
    errorRetryCount: 0,
    ...config,
  });

  return result;
};

export const useLoginUser = () => {
  const mutation = useSWRMutation([apiEndpoints.login, { method: 'post' }], axiosFetcher);

  return mutation;
};

export const useRegisterUser = () => {
  const mutation = useSWRMutation([apiEndpoints.register, { method: 'post' }], axiosFetcher);

  return mutation;
};

export const useLogOutUser = () => {
  const mutation = useSWRMutation([apiEndpoints.logout, { method: 'post' }], axiosFetcher);

  return mutation;
};
export const useSendPasswordResetLink = () => {
  const mutation = useSWRMutation(
    [apiEndpoints.forgotPassword, { method: 'post' }],
    //In your real project use axiosFetcher instead of dummy sendPasswordResetLinkFetcher
    sendPasswordResetLinkFetcher,
  );

  return mutation;
};

export const useSetPassword = () => {
  const mutation = useSWRMutation([apiEndpoints.setPassword, { method: 'post' }], axiosFetcher);

  return mutation;
};
