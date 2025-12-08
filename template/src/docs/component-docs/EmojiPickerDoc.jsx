import { ListItem, ListItemText, Typography } from '@mui/material';
import { folderBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import EmojiPicker from 'components/base/EmojiPicker';
import CodeBlock from 'components/common/CodeBlock';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection, { DocList } from 'components/docs/DocSection';

const exampleCode = `
import EmojiPicker from 'components/base/EmojiPicker';
const BasicExample = () => {
  const [value, setValue] = useState('')
  const handleEmojiSelect = (native) => {
    setValue(native);
  };
  return <EmojiPicker handleEmojiSelect={handleEmojiSelect} />
};
render(<BasicExample />)`.trim();

const EmojiPickerDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Emoji Picker',
        descriptionEl: (
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
            }}
          >
            <strong>Aurora</strong> uses <strong>Emoji mart</strong> as a emoji picker component. It
            displays a panel of emojis where one can be selected. What is done with the selected
            emoji is up to you.
          </Typography>
        ),
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Emoji Picker',
          },
        ],
        docLink: 'https://www.npmjs.com/package/emoji-mart',
        docLinkLabel: 'Emoji mart',
        folderLink: `${folderBaseLink}/EmojiPickerDoc.jsx`,
      }}
    >
      <DocSection title="How to use">
        <Typography>
          The <Code>EmojiPicker</Code> component is a reusable and customizable emoji picker built
          with <Code>@emoji-mart/react</Code> and <Code>Material-UI</Code> components. This
          documentation provides a guide on how to use it effectively in your project.
        </Typography>
        <DocList>
          <ListItem>
            <ListItemText disableTypography sx={{ mb: 0 }}>
              <strong>Import statement:</strong>
            </ListItemText>
            <CodeBlock
              code={`import EmojiPicker from 'components/base/EmojiPicker';`}
              sx={{ my: 0 }}
            />
          </ListItem>
          <ListItem>
            <ListItemText disableTypography sx={{ mb: 0 }}>
              <strong>Customizing Emoji Picker:</strong>
            </ListItemText>
            <Typography>
              You can pass additional props supported by <Code>@emoji-mart/react</Code>'s Picker
              component, such as <Code>theme</Code>, <Code>perLine</Code>, etc.
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography sx={{ mb: 0 }}>
              <strong>Customizing Action button:</strong>
            </ListItemText>
            <Typography>
              The <Code>actionButtonEle</Code> prop accepts any valid JSX element. The provided
              element should have a click event trigger to allow the picker popover to open.{' '}
              <Code>onClick</Code> events will automatically be handled when this prop is passed.
            </Typography>
          </ListItem>
        </DocList>
      </DocSection>
      <DocSection title="Example">
        <DocCard code={exampleCode} scope={{ EmojiPicker }} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default EmojiPickerDoc;
