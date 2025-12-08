import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const fluidContainerCode = `<Container maxWidth="sm">
  <Box sx={{ bgcolor: 'primary.main', height: '50vh' }} />
</Container>`;

const fixedContainerCode = `<Container fixed maxWidth="sm">
  <Box sx={{ bgcolor: 'primary.main', height: '50vh' }} />
</Container>`;

const ContainerDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Container',
        description:
          "The Container centers your content horizontally. It's the most basic layout element.",
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Container',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-container`,
        folderLink: `${folderBaseLink}/ContainerDoc.jsx`,
      }}
    >
      <DocSection
        title="Fluid"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            A fluid container width is bounded by the <Code>maxWidth</Code> prop value.
          </Typography>
        }
      >
        <DocCard code={fluidContainerCode} />
      </DocSection>
      <DocSection
        title="Fixed"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            If you prefer to design for a fixed set of sizes instead of trying to accomodate a fully
            fluid viewport, you can set the <Code>fixed</Code> prop. The max-width matches the
            min-width of the current breakpoint.
          </Typography>
        }
      >
        <DocCard code={fixedContainerCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default ContainerDoc;
