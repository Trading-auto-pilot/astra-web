'use client';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Code from 'components/base/Code';
import CodeBlock from 'components/common/CodeBlock';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const exampleIconData = `// lib/iconify/icon-datasets.ts
export default {
    'mdi:robot-love': {
    body: '<path fill="currentColor" d="M22 14h-1c0-3.87-3.13-7-7-7h-1V5.73A2 2 0 1 0 10 4c0 .74.4 1.39 1 1.73V7h-1c-3.87 0-7 3.13-7 7H2c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h1v1a2 2 0 0 0 2 2h14c1.11 0 2-.89 2-2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1M9.7 15.45l-.73.73l-1.47 1.47l-2.2-2.2c-.4-.4-.4-1.06 0-1.45c.41-.42 1.06-.42 1.47 0l.73.72l.73-.72c.41-.42 1.06-.42 1.47 0c.4.39.4 1.05 0 1.45m9 0l-.73.73l-1.47 1.47l-2.2-2.2c-.4-.4-.4-1.06 0-1.45c.41-.42 1.06-.42 1.47 0l.73.72l.73-.72c.41-.42 1.06-.42 1.47 0c.4.39.4 1.05 0 1.45"/>',
  },
};
`;

const IconRegistration = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Icon Registration',
      }}
    >
      <DocSection title="How to Register Custom Icons with Iconify">
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          In Aurora, custom SVG icons can be registered with <Code>@iconify/react</Code> using a
          manual preload strategy. This avoids runtime CDN fetching and lets you bundle specific
          icons with your app.
        </Typography>
      </DocSection>

      <DocSection title="Using Iconify Icons Locally">
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          To prevent flickers and ensure icons work offline by bundling them locally through{' '}
          <Code>icon-datasets.ts</Code>, you should preload and register icons manually.
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          Just find icons at{' '}
          <Link
            href="https://icon-sets.iconify.design/"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Iconify Icon Sets
          </Link>{' '}
          . Then paste the icon’s <strong>body</strong> into{' '}
          <Code>lib/iconify/icon-datasets.ts</Code> like this:
        </Typography>

        <CodeBlock code={exampleIconData} />
      </DocSection>
    </DocPageLayout>
  );
};

export default IconRegistration;
