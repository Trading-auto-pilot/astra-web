import { List, ListItem, ListItemText, Typography, listItemClasses } from '@mui/material';
import { initialConfig } from 'config';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import Image from 'components/base/Image';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const person = (index) => `${initialConfig.assetsDir}/images/avatar/${index}.webp`;

const imageAvatarCode = `<Stack spacing={1}>
  <Avatar alt="Remy Sharp" src="${person(1)}" />
  <Avatar alt="Cindy Baker" src="${person(2)}" />
  <Avatar alt="Travis Howard" src="${person(3)}" />
  <Avatar alt="Sophia Davis" src="${person(4)}" />
</Stack>`;

const letterAvatarCode = `<Stack spacing={1}>
  <Avatar>H</Avatar>
  <Avatar sx={{ bgcolor: 'warning.main' }}>N</Avatar>
  <Avatar sx={{ bgcolor: 'secondary.main' }}>OP</Avatar>
  <Avatar sx={{ bgcolor: 'success.light' }}>AI</Avatar>
</Stack>`;

const iconAvatarCode = `<Stack spacing={1}>
  <Avatar>
    <IconifyIcon icon="material-symbols:assignment-outline" />
  </Avatar>
  <Avatar sx={{ bgcolor: 'primary.main' }}>
    <IconifyIcon icon="material-symbols-light:folder" />
  </Avatar>
  <Avatar sx={{ bgcolor: 'warning.main' }}>
    <IconifyIcon icon="material-symbols-light:pageview" />
  </Avatar>
</Stack>`;

const variantCode = `<Stack spacing={1}>
  <Avatar alt="Daniel" src="${person(3)}" />
  <Avatar variant="square">
    <IconifyIcon icon="material-symbols-light:notifications" />
  </Avatar>
  <Avatar alt="Daniel" variant="rounded">
    D
  </Avatar>
</Stack>`;

const sizesCode = `<Stack spacing={1}>
  <Avatar alt="Remy Sharp" src="${person(3)}" sx={{ width: 24, height: 24 }} />
  <Avatar alt="Remy Sharp" src="${person(3)}" sx={{ width: 32, height: 32 }} />
  <Avatar alt="Remy Sharp" src="${person(3)}" />
  <Avatar alt="Remy Sharp" src="${person(3)}" sx={{ width: 50, height: 50 }} />
</Stack>`;

const groupedAvatarCode = `<Stack spacing={1}>
  <AvatarGroup max={4}
    sx={{
      [\`& .\${avatarGroupClasses.avatar}\`]: {
        fontSize: 16,
      },
    }}
  >
    <Tooltip title="James Smith">
      <Avatar alt="James Smith" src="${person(1)}" />
    </Tooltip>
    <Tooltip title="Sophia Davis">
      <Avatar alt="Sophia Davis" src="${person(2)}" />
    </Tooltip>
    <Tooltip title="Ethan Johnson">
      <Avatar alt="Ethan Johnson" src="${person(3)}" />
    </Tooltip>
    <Tooltip title="John Doe">
      <Avatar alt="John Doe" src="${person(4)}" />
    </Tooltip>
    <Tooltip title="Remy Sharp">
      <Avatar alt="Remy Sharp" />
    </Tooltip>
  </AvatarGroup>
</Stack>`;

const totalAvatarCode = `<Stack spacing={1}>
  <AvatarGroup total={24} 
    sx={{
      [\`& .\${avatarGroupClasses.avatar}\`]: {
        fontSize: 16,
      },
    }}
  >
    <Tooltip title="James Smith">
      <Avatar alt="James Smith" src="${person(1)}" />
    </Tooltip>
    <Tooltip title="Sophia Davis">
      <Avatar alt="Sophia Davis" src="${person(2)}" />
    </Tooltip>
    <Tooltip title="Ethan Johnson">
      <Avatar alt="Ethan Johnson" src="${person(3)}" />
    </Tooltip>
    <Tooltip title="John Doe">
      <Avatar alt="John Doe" src="${person(4)}" />
    </Tooltip>
    <Tooltip title="Remy Sharp">
      <Avatar alt="Remy Sharp" />
    </Tooltip>
  </AvatarGroup>
</Stack>`;

const surplusAvatarCode = `<Stack spacing={1}>
  <AvatarGroup max={4} renderSurplus={(surplus) => <span>+{surplus.toString()[0]}k</span>}
  total={4251}
    sx={{
      [\`& .\${avatarGroupClasses.avatar}\`]: {
        fontSize: 16,
      },
    }}
  >
    <Tooltip title="James Smith">
      <Avatar alt="James Smith" src="${person(1)}" />
    </Tooltip>
    <Tooltip title="Sophia Davis">
      <Avatar alt="Sophia Davis" src="${person(2)}" />
    </Tooltip>
    <Tooltip title="Ethan Johnson">
      <Avatar alt="Ethan Johnson" src="${person(3)}" />
    </Tooltip>
    <Tooltip title="John Doe">
      <Avatar alt="John Doe" src="${person(4)}" />
    </Tooltip>
    <Tooltip title="Remy Sharp">
      <Avatar alt="Remy Sharp" />
    </Tooltip>
  </AvatarGroup>
</Stack>`;

const fallbackAvatarCode = `<Stack spacing={1}>
    <Avatar sx={{ bgcolor: 'primary.main' }} alt="Remy Sharp" src="/broken-image.jpg">
        B
    </Avatar>
    <Avatar sx={{ bgcolor: 'warning.main' }} alt="Remy Sharp" src="/broken-image.jpg" />
    <Avatar src="/broken-image.jpg" />
</Stack>`;

const badgeAvatarCode = `import Image from 'components/base/Image';

const BadgeAvatars = () => {
  return (
    <Stack spacing={2}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        color="success"
      >
        <Avatar alt="Remy Sharp" src="${person(1)}" />
      </Badge>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Image
            src="${person(3)}"
            height={21}
            width={21}
            alt="icon"
            sx={{ borderRadius: 10, border: 2, borderColor: 'common.white' }}
          />
        }
      >
        <Avatar alt="Travis Howard" src="${person(4)}" />
      </Badge>
    </Stack>
  );
};

render(<BadgeAvatars/>)
`;

const AvatarDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Avatar',
        description:
          'Avatars are found throughout material design with uses in everything from tables to dialog menus.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Avatar',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-avatar`,
        folderLink: `${folderBaseLink}/AvatarDoc.jsx`,
      }}
    >
      <DocSection title="Image Avatar">
        <DocCard code={imageAvatarCode} scope={{ person }} />
      </DocSection>
      <DocSection title="Letter Avatar">
        <DocCard code={letterAvatarCode} />
      </DocSection>
      <DocSection title="Icon Avatar">
        <DocCard code={iconAvatarCode} />
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
            Use the variant prop with the Avatar component for different shapes such as&nbsp;{' '}
            <Code>circular</Code> (default), <Code>square</Code>&nbsp; or&nbsp;<Code>rounded</Code>
            &nbsp;.
          </Typography>
        }
      >
        <DocCard code={variantCode} scope={{ person }} />
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
            You can change the size of the avatar with the &nbsp;<Code>height</Code>&nbsp; and
            &nbsp;
            <Code>width</Code>&nbsp; CSS properties.
          </Typography>
        }
      >
        <DocCard code={sizesCode} scope={{ person }} />
      </DocSection>
      <DocSection
        title="Fallbacks"
        descriptionEl={
          <>
            <Typography variant="body1">
              If there is an error loading the avatar image, the component falls back to an
              alternative in the following order:
            </Typography>

            <List
              sx={{
                listStyleType: 'disc',
                pl: 5,
                mb: 5,
                [`& .${listItemClasses.root}`]: {
                  display: 'list-item',
                },
              }}
            >
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <ListItemText
                  primary={<Typography component="span">the provided children</Typography>}
                />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <ListItemText
                  primary={
                    <Typography>
                      the first letter of the &nbsp; <Code>alt</Code>&nbsp; text
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <ListItemText primary={<Typography>a generic avatar icon</Typography>} />
              </ListItem>
            </List>
          </>
        }
      >
        <DocCard code={fallbackAvatarCode} />
      </DocSection>
      <DocSection
        title="Grouped Avatar"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            &nbsp;<Code>AvatarGroup</Code>&nbsp; renders its children as a stack. Use the &nbsp;
            <Code>max</Code>&nbsp; prop to limit the number of avatars.
          </Typography>
        }
      >
        <DocCard code={groupedAvatarCode} scope={{ person }} sx={{ mb: 3 }} />
        <DocNestedSection id="total-avatar" title="Total Avatar">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            If you need to control the total number of avatars not shown, you can use the &nbsp;
            <Code>total</Code>&nbsp; prop.
          </Typography>
          <DocCard code={totalAvatarCode} scope={{ person }} sx={{ mb: 3 }} />
        </DocNestedSection>
        <DocNestedSection id="custom-surplus" title="Custom Surplus">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            <Code>renderSurplus</Code>&nbsp; prop is useful when you need to render the surplus
            based on the data sent from the server.
          </Typography>
          <DocCard code={surplusAvatarCode} scope={{ person }} />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="With Badge"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use &nbsp;<Code>Avatar</Code>&nbsp; component as a child of &nbsp;<Code>Badge</Code>
            &nbsp; component.
          </Typography>
        }
      >
        <DocCard code={badgeAvatarCode} scope={{ person, Image }} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default AvatarDoc;
