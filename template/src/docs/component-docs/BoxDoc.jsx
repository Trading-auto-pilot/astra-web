import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicBoxCode = `<Box component="section" sx={{ p: 2, bgcolor: 'background.elevation2'}}>
    This Box renders as an HTML section element.
</Box>`.trim();

const sxBoxCode = `
<Stack sx={{ justifyContent: 'center' }}>
  <Box
    sx={{
      width: 200,
      height: 200,
      borderRadius: 6,
      bgcolor: 'primary.dark',
      '&:hover': {
        backgroundColor: 'primary.main',
      },
    }}
  />
</Stack>
`.trim();

const BoxDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Box',
        description:
          'The Box component is a generic, theme-aware container with access to CSS utilities from MUI System.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Box',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-box`,
        folderLink: `${folderBaseLink}/BoxDoc.jsx`,
      }}
    >
      <DocSection
        title="Basic"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
              lineHeight: 2,
            }}
          >
            The Box component renders as a &nbsp;<Code>&lt;div&gt;</Code>&nbsp; by default, but you
            can swap in any other valid HTML tag or React component using the <Code>component</Code>{' '}
            prop. The demo below replaces the &nbsp;<Code>&lt;div&gt;</Code>&nbsp; with a &nbsp;
            <Code>&lt;section&gt;</Code>&nbsp; element:
          </Typography>
        }
      >
        <DocCard code={basicBoxCode} />
      </DocSection>
      <DocSection
        title="With sx Prop"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The <Code>sx</Code> prop in MUI allows you to apply theme-aware styling and CSS directly
            to any Box component, using a rich set of style functions from the MUI System.
          </Typography>
        }
      >
        <DocCard code={sxBoxCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default BoxDoc;
