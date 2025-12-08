import { Link, Typography } from '@mui/material';
import { folderBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const iconifyIconCode = `import IconifyIcon from 'components/base/IconifyIcon';

<div>
  <IconifyIcon 
    icon="mdi-light:home" 
    sx={{ fontSize: 50, color: 'primary.main' }} 
  />

  <IconifyIcon
    icon="mdi-light:home"
    sx={{ fontSize: 50, color: 'success.main' }}
    rotate={-45}
  />

  <IconifyIcon 
    icon="mdi-light:home" 
    sx={{ fontSize: 50, color: 'error.main' }} 
    vFlip 
  />
</div>`;

const iconsCode = `import IconifyIcon from 'components/base/IconifyIcon';

<Stack direction='column'>
  <div>
    <IconifyIcon 
      icon="material-symbols:home-rounded" 
      sx={{ fontSize: 50, color: 'primary.main' }} 
    />

    <IconifyIcon
      icon="mdi:home"
      sx={{ fontSize: 40, color: 'success.main' }}
    />

    <IconifyIcon 
      icon="ic:round-home" 
      sx={{ fontSize: 30, color: 'error.main' }} 
    />
  </div>
  <div>
    <IconifyIcon 
      icon="twemoji:flag-bangladesh" 
      sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} 
    />

    <IconifyIcon
      icon="twemoji:flag-france"
      sx={{ fontSize: 40, color: 'success.main', mr: 2 }}
    />

    <IconifyIcon
      icon="twemoji:flag-united-kingdom" 
      sx={{ fontSize: 40, color: 'error.main' }} 
    />
  </div>
</Stack>`;

const IconDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Icon',
        descriptionEl: (
          <Typography variant="body1">
            Throughout the Aurora project, <Code>Iconify</Code> is used for icons, integrated via
            the{' '}
            <Link href="https://iconify.design/docs/icon-components/react/" target="_blank">
              @iconify/react
            </Link>{' '}
            library. Iconify provides access to <Code>200,000+</Code> icons from <Code>150+</Code>{' '}
            sets with a unified syntax. It renders <Code>pixel-perfect SVG icons</Code> and loads
            them on demand through the Iconify API, ensuring that only the required icons are
            fetched, optimizing performance.
          </Typography>
        ),
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Icon',
          },
        ],
        folderLink: `${folderBaseLink}/IconDoc.jsx`,
        docLink: 'https://iconify.design/docs/',
        docLinkLabel: 'Iconify Docs',
      }}
    >
      <DocSection
        title="IconifyIcon Component"
        descriptionEl={
          <>
            <Typography
              sx={{
                mb: 2,
              }}
            >
              To seamlessly integrate <Code>Iconify</Code> with <Code>MUI</Code>, the{' '}
              <Code>IconifyIcon</Code>
              component was created. This component allows users to utilize MUI's <Code>
                sx
              </Code>{' '}
              prop alongside <Code>Iconify's own props</Code> for enhanced styling flexibility.
            </Typography>
            <Typography
              sx={{
                mb: 5,
              }}
            >
              instead of importing the Icon directly with{' '}
              <Code>
                import {'{'}Icon{'}'} from '@iconify/react';
              </Code>{' '}
              use <Code>import IconifyIcon from 'components/base/IconifyIcon';</Code>
            </Typography>
          </>
        }
      >
        <DocCard code={iconifyIconCode} />
      </DocSection>
      <DocSection
        title="Icons"
        descriptionEl={
          <>
            <Typography
              sx={{
                mb: 2,
              }}
            >
              In Aurora, users can leverage Iconify's vast collection of icons from{' '}
              <strong>150+</strong> icon sets, allowing flexibility in choosing icons that best suit
              their needs. You can explore the full list of available icon sets{' '}
              <Link href="https://icon-sets.iconify.design/" target="_blank">
                here
              </Link>
              .
            </Typography>
            <Typography
              sx={{
                mb: 5,
              }}
            >
              While <strong>any icon</strong> from <strong>any icon set</strong> can be used in
              Aurora, most of the icons in the project are sourced from the{' '}
              <strong>Material Symbols</strong> icon set. This ensures consistency in design while
              maintaining the flexibility to add icons from other sets as needed.
            </Typography>
          </>
        }
      >
        <DocCard code={iconsCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default IconDoc;
