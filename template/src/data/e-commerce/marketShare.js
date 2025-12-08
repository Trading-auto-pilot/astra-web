import { initialConfig } from 'config';

const logo = (index) => `${initialConfig.assetsDir}/images/logo/${index}.svg`;

export const shares = [
  {
    id: 'alligator',
    icon: logo(3),
    brand: 'Alligator',
    revenue: 29.7,
    growth: 6.01,
  },
  {
    id: 'check_mark',
    icon: logo(4),
    brand: 'CheckMark',
    revenue: 31.9,
    growth: 4.12,
  },
  {
    id: 'stripes',
    icon: logo(5),
    brand: 'Stripes',
    revenue: 23.0,
    growth: -3.91,
  },
  {
    id: 'head_mead',
    icon: logo(6),
    brand: 'Head & Mead',
    revenue: 14.4,
    growth: 0.01,
  },
];
