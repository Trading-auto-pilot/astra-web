import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicPaperCode = `
<Stack spacing={1.5} sx={{ flexWrap: 'wrap', justifyContent: "center" }}>
  <Paper variant="default" sx={{ width: 128, height: 128 }} />
  <Paper variant="elevation" sx={{ width: 128, height: 128 }} />
  <Paper variant="outlined" sx={{ width: 128, height: 128 }} />
</Stack>
`.trim();

const paperBackgroundCode = `
<Stack spacing={2} sx={{ flexWrap: 'wrap', justifyContent: "center" }}>
  <Paper background={1} variant="elevation" sx={{ width: 128, height: 128 }} />
  <Paper background={2} variant="elevation" sx={{ width: 128, height: 128 }} />
  <Paper background={3} variant="elevation" sx={{ width: 128, height: 128 }} />
  <Paper background={4} variant="elevation" sx={{ width: 128, height: 128 }} />
  <Paper background={5} variant="elevation" sx={{ width: 128, height: 128 }} />
</Stack>
`.trim();

const elevatedPaperCode = `
<Grid container spacing={2}>
  {[0, 1, 2, 3, 4, 5, 6, 7].map((elevation) => (
    <Grid key={elevation} size={6}>
      <Paper
        variant="elevation"
        elevation={elevation}
        sx={{
          p: 2,
          textAlign: 'center',
        }}
      >
        {\`elevation=\${elevation}\`}
      </Paper>
    </Grid>
  ))}
</Grid>
`.trim();

const PaperDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Paper',
        description:
          'The Paper component is a container for displaying content on an elevated surface.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Paper',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-paper`,
        folderLink: `${folderBaseLink}/PaperDoc.jsx`,
      }}
    >
      <DocSection
        title="Basic Paper"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Set the &nbsp;<Code>variant</Code>&nbsp; prop to &nbsp;<Code>"elevation"</Code>&nbsp;
            (default: <Code>"outlined"</Code>) for a rounded, elevated Paper with custom shadows:
          </Typography>
        }
      >
        <DocCard code={basicPaperCode} />
      </DocSection>
      <DocSection
        title="Paper Background"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Set the &nbsp;<Code>background</Code>&nbsp; prop to change the background color of
            &nbsp;<Code>paper</Code>&nbsp;.
          </Typography>
        }
      >
        <DocCard code={paperBackgroundCode} />
      </DocSection>
      <DocSection
        title="Paper Elevation"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Set the &nbsp;<Code>variant</Code>&nbsp; prop to &nbsp;<Code>"outlined"</Code>&nbsp; for
            a flat, outlined Paper with no shadows:
          </Typography>
        }
      >
        <DocCard code={elevatedPaperCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default PaperDoc;
