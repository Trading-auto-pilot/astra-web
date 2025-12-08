import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicBackdropCode = `const SimpleBackdrop = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Stack sx={{ justifyContent:'center' }}>
      <Button onClick={handleOpen}>Show backdrop</Button>
      <Backdrop
        sx={{ color: 'common.white', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Stack>
  );
};
render(<SimpleBackdrop/>)
`;

const BackdropDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Backdrop',
        description:
          "The Backdrop component narrows the user's focus to a particular element on the screen.",
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Backdrop',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-backdrop`,
        folderLink: `${folderBaseLink}/BackdropDoc.jsx`,
      }}
    >
      <DocSection
        title="Backdrop Example"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The demo below shows a basic Backdrop with a Circular Progress component in the
            foreground to indicate a loading state. After clicking &nbsp;
            <strong> Show Backdrop</strong>,&nbsp; you can click anywhere on the page to close it.
          </Typography>
        }
      >
        <DocCard code={basicBackdropCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default BackdropDoc;
