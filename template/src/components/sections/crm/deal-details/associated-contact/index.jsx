import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import Contact from './Contact';

const AssociatedContact = ({ associatedContactData }) => {
  const { topbarHeight } = useNavContext();

  return (
    <Stack
      direction="column"
      sx={{
        p: { xs: 3, md: 5 },
        gap: 2,
        alignItems: 'flex-start',
        position: 'sticky',
        top: topbarHeight,
      }}
    >
      <Typography variant="h5">Associated Contact</Typography>
      {associatedContactData.map((contact) => (
        <Contact key={contact.id} contact={contact} />
      ))}
      <Button size="small" startIcon={<IconifyIcon icon="material-symbols:add" />}>
        Add More Contact
      </Button>
    </Stack>
  );
};

export default AssociatedContact;
