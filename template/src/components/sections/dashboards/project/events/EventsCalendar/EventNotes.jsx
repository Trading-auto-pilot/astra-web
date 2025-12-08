import { Controller, useFormContext } from 'react-hook-form';
import { Stack, Typography } from '@mui/material';
import Editor from 'components/base/Editor';

const EventNotes = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Stack direction="column" spacing={0.5}>
      <Typography
        component="label"
        sx={{
          mx: 1,
          fontSize: 12,
          fontWeight: 500,
          color: 'text.secondary',
        }}
      >
        Add Notes
      </Typography>
      <Controller
        control={control}
        name="notes"
        render={({ field }) => (
          <Editor
            onChange={field.onChange}
            content={field.value}
            isValid={!errors.notes}
            sx={{
              '& .MuiTiptap-RichTextContent-root .tiptap': {
                minHeight: 96,
              },
            }}
          />
        )}
      />
    </Stack>
  );
};

export default EventNotes;
