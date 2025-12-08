import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicBreadcrumbsCode = `<Breadcrumbs aria-label="breadcrumb">
  <Link underline="hover" color="inherit" href="#!">
    MUI
  </Link>
  <Link
    underline="hover"
    color="inherit"
    href="#!"
  >
    Core
  </Link>
  <Typography sx={{ color: 'text.primary' }}>Breadcrumbs</Typography>
</Breadcrumbs>`;

const activeLastBreadcrumbCode = `<Breadcrumbs aria-label="breadcrumb">
  <Link underline="hover" color="inherit" href="#!">
    MUI
  </Link>
  <Link
    underline="hover"
    color="inherit"
    href="#!"
  >
    Core
  </Link>
  <Link
    underline="hover"
    href="#!"
    aria-current="page"
    sx={{ color: (theme) => \`\${theme.vars.palette.text.primary} !important\` }}
  >
    Breadcrumbs
  </Link>
</Breadcrumbs>`;

const customSeparatorCode = `<Stack direction="column" spacing={2}>
  <Breadcrumbs separator="›" aria-label="breadcrumb">
    <Link underline="hover" key="1" color="inherit" href="#!">
      MUI
    </Link>
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href="#!"
    >
      Core
    </Link>
    <Typography key="3" sx={{ color: 'text.primary' }}>
      Breadcrumb
    </Typography>
  </Breadcrumbs>
  <Breadcrumbs separator="-" aria-label="breadcrumb">
    <Link underline="hover" key="1" color="inherit" href="#!">
      MUI
    </Link>
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href="#!"
    >
      Core
    </Link>
    <Typography key="3" sx={{ color: 'text.primary' }}>
      Breadcrumb
    </Typography>
  </Breadcrumbs>
  <Breadcrumbs
    separator={<IconifyIcon icon="material-symbols:navigate-next" sx={{ fontSize: 20 }} />}
    aria-label="breadcrumb"
  >
    <Link underline="hover" key="1" color="inherit" href="#!">
      MUI
    </Link>
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href="#!"
    >
      Core
    </Link>
    <Typography key="3" sx={{ color: 'text.primary' }}>
      Breadcrumb
    </Typography>
  </Breadcrumbs>
</Stack>`;

const breadcrumbsWithIconsCode = `<Breadcrumbs aria-label="breadcrumb">
  <Link
    underline="hover"
    sx={{ display: 'flex', alignItems: 'center' }}
    color="inherit"
    href="#!"
  >
    <IconifyIcon icon="material-symbols:home" sx={{ fontSize: 16, mr: 0.5 }} />
    MUI
  </Link>
  <Link
    underline="hover"
    sx={{ display: 'flex', alignItems: 'center' }}
    color="inherit"
    href="#!"
  >
    <IconifyIcon icon="material-symbols:whatshot" sx={{ fontSize: 16, mr: 0.5 }} />
    Core
  </Link>
  <Typography
    sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}
  >
    <IconifyIcon icon="material-symbols:grain" sx={{ fontSize: 16, mr: 0.5 }} />
    Breadcrumb
  </Typography>
</Breadcrumbs>`;

const collapsedBreadcrumbsCode = `<Breadcrumbs maxItems={2} aria-label="breadcrumb">
  <Link underline="hover" color="inherit" href="#!">
    Home
  </Link>
  <Link underline="hover" color="inherit" href="#!">
    Catalog
  </Link>
  <Link underline="hover" color="inherit" href="#!">
    Accessories
  </Link>
  <Link underline="hover" color="inherit" href="#!">
    New Collection
  </Link>
  <Typography sx={{ color: 'text.primary' }}>Belts</Typography>
</Breadcrumbs>`;

const chipBreadcrumbsCode = `<Breadcrumbs aria-label="breadcrumb">
  <Chip
    component="a"
    clickable
    href="#!"
    label="Home"
    icon={<IconifyIcon icon="material-symbols:home" sx={{ fontSize: 20 }} />}
  />
  <Chip component="a" clickable href="#!" label="Catalog" />
  <Chip
    label="Accessories"
    clickable
    deleteIcon={<IconifyIcon icon="material-symbols:keyboard-arrow-down" sx={{ fontSize: 22 }} />}
    onDelete={() => console.log('Clicked.')}
  />
</Breadcrumbs>`;

const BreadcrumbsDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Breadcrumbs',
        description:
          "A breadcrumbs is a list of links that help visualize a page's location within a site's hierarchical structure, it allows navigation up to any of the ancestors.",
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Breadcrumbs',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-breadcrumbs`,
        folderLink: `${folderBaseLink}/BreadcrumbsDoc.jsx`,
      }}
    >
      <DocSection title="Basic breadcrumbs">
        <DocCard code={basicBreadcrumbsCode} />
      </DocSection>

      <DocSection
        title="Active last breadcrumb"
        description="Keep the last breadcrumb interactive."
      >
        <DocCard code={activeLastBreadcrumbCode} />
      </DocSection>

      <DocSection
        title="Custom separator"
        description="In the following examples, we are using two string separators and an SVG icon."
      >
        <DocCard code={customSeparatorCode} />
      </DocSection>

      <DocSection title="Breadcrumbs with icons">
        <DocCard code={breadcrumbsWithIconsCode} />
      </DocSection>

      <DocSection title="Collapsed breadcrumbs">
        <DocCard code={collapsedBreadcrumbsCode} />
      </DocSection>

      <DocSection title="Chip breadcrumbs">
        <DocCard code={chipBreadcrumbsCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default BreadcrumbsDoc;
