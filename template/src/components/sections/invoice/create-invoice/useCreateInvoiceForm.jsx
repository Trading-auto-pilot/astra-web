import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const CreateInvoiceFormSchema = yup.object({
  organizationImage: yup
    .object({
      id: yup.string().required('This field is required.'),
      file: yup.mixed().required('This field is required.'),
    })
    .nullable()
    .required('Upload an image'),
  invoiceFrom: yup.object({
    name: yup.string().required('Name is required'),
    phone: yup.string().required('Phone is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    address: yup.string().required('Address is required'),
  }),
  invoiceTo: yup.object({
    name: yup.string().required('Name is required'),
    phone: yup.string().required('Phone is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    address: yup.string().required('Address is required'),
  }),
  invoiceDetails: yup.object({
    invoiceNumber: yup
      .number()
      .nullable()
      .typeError('Invoice number must be a number')
      .required('Invoice number is required'),
    status: yup.string().required('Status is required'),
  }),
  deadline: yup.object({
    issueDate: yup.date().nullable().typeError('Invalid date').required('Issue date is required'),
    dueDate: yup
      .date()
      .nullable()
      .typeError('Invalid date')
      .required('Due date is required')
      .min(yup.ref('issueDate'), 'Due date must be after issue date'),
  }),
  orderCharges: yup.object({
    currency: yup.string().required('Currency is required'),
    shippingCost: yup
      .number()
      .typeError('Shipping cost must be a number')
      .nullable()
      .required('Shipping cost is required'),
  }),
  adjustment: yup.object({
    discount: yup
      .number()
      .typeError('Discount must be a number')
      .nullable()
      .required('Discount is required'),
    tax: yup.number().typeError('Tax must be a number').nullable().required('Tax is required'),
  }),
  itemDetails: yup
    .array()
    .of(
      yup.object({
        type: yup
          .mixed()
          .oneOf(['service', 'product'], 'Invalid type')
          .required('Item type is required'),
        description: yup.string().required('Description is required'),
        quantity: yup
          .number()
          .typeError('Quantity must be a number')
          .positive('Quantity must be greater than 0')
          .required('Quantity is required'),
        price: yup
          .number()
          .typeError('Price must be a number')
          .positive('Price must be greater than 0')
          .required('Price is required'),
      }),
    )
    .min(1, 'At least one item is required')
    .required('Items are required'),
  note: yup.string(),
});

export const useCreateInvoiceForm = () => {
  const methods = useForm({
    resolver: yupResolver(CreateInvoiceFormSchema),
    defaultValues: {
      organizationImage: null,
      invoiceFrom: {
        name: 'Themewagon',
        phone: '+123456789012',
        email: 'themewagon@gmail.com',
        address: 'Wilmington, DE, US 19802-4447',
      },
      invoiceTo: {
        name: '',
        phone: '',
        email: '',
        address: '',
      },
      invoiceDetails: {
        invoiceNumber: null,
        status: '',
      },
      deadline: {
        issueDate: null,
        dueDate: null,
      },
      orderCharges: {
        currency: '',
        shippingCost: null,
      },
      adjustment: {
        discount: null,
        tax: null,
      },
      itemDetails: [
        {
          type: 'service',
          description: 'Web design service',
          quantity: 3,
          price: 50,
        },
        {
          type: 'product',
          description: 'Soft set',
          quantity: 2,
          price: 80,
        },
        {
          type: 'service',
          description: 'Facebook add campaign',
          quantity: 1,
          price: 50,
        },
      ],
      note: '',
    },
  });

  return { methods };
};
