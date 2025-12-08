import { users } from 'data/users';
import { folderBaseLink } from 'lib/constants';
import SimpleBar from 'components/base/SimpleBar';
import DashboardMenu from 'components/common/DashboardMenu';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const verticalScrollCode = `import SimpleBar from 'components/base/SimpleBar';

const SimplebarVerticalScroll = () => {
  return (
    <Paper variant="outlined" sx={{ maxWidth: 300, mx: 'auto'  }}>
      <SimpleBar sx={{ maxWidth: 300, height: 320 }}>
        <List disablePadding dense sx={{ p: 1 }}>
          {users.map((user) =>
            <ListItem
              key={user.id}
              disablePadding
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    src={user.avatar}
                  />
                </ListItemAvatar>
                <ListItemText 
                  primary={user.name} 
                  slotProps={{
                    primary: { fontWeight: 600, color: 'text.primary' },
                  }}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </SimpleBar>
    </Paper>
  )
};

render(<SimplebarVerticalScroll />)`.trim();

const horizontalScrollCode = `import SimpleBar from 'components/base/SimpleBar';

const SimplebarVerticalScroll = () => {
  return (
    <Paper variant="outlined" sx={{ width: 'max-content', mx: 'auto', px: 2  }}>
      <SimpleBar sx={{ maxWidth: { xs: 250, md: 300 }}}>
        <Stack spacing={1} sx={{ width: 1, py: 2 }}>
          {users.map((user) =>
            <Avatar
              key={user.id}
              src={user.avatar}
            />
          )}
        </Stack>
      </SimpleBar>
    </Paper>
  )
};

render(<SimplebarVerticalScroll />)`.trim();

const ScrollbarDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Scrollbar',
        description:
          "Simplebar React provides custom scrollbars that visually enhance your app while maintaining native scrolling behavior and cross-browser consistency. It's a lightweight solution for making custom scrollbars.",

        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Scrollbar',
          },
        ],
        folderLink: `${folderBaseLink}/ScrollbarDoc.jsx`,
        docLink: 'https://github.com/Grsmto/simplebar/tree/master/packages/simplebar-react',
        docLinkLabel: 'Simplebar Docs',
      }}
    >
      <DocSection title="Vertical Scroll">
        <DocCard
          code={verticalScrollCode}
          noInline
          scope={{
            SimpleBar,
            users,
            DashboardMenu,
          }}
        />
      </DocSection>

      <DocSection title="Horizontal Scroll">
        <DocCard
          code={horizontalScrollCode}
          noInline
          scope={{
            SimpleBar,
            users,
            DashboardMenu,
          }}
        />
      </DocSection>
    </DocPageLayout>
  );
};

export default ScrollbarDoc;
