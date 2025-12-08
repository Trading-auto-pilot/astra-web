import { Link, ListItem, ListItemText, Typography, listItemClasses } from '@mui/material';
import paths from 'routes/paths';
import Code from 'components/base/Code';
import CodeBlock from 'components/common/CodeBlock';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection, { DocList, DocSubtitle } from 'components/docs/DocSection';

const Layouts = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Layouts',
        descriptionEl: (
          <Typography sx={{ color: 'text.secondary' }}>
            Aurora offers a highly flexible layout system designed to cater to various application
            needs. The layout is divided into <Code>Sidenav</Code>, <Code>Topnav</Code>, and{' '}
            <Code>Combo</Code> (a combination of bothLayout). These layouts can be customized
            through the configuration options provided, allowing for a modular and adaptive
            structure.
          </Typography>
        ),
      }}
    >
      <DocSection title="Layout Types">
        <DocList
          sx={{
            listStyleType: 'decimal',
          }}
        >
          <ListItem sx={{ mb: 2 }}>
            <ListItemText disableTypography>
              <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                Sidenav Layout:
              </DocSubtitle>{' '}
              A side navigation-based layout, typically seen in admin dashboards. The Sidenav itself
              comes in three different variants:
            </ListItemText>

            <DocList>
              <ListItem>
                <ListItemText disableTypography>
                  <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                    Default:
                  </DocSubtitle>{' '}
                  Standard Sidenav with full width.
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText disableTypography>
                  <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                    Slim:
                  </DocSubtitle>{' '}
                  A more compact version of the Sidenav, saving horizontal space.
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText disableTypography>
                  <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                    Stacked:
                  </DocSubtitle>{' '}
                  A stacked layout variant, designed for better organization of navigation items.
                </ListItemText>
              </ListItem>
            </DocList>
          </ListItem>
          <ListItem sx={{ mb: 2 }}>
            <ListItemText disableTypography>
              <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                Topnav Layout:
              </DocSubtitle>{' '}
              A top navigation bar-based layout, ideal for simpler applications or landing pages.
              The Topnav also comes in three variants:
            </ListItemText>

            <DocList>
              <ListItem>
                <ListItemText disableTypography>
                  <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                    Default:
                  </DocSubtitle>{' '}
                  A standard top navigation bar.
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText disableTypography>
                  <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                    Slim:
                  </DocSubtitle>{' '}
                  A minimalistic version, offering a cleaner design.
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText disableTypography>
                  <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                    Stacked:
                  </DocSubtitle>{' '}
                  A stacked top navigation bar for better grouping of content.
                </ListItemText>
              </ListItem>
            </DocList>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                Combo Layout:
              </DocSubtitle>{' '}
              Aurora's Combo Layout allows for combining any of the Sidenav variants with any of the
              Topnav variants, giving users the freedom to mix and match according to their design
              needs.
            </ListItemText>
          </ListItem>
        </DocList>
      </DocSection>

      <DocSection title="Main Layout Configuration">
        <Typography sx={{ color: 'text.secondary' }}>
          Aurora's layout logic is managed inside the MainLayout component located at{' '}
          <Code>src/layouts/main-layout/MainLayout.jsx</Code>. The layout is configured dynamically
          using the following <Link href={paths.configuration}>configuration</Link> values:
        </Typography>
        <DocList sx={{ mb: 2 }}>
          <ListItem>
            <ListItemText disableTypography>
              <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                navigationMenuType:
              </DocSubtitle>{' '}
              Defines whether the app uses Sidenav, Topnav, or Combo Layout.
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                sidenavType:
              </DocSubtitle>{' '}
              Controls which variant of Sidenav is being used.
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
                topnavType:
              </DocSubtitle>{' '}
              Controls which Topnav variant is applied.
            </ListItemText>
          </ListItem>
        </DocList>
        <Typography sx={{ mb: 5, color: 'text.secondary' }}>
          The conditional logic in the <Code>MainLayout</Code> component ensures that the correct
          layout is applied based on the configuration values from the{' '}
          <Code>useSettingsContext()</Code> hook.
        </Typography>

        <DocSubtitle sx={{ mb: 2 }}>
          <Code>src/layouts/main-layout/index.jsx</Code> File
        </DocSubtitle>
        <Typography sx={{ mb: 2, color: 'text.secondary' }}>
          The <Code>index.jsx</Code> file is responsible for exporting the <Code>MainLayout</Code>{' '}
          as the default layout for Aurora. If you need to use a specific layout—such as
          <Code>SidenavLayout</Code>, <Code>TopnavLayout</Code>, or <Code>ComboLayout</Code> instead
          of the <Code>MainLayout</Code>, this file allows you to easily configure which layout
          should be considered the main layout.
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          To do so, you can comment out the other layout imports and set the desired layout as the
          default export:
        </Typography>
        <CodeBlock
          sx={{ mb: 0 }}
          code={`import MainLayout from './MainLayout';
// import SidenavLayout from './SidenavLayout';
// import ComboLayout from './ComboLayout';
// import TopnavLayout from './TopnavLayout';

export default MainLayout;
// export default SidenavLayout;
// export default TopnavLayout;
// export default ComboLayout;
`}
        />
      </DocSection>

      <DocSection title="Sidanav-Only Layout">
        <Typography sx={{ color: 'text.secondary', mb: 5 }}>
          The <Code>SidenavLayout</Code> component configures Aurora to use only the default side
          navigation layout, simplifying the interface for applications where a single layout is
          required. This setup bypasses the need for conditional logic and ensures a consistent user
          experience with a single layout type.
        </Typography>

        <DocSubtitle sx={{ mb: 2 }}>Steps to Use SidenavLayout:</DocSubtitle>
        <DocList
          sx={{
            color: 'text.secondary',
            [`& .${listItemClasses.root}`]: {
              '&:not(:last-of-type)': {
                marginBottom: 4,
              },
            },
          }}
        >
          <ListItem>
            <Typography>Update Config Values:</Typography>
            <CodeBlock
              code={`export const initialConfig: Config = {
  // other config values
  navigationMenuType: 'sidenav',
  sidenavType: 'default',  // 'slim' | 'stacked' depending on design
};`}
            />
            <Typography>
              Clear the <Code>local storage</Code> to remove any previously saved configuration
              values.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              In <Code>src/layouts/main-layout/index.jsx</Code>, make sure you are exporting{' '}
              <Code>SidenavLayout</Code> by commenting out other layout options:
            </Typography>
            <CodeBlock
              sx={{ mb: 0 }}
              code={`// import MainLayout from './MainLayout';
import SidenavLayout from './SidenavLayout';
// import ComboLayout from './ComboLayout';
// import TopnavLayout from './TopnavLayout';

// export default MainLayout;
export default SidenavLayout;
// export default TopnavLayout;
// export default ComboLayout;
`}
            />
          </ListItem>
          <ListItem>
            <Typography>
              The <Code>SidenavLayout</Code> component is pre-configured to use the{' '}
              <Code>default</Code> Sidenav. You can decide which sidenav variant to use based on
              your application's design needs.For example, if you're using <Code>SlimSidenav</Code>,
              you should comment out the other variants (<Code>Sidenav</Code>,{' '}
              <Code>StackedSidenav</Code>) in <Code>src/layouts/main-layout/SidenavLayout.jsx</Code>{' '}
              file to prevent any conflicts:
            </Typography>
            <CodeBlock
              code={`// import Sidenav from 'layouts/main-layout/sidenav';
 import SlimSidenav from './sidenav/SlimSidenav';
// import StackedSidenav from './sidenav/StackedSidenav';`}
            />
            <Typography>
              Then, in the JSX, ensure you're rendering the correct component. If{' '}
              <Code>SlimSidenav</Code> is your choice, use it instead of the others:
            </Typography>
            <CodeBlock
              sx={{ mb: 0 }}
              code={`const SidenavLayout = ({ children }: PropsWithChildren) => {

  //...

  return (
    <Box sx={{ display: 'flex' }}>
      <NavProvider>
        <AppBar />
        {/* <Sidenav /> */}
        <SlimSidenav />  {/* Active sidenav */}
        {/* <StackedSidenav /> */}
      
        {/* Rest of the layout logic */}
      </NavProvider>
    </Box>
  );
};
`}
            />
          </ListItem>
        </DocList>
      </DocSection>

      <DocSection title="Topnav-Only Layout">
        <Typography sx={{ color: 'text.secondary', mb: 5 }}>
          The <Code>TopnavLayout</Code> component configures Aurora to use only the default top
          navigation layout.
        </Typography>

        <DocSubtitle sx={{ mb: 2 }}>Steps to Use TopnavLayout:</DocSubtitle>
        <DocList
          sx={{
            color: 'text.secondary',
            [`& .${listItemClasses.root}`]: {
              '&:not(:last-of-type)': {
                marginBottom: 4,
              },
            },
          }}
        >
          <ListItem>
            <Typography>Update Config Values:</Typography>
            <CodeBlock
              code={`export const initialConfig: Config = {
  // other config values
  navigationMenuType: 'topnavType',
  topnavType: 'default',  // 'slim' | 'stacked' depending on design
};`}
            />
            <Typography>
              Clear the <Code>local storage</Code> to remove any previously saved configuration
              values.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              In <Code>src/layouts/main-layout/index.jsx</Code>, make sure you are exporting{' '}
              <Code>TopnavLayout</Code> by commenting out other layout options:
            </Typography>
            <CodeBlock
              sx={{ mb: 0 }}
              code={`// import MainLayout from './MainLayout';
//import SidenavLayout from './SidenavLayout';
import TopnavLayout from './TopnavLayout';
// import ComboLayout from './ComboLayout';

// export default MainLayout;
// export default SidenavLayout;
export default TopnavLayout;
// export default ComboLayout;
`}
            />
          </ListItem>
          <ListItem>
            <Typography>
              The <Code>TopnavLayout</Code> component is pre-configured to use the{' '}
              <Code>default</Code> Topnav. You can decide which topnav variant to use based on your
              application's design needs.For example, if you want to use <Code>TopNavStacked</Code>,
              you should comment out the other variants (<Code>Topnav</Code>,{' '}
              <Code>TopnavSlim</Code>) in <Code>src/layouts/main-layout/TopnavLayout.jsx</Code> file
              to prevent any conflicts:
            </Typography>
            <CodeBlock
              code={`// import Topnav from './topnav';
// import TopnavSlim from './topnav/TopnavSlim';
import TopNavStacked from './topnav/TopNavStacked';`}
            />
            <Typography>
              Then, in the JSX, ensure you're rendering the correct component. If{' '}
              <Code>TopNavStacked</Code> is your choice, use it instead of the others:
            </Typography>
            <CodeBlock
              sx={{ mb: 0 }}
              code={`const TopnavLayout = ({ children }: PropsWithChildren) => {
  
  //...

  return (
    <Box sx={{ display: 'flex' }}>
      <NavProvider>
        <AppBar />
        {/* <Topnav /> */}
        {/* <TopnavSlim /> */}
        <TopNavStacked />
      
        {/* Rest of the layout logic */}
      </NavProvider>
    </Box>
  );
};
`}
            />
          </ListItem>
        </DocList>
      </DocSection>

      <DocSection title="Combo Layout">
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          The <Code>ComboLayout</Code> component configures Aurora to use both top and side
          navigation, offering flexibility for applications that need multiple navigation methods.
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 5 }}>
          By default, the combo layout uses the default <Code>Sidenav</Code> and default{' '}
          <Code>Topnav</Code>, but these can be customized to match the specific navigation styles
          required for your application.
        </Typography>

        <DocSubtitle sx={{ mb: 2 }}>Steps to Use ComboLayout:</DocSubtitle>
        <DocList
          sx={{
            color: 'text.secondary',
            [`& .${listItemClasses.root}`]: {
              '&:not(:last-of-type)': {
                marginBottom: 4,
              },
            },
          }}
        >
          <ListItem>
            <Typography>Update Config Values:</Typography>
            <CodeBlock
              code={`export const initialConfig: Config = {
  // other config values
  navigationMenuType: 'combo',
  sidenavType: 'default', // 'slim' | 'stacked' depending on design
  topnavTypeType: 'default', // 'slim' | 'stacked' depending on design 
};`}
            />
            <Typography>
              Clear the <Code>local storage</Code> to remove any previously saved configuration
              values.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              In <Code>src/layouts/main-layout/index.jsx</Code>, make sure you are exporting{' '}
              <Code>ComboLayout</Code> by commenting out other layout options:
            </Typography>
            <CodeBlock
              sx={{ mb: 0 }}
              code={`// import MainLayout from './MainLayout';
// import SidenavLayout from './SidenavLayout';
// import TopnavLayout from './TopnavLayout';
import ComboLayout from './ComboLayout';

// export default MainLayout;
// export default SidenavLayout;
// export default TopnavLayout;
export default ComboLayout;
`}
            />
          </ListItem>
          <ListItem>
            <Typography>
              The <Code>ComboLayout</Code> component is pre-configured to use the default{' '}
              <Code>Topnav</Code> and default <Code>Sidenav</Code>. You can decide which sidenav and
              topnav variant to use based on your application's design needs. Comment out or remove
              the import statements of the other variants which you don&apos;t want to use in
              <Code>src/layouts/main-layout/ComboLayout.jsx</Code> file to prevent any conflicts:
            </Typography>
            <CodeBlock
              code={`import Topnav from './topnav';
import Sidenav from './sidenav';
// import SlimSidenav from './sidenav/SlimSidenav';
// import StackedSidenav from './sidenav/StackedSidenav';
// import TopnavSlim from './topnav/TopnavSlim';
// import TopNavStacked from './topnav/TopNavStacked';`}
            />
            <Typography>
              Then, in the JSX, ensure you're rendering the correct component.
            </Typography>
            <CodeBlock
              sx={{ mb: 0 }}
              code={`const ComboLayout = ({ children }: PropsWithChildren) => {
  
  //...

  return (
    <Box sx={{ display: 'flex' }}>
      <NavProvider>
        <AppBar />
        
        <Sidenav />
        {/* <SlimSidenav /> */}
        {/* <StackedSidenav /> */}

        <Topnav />
        {/* <TopnavSlim /> */}
        {/* <TopNavStacked /> */}
      
        {/* Rest of the layout logic */}
    
      </NavProvider>
    </Box>
  );
};
`}
            />
          </ListItem>
        </DocList>
      </DocSection>
    </DocPageLayout>
  );
};

export default Layouts;
