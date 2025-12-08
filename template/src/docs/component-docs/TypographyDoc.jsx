import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const typographyCode = `<Stack direction="column" spacing={2} sx={{ width: 1, maxWidth: 500 }}>
  <Typography variant="h1" gutterBottom>
    h1. Heading
  </Typography>
  <Typography variant="h2" gutterBottom>
    h2. Heading
  </Typography>
  <Typography variant="h3" gutterBottom>
    h3. Heading
  </Typography>
  <Typography variant="h4" gutterBottom>
    h4. Heading
  </Typography>
  <Typography variant="h5" gutterBottom>
    h5. Heading
  </Typography>
  <Typography variant="h6" gutterBottom>
    h6. Heading
  </Typography>
  <Typography variant="subtitle1" gutterBottom>
    subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
    blanditiis tenetur
  </Typography>
  <Typography variant="subtitle2" gutterBottom>
    subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
    blanditiis tenetur
  </Typography>
  <Typography variant="body1" gutterBottom>
    body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
    blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
    neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
    quasi quidem quibusdam.
  </Typography>
  <Typography variant="body2" gutterBottom>
    body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
    blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
    neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
    quasi quidem quibusdam.
  </Typography>
  <Typography variant="button" gutterBottom sx={{ display: 'block' }}>
    button text
  </Typography>
  <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>
    caption text
  </Typography>
  <Typography variant="overline" gutterBottom sx={{ display: 'block' }}>
    overline text
  </Typography>
</Stack>`;

const TypographyDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Typography',
        description:
          'Use typography to present your design and content as clearly and efficiently as possible.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Typography',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-typography`,
        folderLink: `${folderBaseLink}/TypographyDoc.jsx`,
      }}
    >
      <DocSection title="Usage">
        <DocCard code={typographyCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default TypographyDoc;
