import { ListItem, ListItemText, Typography } from '@mui/material';
import { folderBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import Resizable from 'components/base/Resizable';
import CodeBlock from 'components/common/CodeBlock';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection, { DocList } from 'components/docs/DocSection';

const basicExampleCode = `
import Resizable from 'components/base/Resizable';
const BasicExample = () => {
  const [resizableWidth, setResizableWidth] = useState(0);
  const handleResize = (width) => {
    setResizableWidth(width);
  };
  return (
    <Resizable
      handleResize={handleResize}
      defaultSize={{ height: 300 }}
      sx={{ minWidth: 'unset', maxWidth: '100%' }}
      minHeight={100}
      enable={{
        top: true,
        right: true,
        bottom: true,
        left: false,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
    >
      <Paper variant="outlined" sx={{width: 1, height: 1 }} background={2} />
  </Resizable>
)
};
render(<BasicExample />)`.trim();

const resizableSectionCode = `
import Resizable from 'components/base/Resizable';

const BasicExample = () => {
  const [resizableWidth, setResizableWidth] = useState(0);
  const { direction } = useTheme();
  const handleResize = (width) => {
    setResizableWidth(width);
  };
  return (
    <Stack sx={{width: 1, height: 300}}>
      <Resizable
        handleResize={handleResize}
        defaultSize={{width: '50%', height: '100%' }}
        minHeight={100}
        minWidth={100}
        maxWidth="calc(100% - 100px)"
        enable={{
          top: false,
          bottom: false,
          right: direction === 'rtl' ? false : true,
          left: direction === 'rtl' ? true : false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <Paper background={2} sx={{borderTopLeftRadius: 8, borderBottomLeftRadius: 8, width: 1, height: 1 }} />
      </Resizable>
      <Paper background={3} sx={{borderTopRightRadius: 8, borderBottomRightRadius: 8, flex: 1, height: 1, minWidth: 0 }} />
    </Stack>
  )
};
render(<BasicExample />)`.trim();

const ResizableDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Resizable',
        descriptionEl: (
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
            }}
          >
            <strong>Aurora</strong> uses <strong>re-resizable</strong> for resizable component. It
            allows you to add resizable functionality to elements, supporting resizing in various
            directions (e.g., horizontal, vertical, or both) with customizable handles and styles.
          </Typography>
        ),
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Resizable',
          },
        ],
        docLink: 'https://www.npmjs.com/package/re-resizable',
        docLinkLabel: 'Re Resizable',
        folderLink: `${folderBaseLink}/ResizableDoc.jsx`,
      }}
    >
      <DocSection title="How to use">
        <Typography>
          The <Code>Resizable</Code> component is a wrapper around the <Code>re-resizable</Code>{' '}
          package, integrated with <Code>Material-UI</Code>. It allows you to create a resizable
          container with dynamic behavior, handling resizing events and adapting to changes in
          window size.
        </Typography>
        <DocList>
          <ListItem>
            <ListItemText disableTypography sx={{ mb: 0 }}>
              <strong>Import statement:</strong>
            </ListItemText>
            <CodeBlock code={`import Resizable from 'components/base/Resizable';`} sx={{ my: 0 }} />
          </ListItem>
          <ListItem>
            <ListItemText disableTypography sx={{ mb: 0 }}>
              <strong>Customizing Resizable:</strong>
            </ListItemText>
            <Typography>
              You can pass any additional props supported by the <Code>re-resizable</Code> library
              to further customize the behavior. Such as <Code>minWidth</Code>,{' '}
              <Code>maxWidth</Code> etc.
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography sx={{ mb: 0 }}>
              <strong>Customizing Resizable Directions:</strong>
            </ListItemText>
            <Typography>
              The <Code>enable</Code> prop controls which edges of the component are resizable. You
              can customize the resizable directions based on the user interface requirements.
            </Typography>
            <CodeBlock
              code={`<Resizable
  enable={{
    top: false,
    right: true,
    bottom: false,
    left: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  }}
>
  <p>Resize Only from the Right</p>
</Resizable>`}
            />
          </ListItem>
          <ListItem>
            <ListItemText disableTypography sx={{ mb: 0 }}>
              <strong>Modifying Resize Handles:</strong>
            </ListItemText>
            <Typography>
              The resizable handle can be styled using the <Code>handleClasses</Code> prop. By
              default, the <Code>resizable-handler</Code> class is applied to the handle. Add your
              styles to this class or the <Code>handleClasses</Code> and <Code>handleStyles</Code>{' '}
              props from the <Code>re-resizable</Code> package let you style the resize handles.
            </Typography>
          </ListItem>
        </DocList>
      </DocSection>
      <DocSection title="Basic example">
        <DocCard code={basicExampleCode} scope={{ Resizable }} noInline />
      </DocSection>
      <DocSection title="Resizable section">
        <DocCard code={resizableSectionCode} scope={{ Resizable }} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default ResizableDoc;
