import { Box, Link, Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicLinkCode = `<Stack
  spacing={2}
  sx={{
    typography: 'body1',
    flexWrap: 'wrap',
  }}
  >
    <Link href="#">Link</Link>
    <Link href="#" color="inherit">
      {'color="inherit"'}
    </Link>
    <Link href="#" variant="body2">
      {'variant="body2"'}
    </Link>
</Stack>`;

const underlineCode = `<Stack
  spacing={2}
  sx={{
    typography: 'body1',
    flexWrap: 'wrap',
  }}
>
  <Link href="#" underline="none">
    {'underline="none"'}
  </Link>
  <Link href="#" underline="hover">
    {'underline="hover"'}
  </Link>
  <Link href="#" underline="always">
    {'underline="always"'}
  </Link>
</Stack>`;

const reactRouterCode = `<Stack
  direction="column"
  spacing={2}
  sx={{
    typography: 'body1',
  }}
>
  <Stack spacing={2} sx={{ flexWrap: 'wrap' }}>
    <Link href="#">
      Home
    </Link>
    <Link href="#">
      About
    </Link>
  </Stack>
  <Stack spacing={2} sx={{ flexWrap: 'wrap' }}>
    <Button variant='contained' href="#">
      Home
    </Button>
    <Button variant='contained'  href="#">
      About
    </Button>
  </Stack>
</Stack>`;

const LinkDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Links',
        description:
          'The Link component allows you to easily customize anchor elements with your theme colors and typography styles.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Link',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-link`,
        folderLink: `${folderBaseLink}/LinkDoc.jsx`,
      }}
    >
      <DocSection
        title="Basic links"
        descriptionEl={
          <>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              The Link component is built on top of the{' '}
              <Link href="/component-docs/typography">Typography</Link> component, meaning that you
              can use its props.
            </Typography>
            <Box
              sx={{
                mb: 5,
              }}
            >
              However, the Link component has some different default props than the Typography
              component:
              <ul>
                <li>
                  <Code>color="primary"</Code> as the link needs to stand out.
                </li>
                <li>
                  <Code>variant="inherit"</Code> as the link will, most of the time, be used as a
                  child of a Typography component.
                </li>
              </ul>
            </Box>
          </>
        }
      >
        <DocCard code={basicLinkCode} />
      </DocSection>
      <DocSection
        title="Underline"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The <Code>underline</Code> prop can be used to set the underline behavior. The default
            is <Code>hover</Code>.
          </Typography>
        }
      >
        <DocCard code={underlineCode} />
      </DocSection>
      <DocSection
        title="react-router examples"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            In <Code>Aurora</Code>, the Mui <Code>Link</Code> and <Code>Button</Code> component is
            already integrated with
            <Code>react-router</Code> through a component override. This means that you can directly
            use the MUI <Code>Link</Code> and <Code>Link</Code> component with the <Code>href</Code>{' '}
            prop for navigation, without needing to manually specify the <Code>component</Code> prop
            to render React Router's <Code>Link</Code>.
          </Typography>
        }
      >
        <DocCard code={reactRouterCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default LinkDoc;
