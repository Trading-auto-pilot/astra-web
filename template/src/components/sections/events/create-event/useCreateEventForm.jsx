import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const CreateEventFormSchema = yup.object({
  name: yup.string().required('This field is required'),
  address: yup.string().required('This field is required'),
  eventDateRange: yup
    .array()
    .of(yup.date().nullable())
    .length(2, 'Both start and end dates are required')
    .required('Please select a date range')
    .test('both-dates-present', 'Both start and end dates are required', (value) => {
      return Array.isArray(value) && value[0] !== null && value[1] !== null;
    }),

  startTime1: yup.string().required('This field is required'),
  endTime1: yup.string().required('This field is required'),
  startTime2: yup.string().required('This field is required'),
  endTime2: yup.string().required('This field is required'),

  eventImages: yup
    .array()
    .of(
      yup
        .object({
          id: yup.string().required('This field is required'),
          file: yup.mixed().required('File is required'),
        })
        .required(),
    )
    .min(1, 'Upload at least 1 media file')
    .required(),
  sections: yup.array().of(
    yup.object({
      title: yup.string().required('This field is required'),
      contentType: yup.string().oneOf(['paragraph', 'list', 'info']).required(),
      listItems: yup
        .array()
        .of(
          yup.object({
            value: yup.string().required('This field is required'),
            itemId: yup.string().required(),
          }),
        )
        .optional()
        .nullable(),
      infoItems: yup
        .array()
        .of(
          yup.object({
            option: yup.string().required('This field is required'),
            value: yup.string().required('This field is required'),
            itemId: yup.string().required(),
          }),
        )
        .optional()
        .nullable(),
      paragraphContents: yup
        .string()
        .nullable()
        .test('validate-paragraph', 'Paragraph content is required', (value, context) => {
          return context.parent.contentType !== 'paragraph' || !!value;
        }),
      images: yup
        .array()
        .of(
          yup.object({
            id: yup.string().required(),
            file: yup.mixed().required(),
          }),
        )
        .optional(),
      imageAlignment: yup.mixed().optional(),
    }),
  ),
  ticketPricing: yup.object({
    ticketType: yup.string().oneOf(['free', 'paid']).required(),
    options: yup
      .array()
      .of(
        yup.object({
          name: yup.string().required('This field is required'),
          price: yup
            .number()
            .positive('This field is required')
            .nullable()
            .required('This field is required'),
          noOfTickets: yup
            .number()
            .required('This field is required')
            .positive('This field is required')
            .nullable()
            .required('This field is required'),
          facilities: yup
            .array()
            .of(yup.string().required('This field is required'))
            .min(1, 'This field is required'),
        }),
      )
      .when('isTicketFree', {
        is: false,
        then: (schema) => schema.min(1, 'Ticket option is required'),
        otherwise: (schema) => schema.notRequired().nullable(),
      }),
  }),

  eventPrivacy: yup.mixed().required(),
});

const useCreateEventForm = () => {
  const methods = useForm({
    resolver: yupResolver(CreateEventFormSchema),
    defaultValues: {
      eventImages: [],
      sections: [
        {
          title: '',
          contentType: 'paragraph',
          paragraphContents: '',
        },
        {
          title: '',
          contentType: 'info',

          infoItems: [
            { option: '', value: '', itemId: 'item1' },
            { option: '', value: '', itemId: 'item2' },
            { option: '', value: '', itemId: 'item3' },
          ],
        },
        {
          title: '',
          contentType: 'list',

          listItems: [
            { value: '', itemId: 'item1' },
            { value: '', itemId: 'item2' },
            { value: '', itemId: 'item3' },
          ],
        },
      ],
      ticketPricing: {
        ticketType: 'paid',
        options: [
          {
            name: '',
            facilities: ['Club', 'Stadium', 'Arena', 'Pool'],
          },
        ],
      },
    },
  });

  return { methods };
};

export default useCreateEventForm;
