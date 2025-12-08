import { Link, ListItem, ListItemText, Typography } from '@mui/material';
import Code from 'components/base/Code';
import CodeBlock from 'components/common/CodeBlock';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection, { DocList, DocSubtitle } from 'components/docs/DocSection';

const ApiCalls = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'API Calls',
        descriptionEl: (
          <Typography sx={{ color: 'text.secondary' }}>
            Aurora is configured to handle API requests efficiently using{' '}
            <Link href="https://axios-http.com/docs/intro" target="_blank">
              Axios
            </Link>{' '}
            and{' '}
            <Link href="https://swr.vercel.app/" target="_blank">
              SWR
            </Link>
            . These two approaches provide flexibility for developers, allowing them to choose their
            preferred method for data fetching and caching.
          </Typography>
        ),
      }}
    >
      <DocSection title="Axios Configuration">
        <Typography
          sx={{
            color: 'text.secondary',
            mb: 2,
          }}
        >
          Aurora uses a custom instance of Axios, <Code>axiosInstance</Code>, created with specific
          configurations for making HTTP requests. This file is located in{' '}
          <Code>src/services/axios/axiosInstance.js</Code>.
        </Typography>
        <CodeBlock
          code={`const res = await axiosInstance({
  url: '/products',
  method: 'get'
  // other options
});`}
        />
        <Typography
          sx={{
            color: 'text.secondary',
            mb: 2,
          }}
        >
          This instance is pre-configured with:
        </Typography>
        <DocList>
          <ListItem>
            <ListItemText disableTypography>
              <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                Base URL:{' '}
              </DocSubtitle>
              The base URL for axios is defined by the environment variable{' '}
              <Code>VITE_API_URL</Code>, defaulting to <Code>http://localhost:8000/api</Code> if not
              set. If you don't want to use the default base URL or wish to change it for a specific
              request, you can simply override it by specifying the <Code>baseURL</Code> in your
              request:
              <CodeBlock
                code={`const res = await axiosInstance({
  baseURL: desired_base_url,
  // other request options
});`}
              />
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              <Typography>
                <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                  Authorization Header:{' '}
                </DocSubtitle>
                The instance automatically adds a Bearer token from <Code>localStorage</Code> if an{' '}
                <Code>auth_token</Code>
                exists.
              </Typography>
              <CodeBlock
                code={`axiosInstance.interceptors.request.use(async (config) => {
  const authToken = localStorage.getItem('auth_token');

  if (authToken) {
    config.headers.Authorization = \`Bearer \${authToken}\`;
  }
  return config;
});`}
              />
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              <Typography>
                <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                  Response Interceptors:{' '}
                </DocSubtitle>
                Handles responses by returning the <Code>data</Code> property or handling errors by
                rejecting the promise with the status and error message.
              </Typography>
              <CodeBlock
                sx={{ mb: 0 }}
                code={`axiosInstance.interceptors.response.use(
  (response) => (response.data.data ? response.data.data : response.data),
  (error) => {
    return Promise.reject({
      status: error.response?.status,
      data: error.response?.data || error.message,
    });
  },
);`}
              />
            </ListItemText>
          </ListItem>
        </DocList>
      </DocSection>
      <DocSection title="SWR">
        <Typography
          sx={{
            color: 'text.secondary',
            mb: 2,
          }}
        >
          For data fetching, caching and revalidation, Aurora uses{' '}
          <Link href="https://swr.vercel.app/" target="_blank">
            SWR
          </Link>{' '}
          to simplify the data-fetching logic in the project. Aurora also provides a custom{' '}
          <Code>axiosFetcher</Code> that integrates seamlessly with <Code>SWR</Code>. This fetcher
          utilizes the pre-configured <Code>axiosInstance</Code>, ensuring consistent API
          interactions when using SWR.
        </Typography>
        <DocSubtitle sx={{ mt: 5, mb: 1 }}>Usage Example:</DocSubtitle>
        <CodeBlock
          sx={{ mb: 0 }}
          code={`import axiosFetcher from 'services/axios/axiosFetcher';
...

const { data, isLoading } = useSWR<ProductDetails | null>(
    [apiEndpoints.getProduct(productId), { productId }],
    axiosFetcher,
    {
      suspense: true,
    },
  );
`}
        />

        <DocSubtitle sx={{ mt: 5, mb: 1 }}>Custom SWR Hooks:</DocSubtitle>
        <Typography sx={{ color: 'text.secondary' }}>
          For every request, Aurora creates an SWR-based custom hook. All custom hooks for SWR-based
          API requests are stored in the <Code>src/services/swr/api-hooks</Code> folder. These hooks
          demonstrate how to use SWR with Axios and provide examples for real application API
          requests. Some dummy fetchers are also included to illustrate potential use cases. In a
          real project, those dummy fetchers should be replaced by <Code>axiosFetchers</Code>
        </Typography>
        <DocSubtitle sx={{ mt: 5, mb: 1 }}>SWRConfiguration:</DocSubtitle>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          To manage SWR settings globally, the <Code>SWRConfiguration</Code> component is created in{' '}
          <Code>src/services/configuration/SWRConfiguration.jsx</Code>
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          This component defines custom configurations such as the fetcher function, revalidation
          options, and more. It ensures that all SWR hooks in the application follow the same
          configurations, leading to a consistent data-fetching experience. For more configuration
          options, visit the{' '}
          <Link href="https://swr.vercel.app/docs/api" target="_blank">
            SWR documentation
          </Link>
          .
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          The entire application is wrapped by the <Code>SWRConfiguration</Code> component in
          <Code>main.jsx</Code>, ensuring that these configurations are applied globally.
        </Typography>
      </DocSection>
    </DocPageLayout>
  );
};

export default ApiCalls;
