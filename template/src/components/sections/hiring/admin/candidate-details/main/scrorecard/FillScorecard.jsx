import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';

const criteriaRatings = [
  {
    title: 'Professionalism',
    items: ['Punctual', 'Courteous', 'Communicator', 'Articulate'],
  },
  {
    title: 'Qualities',
    items: ['Emotional Intelligence', 'Honesty', 'Positivity', 'Curiosity', 'Self-Motivated'],
  },
  {
    title: 'Activities',
    items: ['Event Management', 'Speaker', 'Event Planning'],
  },
];

const getAllItems = () => {
  return criteriaRatings.flatMap((category) => category.items);
};

const validationSchema = yup.object({
  ratings: yup
    .object(
      getAllItems().reduce((acc, item) => {
        acc[item] = yup.number().min(1, `${item} rating is required`).max(5);

        return acc;
      }, {}),
    )
    .required(),
  comment: yup.string().required('Comment is required'),
});

const FillScorecard = () => {
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ratings: {},
      comment: '',
    },
    mode: 'onChange',
  });

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    console.log(data);

    handleClose();
  };

  const getErrorMessage = (item) => {
    return errors.ratings?.[item]?.message;
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen} sx={{ whiteSpace: 'nowrap' }}>
        Fill Scorecard
      </Button>

      <Dialog
        open={open}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          component={Stack}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 5, pb: 3 }}
        >
          <div>
            <Typography variant="h6">Fill Scoreboard</Typography>
            <Typography variant="body2" color="textSecondary">
              Please share your ratings and feedback for the candidate.
            </Typography>
          </div>

          <IconButton onClick={handleClose}>
            <IconifyIcon
              icon="material-symbols:close"
              sx={{ fontSize: 20, color: 'neutral.dark' }}
            />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 5, pb: 0 }}>
          <Stack direction="column" gap={3}>
            {criteriaRatings.map((category) => (
              <div key={category.title}>
                <Typography variant="body1" fontWeight={700} mb={2}>
                  {category.title}
                </Typography>

                <Stack direction="column" gap={1}>
                  {category.items.map((item) => (
                    <Stack
                      key={item}
                      direction="row"
                      sx={{
                        bgcolor: 'background.elevation1',
                        borderRadius: 2,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 2,
                        py: 1,
                        border: getErrorMessage(item) ? '1px solid' : 'none',
                        borderColor: 'error.main',
                      }}
                    >
                      <div>
                        <Typography variant="body2" fontWeight={500} color="textSecondary">
                          {item}
                        </Typography>
                        {getErrorMessage(item) && (
                          <Typography variant="caption" color="error.main">
                            {getErrorMessage(item)}
                          </Typography>
                        )}
                      </div>

                      <Controller
                        name={`ratings.${item}`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Rating
                            value={value || 0}
                            onChange={(_, newValue) => onChange(newValue || 0)}
                            icon={
                              <IconifyIcon
                                icon="material-symbols:star-rounded"
                                fontSize={24}
                                color="warning.main"
                              />
                            }
                            emptyIcon={
                              <IconifyIcon
                                icon="material-symbols:star-rounded"
                                fontSize={24}
                                color="divider"
                              />
                            }
                          />
                        )}
                      />
                    </Stack>
                  ))}
                </Stack>
              </div>
            ))}

            <div>
              <Typography variant="body1" fontWeight={700} mb={2}>
                Final Assessment
              </Typography>

              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Add Comment"
                    multiline
                    rows={2}
                    error={!!errors.comment}
                    helperText={errors.comment?.message}
                  />
                )}
              />

              {!errors.comment && (
                <FormHelperText sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <IconifyIcon icon="material-symbols:info-outline-rounded" />
                  Comment must be at least 10 characters long.
                </FormHelperText>
              )}
            </div>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 5, pt: 2 }}>
          <Button variant="text" color="neutral" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={!isValid}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FillScorecard;
