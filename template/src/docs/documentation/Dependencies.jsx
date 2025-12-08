import {
  Box,
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import packageJson from 'package.json';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const getDependencies = (deps) => {
  return Object.entries(deps).map(([name, version]) => ({
    name,
    version: version.replace(/^[\^~]/, ''),
    link: `https://www.npmjs.com/package/${name}`,
  }));
};

const dependencies = getDependencies(packageJson.dependencies);
const devDependencies = getDependencies(packageJson.devDependencies);

const DependenciesTable = ({ rows }) => {
  return (
    <TableContainer component={Box} sx={{ pl: 0, ml: 0 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Package name</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">
              Version
            </TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="right">
              NPM Link
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell sx={{ fontWeight: '500 !important' }}>{row.name}</TableCell>
              <TableCell align="center">
                <Chip label={row.version} color="neutral" />
              </TableCell>
              <TableCell align="right">
                <Link href={row.link} target="_blank" sx={{ textDecoration: 'none', mx: 0.5 }}>
                  Link
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Dependencies = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Dependencies',
        description:
          'This table provides an overview of the installed packages in the project. You can explore the available dependencies and utilize them as needed.',
      }}
    >
      <DocSection title="Dependencies">
        <DependenciesTable rows={dependencies} />
      </DocSection>
      <DocSection title="Dev Dependencies">
        <DependenciesTable rows={devDependencies} />
      </DocSection>
    </DocPageLayout>
  );
};

export default Dependencies;
