import { Link, ListItem, ListItemText, Typography } from '@mui/material';
import { initialConfig } from 'config';
import useLightbox from 'hooks/useLightbox';
import { folderBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import Lightbox from 'components/base/Lightbox';
import CodeBlock from 'components/common/CodeBlock';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection, { DocList } from 'components/docs/DocSection';

const lightboxImage = (index) => `${initialConfig.assetsDir}/images/docs/lightbox/${index}.webp`;

const basicExampleCode = `import Lightbox from 'components/base/Lightbox';
import useLightbox from 'hooks/useLightbox';

const BasicExample = () => {
  const { openLightbox, ...lightboxProps } = useLightbox();

  const slides = [
    {
      src: "${lightboxImage(1)}",
      width: 3840,
      height: 5760,
      title: 'Puppy in sunglasses',
      rows: 2,
      cols: 2,
    },
    {
      src: "${lightboxImage(2)}",
      width: 3840,
      height: 5070,
      title: 'Miami Beach',
    },
    {
      src: "${lightboxImage(3)}",
      width: 3840,
      height: 5120,
      title: 'Flamingo',
    },
    {
      src: "${lightboxImage(4)}",
      width: 3840,
      height: 2546,
      title: 'Starfish on a sand beach',
      cols: 2,
    },
    {
      src: "${lightboxImage(5)}",
      width: 3840,
      height: 2553,
      title: 'The last night of a two week stay on the North Shore of Oahu, Hawaii',
      cols: 2,
    },
    {
      src: "${lightboxImage(6)}",
      width: 3840,
      height: 5760,
      title: 'Sunset on Kauai',
      rows: 2,
      cols: 2,
    },
    {
      src: "${lightboxImage(7)}",
      width: 3840,
      height: 2560,
      title: 'RayBan sunglasses',
    },
    {
      src: "${lightboxImage(8)}",
      width: 3840,
      height: 5124,
      title: 'Crab on Beach',
    },
  ];

  return (
    <div>
      <ImageList sx={{ width: '100%', height: 500 }} variant="quilted" cols={4} rowHeight={121}>
        {slides.map((item, index) => (
          <ImageListItem
            key={item.title}
            cols={item.cols || 1}
            rows={item.rows || 1}
            onClick={() => {
              openLightbox(index);
            }}
            sx={{
              cursor: 'pointer',
            }}
          >
            <img src={item.src} alt={item.title} loading="lazy" />
          </ImageListItem>
        ))}
      </ImageList>

      <Lightbox slides={slides} {...lightboxProps} />
    </div>
  );
};
render(<BasicExample />)`.trim();

const advanceExampleCode = `import Lightbox from 'components/base/Lightbox';
import useLightbox from 'hooks/useLightbox';

const AdvanceExample = () => {
  const { openLightbox, ...lightboxProps } = useLightbox();

  const slides = [
    {
      src: lightboxImage(1),
      width: 3840,
      height: 5760,
      title: 'Puppy in sunglasses',
      description: 'Mollie Sivaram',
      rows: 2,
      cols: 2,
    },
    {
      src: lightboxImage(2),
      width: 3840,
      height: 5070,
      title: 'Miami Beach',
      description: 'Clark Van Der Beken\\n\\nSouth Beach, Miami Beach, Florida, United States',
    },
    {
      src: lightboxImage(3),
      width: 3840,
      height: 5120,
      title: 'Flamingo',
      description: 'Vicko Mozara\\n\\nVeliki zali, Dubravica, Croatia',
    },
    {
      src: lightboxImage(4),
      width: 3840,
      height: 2546,
      title: 'Starfish on a sand beach',
      description: 'Pedro Lastra\\n\\nKey West, Florida, United States',
      cols: 2,
    },
    {
      src: lightboxImage(5),
      width: 3840,
      height: 2553,
      title: 'The last night of a two week stay on the North Shore of Oahu, Hawaii',
      description: 'Sean Oulashin\\n\\nNorth Shore, Waialua, Hawaii, United States',
      cols: 2,
    },
    {
      src: lightboxImage(6),
      width: 3840,
      height: 5760,
      title: 'Sunset on Kauai',
      description: 'Cristofer Maximilian\\n\\nKauai, Hawaii, United States',
      rows: 2,
      cols: 2,
    },
    {
      src: lightboxImage(7),
      width: 3840,
      height: 2560,
      title: 'RayBan sunglasses',
      description: 'Ethan Robertson\\n\\nSanta Monica, California, United States',
    },
    {
      src: lightboxImage(8),
      width: 3840,
      height: 5124,
      title: 'Crab beach',
      description: 'Alex Perez\\n\\nNaples, Florida, United States',
    },
  ];

  return (
    <div>
      <ImageList sx={{ width: '100%', height: 500 }} variant="quilted" cols={4} rowHeight={121}>
        {slides.map((item, index) => (
          <ImageListItem
            key={item.title}
            cols={item.cols || 1}
            rows={item.rows || 1}
            onClick={() => {
              openLightbox(index);
            }}
            sx={{
              cursor: 'pointer',
            }}
          >
            <img src={item.src} alt={item.title} loading="lazy" />
          </ImageListItem>
        ))}
      </ImageList>

      <Lightbox
        slides={slides}
        extension={['caption', 'fullscreen', 'slideshow', 'thumbnails', 'video', 'zoom']}
        {...lightboxProps}
      />
    </div>
  );
};
render(<AdvanceExample />)`.trim();

const LightboxDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Lightbox',
        descriptionEl: (
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
            }}
          >
            <strong>Aurora</strong> uses <strong>Yet Another React Lightbox</strong> for lightbox.{' '}
            <strong>Yet Another React Lightbox</strong> is a modern React lightbox component.
            Performant, easy to use, customizable and extendable.
          </Typography>
        ),
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'LightBox',
          },
        ],
        docLink: 'https://yet-another-react-lightbox.com/',
        docLinkLabel: 'Yet Another React Lightbox Docs',
        folderLink: `${folderBaseLink}/LightboxDoc.jsx`,
      }}
    >
      <DocSection title="How to use">
        <Typography>
          The <Code>useLightbox</Code> custom hook and <Code>Lightbox</Code> componet in Aurora
          simplify the use of <Code>yet-another-react-lightbox</Code>, enhancing code organization
          and maintainability.
        </Typography>
        <DocList>
          <ListItem>
            <ListItemText disableTypography sx={{ mb: 0 }}>
              <strong>Import statement:</strong>
            </ListItemText>
            <CodeBlock
              code={`import Lightbox from 'components/base/Lightbox';
import useLightbox from 'hooks/useLightbox`}
              sx={{ my: 0 }}
            />
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              <strong>useLightbox</strong>: This hook returns an object with <Code>open</Code>,{' '}
              <Code>index</Code>, <Code>close</Code>, <Code>openLightbox</Code> which helps manage
              the open state, active index, close handler, and dynamic opening of Lightbox by index.
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              <strong>Lightbox</strong>: After initializing <Code>useLightbox</Code> deconstruct it
              to obtain <Code>openLightbox</Code> and <Code>lightboxProps</Code>. Pass any
              additional <Code>yet-another-react-lightbox</Code> props, along with
              <Code>lightboxProps</Code> to the <Code>Lightbox</Code> component to enable lightbox
              functionality.
            </ListItemText>
          </ListItem>
        </DocList>
      </DocSection>
      <DocSection title="Basic Example">
        <DocCard
          code={basicExampleCode}
          scope={{
            Lightbox,
            useLightbox,
            lightboxImage,
          }}
          noInline
        />
      </DocSection>

      <DocSection
        title="Advance Example"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            In Aurora's <Code>Lightbox</Code> component, you can use <Code>extension</Code> prop to
            specify the desired <Code>plugins</Code> as strings, like{' '}
            <Code>['caption', 'fullscreen', 'slideshow', 'thumbnails', 'video', 'zoom']</Code>. This
            replaces the traditional <Code>plugins</Code> array approach. You can also pass any
            <Code>yet-another-react-lightbox</Code>{' '}
            <Link
              href="https://yet-another-react-lightbox.com/documentation#Lightbox"
              target="_blank"
            >
              props
            </Link>{' '}
            along with <Code>lightboxProps</Code> to the <Code>Lightbox</Code> component.
          </Typography>
        }
      >
        <DocCard
          code={advanceExampleCode}
          scope={{
            Lightbox,
            useLightbox,
            lightboxImage,
          }}
          noInline
        />
      </DocSection>
    </DocPageLayout>
  );
};

export default LightboxDoc;
