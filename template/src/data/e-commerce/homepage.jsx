import { initialConfig } from 'config';
import paths from 'routes/paths';

const banner = (index) => `${initialConfig.assetsDir}/images/ecommerce/banners/${index}.webp`;
const category = (index) => `${initialConfig.assetsDir}/images/ecommerce/categories/${index}.webp`;

export const categories = [
  {
    id: '1',
    label: 'Shop by Room',
    items: [
      {
        id: '1-1',
        title: 'Living room',
        items: [
          { id: '1-1-1', title: 'Sofas', url: paths.products },
          { id: '1-1-2', title: 'Coffee Tables', url: paths.products },
          { id: '1-1-3', title: 'TV Stands', url: paths.products },
          { id: '1-1-4', title: 'Living Room Sets', url: paths.products },
          {
            id: '1-1-5',
            title: 'Ottomans',
            url: paths.products,
            items: [
              { id: '1-1-5-1', title: 'Sofassss', url: paths.products },
              { id: '1-1-5-2', title: 'Coffee Tables', url: paths.products },
              { id: '1-1-5-3', title: 'TV Stands', url: paths.products },
              { id: '1-1-5-4', title: 'Living Room Sets', url: paths.products },
              { id: '1-1-5-5', title: 'Ottomans', url: paths.products },
            ],
          },
        ],
      },
      { id: '1-2', title: 'Sofas', url: paths.products },
      {
        id: '1-3',
        title: 'Dining room',
        items: [
          { id: '1-3-1', title: 'Dining Tables', url: paths.products },
          { id: '1-3-2', title: 'Dining Chairs', url: paths.products },
          { id: '1-3-3', title: 'Buffets & Sideboards', url: paths.products },
          { id: '1-3-4', title: 'Bar Stools', url: paths.products },
          { id: '1-3-5', title: 'Dining Sets', url: paths.products },
        ],
      },
      {
        id: '1-4',
        title: 'Bedroom',
        items: [
          { id: '1-4-1', title: 'Beds', url: paths.products },
          { id: '1-4-2', title: 'Dressers', url: paths.products },
          { id: '1-4-3', title: 'Nightstands', url: paths.products },
          { id: '1-4-4', title: 'Bedroom Sets', url: paths.products },
          { id: '1-4-5', title: 'Mattresses', url: paths.products },
        ],
      },
      {
        id: '1-5',
        title: 'Kitchen',
        items: [
          { id: '1-5-1', title: 'Kitchen Islands', url: paths.products },
          { id: '1-5-2', title: 'Bar Stools', url: paths.products },
          { id: '1-5-3', title: 'Pantry Cabinets', url: paths.products },
          { id: '1-5-4', title: 'Kitchen Carts', url: paths.products },
          { id: '1-5-5', title: 'Dining Sets', url: paths.products },
        ],
      },
      {
        id: '1-6',
        title: 'Washroom',
        items: [
          { id: '1-6-1', title: 'Bathroom Vanities', url: paths.products },
          { id: '1-6-2', title: 'Bathroom Cabinets', url: paths.products },
          { id: '1-6-3', title: 'Towel Racks', url: paths.products },
          { id: '1-6-4', title: 'Laundry Hampers', url: paths.products },
          { id: '1-6-5', title: 'Bathroom Shelves', url: paths.products },
        ],
      },
      {
        id: '1-7',
        title: 'Outdoor',
        items: [
          { id: '1-7-1', title: 'Patio Furniture Sets', url: paths.products },
          { id: '1-7-2', title: 'Outdoor Chairs', url: paths.products },
          { id: '1-7-3', title: 'Outdoor Tables', url: paths.products },
          { id: '1-7-4', title: 'Hammocks', url: paths.products },
          { id: '1-7-5', title: 'Outdoor Storage', url: paths.products },
        ],
      },
    ],
  },
  {
    id: '2',
    label: 'Shop by Furniture',
    items: [
      {
        id: '2-1',
        title: 'Table',
        items: [
          { id: '2-1-1', title: 'Coffee Tables', url: paths.products },
          { id: '2-1-2', title: 'Side Tables', url: paths.products },
          { id: '2-1-3', title: 'Dining Tables', url: paths.products },
          { id: '2-1-4', title: 'Console Tables', url: paths.products },
          { id: '2-1-5', title: 'Bedside Tables', url: paths.products },
        ],
      },
      {
        id: '2-2',
        title: 'Chair',
        items: [
          { id: '2-2-1', title: 'Armchairs', url: paths.products },
          { id: '2-2-2', title: 'Dining Chairs', url: paths.products },
          { id: '2-2-3', title: 'Office Chairs', url: paths.products },
          { id: '2-2-4', title: 'Recliners', url: paths.products },
          { id: '2-2-5', title: 'Accent Chairs', url: paths.products },
        ],
      },
      {
        id: '2-3',
        title: 'Bed',
        items: [
          { id: '2-3-1', title: 'Platform Beds', url: paths.products },
          { id: '2-3-2', title: 'Canopy Beds', url: paths.products },
          { id: '2-3-3', title: 'Storage Beds', url: paths.products },
          { id: '2-3-4', title: 'Bunk Beds', url: paths.products },
          { id: '2-3-5', title: 'Sleigh Beds', url: paths.products },
        ],
      },
      {
        id: '2-4',
        title: 'Bookshelf',
        items: [
          { id: '2-4-1', title: 'Wall Bookshelves', url: paths.products },
          { id: '2-4-2', title: 'Corner Bookshelves', url: paths.products },
          { id: '2-4-3', title: 'Ladder Bookshelves', url: paths.products },
          { id: '2-4-4', title: 'Cube Bookshelves', url: paths.products },
          { id: '2-4-5', title: 'Kids Bookshelves', url: paths.products },
        ],
      },
      {
        id: '2-5',
        title: 'Sofa',
        items: [
          { id: '2-5-1', title: 'Sectional Sofas', url: paths.products },
          { id: '2-5-2', title: 'Sleeper Sofas', url: paths.products },
          { id: '2-5-3', title: 'Loveseats', url: paths.products },
          { id: '2-5-4', title: 'Reclining Sofas', url: paths.products },
          { id: '2-5-5', title: 'Chaise Sofas', url: paths.products },
        ],
      },
      {
        id: '2-6',
        title: 'Couch',
        items: [
          { id: '2-6-1', title: 'Fabric Couches', url: paths.products },
          { id: '2-6-2', title: 'Leather Couches', url: paths.products },
          { id: '2-6-3', title: 'Microfiber Couches', url: paths.products },
          { id: '2-6-4', title: 'Convertible Couches', url: paths.products },
          { id: '2-6-5', title: 'Modular Couches', url: paths.products },
        ],
      },
      {
        id: '2-7',
        title: 'Decor',
        items: [
          { id: '2-7-1', title: 'Wall Art', url: paths.products },
          { id: '2-7-2', title: 'Mirrors', url: paths.products },
          { id: '2-7-3', title: 'Rugs', url: paths.products },
          { id: '2-7-4', title: 'Throw Pillows', url: paths.products },
          { id: '2-7-5', title: 'Vases', url: paths.products },
        ],
      },
      {
        id: '2-8',
        title: 'Sofa',
        items: [
          { id: '2-8-1', title: 'Sectional Sofas', url: paths.products },
          { id: '2-8-2', title: 'Sleeper Sofas', url: paths.products },
          { id: '2-8-3', title: 'Loveseats', url: paths.products },
          { id: '2-8-4', title: 'Reclining Sofas', url: paths.products },
          { id: '2-8-5', title: 'Chaise Sofas', url: paths.products },
        ],
      },
      {
        id: '2-9',
        title: 'Couch',
        items: [
          { id: '2-9-1', title: 'Fabric Couches', url: paths.products },
          { id: '2-9-2', title: 'Leather Couches', url: paths.products },
          { id: '2-9-3', title: 'Microfiber Couches', url: paths.products },
          { id: '2-9-4', title: 'Convertible Couches', url: paths.products },
          { id: '2-9-5', title: 'Modular Couches', url: paths.products },
        ],
      },
    ],
  },
];

export const features = [
  {
    label: 'Fastest delivery',
    icon: 'material-symbols-light:local-shipping-outline-rounded',
  },
  {
    label: 'Smooth shopping',
    icon: 'material-symbols-light:shopping-bag-outline',
  },
  {
    label: 'Authentic products',
    icon: 'material-symbols-light:verified-outline-rounded',
  },
  {
    label: 'Easy payment',
    icon: 'material-symbols-light:credit-score-outline-rounded',
  },
  {
    label: 'Secured data',
    icon: 'material-symbols-light:verified-user-outline-rounded',
  },
  {
    label: 'Free and easy return',
    icon: 'material-symbols-light:keyboard-return-rounded',
  },
];

export const popularCategories = [
  {
    label: 'Armchair',
    image: category(1),
    url: paths.products,
  },
  {
    label: 'Couch',
    image: category(2),
    url: paths.products,
  },
  {
    label: 'Sofa',
    image: category(3),
    url: paths.products,
  },
  {
    label: 'Chair',
    image: category(4),
    url: paths.products,
  },
  {
    label: 'Nightstand',
    image: category(5),
    url: paths.products,
  },
  {
    label: 'Stool',
    image: category(6),
    url: paths.products,
  },
  {
    label: 'Table',
    image: category(7),
    url: paths.products,
  },
  {
    label: 'Bed',
    image: category(8),
    url: paths.products,
  },
  {
    label: 'Coffee Table',
    image: category(9),
    url: paths.products,
  },
  {
    label: 'Dresser',
    image: category(10),
    url: paths.products,
  },
  {
    label: 'Work Desk',
    image: category(11),
    url: paths.products,
  },
  {
    label: 'Shelf',
    image: category(12),
    url: paths.products,
  },
];

export const categoryBanners = [
  {
    id: 1,
    title: <>Browse furnitures for your living room</>,
    image: banner(1),
    url: '#!',
  },
  {
    id: 2,
    title: <>Spend leisure on your lawn with comfort</>,
    image: banner(2),
    url: '#!',
  },
  {
    id: 3,
    title: <>Let ergonomics meet style in your office</>,
    image: banner(3),
    url: '#!',
  },
];
