import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  List,
  Stack,
  TextField,
  dialogClasses,
} from '@mui/material';
import { languages } from 'data/account/language-region';
import IconifyIcon from 'components/base/IconifyIcon';
import SimpleBar from 'components/base/SimpleBar';
import LanguageListItem from './LanguageListItem';

const LanguageDialog = (props) => {
  const { open, handleDialogClose, sx } = props;
  const { setValue, control } = useFormContext();
  const checkedLanguages = useWatch({ control, name: 'languages' });
  const [visibleLanguages, setVisibleLanguages] = useState(languages);
  const [updatedLanguages, setUpdatedLanguages] = useState(checkedLanguages);

  const handleSearch = (event) => {
    setVisibleLanguages(() =>
      languages.filter(
        (language) =>
          language.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
          language.label.toLowerCase().includes(event.target.value.toLowerCase()) ||
          `${language.name} - ${language.label}`
            .toLowerCase()
            .includes(event.target.value.toLowerCase()),
      ),
    );
  };

  const toggleLanguage = (language, isChecked) => {
    setUpdatedLanguages((prev) =>
      isChecked
        ? [...prev, language].sort((a, b) => a.id - b.id)
        : prev.filter((l) => l.id !== language.id),
    );
  };

  const handleConfirm = () => {
    setValue('languages', updatedLanguages);
    handleDialogClose();
  };

  const handleDiscard = () => {
    setUpdatedLanguages(checkedLanguages);
    handleDialogClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDiscard}
      sx={{
        [`& .${dialogClasses.paper}`]: {
          borderRadius: 6,
          overflow: 'visible',
          maxWidth: 463,
          ...sx,
        },
      }}
    >
      <DialogTitle
        component="h6"
        sx={{
          pt: 3,
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Language
        <IconButton onClick={handleDiscard}>
          <IconifyIcon icon="material-symbols:close" sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <DialogContentText
          variant="body2"
          sx={{ color: 'text.secondary', mb: 2, textWrap: 'pretty' }}
        >
          Choose your preferred language for display text, handwriting, speech, and search filters.
        </DialogContentText>
        <Stack direction="column" spacing={1}>
          <TextField
            label="Search"
            size="small"
            autoComplete="off"
            onChange={handleSearch}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon icon="material-symbols:search-rounded" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <SimpleBar sx={{ maxHeight: 334 }}>
            <List
              disablePadding
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {visibleLanguages.map((language) => (
                <LanguageListItem
                  key={language.id}
                  language={language}
                  updatedLanguages={updatedLanguages}
                  toggleLanguage={toggleLanguage}
                />
              ))}
            </List>
          </SimpleBar>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
        }}
      >
        <Button variant="soft" color="neutral" onClick={handleDiscard}>
          Discard
        </Button>
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LanguageDialog;
