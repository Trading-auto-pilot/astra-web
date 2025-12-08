import { Typography } from '@mui/material';
import { initialConfig } from 'config';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const image = (dir) => `${initialConfig.assetsDir}/images/ecommerce/${dir}.webp`;

const basicCardCode = `
const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

const BasicCard = () => {
  return (
    <Stack sx={{ justifyContent:'center' }}>
      <Card background={1} sx={{ minWidth: 275 }}>
        <CardHeader title={<Typography variant="body1">Basic Card</Typography>} />
        <Divider />
        <CardContent>
          <Typography sx={{ fontSize: 14 }} gutterBottom>
            Word of the Day
          </Typography>
          <Typography variant="h5">
            be{bull}nev{bull}o{bull}lent
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.primary">
            adjective
          </Typography>
          <Typography variant="body2">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Stack>
  );
};
render(<BasicCard/>);
`.trim();

const outlinedCardCode = `
const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

const OutlinedCard = () => {
  return (
    <Stack spacing={2} sx={{ justifyContent:'center' }}>
      <Card variant="outlined" background={1} sx={{ minWidth: 275 }}>
        <CardHeader title={<Typography variant="body1">Rounded Outline</Typography>} />
        <Divider />
        <CardContent>
          <Typography sx={{ fontSize: 14 }} gutterBottom>
            Word of the Day
          </Typography>
          <Typography variant="h5" component="div">
            be{bull}nev{bull}o{bull}lent
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.primary">
            adjective
          </Typography>
          <Typography variant="body2">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Stack>
  );
};
render(<OutlinedCard/>);
`.trim();

const complexCardCode = `
const ProductReviewCard = () => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Stack sx={{ justifyContent:'center' }}>
      <Card background={1} variant="outlined" sx={{ maxWidth: 345 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'secondary.main' }} aria-label="furniture">
              S
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <IconifyIcon icon="material-symbols-light:more-vert" />
            </IconButton>
          }
          title="Luxury Leather Sofa"
          subheader="Available Since July 20, 2024"
        />
        <CardMedia
          component="img"
          image="${image('products/14')}"
          alt="Luxury Leather Sofa"
          sx={{ height: 255, p: 3, objectFit: 'contain' }}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            This exquisite leather sofa is the perfect blend of style and comfort,
            ideal for elevating any living space.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <IconifyIcon icon="material-symbols-light:favorite" />
          </IconButton>
          <IconButton aria-label="share">
            <IconifyIcon icon="material-symbols-light:share" />
          </IconButton>
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              marginLeft: 'auto',
              transition: (theme) =>
                theme.transitions.create('transform', {
                  duration: theme.transitions.duration.shortest,
                }),
            }}
          >
            <IconifyIcon icon="material-symbols-light:expand-all" />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography component="p" variant="body2" sx={{ fontWeight: 700 }} >Product Details:</Typography>
            <Typography component="p" variant="body2" sx={{ my: 1 }} >
              Crafted from the finest materials, this sofa features a sturdy hardwood frame and
              top-grain leather upholstery. The cushions are filled with high-density foam,
              providing exceptional support and comfort.
            </Typography>
            <Typography component="p" variant="body2" sx={{ my: 1 }} >
              The sofa measures 90 inches in length, 40 inches in depth, and 35 inches in height,
              making it a spacious and inviting piece for any living room. The sleek design is
              complemented by stainless steel legs, adding a modern touch.
            </Typography>
            <Typography component="p" variant="body2" sx={{ my: 1 }} >
              Maintenance is simple with its easy-to-clean surface. Wipe down with a damp cloth
              to keep your sofa looking pristine. This piece is designed for durability, ensuring
              it withstands the test of time in both style and function.
            </Typography>
            <Typography variant="body2" sx={{ my: 1 }} >
              Order now and enjoy the ultimate in luxury seating. Assembly is straightforward,
              and we offer free shipping on all orders.
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Stack>
  );
};
render(<ProductReviewCard/>);
`.trim();

const mediaCardCode = `
<Stack sx={{ justifyContent:'center', alignItems: 'center' }}>
  <Card background={1} variant="outlined" sx={{ maxWidth: 315 }}>
    <CardMedia
      component="img"
      alt="sunlit cafe interior"
      image="${image('gallery/3')}"
      sx={{ height: 140, objectFit: 'fill' }}
    />
    <CardContent>
      <Typography gutterBottom variant="h5">
        Sunlit Cafe
      </Typography>
      <Typography variant="body2" color="text.secondary">
        A tranquil cafe interior with soft sunlight, minimalistic wooden tables, comfortable
        chairs, and a warm inviting atmosphere.
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small">Book Now</Button>
      <Button size="small">View More</Button>
    </CardActions>
  </Card>
</Stack>
`.trim();

const actionCardCode = `
<Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
  <Card background={1} variant="outlined" sx={{ maxWidth: 315 }}>
    <CardActionArea>
      <CardMedia
        component="img"
        alt="sunlit cafe interior"
        image="${image('gallery/3')}"
        sx={{ height: 140, objectFit: 'fill' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5">
          Sunlit cafe
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A tranquil cafe interior with soft sunlight, minimalistic wooden tables,
          comfortable chairs, and a warm inviting atmosphere.
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
</Stack>
`.trim();

const controlledCardCode = `
<Stack sx={{ justifyContent: 'center' }}>
  <Card background={1} variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: 345 }}>
    <Stack direction="column">
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Ambient Vibes
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Mac Miller
        </Typography>
      </CardContent>
      <Stack sx={{ alignItems: 'center', pl: 1, pb: 1 }}>
        <IconButton aria-label="previous">
          <IconifyIcon icon="material-symbols-light:skip-previous" />
        </IconButton>
        <IconButton aria-label="play/pause">
          <IconifyIcon
            icon="material-symbols-light:play-circle"
            sx={{ height: 38, width: 38 }}
          />
        </IconButton>
        <IconButton aria-label="next">
          <IconifyIcon icon="material-symbols-light:skip-next" />
        </IconButton>
      </Stack>
    </Stack>
    <CardMedia
      component="img"
      sx={{ width: 130 }}
      image="${image('categories/12')}"
      alt="Live from space album cover"
    />
  </Card>
</Stack>
`.trim();

const CardDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Card',
        description: 'Cards contain content and actions about a single subject.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Card',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-card`,
        folderLink: `${folderBaseLink}/CardDoc.jsx`,
      }}
    >
      <DocSection title="Basic Card">
        <DocCard code={basicCardCode} noInline />
      </DocSection>
      <DocSection
        title="Rounded Card"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Set &nbsp;<Code>variant="outlined"</Code>&nbsp; to render an rounded outlined card.
          </Typography>
        }
      >
        <DocCard code={outlinedCardCode} noInline />
      </DocSection>
      <DocSection title="Complex Interaction">
        <DocCard code={complexCardCode} scope={{ image }} noInline />
      </DocSection>
      <DocSection
        title="Media"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            By default, Material UI Card component uses combination of a &nbsp;
            <Code>&lt;div&gt;</Code>&nbsp; element and a background image to display the media. It
            can be problematic in some situations, for example, you might want to display a video or
            a responsive image. Use the &nbsp;
            <Code>component</Code>&nbsp; prop for these use cases:
          </Typography>
        }
      >
        <DocCard code={mediaCardCode} scope={{ image }} />
      </DocSection>
      <DocSection title="Card Actions">
        <DocCard code={actionCardCode} scope={{ image }} />
      </DocSection>
      <DocSection
        title="UI Control"
        description="Supplemental actions within the card are explicitly called out using icons, text, and UI controls, typically placed at the bottom of the card."
      >
        <DocCard code={controlledCardCode} scope={{ image }} />
      </DocSection>
    </DocPageLayout>
  );
};

export default CardDoc;
