import { Button, Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import { kebabCase } from 'lib/utils';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';
import { VisuallyHiddenInput } from 'components/styled/VisuallyHiddenInput';

const containedBtnCode = `<Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
  <Button variant="contained" color="primary">
    Primary
  </Button>
  <Button variant="contained" color="secondary">
    Secondary
  </Button>
  <Button variant="contained" color="info">
    Info
  </Button>
  <Button variant="contained" color="success">
    Success
  </Button>
  <Button variant="contained" color="warning">
    Warning
  </Button>
  <Button variant="contained" color="error">
    Error
  </Button>
  <Button variant="contained" color="neutral">
    Neutral
  </Button>
</Stack>`;

const outlinedBtnCode = `<Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
  <Button variant="outlined" color="primary">
    Primary
  </Button>
  <Button variant="outlined" color="secondary">
    Secondary
  </Button>
  <Button variant="outlined" color="info">
    Info
  </Button>
  <Button variant="outlined" color="success">
    Success
  </Button>
  <Button variant="outlined" color="warning">
    Warning
  </Button>
  <Button variant="outlined" color="error">
    Error
  </Button>
  <Button variant="outlined" color="neutral">
    Neutral
  </Button>
</Stack>`;

const textBtnCode = `<Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
  <Button variant="text" color="primary">
    Primary
  </Button>
  <Button variant="text" color="secondary">
    Secondary
  </Button>
  <Button variant="text" color="info">
    Info
  </Button>
  <Button variant="text" color="success">
    Success
  </Button>
  <Button variant="text" color="warning">
    Warning
  </Button>
  <Button variant="text" color="error">
    Error
  </Button>
  <Button variant="text" color="neutral">
    Neutral
  </Button>
</Stack>`;

const softBtnCode = `<Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
  <Button variant="soft" color="primary">
    Primary
  </Button>
  <Button variant="soft" color="secondary">
    Secondary
  </Button>
  <Button variant="soft" color="info">
    Info
  </Button>
  <Button variant="soft" color="success">
    Success
  </Button>
  <Button variant="soft" color="warning">
    Warning
  </Button>
  <Button variant="soft" color="error">
    Error
  </Button>
  <Button variant="soft" color="neutral">
    Neutral
  </Button>
</Stack>`;

const sizesCode = ` <Box sx={{ '& button': { m: 1 } }}>
  <div>
    <Button size="small">Small</Button>
    <Button size="medium">Medium</Button>
    <Button size="large">Large</Button>
  </div>
  <div>
    <Button variant="outlined" size="small">
      Small
    </Button>
    <Button variant="outlined" size="medium">
      Medium
    </Button>
    <Button variant="outlined" size="large">
      Large
    </Button>
  </div>
  <div>
    <Button variant="soft" size="small">
      Small
    </Button>
    <Button variant="soft" size="medium">
      Medium
    </Button>
    <Button variant="soft" size="large">
      Large
    </Button>
  </div>
  <div>
    <Button variant="contained" size="small">
      Small
    </Button>
    <Button variant="contained" size="medium">
      Medium
    </Button>
    <Button variant="contained" size="large">
      Large
    </Button>
  </div>
</Box>`;

const shapeCode = `<Stack direction="column" spacing={1}>
  <Stack spacing={1} sx={{ alignItems: 'center' }}>
    <Button variant="contained" shape="circle" color="primary" size="large">
      <IconifyIcon 
        icon="material-symbols:add-circle-outline-rounded" 
        sx={{ fontSize: 22 }} 
      />
    </Button>
    <Button variant="contained" shape="square" color="secondary" size="large">
      <IconifyIcon 
        icon="material-symbols:add-circle-outline-rounded" 
        sx={{ fontSize: 22 }} 
      />
    </Button>
  </Stack>
  <Stack spacing={1}>
    <Button variant="contained" shape="circle" color="primary">
      <IconifyIcon 
        icon="material-symbols:add-circle-outline-rounded" 
        sx={{ fontSize: 20 }} 
      />
    </Button>
    <Button variant="contained" shape="square" color="secondary">
      <IconifyIcon 
        icon="material-symbols:add-circle-outline-rounded" 
        sx={{ fontSize: 20 }} 
      />
    </Button>
  </Stack>
  <Stack spacing={1}>
    <Button variant="contained" shape="circle" color="primary" size="small">
      <IconifyIcon 
        icon="material-symbols:add-circle-outline-rounded" 
        sx={{ fontSize: 18 }} 
      />
    </Button>
    <Button variant="contained" shape="square" color="secondary" size="small">
      <IconifyIcon 
        icon="material-symbols:add-circle-outline-rounded" 
        sx={{ fontSize: 18 }} 
      />
    </Button>
  </Stack>
</Stack>`;

const iconWithLabelCode = `<Stack spacing={1}>
  <Button 
    variant="outlined" 
    startIcon={
      <IconifyIcon icon="material-symbols:delete" sx={{ fontSize: 20 }} />
    }
  >
    Delete
  </Button>
  <Button 
    variant="contained" 
    endIcon={
      <IconifyIcon icon="material-symbols:send" sx={{ fontSize: 20 }} />
    }
  >
    Send
  </Button>
</Stack>`;

const iconButtonCode = `<Stack spacing={1}>
  <IconButton aria-label="delete" size="large">
    <IconifyIcon 
      icon="material-symbols:delete-outline-rounded" 
      sx={{ fontSize: 24 }} 
    />
  </IconButton>
  <IconButton aria-label="delete" disabled color="primary" size="large">
    <IconifyIcon 
      icon="material-symbols:delete-outline-rounded" 
      sx={{ fontSize: 24 }} 
    />
  </IconButton>
  <IconButton color="secondary" aria-label="add an alarm" size="large">
    <IconifyIcon 
      icon="material-symbols:alarm-outline-rounded" 
      sx={{ fontSize: 24 }} 
    />
  </IconButton>
  <IconButton color="primary" aria-label="add to shopping cart" size="large">
    <IconifyIcon 
      icon="material-symbols:add-shopping-cart" 
      sx={{ fontSize: 24 }} 
    />
  </IconButton>
</Stack>
`;

const iconButtonSizesCode = `<Stack spacing={1} sx={{ alignItems: 'center' }}>
  <IconButton aria-label="delete" size="small">
    <IconifyIcon 
      icon="material-symbols:delete-outline-rounded" 
      sx={{ fontSize: 18 }} 
    />
  </IconButton>
  <IconButton aria-label="delete" size="small">
    <IconifyIcon 
      icon="material-symbols:delete-outline-rounded" 
      sx={{ fontSize: 20 }} 
    />
  </IconButton>
  <IconButton aria-label="delete" size="large">
    <IconifyIcon 
      icon="material-symbols:delete-outline-rounded" 
      sx={{ fontSize: 24 }} 
    />
  </IconButton>
  <IconButton aria-label="delete" size="large">
    <IconifyIcon 
      icon="material-symbols:delete-outline-rounded" 
      sx={{ fontSize: 28 }} 
    />
  </IconButton>
</Stack>
`;

const iconButtonColorsCode = `<Stack spacing={1}>
  <IconButton aria-label="fingerprint" color="secondary">
    <IconifyIcon 
      icon="material-symbols:fingerprint" 
      sx={{ fontSize: 24 }} 
    />
  </IconButton>
  <IconButton aria-label="fingerprint" color="success">
    <IconifyIcon 
      icon="material-symbols:fingerprint" 
      sx={{ fontSize: 24 }} 
    />
  </IconButton>
</Stack>`;

const fileUploadCode = `<Button
  component="label"
  role={undefined}
  variant="contained"
  tabIndex={-1}
  startIcon={
    <IconifyIcon 
      icon="material-symbols:cloud-upload" 
      sx={{ fontSize: 20 }} 
    />
  }
>
  Upload file
  <VisuallyHiddenInput type="file" />
</Button>`;

const loadingButtonCode = `<Stack spacing={2} sx={{ flexWrap: 'wrap' }}>
  <Button loading variant="outlined">
    Submit
  </Button>
  <Button loading loadingIndicator="Loading…" variant="outlined">
    Fetch data
  </Button>
  <Button
    loading
    loadingPosition="start"
    startIcon={
      <IconifyIcon icon="material-symbols:save" sx={{ fontSize: 20 }} />
    }
    variant="outlined"
  >
    Save
  </Button>
</Stack>`;

const ButtonDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Buttons',
        description: 'Buttons allow users to take actions, and make choices, with a single tap.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Buttons',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-button`,
        folderLink: `${folderBaseLink}/ButtonDoc.jsx`,
      }}
    >
      <DocSection
        title="Basic button"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
              color: 'text.secondary',
            }}
          >
            The <Code>Button</Code> comes with the variants: text (default), contained, soft and
            outlined.
          </Typography>
        }
      >
        <DocNestedSection title="Contained button" id={kebabCase('Contained button')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
              color: 'text.secondary',
            }}
          >
            Contained buttons are high-emphasis, distinguished by their use of elevation and fill.
            They contain actions that are primary to your app.
          </Typography>
          <DocCard code={containedBtnCode} sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Soft button" id={kebabCase('Soft button')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Soft buttons provide a gentle emphasis with a subtle background and solid text color,
            ideal for secondary actions that need visual distinction without overpowering the
            primary content.
          </Typography>
          <DocCard code={softBtnCode} sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Outlined button" id={kebabCase('Outlined button')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Outlined buttons are medium-emphasis buttons. They contain actions that are important
            but aren't the primary action in an app.
          </Typography>
          <DocCard code={outlinedBtnCode} sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Text button" id={kebabCase('Text button')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Text buttons are typically used for less-pronounced actions, including those located: in
            dialogs, in cards. In cards, text buttons help maintain an emphasis on card content.
          </Typography>
          <DocCard code={textBtnCode} sx={{ mb: 4 }} />
        </DocNestedSection>
      </DocSection>

      <DocSection
        title="Button Sizes"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            For larger or smaller buttons, use the <Code>size</Code> prop. Default is{' '}
            <Code>medium</Code>.
          </Typography>
        }
      >
        <DocCard code={sizesCode} />
      </DocSection>
      <DocSection
        title="Button Shape"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can change the shape of the button using the <Code>shape</Code> prop.
          </Typography>
        }
      >
        <DocCard code={shapeCode} />
      </DocSection>
      <DocSection title="Buttons with icons and label">
        <DocCard code={iconWithLabelCode} />
      </DocSection>
      <DocSection title="Icon button">
        <DocCard code={iconButtonCode} sx={{ mb: 4 }} />

        <DocNestedSection title="Sizes" id={kebabCase('Sizes')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            For larger or smaller icon buttons, use the <Code>size</Code> prop. Default is{' '}
            <Code>medium</Code>.
          </Typography>
          <DocCard code={iconButtonSizesCode} sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Colors" id={kebabCase('Colors')}>
          <DocCard code={iconButtonColorsCode} sx={{ mb: 4 }} />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="File upload"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            To create a file upload button, turn the button into a label using{' '}
            <Code>component="label"</Code> and then create a visually-hidden input with type{' '}
            <Code>file</Code>.
          </Typography>
        }
      >
        <DocCard code={fileUploadCode} scope={{ VisuallyHiddenInput }} />
      </DocSection>
      <DocSection
        title="Loading button"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use the <Code>loading</Code> prop to set icon buttons in a loading state and disable
            interactions.
          </Typography>
        }
      >
        <DocCard code={loadingButtonCode} scope={{ Button }} />
      </DocSection>
    </DocPageLayout>
  );
};

export default ButtonDoc;
