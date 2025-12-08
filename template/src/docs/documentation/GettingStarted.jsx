import { Link, ListItem, ListItemText, Typography } from '@mui/material';
import Code from 'components/base/Code';
import CodeBlock from 'components/common/CodeBlock';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection, { DocList } from 'components/docs/DocSection';

const GettingStarted = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Getting Started',
      }}
    >
      <DocSection title="Pre-requisites">
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          Ensure you have the following requirements to leverage the best of Aurora:
        </Typography>
        <DocList>
          <ListItem>
            <ListItemText>
              <Typography>
                <Link target="_blank" href="https://nodejs.org/en/">
                  Node.js
                </Link>{' '}
                v20.x.x.
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography>
                Package Manager :{' '}
                <Link target="_blank" href="https://www.npmjs.com/">
                  NPM
                </Link>
                /
                <Link target="_blank" href="https://yarnpkg.com/">
                  YARN
                </Link>
                /
                <Link target="_blank" href="https://pnpm.io/">
                  PNPM
                </Link>{' '}
                (recommended)
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography>
                Do not delete or remove <Code>package-lock.json</Code>, <Code>yarn.lock</Code>, or{' '}
                <Code>pnpm-lock.yaml</Code> file.
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography>
                Do not delete the <Code>.env</Code> file. Update its values as you need without
                changing the keys.
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography>
                Include hidden files like <Code>.env</Code> while copying folders & ensure keeping
                all essential theming files.
              </Typography>
            </ListItemText>
          </ListItem>
        </DocList>
      </DocSection>
      <DocSection title="Running in Local environment">
        <DocList sx={{ mb: 2 }}>
          <ListItem>
            <ListItemText>
              <Typography>Navigate to the project folder and open the terminal.</Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              <Typography>Install dependencies:</Typography>
              <CodeBlock code="npm i" />
              <Typography>
                This command will download all the necessary dependencies into the{' '}
                <Code>node_modules</Code> directory.
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              <Typography>Start the development server:</Typography>
              <CodeBlock code="npm run dev" />
              <Typography>
                This will start your local server at <Code>http://localhost:5001</Code>.
              </Typography>
              <ListItemText>
                <Typography>
                  By default, if you don't change the <Code>VITE_APP_PORT</Code> environment
                  variable, the server will start on port <Code>5001</Code>. If you want to start
                  the server on a different port, update the value of <Code>VITE_APP_PORT</Code> in
                  your env file.
                </Typography>
              </ListItemText>
            </ListItemText>
          </ListItem>
        </DocList>
        <Typography sx={{ color: 'text.secondary' }}>
          Since the application is built with Vite, any configuration customizations, such as port
          changes or other settings, can be done according to the{' '}
          <Link target="_blank" href="https://vitejs.dev/config/dep-optimization-options.html">
            Vite documentation
          </Link>
          .
        </Typography>
      </DocSection>
      <DocSection title="Creating a Production Build">
        <DocList>
          <ListItem>
            <ListItemText disableTypography>
              <Typography>
                After you have done your customization, when you are ready to build, simply run:
              </Typography>
              <CodeBlock code="npm run build" />
              <Typography>
                This will create an optimized production build by compiling, merging and minifying
                all the source files as necessary and will put them in the <Code>dist</Code> folder.
                For more information visit Vite{' '}
                <Link target="_blank" href="https://vitejs.dev/guide/build.html">
                  Building for Production
                </Link>{' '}
                documentation
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              <Typography>
                To run the production build locally run the following commands:
              </Typography>
              <CodeBlock sx={{ mb: 0 }} code="npm run preview" />
            </ListItemText>
          </ListItem>
        </DocList>
      </DocSection>
    </DocPageLayout>
  );
};

export default GettingStarted;
