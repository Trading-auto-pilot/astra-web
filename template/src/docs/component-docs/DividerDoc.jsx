import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicDividerCode = `
<Stack sx={{ justifyContent: 'center' }}>
  <Card variant="outlined" sx={{ maxWidth: 360 }}>
    <Box sx={{ p: 2 }}>
      <Stack sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography gutterBottom variant="h5" component="div">
          Toothbrush
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          $4.50
        </Typography>
      </Stack>
      <Typography color="text.secondary" variant="body2">
        Pinstriped cornflower blue cotton blouse takes you on a walk to the park or
        just down the hall.
      </Typography>
    </Box>
    <Divider />
    <Box sx={{ p: 2 }}>
      <Typography gutterBottom variant="body2">
        Select type
      </Typography>
      <Stack spacing={1}>
        <Chip color="primary" label="Soft" />
        <Chip label="Medium" />
        <Chip label="Hard" />
      </Stack>
    </Box>
  </Card>
</Stack>
`.trim();

const dividerVariantsCode = `
<Stack sx={{ justifyContent: 'center' }}>
  <List
    sx={{
      py: 0,
      width: 1,
      maxWidth: 360,
      borderRadius: 2,
      border: 1,
      borderColor: 'divider',
      backgroundColor: 'background.paper',
    }}
  >
    <ListItem>
      <ListItemText primary="Full width variant below" />
    </ListItem>
    <Divider component="li" />
    <ListItem>
      <ListItemText primary="Inset variant below" />
    </ListItem>
    <Divider variant="inset" component="li" />
    <ListItem>
      <ListItemText primary="Middle variant below" />
    </ListItem>
    <Divider variant="middle" component="li" />
    <ListItem>
      <ListItemText primary="List item" />
    </ListItem>
  </List>
</Stack>
`.trim();

const verticalDividersCode = `
<Stack sx={{ justifyContent: 'center' }}>
  <Stack
    sx={{
      alignItems: 'center',
      border: 1,
      borderColor: 'divider',
      borderRadius: 1.5,
      bgcolor: 'background.paper',
      color: 'text.secondary',
      '& svg': {
        m: 1,
      },
      '& hr': {
        mx: 0.5,
      },
    }}
  >
    <IconifyIcon icon="material-symbols-light:format-align-left" sx={{ fontSize: 24 }} />
    <IconifyIcon icon="material-symbols-light:format-align-justify" sx={{ fontSize: 24 }} />
    <IconifyIcon icon="material-symbols-light:format-align-right" sx={{ fontSize: 24 }} />
    <Divider orientation="vertical" flexItem />
    <IconifyIcon icon="material-symbols-light:format-bold" sx={{ fontSize: 24 }} />
  </Stack>
</Stack>
`.trim();

const flexDividerCode = `
<Stack sx={{ justifyContent: 'center' }}>
  <Stack
    sx={{
      alignItems: 'center',
      border: 1,
      borderColor: 'divider',
      borderRadius: 2,
      bgcolor: 'background.paper',
      color: 'text.secondary',
      '& svg': {
        m: 1,
      },
    }}
  >
    <IconifyIcon icon="material-symbols-light:format-bold" fontSize={24} />
    <Divider orientation="vertical" variant="middle" flexItem />
    <IconifyIcon icon="material-symbols-light:format-italic" fontSize={24} />
  </Stack>
</Stack>
`.trim();

const dividerTextCode = `
<Stack sx={{ justifyContent: 'center' }}>
  <Stack direction="column" spacing={2} sx={{ justifyContent: 'center' }}>
    <Typography variant="body2">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </Typography>
    <Divider>CENTER</Divider>
    <Typography variant="body2">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </Typography>
    <Divider textAlign="left">LEFT</Divider>
    <Typography variant="body2">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </Typography>
    <Divider textAlign="right">RIGHT</Divider>
    <Typography variant="body2">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </Typography>
    <Divider>
      <Chip label="Chip" />
    </Divider>
    <Typography variant="body2">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </Typography>
  </Stack>
</Stack>
`.trim();

const verticalDividerMiddleCode = `
<Stack sx={{ justifyContent: 'center' }}>
  <Card
    variant="outlined"
    sx={{
      display: 'flex',
      color: 'text.secondary',
      '& svg': {
        m: 1,
      },
      '& hr': {
        mx: 0.5,
      },
    }}
  >
    <IconifyIcon icon="material-symbols-light:format-align-left" fontSize={24} />
    <IconifyIcon icon="material-symbols-light:format-align-justify" fontSize={24} />
    <IconifyIcon icon="material-symbols-light:format-align-right" fontSize={24} />
    <Divider orientation="vertical" variant="middle" flexItem />
    <IconifyIcon icon="material-symbols-light:format-bold" fontSize={24} />
  </Card>
</Stack>
`.trim();

const DividerDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Divider',
        description:
          'The Divider component provides a thin, unobtrusive line for grouping elements to reinforce visual hierarchy.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Divider',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-divider`,
        folderLink: `${folderBaseLink}/DividerDoc.jsx`,
      }}
    >
      <DocSection title="Usage">
        <DocCard code={basicDividerCode} />
      </DocSection>
      <DocSection
        title="Variants"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The Divider component supports three variants: &nbsp;<Code>fullWidth</Code> (default)
            ,&nbsp; &nbsp;<Code>inset</Code>&nbsp; and &nbsp;<Code>middle</Code>&nbsp;.
          </Typography>
        }
      >
        <DocCard code={dividerVariantsCode} />
      </DocSection>
      <DocSection
        title="Orientation"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use the &nbsp;<Code>orientation</Code>,&nbsp; prop to change the Divider from horizontal
            to vertical.
          </Typography>
        }
      >
        <DocCard code={verticalDividersCode} />
      </DocSection>
      <DocSection
        title="Flex Item"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use the &nbsp;<Code>flexItem</Code>&nbsp; prop to display the Divider when it's being
            used in a flex container.
          </Typography>
        }
      >
        <DocCard code={flexDividerCode} />
      </DocSection>
      <DocSection
        title="With Children"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use the &nbsp;<Code>textAlign</Code>&nbsp; prop to align elements that are wrapped by
            the Divider.
          </Typography>
        }
      >
        <DocCard code={dividerTextCode} />
      </DocSection>
      <DocSection
        title="Icon Grouping"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The demo below shows how to combine the props &nbsp;<Code>variant="middle"</Code>&nbsp;
            and &nbsp;<Code>orientation="vertical"</Code>&nbsp;.
          </Typography>
        }
      >
        <DocCard code={verticalDividerMiddleCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default DividerDoc;
