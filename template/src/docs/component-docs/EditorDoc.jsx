import { Link, ListItem, ListItemText, Typography } from '@mui/material';
import { folderBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import Editor, { editorDefaultToolbar } from 'components/base/Editor';
import CodeBlock from 'components/common/CodeBlock';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection, { DocList, DocSubtitle } from 'components/docs/DocSection';

const basicExampleCode = `import Editor from 'components/base/Editor';

const BasicExample = () => {
  return (
    <Editor />
  );
}

render(<BasicExample />);`.trim();

const customisableExampleCode = `import { useRef } from 'react';
import Editor, { editorDefaultToolbar } from 'components/base/Editor';

const BasicExample = () => {
  const rteRef = useRef(null);

  const handlePost = () => {
    const value = rteRef.current?.editor?.isEmpty ? '' : rteRef.current?.editor?.getHTML();
    if (value) {
      console.log(value);
      rteRef.current?.editor?.commands.clearContent();
    }
  };

  return (
    <Editor
      ref={rteRef}
      renderControls={() => (
        <Stack
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            columnGap: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              overflowX: 'auto',
              '& > div:first-of-type': {
                flexWrap: 'nowrap',
              },
            }}
          >
            {editorDefaultToolbar()}
          </Box>
          <Button
            color="neutral"
            variant="text"
            size="small"
            sx={{ flexShrink: 0 }}
            onClick={handlePost}
            disabled={rteRef.current?.editor?.isEmpty}
          >
            Post
          </Button>
        </Stack>
      )}
      sx={{
        display: 'flex',
        flexDirection: 'column-reverse',
      }}
    />
  );
}

render(<BasicExample />);`.trim();

const EditorDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Editor',
        descriptionEl: (
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
            }}
          >
            <strong>Aurora</strong> uses <strong>mui-tiptap</strong> for rich text editor.{' '}
            <strong>Mui-tiptap</strong> is a customizable Material UI styled WYSIWYG rich text
            editor, using{' '}
            <Link href="https://tiptap.dev/docs/editor/getting-started/overview" target="_blank">
              Tiptap
            </Link>
            .
          </Typography>
        ),
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Editor',
          },
        ],
        docLink: 'https://github.com/sjdemartini/mui-tiptap',
        docLinkLabel: 'Mui-tiptap Docs',
        folderLink: `${folderBaseLink}/EditorDoc.jsx`,
      }}
    >
      <DocSection title="How to use">
        <Typography>
          The <Code>Editor</Code> componet in Aurora simplify the use of <Code>mui-tiptap</Code>,
          enhancing code organization and maintainability.
        </Typography>
        <DocList>
          <ListItem>
            <ListItemText disableTypography sx={{ mb: 0 }}>
              <strong>Import statement:</strong>
            </ListItemText>
            <CodeBlock code={`import Editor from 'components/base/Editor';`} sx={{ my: 0 }} />
          </ListItem>
          <ListItem sx={{ mb: 2 }}>
            <ListItemText disableTypography>
              <strong>Editor</strong>: The <Code>Editor</Code> component is a rich text editor with
              custom styling, placeholder text, and toolbar controls.
            </ListItemText>
          </ListItem>

          <DocSubtitle>
            Props of <Code>Editor</Code>:
          </DocSubtitle>

          <DocList>
            <ListItem>
              <ListItemText disableTypography>
                <Code>{`onChange?: (content: string) => void`}</Code>: Callback function that is
                called with the updated content whenever the editor content changes.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography>
                <Code>{`isValid?: boolean`}</Code>: Indicates whether the editor input is valid.
                Controls styling for error or normal state.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography>
                <Code>{`placeholder?: string`}</Code>: Placeholder text displayed when the editor is
                empty.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography>
                <Code>{`imageUploadHandler?: (files: File[]) => Promise<ImageNodeAttributes[]>`}</Code>
                : Custom handler for uploading images. Accepts an array of files and returns an
                array of image attributes (<Code>src</Code> and <Code>alt</Code>).
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography>
                <Code>{`extensions?: Extensions`}</Code>: Array of additional extensions to
                customize the editor's functionality.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography>
                <Code>{`sx?: SxProps`}</Code>: Custom styling for the editor container using MUI's
                <Code>sx</Code> prop.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography>
                <Code>{`RichTextEditor Props`}</Code>: Any prop supported by{' '}
                <strong>RichTextEditor</strong> can be passed directly to <Code>Editor</Code>{' '}
                component.
              </ListItemText>
            </ListItem>
          </DocList>
        </DocList>
      </DocSection>
      <DocSection title="Example">
        <DocCard code={basicExampleCode} scope={{ Editor }} noInline />
      </DocSection>
      <DocSection title="Customisable Example">
        <DocCard code={customisableExampleCode} scope={{ Editor, editorDefaultToolbar }} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default EditorDoc;
