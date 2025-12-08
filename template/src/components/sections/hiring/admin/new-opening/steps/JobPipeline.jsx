import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import { stepIconClasses } from '@mui/material/StepIcon';
import StepLabel, { stepLabelClasses } from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import EditDeleteMenu from './common/EditDeleteMenu';

const initialSteps = [
  { isMandatory: true, label: 'Received Applications' },
  { isMandatory: false, label: 'Reviewed' },
  { isMandatory: false, label: 'Schedule Mobile Screening' },
  { isMandatory: false, label: 'Mobile Screening' },
  { isMandatory: true, label: 'Job Offer' },
  { isMandatory: true, label: 'Hired' },
];

const JobPipeline = () => {
  const [steps, setSteps] = useState(initialSteps);
  const [editingIndex, setEditingIndex] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);

  const handleMenuOpen = (event, index) => {
    setMenuAnchor(event.currentTarget);
    setMenuIndex(index);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuIndex(null);
  };

  const handleEdit = () => {
    if (menuIndex !== null) setEditingIndex(menuIndex);

    handleMenuClose();
  };

  const handleDelete = () => {
    if (menuIndex !== null) setSteps((prev) => prev.filter((_, i) => i !== menuIndex));

    handleMenuClose();
  };

  const handleEditSave = (index, value) => {
    if (value.trim() === '') setSteps((prev) => prev.filter((_, i) => i !== index));
    else setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, label: value } : s)));

    setEditingIndex(null);
  };

  const handleAddStep = () => {
    const lastNonMandatoryIndex = [...steps]
      .map((s, i) => (s.isMandatory ? -1 : i))
      .filter((i) => i !== -1)
      .pop();

    const insertIndex =
      lastNonMandatoryIndex !== undefined ? lastNonMandatoryIndex + 1 : steps.length - 2;

    const newSteps = [...steps];
    newSteps.splice(insertIndex, 0, { isMandatory: false, label: 'New Step' });
    setSteps(newSteps);
    setEditingIndex(insertIndex);
  };

  return (
    <Stack direction="column" gap={2}>
      <Stepper orientation="vertical">
        {steps.map(({ label, isMandatory }, index) => (
          <Step key={index}>
            <StepLabel
              sx={({ vars }) => ({
                [`& .${stepLabelClasses.iconContainer}`]: {
                  '& svg': {
                    fill: isMandatory
                      ? vars.palette.background.elevation3
                      : vars.palette.chBlue[100],
                    [`& .${stepIconClasses.text}`]: {
                      fill: isMandatory
                        ? `${vars.palette.text.primary} !important`
                        : `${vars.palette.primary.dark} !important`,
                    },
                  },
                },
                [`& .${stepLabelClasses.labelContainer}`]: {
                  py: 0.5,
                  px: 2,
                  borderRadius: 2,
                  bgcolor: 'background.elevation1',
                },
                [`& .${stepLabelClasses.label}`]: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                },
              })}
            >
              {editingIndex === index ? (
                <StyledTextField
                  size="small"
                  fullWidth
                  autoFocus
                  placeholder="New Step"
                  defaultValue={label}
                  onBlur={(e) => handleEditSave(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSave(index, e.target.value);

                    if (e.key === 'Escape') {
                      if (label === 'New Step')
                        setSteps((prev) => prev.filter((_, i) => i !== index));
                      setEditingIndex(null);
                    }
                  }}
                  sx={{ maxWidth: 0.5 }}
                />
              ) : (
                <>
                  {label}
                  <Button
                    shape="square"
                    color="neutral"
                    size="small"
                    onClick={(e) => handleMenuOpen(e, index)}
                  >
                    <IconifyIcon icon="material-symbols-light:more-horiz" sx={{ fontSize: 18 }} />
                  </Button>
                </>
              )}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Button
        startIcon={<IconifyIcon icon="material-symbols:add" />}
        sx={{ alignSelf: 'flex-start' }}
        onClick={handleAddStep}
      >
        Add Step
      </Button>

      <EditDeleteMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Stack>
  );
};

export default JobPipeline;
