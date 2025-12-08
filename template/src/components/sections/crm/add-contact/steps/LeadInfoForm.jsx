import { Controller, useFormContext } from 'react-hook-form';
import {
  Autocomplete,
  Box,
  Divider,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import * as yup from 'yup';
import ContactFormSection from 'components/sections/crm/add-contact/ContactFormSection';
import ControlledSelect from 'components/sections/crm/add-contact/ControlledSelect';

export const leadInfoSchema = yup.object({
  leadInfo: yup.object({
    source: yup.string().required('Lead Source is required'),
    assignedAgent: yup.string().required('Assigned Agent is required'),
    status: yup.string().required('Lead Status is required'),
    priority: yup.string().required('Priority is required'),
    tags: yup
      .array()
      .of(yup.string())
      .min(1, 'At least one tag is required')
      .required('Tags are required'),
    note: yup.string().optional(),
  }),
});

const sourceOptions = [
  { value: 'organic_search', label: 'Organic Search' },
  { value: 'paid_ads', label: 'Paid Ads' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'referral', label: 'Referral' },
  { value: 'email_campaign', label: 'Email Campaign' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'partner', label: 'Partner' },
  { value: 'event', label: 'Event' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'other', label: 'Other' },
];

const agentOptions = [
  { value: 'agent1', label: 'Agent 1' },
  { value: 'agent2', label: 'Agent 2' },
  { value: 'agent3', label: 'Agent 3' },
  { value: 'agent4', label: 'Agent 4' },
  { value: 'agent5', label: 'Agent 5' },
];

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'interested', label: 'Interested' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
  { value: 'lost', label: 'Lost' },
  { value: 'nurturing', label: 'Nurturing' },
];

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'normal', label: 'Normal' },
];

const availableTags = [
  'Technology',
  'Finance',
  'Marketing',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Hospitality',
  'E-commerce',
  'Energy',
  'Government',
];
const LeadInfoForm = ({ label }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <Box sx={{ mb: 4.5 }}>
        <Typography variant="h6" sx={{ mb: 2, whiteSpace: 'nowrap' }}>
          {label}
        </Typography>
        <Divider />
      </Box>

      <Stack direction="column" spacing={4}>
        <ContactFormSection title="Lead Assignment">
          <Stack spacing={2} sx={{ width: 1 }}>
            <ControlledSelect
              name="leadInfo.source"
              label="Lead Source Type"
              options={sourceOptions}
              control={control}
              error={errors.leadInfo?.source?.message}
            />
            <ControlledSelect
              name="leadInfo.assignedAgent"
              label="Assign Agent"
              options={agentOptions}
              control={control}
              error={errors.leadInfo?.assignedAgent?.message}
            />
          </Stack>
        </ContactFormSection>

        <ContactFormSection title="Lead Status">
          <Stack spacing={2} sx={{ width: 1 }}>
            <ControlledSelect
              name="leadInfo.status"
              label="Lead Status"
              options={statusOptions}
              control={control}
              error={errors.leadInfo?.status?.message}
            />
            <ControlledSelect
              name="leadInfo.priority"
              label="Priority"
              options={priorityOptions}
              control={control}
              error={errors.leadInfo?.priority?.message}
            />
          </Stack>
        </ContactFormSection>

        <ContactFormSection title="Tags & Keywords">
          <FormControl fullWidth variant="filled" error={!!errors.leadInfo?.tags}>
            <Controller
              name="leadInfo.tags"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  fullWidth
                  multiple
                  id="tags"
                  options={availableTags}
                  freeSolo
                  value={field.value || []}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      label="Add Tags/Keywords"
                      error={!!errors.leadInfo?.tags}
                      {...params}
                    />
                  )}
                />
              )}
            />
            <FormHelperText>{errors.leadInfo?.tags?.message}</FormHelperText>
          </FormControl>
          <Controller
            name="leadInfo.note"
            control={control}
            render={({ field }) => (
              <TextField
                label={
                  <Typography variant="subtitle2" fontWeight={400}>
                    Website
                    <Box component="span" sx={{ color: 'text.disabled', ml: 0.5 }}>
                      ( optional )
                    </Box>
                  </Typography>
                }
                multiline
                rows={3}
                fullWidth
                error={!!errors.leadInfo?.note}
                helperText={errors.leadInfo?.note?.message}
                {...field}
              />
            )}
          />
        </ContactFormSection>
      </Stack>
    </div>
  );
};

export default LeadInfoForm;
