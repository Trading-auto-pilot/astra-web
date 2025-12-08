import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, FormHelperText, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import Editor from 'components/base/Editor';

const EventParagraphSection = ({ sectionIndex }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Paper
      background={1}
      sx={{
        borderRadius: 6,
        outline: 'none',
      }}
    >
      <Grid container spacing={3}>
        <Grid size={12}>
          <FormControl
            variant="filled"
            fullWidth
            error={!!errors['sections']?.[sectionIndex]?.paragraphContents}
          >
            <Controller
              name={`sections.${sectionIndex}.paragraphContents`}
              control={control}
              render={({ field }) => (
                <Editor
                  onChange={field.onChange}
                  content={field.value}
                  isValid={!errors['sections']?.[sectionIndex]?.paragraphContents}
                />
              )}
            />
            <FormHelperText>
              {errors['sections']?.[sectionIndex]?.paragraphContents?.message}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EventParagraphSection;
