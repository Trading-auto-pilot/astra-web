import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicRatingCode = `const BasicRating = () => {
  const [value, setValue] = useState(2);
  return (
    <Box
      sx={{
        '& > legend': { mt: 2 },
      }}
    >
      <Typography component="legend">Controlled</Typography>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
      <Typography component="legend">Read only</Typography>
      <Rating name="read-only" value={value} readOnly />
      <Typography component="legend">Disabled</Typography>
      <Rating name="disabled" value={value} disabled />
      <Typography component="legend">No rating given</Typography>
      <Rating name="no-value" value={null} />
    </Box>
  );
};
render(<BasicRating/>)
`.trim();

const halfRatingCode = `<Stack spacing={1}>
  <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
  <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
</Stack>`.trim();

const sizesRatingCode = `<Stack direction="column" spacing={2} sx={{ alignItems: 'start' }}>
  <Rating name="size-small" defaultValue={2} size="small" />
  <Rating name="size-medium" defaultValue={2} />
  <Rating name="size-large" defaultValue={2} size="large" />
</Stack>`.trim();

const hoverRatingCode = `
const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

const getLabelText = (value) => {
  return \`\${value} Star\${value !== 1 ? 's' : ''}, \${labels[value]}\`;
}

const HoverRating = () => {
  const [value, setValue] = useState(2);
  const [hover, setHover] = useState(-1);

  return (
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      <Rating
        name="hover-feedback"
        value={value}
        precision={0.5}
        getLabelText={getLabelText}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<IconifyIcon style={{ opacity: 0.15 }} icon="material-symbols-light:star" />}
      />
      {value !== null && <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>}
    </Stack>
  );
};
render(<HoverRating/>)
`.trim();

const radioRatingCode = `
const IconContainer = (props) => {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
};

const RadioGroupRating = () => {
  return (
    <Rating
      name="highlight-selected-only"
      defaultValue={2}
      slotProps={{
  			icon: {
    			component: IconContainer,
  			},
			}}
      getLabelText={(value) => customIcons[value].label}
      highlightSelectedOnly
      sx={(theme) => ({
        [\`& .\${ratingClasses.iconEmpty} .iconify\`]: {
          color: theme.vars.palette.action.disabled,
        },
      })}
    />
  );
};
render(<RadioGroupRating/>)

const customIcons = {
  1: {
    icon: (
      <IconifyIcon
        color="error.main"
        icon="material-symbols-light:sentiment-sad-outline"
        sx={{ fontSize: 25 }}
      />
    ),
    label: 'Very Dissatisfied',
  },
  2: {
    icon: (
      <IconifyIcon
        color="secondary.main"
        icon="material-symbols-light:sentiment-worried-outline"
        sx={{ fontSize: 25 }}
      />
    ),
    label: 'Dissatisfied',
  },
  3: {
    icon: (
      <IconifyIcon
        color="warning.main"
        icon="material-symbols-light:sentiment-content-outline"
        sx={{ fontSize: 25 }}
      />
    ),
    label: 'Neutral',
  },
  4: {
    icon: (
      <IconifyIcon
        color="primary.main"
        icon="material-symbols-light:sentiment-calm-outline"
        sx={{ fontSize: 25 }}
      />
    ),
    label: 'Satisfied',
  },
  5: {
    icon: (
      <IconifyIcon
        color="success.main"
        icon="material-symbols-light:sentiment-excited-outline"
        sx={{ fontSize: 25 }}
      />
    ),
    label: 'Very Satisfied',
  },
};
`.trim();

const RatingDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Rating',
        description:
          "Ratings provide insight regarding others' opinions and experiences, and can allow the user to submit a rating of their own.",
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Rating',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-rating`,
        folderLink: `${folderBaseLink}/RatingDoc.jsx`,
      }}
    >
      <DocSection
        title="Basic Rating"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use &nbsp;<Code>name</Code>&nbsp; prop to name the rating and use &nbsp;
            <Code>value</Code>&nbsp; or &nbsp;<Code>defaultValue</Code>&nbsp; prop to set any
            initial value to a rating.
          </Typography>
        }
      >
        <DocCard code={basicRatingCode} noInline />
      </DocSection>
      <DocSection
        title="Rating precision"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The rating can display any float number with the &nbsp;<Code>value</Code>&nbsp; prop.
            Use the &nbsp;<Code>precision</Code>&nbsp; prop to define the minimum increment value
            change allowed.
          </Typography>
        }
      >
        <DocCard code={halfRatingCode} />
      </DocSection>
      <DocSection
        title="Hover feedback"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can display a label on hover to help the user pick the correct rating value. The
            demo uses the &nbsp;<Code>onChangeActive</Code>&nbsp; prop.
          </Typography>
        }
      >
        <DocCard code={hoverRatingCode} noInline />
      </DocSection>
      <DocSection
        title="Sizes"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            To adjust the size of ratings, use the &nbsp;<Code>size</Code>&nbsp; prop. The default
            value is &nbsp;<Code>medium</Code>.
          </Typography>
        }
      >
        <DocCard code={sizesRatingCode} />
      </DocSection>
      <DocSection
        title="Radio Group"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The rating is implemented with a radio group, set &nbsp;
            <Code>highlightSelectedOnly</Code>&nbsp; prop to restore the natural behavior.
          </Typography>
        }
      >
        <DocCard code={radioRatingCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default RatingDoc;
