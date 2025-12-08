import {
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  listItemSecondaryActionClasses,
} from '@mui/material';

const LanguageListItem = ({ ref, language, updatedLanguages, toggleLanguage, ...props }) => {
  const isChecked = updatedLanguages.some((l) => l.id === language.id);

  return (
    <ListItem
      ref={ref}
      disablePadding
      disableGutters
      secondaryAction={
        <Checkbox
          size="small"
          checked={isChecked}
          onChange={(event) => toggleLanguage(language, event.target.checked)}
        />
      }
      sx={{
        [`& .${listItemSecondaryActionClasses.root}`]: {
          mr: '7px',
        },
      }}
      {...props}
    >
      <ListItemButton
        disableGutters
        sx={{ py: 1.25 }}
        role={undefined}
        onClick={() => toggleLanguage(language, !isChecked)}
      >
        <ListItemText
          primary={
            <Typography sx={{ color: 'text.primary' }}>
              {language.name} -{' '}
              <Typography component="span" sx={{ color: 'text.secondary' }}>
                {language.label}
              </Typography>
            </Typography>
          }
          sx={{ my: 0 }}
        />
      </ListItemButton>
    </ListItem>
  );
};

LanguageListItem.displayName = 'LanguageListItem';

export default LanguageListItem;
