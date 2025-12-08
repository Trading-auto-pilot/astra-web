import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import IconifyIcon from 'components/base/IconifyIcon';
import EditDeleteMenu from '../common/EditDeleteMenu';
import QuestionItem from './Question';
import QuestionDialog from './QuestionDialog';

const initialQuestions = [
  { isMandatory: false, question: 'Why did you choose to apply to this company?' },
  { isMandatory: false, question: 'What are your greatest strengths?' },
  { isMandatory: false, question: 'How do you prefer to work on tasks?' },
  { isMandatory: false, question: 'Have you worked remotely before?' },
];

const Questionaries = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions);
  const [editingIndex, setEditingIndex] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuIndex(null);
  };

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setOpen(true);
  };

  const handleOpenEdit = (index) => {
    setEditingIndex(index);
    setOpen(true);
  };

  const handleDelete = () => {
    if (menuIndex !== null) {
      setQuestions((prev) => prev.filter((_, i) => i !== menuIndex));
    }
    enqueueSnackbar('Question deleted', { variant: 'error', autoHideDuration: 4000 });
    handleMenuClose();
  };

  const handleClose = () => setOpen(false);

  const handleSave = (value) => {
    if (editingIndex !== null) {
      const updated = [...questions];
      updated[editingIndex] = value;
      setQuestions(updated);
      enqueueSnackbar('Question updated', { variant: 'success', autoHideDuration: 4000 });
    } else {
      setQuestions([...questions, value]);
      enqueueSnackbar('Question added', { variant: 'success', autoHideDuration: 4000 });
    }

    handleClose();
  };

  return (
    <>
      <Typography fontWeight={600} mb={2}>
        Questionaries
      </Typography>
      <Stack direction="column" gap={1} mb={2}>
        {questions.map((q, index) => (
          <QuestionItem key={index} question={q} onMenuOpen={(e) => handleMenuOpen(e, index)} />
        ))}
      </Stack>
      <Button onClick={handleOpenAdd} startIcon={<IconifyIcon icon="material-symbols:add" />}>
        Add Question
      </Button>

      <QuestionDialog
        open={open}
        onClose={handleClose}
        onSave={handleSave}
        initialValue={editingIndex !== null ? questions[editingIndex] : undefined}
      />

      <EditDeleteMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onEdit={() => {
          if (menuIndex !== null) handleOpenEdit(menuIndex);
          handleMenuClose();
        }}
        onDelete={handleDelete}
      />
    </>
  );
};

export default Questionaries;
