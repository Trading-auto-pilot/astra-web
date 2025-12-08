import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import { inputBaseClasses } from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import SimpleBar from 'components/base/SimpleBar';
import StyledTextField from 'components/styled/StyledTextField';
import Note from './Note';

const NotesTabPanel = ({ notes }) => {
  return (
    <Container maxWidth={false} sx={{ maxWidth: 800, px: { xs: 0 } }}>
      <StyledTextField
        multiline
        rows={4}
        placeholder="Write & press enter"
        fullWidth
        sx={{
          mb: 1,
          [`& .${inputBaseClasses.root}.${inputBaseClasses.multiline}`]: {
            py: 0,
          },
        }}
      />

      <SimpleBar sx={{ maxHeight: 504 }}>
        <Stack
          direction="column"
          divider={<Divider sx={{ borderColor: 'dividerLight' }} />}
          sx={{ borderBottom: 1, borderColor: 'dividerLight' }}
        >
          {notes.map((note) => (
            <Note key={note.id} note={note} />
          ))}
        </Stack>
      </SimpleBar>

      <Button sx={{ mt: 3 }}>Load more notes</Button>
    </Container>
  );
};
export default NotesTabPanel;
