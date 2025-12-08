import { Link, ListItem, ListItemText, Typography } from '@mui/material';
import Code from 'components/base/Code';
import CodeBlock from 'components/common/CodeBlock';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection, { DocList, DocSubtitle } from 'components/docs/DocSection';

const Routing = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Routing',
        descriptionEl: (
          <Typography sx={{ color: 'text.secondary' }}>
            Aurora uses{' '}
            <Link href="https://reactrouter.com/en/main" underline="none">
              react-router
            </Link>{' '}
            for routing, providing a seamless navigation experience across different pages and
            components within the application. Routes are defined and managed to ensure efficient
            rendering and user interaction.
          </Typography>
        ),
      }}
    >
      <DocSection title="Core Files">
        <DocList>
          <ListItem>
            <ListItemText disableTypography>
              <Code>paths.js</Code> src/routes/paths.js
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              <Code>router.jsx</Code> src/routes/router.jsx
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              <Code>sitemap.js</Code> src/routes/sitemap.js
            </ListItemText>
          </ListItem>
        </DocList>
      </DocSection>
      <DocSection title="Routing Architecture">
        <DocList
          sx={{
            color: 'text.secondary',
            listStyleType: 'decimal',
          }}
        >
          <ListItem sx={{ mb: 2 }}>
            <ListItemText disableTypography>
              <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                Path Definitions:
              </DocSubtitle>{' '}
              Aurora's path definitions are split into two parts:
            </ListItemText>
            <DocList sx={{ mb: 2 }}>
              <ListItem>
                <ListItemText disableTypography>
                  <Code>Roots</Code> These are the base paths that serve as parent routes.
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText disableTypography>
                  <Code>Route Paths</Code> These are the child paths, which need to be concatenated
                  with their respective parent paths from the roots.
                </ListItemText>
              </ListItem>
            </DocList>
            <Typography>
              This approach centralizes the route paths, allowing them to be updated from a single
              place. It also enables using these paths from multiple places, as
              <Code>react-router</Code> doesn't support named routes.
            </Typography>
          </ListItem>
          <ListItem sx={{ mb: 2 }}>
            <ListItemText disableTypography>
              <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                Router Configuration:
              </DocSubtitle>{' '}
            </ListItemText>

            <DocList>
              <ListItem>
                <ListItemText disableTypography>
                  In <Code>router.jsx</Code>, routes are defined within a hierarchical structure.
                  The <Code>routes</Code> array includes all the necessary routes for the
                  application. Also, the router object is created here using{' '}
                  <Code>createBrowserRouter</Code>.
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText disableTypography>
                  In <Code>main.jsx</Code> The router configuration is integrated using{' '}
                  <Code>RouterProvider</Code>. The <Code>router</Code> object is passed to{' '}
                  <Code>RouterProvider</Code>, which handles the navigation and routing logic for
                  the entire app.
                </ListItemText>
              </ListItem>
            </DocList>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                Sitemap:
              </DocSubtitle>{' '}
              The <Code>sitemap</Code> is an array of objects that defines the hierarchical
              navigation structure of the Aurora application. It is used to generate both the side
              and top navigation menus.
            </ListItemText>
          </ListItem>
        </DocList>
      </DocSection>
      <DocSection title="Adding a new route">
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          To add a new route in Aurora, follow these steps:
        </Typography>
        <DocList sx={{ listStyleType: 'decimal' }}>
          <ListItem>
            <DocSubtitle>Define the Path:</DocSubtitle>
            <DocList>
              <ListItem>
                <ListItemText disableTypography>
                  Open <Code>paths.js</Code> and add a new path to the appropriate root or create a
                  new root if necessary. For example:
                </ListItemText>
                <CodeBlock
                  code={`export default {
  ...,
  newRoute: \`/\${rootPaths.pagesRoot}/new-route\`,
};`}
                />
              </ListItem>
            </DocList>
          </ListItem>
          <ListItem>
            <DocSubtitle>Add the Route Configuration:</DocSubtitle>
            <DocList>
              <ListItem>
                <ListItemText disableTypography>
                  In <Code>router.jsx</Code>, locate the appropriate section where the new route
                  should be added. Add a new route object to the children array, specifying the path
                  and the component to render:
                </ListItemText>
                <CodeBlock
                  code={`...
const NewRoute = lazy(() => import('pages/others/NewRoute'));

export const routes = [
  ...
  {
    path: paths.newRoute,
    element: <NewRoute />
  }
  ...
]`}
                />
              </ListItem>
              <ListItem>
                <ListItemText disableTypography>
                  Ensure that the new route's parent structure is correctly set, so the layout and
                  guards are applied properly.
                </ListItemText>
              </ListItem>
            </DocList>
          </ListItem>
          <ListItem>
            <DocSubtitle>Adding item to the navigation menu:</DocSubtitle>
            <DocList>
              <ListItem>
                <ListItemText disableTypography>
                  In <Code>sitemap.js</Code>, add a new item to the appropriate section of the
                  sitemap. For example, to add a new item under "Apps":
                </ListItemText>
                <CodeBlock
                  code={`...
const sitemap: MenuItem[] = [

export const routes = [
  ...
  {
    id: 'pages',
    subheader: 'Pages',
    icon: 'material-symbols:view-quilt-outline',
    items: [
      ...
      {
        name: 'New Route',
        path: paths.newRoute,
        pathName: 'new-route',
        icon: 'material-symbols:play-circle-outline-rounded',
        active: true,
      },
      ...
    ],
  },
  ...
]`}
                />
              </ListItem>
              <ListItem>
                <ListItemText disableTypography>
                  Ensure the <Code>path</Code> property in your new item is correctly defined in the
                  <Code>paths.js</Code> file or manually enter the desired route.
                </ListItemText>
              </ListItem>
            </DocList>
          </ListItem>
        </DocList>
      </DocSection>
    </DocPageLayout>
  );
};

export default Routing;
