import { Typography } from '@mui/material';
import { initialConfig } from 'config';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import Image from 'components/base/Image';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const banner = `${initialConfig.assetsDir}/images/ecommerce/banners/1.webp`;

const productImage = (index) =>
  `${initialConfig.assetsDir}/images/ecommerce/products/${index}.webp`;

const basicSkeletonCode = `<Stack sx={{ justifyContent: 'center' }}>
  <Stack direction="column" spacing={1} sx={{ alignItems: 'stretch' }}>
    {/* For variant="text", adjust the height via font-size */}
    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

    {/* For other variants, adjust the size with \`width\` and \`height\` */}
    <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
    <Skeleton variant="rectangular" sx={{ width: 210, height: 60 }} />
    <Skeleton variant="rounded" sx={{ width: 210, height: 60 }} />
  </Stack>
</Stack>`;

const animatedPulsateSkeletonCode = `import Image from 'components/base/Image';

const data = [
  {
    src: "${productImage(1)}",
    title: 'Plush Bean Bag Chair',
    channel: 'Furniture Mart',
    views: '120 units sold',
    createdAt: '2 days ago',
  },
  {
    src: "${productImage(2)}",
    title: 'Modern Upholstered Chair',
    channel: 'Home Comforts',
    views: '85 units sold',
    createdAt: '1 week ago',
  },
  {
    src: "${productImage(3)}",
    title: 'Designer Lounge Chair',
    channel: 'Style & Co.',
    views: '50 units sold',
    createdAt: '3 days ago',
  },
];

const ProductCard = (props) => {
  const { loading = false } = props;

  return (
    <Grid container>
      {(loading ? Array.from(new Array(3)) : data).map((item, index) => (
        <Box key={index} sx={{ width: 210, marginRight: 0.5, mb: 5 }}>
          {item ? (
            <Image
              sx={{ width: 210, height: 200, p: 1, objectFit: 'cover' }}
              alt={item.title}
              src={item.src}
            />
          ) : (
            <Skeleton variant="rectangular" sx={{ width: 210, height: 118 }} />
          )}
          {item ? (
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Typography gutterBottom variant="body2">
                {item.title}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                {item.channel}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {\`\${item.views} • \${item.createdAt}\`}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ pt: 0.5 }}>
              <Skeleton />
              <Skeleton sx={{ width: '60%' }} />
            </Box>
          )}
        </Box>
      ))}
    </Grid>
  );
};

const FurnitureShowcase = () => {
  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Box sx={{ overflow: 'hidden' }}>
        <ProductCard loading />
        <ProductCard />
      </Box>
    </Stack>
  );
};

render(<FurnitureShowcase />);
`.trim();

const animatedSkeletonCode = `<Stack sx={{ justifyContent: 'center' }}>
  <Box sx={{ width: 300 }}>
    <Skeleton />
    <Skeleton animation="wave" />
    <Skeleton animation={false} />
  </Box>
</Stack>`.trim();

const animatedWaveSkeletonCode = `

const ProductCard = (props) => {
  const { loading = false } = props;

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardHeader
        avatar={
          loading ? (
            <Skeleton animation="wave" variant="circular" sx={{ width: 40, height: 40 }} />
          ) : (
            <Avatar
              alt="Furniture Store"
              src="https://example.com/store-avatar.jpg"
            />
          )
        }
        action={
          loading ? null : (
            <IconButton aria-label="settings">
              <IconifyIcon icon="material-symbols:more-vert" sx={{ fontSize: 24 }} />
            </IconButton>
          )
        }
        title={
          loading ? (
            <Skeleton animation="wave" sx={{ height: 10, width: '80%', mb: 0.75 }} />
          ) : (
            'Elegant Sofa with Side Stand'
          )
        }
        subheader={
          loading ? (
            <Skeleton animation="wave" sx={{ height: 10, width: '40%' }} />
          ) : (
            '5 hours ago'
          )
        }
      />
      {loading ? (
        <Skeleton sx={{ height: 200 }} animation="wave" variant="rectangular" />
      ) : (
        <CardMedia
          component="img"
          sx={{ height: 170, objectFit: 'contain' }}
          image="${banner}"
        />
      )}
      <CardContent>
        {loading ? (
          <>
            <Skeleton animation="wave" sx={{ height: 10, mb: 1 }} />
            <Skeleton animation="wave" sx={{ height: 10, width: '80%' }} />
          </>
        ) : (
          <Typography variant="body2" color="text.secondary" component="p">
            Add a touch of elegance to your living space with this comfortable sofa paired with a
            stylish side stand.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const FurnitureShowcase = () => {
  return (
    <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <ProductCard loading />
        <ProductCard />
      </div>
    </Stack>
  );
};

render(<FurnitureShowcase />);
`.trim();

const inferringDimSkeletonCode = `
const variants = ['h1', 'h3', 'body1', 'caption'];

const TypographyDemo = (props) => {
  const { loading = false } = props;

  return (
    <div>
      {variants.map((variant) => (
        <Typography component="div" key={variant} variant={variant}>
          {loading ? <Skeleton /> : variant}
        </Typography>
      ))}
    </div>
  );
};

const SkeletonTypography = () => {
  return (
      <Grid container spacing={8}>
        <Grid size="grow">
          <TypographyDemo loading />
        </Grid>
        <Grid size="grow">
          <TypographyDemo />
        </Grid>
      </Grid>
  );
};
render(<SkeletonTypography />);
`.trim();

const skeletonColorCode = `
<Box
  sx={{
    bgcolor: 'grey.900',
    p: 8,
    width: 1,
    display: 'flex',
    justifyContent: 'center',
  }}
>
  <Skeleton
    sx={{ bgcolor: 'grey.700', width: 210, height: 118 }}
    variant="rectangular"
  />
</Box>
`.trim();

const SkeletonDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Skeleton',
        description:
          'Skeletons provide a placeholder while content is loading, which can improve perceived performance and user experience.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Skeleton',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-skeleton`,
        folderLink: `${folderBaseLink}/SkeletonDoc.jsx`,
      }}
    >
      <DocSection title="Basic Skeleton">
        <DocCard code={basicSkeletonCode} />
      </DocSection>
      <DocSection
        title="Animation"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            By default, the skeleton pulsates, but you can change the animation to a wave or disable
            it entirely.
          </Typography>
        }
      >
        <DocCard code={animatedSkeletonCode} sx={{ my: 3 }} />
        <DocNestedSection title="Pulsate Animation Example" id="pulsate-animation-example">
          <DocCard
            code={animatedPulsateSkeletonCode}
            scope={{ Image, productImage }}
            noInline
            sx={{ my: 3 }}
          />
        </DocNestedSection>
        <DocNestedSection title="Wave Animation Example" id="wave-animation-example">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            By default, the skeleton pulsates, but you can change the animation to a wave or disable
            it entirely.
          </Typography>
          <DocCard code={animatedWaveSkeletonCode} scope={{ banner }} noInline />
        </DocNestedSection>
      </DocSection>

      <DocSection
        title="Inferring Dimensions"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            In addition to accepting &nbsp;<Code>width</Code>&nbsp; and &nbsp;<Code>height</Code>
            &nbsp; props, the component can also infer the dimensions.
          </Typography>
        }
      >
        <DocCard code={inferringDimSkeletonCode} noInline />
      </DocSection>
      <DocSection
        title="Skeleton Color"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The color of the component can be customized by changing its &nbsp;
            <Code>background-color</Code>
            &nbsp; CSS property. This is especially useful when on a black background (as the
            skeleton will otherwise be invisible).
          </Typography>
        }
      >
        <DocCard code={skeletonColorCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default SkeletonDoc;
