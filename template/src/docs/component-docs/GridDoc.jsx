import { Link, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import illustrationDark from 'assets/images/illustrations/2-dark.webp';
import illustration from 'assets/images/illustrations/2.webp';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import Image from 'components/base/Image';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicGridCode = `
<Grid container spacing={2}>
  <Grid size={{ xs: 6, md: 8 }}>
    <Paper
      background={1}
      sx={{
        p: 1,
        borderRadius: 2,
        wordBreak: 'break-word',
        fontSize: 14,
        textAlign: 'center',
      }}
    >
      xs=6 md=8
    </Paper>
  </Grid>
  <Grid size={{ xs: 6, md: 4 }}>
    <Paper
      background={1}
      sx={{
        p: 1,
        borderRadius: 2,
        wordBreak: 'break-word',
        fontSize: 14,
        textAlign: 'center',
      }}
    >
      xs=6 md=4
    </Paper>
  </Grid>
  <Grid size={{ xs: 6, md: 4 }}>
    <Paper
      background={1}
      sx={{
        p: 1,
        borderRadius: 2,
        wordBreak: 'break-word',
        fontSize: 14,
        textAlign: 'center',
      }}
    >
      xs=6 md=4
    </Paper>
  </Grid>
  <Grid size={{ xs: 6, md: 8 }}>
    <Paper
      background={1}
      sx={{
        p: 1,
        borderRadius: 2,
        wordBreak: 'break-word',
        fontSize: 14,
        textAlign: 'center',
      }}
    >
      xs=6 md=8
    </Paper>
  </Grid>
</Grid>
`.trim();

const rowAndColumnSpacingCode = `
<Box sx={{ width: 1 }}>
  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
    <Grid size={6}>
      <Paper
        background={1}
        sx={{
          p: 1,
          borderRadius: 2,
          wordBreak: 'break-word',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        1
      </Paper>
    </Grid>
    <Grid size={6}>
      <Paper
        background={1}
        sx={{
          p: 1,
          borderRadius: 2,
          wordBreak: 'break-word',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        2
      </Paper>
    </Grid>
    <Grid size={6}>
      <Paper
        background={1}
        sx={{
          p: 1,
          borderRadius: 2,
          wordBreak: 'break-word',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        3
      </Paper>
    </Grid>
    <Grid size={6}>
      <Paper
        background={1}
        sx={{
          p: 1,
          borderRadius: 2,
          wordBreak: 'break-word',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        4
      </Paper>
    </Grid>
  </Grid>
</Box>
`.trim();

const autoGridCode = `
<Box sx={{ flexGrow: 1 }}>
  <Grid container spacing={3}>
    <Grid size="grow">
      <Paper
        background={1}
        sx={{
          p: 1,
          borderRadius: 2,
          wordBreak: 'break-word',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        xs
      </Paper>
    </Grid>
    <Grid size={6}>
      <Paper
        background={1}
        sx={{
          p: 1,
          borderRadius: 2,
          wordBreak: 'break-word',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        xs=6
      </Paper>
    </Grid>
    <Grid size="grow">
      <Paper
        background={1}
        sx={{
          p: 1,
          borderRadius: 2,
          wordBreak: 'break-word',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        xs
      </Paper>
    </Grid>
  </Grid>
</Box>
`.trim();

const customColumnGridCode = `
<Box sx={{ flexGrow: 1 }}>
  <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 16 }}>
    {Array.from(Array(6)).map((_, index) => (
      <Grid size={{ xs: 4, sm: 8 }}  key={index}>
        <Paper
          background={1}
          sx={{
            p: 1,
            borderRadius: 2,
            wordBreak: 'break-word',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          Item
        </Paper>
      </Grid>
    ))}
  </Grid>
</Box>
`.trim();

const nestedGridColumnCode = `<Box sx={{ flexGrow: 1 }}>
  <Grid container spacing={2} columns={24}>
    <Grid size={8}>
      <Paper
        background={1}
        sx={{
          p: 1,
          borderRadius: 2,
          wordBreak: 'break-word',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        size = 8/24
      </Paper>
    </Grid>
    <Grid container size={16}>
      <Grid size={12}>
        <Paper
          background={1}
          sx={{
            p: 1,
            borderRadius: 2,
            wordBreak: 'break-word',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          nested size = 12/24
        </Paper>
      </Grid>
      <Grid size={12}>
        <Paper
          background={1}
          sx={{
            p: 1,
            borderRadius: 2,
            wordBreak: 'break-word',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          nested size = 12/24
        </Paper>
      </Grid>
    </Grid>
    <Grid size={8}>
      <Paper
        background={1}
        sx={{
          p: 1,
          borderRadius: 2,
          wordBreak: 'break-word',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        size = 8/24
      </Paper>
    </Grid>
    <Grid container columns={12} size={16}>
      <Grid size={6}>
        <Paper
          background={1}
          sx={{
            p: 1,
            borderRadius: 2,
            wordBreak: 'break-word',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          nested size = 6/12
        </Paper>
      </Grid>
      <Grid size={6}>
        <Paper
          background={1}
          sx={{
            p: 1,
            borderRadius: 2,
            wordBreak: 'break-word',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          nested size = 6/12
        </Paper>
      </Grid>
    </Grid>
  </Grid>
</Box>
`.trim();

const nestedGridSpacingCode = `<Box sx={{ flexGrow: 1 }}>
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 5, lg: 4 }}>
      <Paper
        background={1}
        sx={{
          p: 1,
          borderRadius: 2,
          wordBreak: 'break-word',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        Email subscribe section
      </Paper>
    </Grid>
    <Grid container spacing={4} size={{ xs: 12, md: 7, lg: 8 }}>
      <Grid size={{ xs: 6, lg: 3 }}>
        <Paper
          background={1}
          sx={{
            p: 1,
            borderRadius: 2,
            wordBreak: 'break-word',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          <Box id="category-a" sx={{ fontSize: 12, textTransform: 'uppercase' }}>
            Category A
          </Box>
          <Box component="ul" aria-labelledby="category-a" sx={{ pl: 2 }}>
            <li>Link 1.1</li>
            <li>Link 1.2</li>
            <li>Link 1.3</li>
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 6, lg: 3 }}>
        <Paper
          background={1}
          sx={{
            p: 1,
            borderRadius: 2,
            wordBreak: 'break-word',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          <Box id="category-b" sx={{ fontSize: 12, textTransform: 'uppercase' }}>
            Category B
          </Box>
          <Box component="ul" aria-labelledby="category-b" sx={{ pl: 2 }}>
            <li>Link 2.1</li>
            <li>Link 2.2</li>
            <li>Link 2.3</li>
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 6, lg: 3 }}>
        <Paper
          background={1}
          sx={{
            p: 1,
            borderRadius: 2,
            wordBreak: 'break-word',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          <Box id="category-c" sx={{ fontSize: 12, textTransform: 'uppercase' }}>
            Category C
          </Box>
          <Box component="ul" aria-labelledby="category-c" sx={{ pl: 2 }}>
            <li>Link 3.1</li>
            <li>Link 3.2</li>
            <li>Link 3.3</li>
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 6, lg: 3 }}>
        <Paper
          background={1}
          sx={{
            p: 1,
            borderRadius: 2,
            wordBreak: 'break-word',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          <Box id="category-d" sx={{ fontSize: 12, textTransform: 'uppercase' }}>
            Category D
          </Box>
          <Box component="ul" aria-labelledby="category-d" sx={{ pl: 2 }}>
            <li>Link 4.1</li>
            <li>Link 4.2</li>
            <li>Link 4.3</li>
          </Box>
        </Paper>
      </Grid>
    </Grid>
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      flexDirection={{ xs: 'column', sm: 'row' }}
      sx={{ fontSize: 14 }}
      size={12}
    >
      <Grid sx={{ order: { xs: 2, sm: 1 } }}>
        <Paper
          background={1}
          sx={{
            p: 1,
            borderRadius: 2,
            wordBreak: 'break-word',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          © Copyright
        </Paper>
      </Grid>
      <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
        <Grid>
          <Paper
            background={1}
            sx={{
              p: 1,
              borderRadius: 2,
              wordBreak: 'break-word',
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            Link A
          </Paper>
        </Grid>
        <Grid>
          <Paper
            background={1}
            sx={{
              p: 1,
              borderRadius: 2,
              wordBreak: 'break-word',
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            Link B
          </Paper>
        </Grid>
        <Grid>
          <Paper
            background={1}
            sx={{
              p: 1,
              borderRadius: 2,
              wordBreak: 'break-word',
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            Link C
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
</Box>
`.trim();

const offsetGridCode = `
  <Grid container spacing={3} sx={{ flexGrow: 1 }}>
    <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 0 }}>
      <Paper
        background={1}
        sx={{
          p: 1,
          borderRadius: 2,
          wordBreak: 'break-word',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        1
      </Paper>
    </Grid>
    <Grid size={{ xs: 4, md: 2 }} offset={{ md: 'auto' }}>
      <Paper
        background={1}
        sx={{
          p: 1,
          borderRadius: 2,
          wordBreak: 'break-word',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        2
      </Paper>
    </Grid>
    <Grid size={{ xs: 4, md: 2 }} offset={{ xs: 4, md: 0 }}>
      <Paper
        background={1}
        sx={{
          p: 1,
          borderRadius: 2,
          wordBreak: 'break-word',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        3
      </Paper>
    </Grid>
    <Grid size={{ xs: 'grow', md: 6 }} offset={{ md: 2 }}>
      <Paper
        background={1}
        sx={{
          p: 1,
          borderRadius: 2,
          wordBreak: 'break-word',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        4
      </Paper>
    </Grid>
  </Grid>
`.trim();

const complexGrid = `
import Image from 'components/base/Image';
import Grid from '@mui/material/Grid';
import illustration from 'assets/images/illustrations/2.webp';
import illustrationdark from 'assets/images/illustrations/2-dark.webp';

const ComplexGrid = () => {
  return (
    <Paper
      background={1}
      sx={(theme) => ({
        p: 2,
        borderRadius: 4,
        margin: 'auto',
        maxWidth: 500,
        flexGrow: 1,
        backgroundColor: 'common.white',
        ...theme.applyStyles('dark', {
          backgroundColor: 'background.elevation1',
        }),
      })}
    >
      <Grid container spacing={2}>
        <Grid>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <Image
              alt="complex"
              src={{ light: illustration, dark: illustrationDark }}
              sx={{ display: 'block', width: 1, height: 1 }}
            />
          </ButtonBase>
        </Grid>
        <Grid container size={{ xs: 12, sm: 'grow' }}>
          <Grid size="grow" container direction="column" spacing={2}>
            <Grid>
              <Typography gutterBottom variant="subtitle1" component="div">
                Standard license
              </Typography>
              <Typography variant="body2" gutterBottom>
                Full resolution 1920x1080 • JPEG
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: 1030114
              </Typography>
            </Grid>
            <Grid>
              <Typography sx={{ cursor: 'pointer' }} variant="body2">
                Remove
              </Typography>
            </Grid>
          </Grid>
          <Grid>
            <Typography variant="subtitle1" component="div">
              $19.00
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
render(<ComplexGrid/>)
`.trim();

const GridDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Grid',
        descriptionEl: (
          <Typography variant="body1">
            The Material Design responsive layout grid adapts to screen size and orientation,
            ensuring consistency across layouts.
          </Typography>
        ),
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Grid',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-grid`,
        folderLink: `${folderBaseLink}/GridDoc.jsx`,
      }}
    >
      <DocSection title="Basic Fluid Grid">
        <DocCard code={basicGridCode} scope={Grid} />
      </DocSection>
      <DocSection
        title="Spacing"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
              lineHeight: 1.5,
            }}
          >
            The &nbsp;<Code>rowSpacing</Code>&nbsp; and &nbsp;<Code>columnSpacing</Code>&nbsp; props
            allow for specifying the row and column gaps independently. It’s similar to the row-gap
            and column-gap properties of{' '}
            <Link
              href="https://mui.com/system/grid/#row-gap-amp-column-gap"
              target="_blank"
              rel="noopener nofollow"
            >
              CSS Grid
            </Link>
            .
          </Typography>
        }
      >
        <DocCard code={rowAndColumnSpacingCode} />
      </DocSection>
      <DocSection title="Auto Layout">
        <DocCard code={autoGridCode} />
      </DocSection>
      <DocSection
        title="Nested Grid"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The grid container that renders as a <strong>direct child</strong> inside another grid
            container is a nested grid that inherits its &nbsp;<Code>columns</Code>&nbsp; and &nbsp;
            <Code>spacing</Code>&nbsp; from the top level. It will also inherit the props of the
            top-level grid if it receives those props.
          </Typography>
        }
      >
        <DocNestedSection id="inheriting-spacing" title="Inheriting Spacing">
          <DocCard code={nestedGridSpacingCode} sx={{ my: 5 }} />
        </DocNestedSection>
        <DocNestedSection id="inheriting-columns" title="Inheriting Columns">
          <DocCard code={nestedGridColumnCode} sx={{ my: 5 }} />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="Responsive Custom Grid System"
        description={`This example demonstrates how to create a responsive grid using Material-UI's Grid component, where the grid adjusts based on the screen size, with a 16-column grid system.`}
      >
        <DocCard code={customColumnGridCode} />
      </DocSection>

      <DocSection
        title="Offset Grid"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The &nbsp;<Code>offset</Code>&nbsp; prop pushes an item to the right side of the grid.
            For example, &nbsp;<Code>offset={`{{ md: 2 }}`}</Code>&nbsp; pushes an item two columns
            to the right when the viewport size is equal to or greater than the &nbsp;
            <Code>md</Code>
            &nbsp; breakpoint.
          </Typography>
        }
      >
        <DocCard code={offsetGridCode} />
      </DocSection>
      <DocSection title="Complex Grid">
        <DocCard code={complexGrid} scope={{ illustration, illustrationDark, Image }} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default GridDoc;
