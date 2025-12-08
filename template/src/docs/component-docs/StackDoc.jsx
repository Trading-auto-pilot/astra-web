import { Link, Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import { kebabCase } from 'lib/utils';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicStackCode = `
<Box sx={{ width: 1 }}>
  <Stack spacing={2} sx={{ mb: 1 }}>
    <Paper
      sx={(theme) => ({
        p: 2,
        boxShadow: theme.vars.shadows[3],
        textAlign: 'center',
        width: 100,
        flex: 1
      })}
    >
      Item 1
    </Paper>
    <Paper
      sx={(theme) => ({
        p: 2,
        boxShadow: theme.vars.shadows[3],
        textAlign: 'center',
        width: 100,
        flex: 1
      })}
    >
      Item 2
    </Paper>
    <Paper
      sx={(theme) => ({
        p: 2,
        boxShadow: theme.vars.shadows[3],
        textAlign: 'center',
        width: 100,
        flex: 1
      })}
    >
      Item 3
    </Paper>
  </Stack>
</Box>
`.trim();

const verticalStackCode = `
<Box sx={{ width: 1 }}>
  <Stack direction="column" spacing={2}>
		<Paper
			sx={(theme) => ({
				p: 2,
				boxShadow: theme.vars.shadows[3],
				textAlign: 'center',
			})}
		>
			Item 1
		</Paper>
		<Paper
			sx={(theme) => ({
				p: 2,
				boxShadow: theme.vars.shadows[3],
				textAlign: 'center',
			})}
		>
			Item 2
		</Paper>
		<Paper
			sx={(theme) => ({
				p: 2,
				boxShadow: theme.vars.shadows[3],
				textAlign: 'center',
			})}
		>
			Item 3
		</Paper>
	</Stack>
</Box>
`.trim();

const dividerStackCode = `
<Box sx={{ width: 1, display: 'flex', justifyContent: 'center' }}>
  <Stack spacing={2} divider={<Divider orientation="vertical" flexItem />}>
    <Paper
      sx={(theme) => ({
        p: 2,
        boxShadow: theme.vars.shadows[3],
        textAlign: 'center',
      })}
    >
      Item 1
    </Paper>
    <Paper
      sx={(theme) => ({
        p: 2,
        boxShadow: theme.vars.shadows[3],
        textAlign: 'center',
      })}
    >
      Item 2
    </Paper>
    <Paper
      sx={(theme) => ({
        p: 2,
        boxShadow: theme.vars.shadows[3],
        textAlign: 'center',
      })}
    >
      Item 3
    </Paper>
  </Stack>
</Box>`.trim();

const responsiveStackCode = `
<Box sx={{ width: 1 }}>
  <Stack direction={{ xs: 'column', lg: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
    <Paper
      sx={(theme) => ({
        p: 2,
        boxShadow: theme.vars.shadows[3],
        textAlign: 'center',
        flexGrow: 1,
      })}
    >
      Item 1
    </Paper>
    <Paper
      sx={(theme) => ({
        p: 2,
        boxShadow: theme.vars.shadows[3],
        textAlign: 'center',
        flexGrow: 1,
      })}
    >
      Item 2
    </Paper>
    <Paper
      sx={(theme) => ({
        p: 2,
        boxShadow: theme.vars.shadows[3],
        textAlign: 'center',
        flexGrow: 1,
      })}
    >
      Item 3
    </Paper>
  </Stack>
</Box>`.trim();

const flexboxGapStackCode = `
<Stack sx={{ justifyContent: 'center' }}>
  <Box sx={{ width: 200 }}>
    <Stack
      spacing={{ xs: 1, sm: 2 }}
      useFlexGap
      sx={{ flexWrap: 'wrap' }}
    >
      <Paper
        sx={(theme) => ({
          p: 2,
          boxShadow: theme.vars.shadows[3],
          textAlign: 'center',
          flexGrow: 1,
        })}
      >
        Item 1
      </Paper>
      <Paper
        sx={(theme) => ({
          p: 2,
          boxShadow: theme.vars.shadows[3],
          textAlign: 'center',
          flexGrow: 1,
        })}
      >
        Item 2
      </Paper>
      <Paper
        sx={(theme) => ({
          p: 2,
          boxShadow: theme.vars.shadows[3],
          textAlign: 'center',
          flexGrow: 1,
        })}
      >
        Long Content ...
      </Paper>
    </Stack>
  </Box>
</Stack>`.trim();

const StackDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Stack',
        description:
          'Stack is a container component for arranging elements vertically or horizontally.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Stack',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-stack`,
        folderLink: `${folderBaseLink}/StackDoc.jsx`,
      }}
    >
      <DocSection
        title="Basic Stack"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            By default, &nbsp;<Code>&lt;Stack&gt;</Code>&nbsp; arranges items horizontally in a
            column. Use the &nbsp;<Code>direction</Code>&nbsp; prop to position items horizontally
            or vertically.
          </Typography>
        }
      >
        <DocNestedSection title="Horizontal" id={kebabCase('Horizontal')}>
          <DocCard code={basicStackCode} sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Vertical" id={kebabCase('Vertical')}>
          <DocCard code={verticalStackCode} />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="With Dividers"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use the &nbsp;<Code>divider</Code>&nbsp; prop to insert an element between each child.
          </Typography>
        }
      >
        <DocCard code={dividerStackCode} />
      </DocSection>
      <DocSection
        title="Responsive Values"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can switch the <Code>direction</Code> or <Code>spacing</Code> values based on the
            active breakpoint.
          </Typography>
        }
      >
        <DocCard code={responsiveStackCode} />
      </DocSection>
      <DocSection
        title="Flexbox Gap"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The &nbsp;
            <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/gap" target="_blank">
              flexbox gap
            </Link>
            &nbsp; is used for spacing, controlled by the &nbsp;<Code>useFlexGap</Code>&nbsp; prop.
            By default, it's set to true, but you can disable it by setting the prop to false.
          </Typography>
        }
      >
        <DocCard code={flexboxGapStackCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default StackDoc;
