import { initialConfig } from 'config';
import { users } from 'data/users';

const blog = (index) => `${initialConfig.assetsDir}/images/landing/blog/${index}.webp`;
const gallery = (index) => `${initialConfig.assetsDir}/images/landing/gallery/${index}.webp`;
const testimonial = (index) =>
  `${initialConfig.assetsDir}/images/landing/testimonial/${index}.webp`;
const showcase = (index) => `${initialConfig.assetsDir}/images/landing/showcase/${index}.webp`;

export const showcaseData = [
  {
    title: 'Skyline Innovations',
    img: showcase(1),
    subtitle: 'Modern architecture reimagined for tomorrow’s cities.',
    desc: 'A forward-thinking project blending minimal design with functional elegance. This work emphasizes clean geometry and sustainable building practices to create inspiring spaces.',
  },
  {
    title: 'Quantum Leap Initiative',
    img: showcase(2),
    subtitle: 'Pioneering solutions for modern infrastructure.',
    desc: 'A daring take on structural innovation merges advanced technology with classic design. This initiative demonstrates how contemporary construction can meet the urban challenges of the future.',
  },
  {
    title: 'EcoVision Project',
    img: showcase(3),
    subtitle: 'Where sustainability meets architectural beauty.',
    desc: 'A project focused on eco-friendly materials and green architecture. Built with efficiency in mind, EcoVision highlights how smart design can minimize impact while maximizing aesthetic value.',
  },
];

export const featuresData = [
  {
    title: 'Real-time collaboration.',
    description: 'An intuitive drag-and-drop interface for easy content management.',
  },
  {
    title: 'Guided tutorials.',
    description: 'A notification system that alerts users about important updates and messages.',
  },
  {
    title: 'User data protection.',
    description: 'A feedback system that allows users to share their thoughts and suggestions.',
  },
  {
    title: 'Third-party integration.',
    description:
      'A responsive design that ensures optimal performance on both mobile and desktop devices.',
  },
  {
    title: 'Adaptive profiles.',
    description:
      'A sleek dashboard that provides real-time analytics and insights. Users can customize their views.',
  },
  {
    title: 'Personalized themes.',
    description: 'A robust search feature that helps users find content quickly and efficiently.',
  },
];

export const galleryData = [
  { img: gallery(1), name: 'The Zenith UI/UX' },
  { img: gallery(2), name: 'The Atlas Interface' },
  { img: gallery(3), name: 'The Serpentine Design' },
  { img: gallery(4), name: 'Heritage Blueprint' },
  { img: gallery(5), name: 'The Vaulted Architecture' },
  { img: gallery(6), name: 'Quantum Framework' },
  { img: gallery(7), name: 'The Urban Experience' },
];

export const statsData = [
  { value: '4,000+', label: 'Users and still counting' },
  { value: '$25,000', label: 'In revenue and still generating' },
  { value: '3%', label: 'Flat platform fee' },
  { value: '5,152', label: 'Transactions this year' },
];

export const testimonialData = [
  {
    id: 0,
    rating: 5,
    review: 'I absolutely love the package I chose; it fits my needs perfectly!',
    name: 'Casey Adams',
    company: 'CEO, Limitless Ltd',
    img: testimonial(1),
  },
  {
    id: 1,
    rating: 4,
    review: 'I absolutely love the package I chose; it fits my needs perfectly!',
    name: 'Jake Peralta',
    company: 'CEO, Limitless Ltd',
    img: testimonial(2),
  },
  {
    id: 2,
    rating: 3,
    review: 'I absolutely love the package I chose; it fits my needs perfectly!',
    name: 'Charles Boyle',
    company: 'CEO, Limitless Ltd',
    img: testimonial(3),
  },
  {
    id: 3,
    rating: 4,
    review: 'I absolutely love the package I chose; it fits my needs perfectly!',
    name: 'Terry Jeffords',
    company: 'CEO, Limitless Ltd',
    img: testimonial(1),
  },
  {
    id: 4,
    rating: 5,
    review: 'I absolutely love the package I chose; it fits my needs perfectly!',
    name: 'Casey Adams',
    company: 'CEO, Limitless Ltd',
    img: testimonial(2),
  },
];

export const blogData = [
  {
    id: 1,
    img: blog(1),
    title: 'Enhancing Your Conversion Rates Through Front-End Development',
    tag: 'Nature',
    date: '2024-12-31',
    timeRead: '12 min read',
    user: users[5],
    designation: 'Front end developer',
  },
  {
    id: 2,
    img: blog(2),
    title: 'Boosting Your Conversion Rates with Front-End Development',
    tag: 'Nature',
    date: '2024-12-31',
    timeRead: '12 min read',
    user: users[2],
    designation: 'Front end developer',
  },
  {
    id: 3,
    img: blog(3),
    title: 'Improving Conversion Rates via Front-End Development',
    tag: 'Nature',
    date: '2024-12-31',
    timeRead: '12 min read',
    user: users[13],
    designation: 'Front end developer',
  },
];

export const faqData = [
  {
    summary: 'How do I get started?',
    details:
      'Getting started is simple. Just sign up with your email, create an account, and you’ll have instant access to all the core features. You can explore the platform right away and upgrade later if you need advanced tools.',
  },
  {
    summary: 'Do I need to create an account to use this?',
    details:
      'Lorem ipsum dolor sit amet consectetur. Sed euismod scelerisque sed at. Adipiscing augue tempor tincidunt eu luctus massa facilisis. Mi a eget auctor et scelerisque bibendum sodales. Sagittis amet consequat integer blandit ut vitae tincidunt.',
  },
  {
    summary: 'Is there a free trial or demo available?',
    details:
      'Lorem ipsum dolor sit amet consectetur. Sed euismod scelerisque sed at. Adipiscing augue tempor tincidunt eu luctus massa facilisis. Mi a eget auctor et scelerisque bibendum sodales. Sagittis amet consequat integer blandit ut vitae tincidunt.',
  },
  {
    summary: 'What makes your product different from others?',
    details:
      'Lorem ipsum dolor sit amet consectetur. Sed euismod scelerisque sed at. Adipiscing augue tempor tincidunt eu luctus massa facilisis. Mi a eget auctor et scelerisque bibendum sodales. Sagittis amet consequat integer blandit ut vitae tincidunt.',
  },
  {
    summary: 'What payment methods do you accept?',
    details:
      'Lorem ipsum dolor sit amet consectetur. Sed euismod scelerisque sed at. Adipiscing augue tempor tincidunt eu luctus massa facilisis. Mi a eget auctor et scelerisque bibendum sodales. Sagittis amet consequat integer blandit ut vitae tincidunt.',
  },
];
