import banner from 'assets/images/background/12.webp';
import { initialConfig } from 'config';
import dayjs from 'dayjs';
import { generateUniqueId } from 'lib/utils';
import { users } from './users';

const image = (index) => `${initialConfig.assetsDir}/images/social/photos/${index}.webp`;

export const profileData = {
  ...users[3],
  bannerImage: banner,
  bio: '🌟 Jedi Master, Rebel Alliance Hero, Lightsaber Enthusiast, Farmboy-turned-Galactic Legend, Defeated the Empire - May the Force be with you! 💫',
  websiteUrl: 'kugisakinobara.com',
  username: 'KugisakiNobara123',
  following: 60,
  followers: 11200000,
  followingUsers: [
    { ...users[2], id: 1, following: 120, followers: 850000, followingStatus: true },
    { ...users[4], id: 2, following: 95, followers: 2300000, followingStatus: true },
    { ...users[0], id: 3, following: 300, followers: 15000, followingStatus: false },
    { ...users[3], id: 4, following: 45, followers: 760000, followingStatus: false },
    { ...users[5], id: 5, following: 210, followers: 1350000, followingStatus: false },
    { ...users[15], id: 6, following: 180, followers: 420000, followingStatus: false },
  ],

  posts: [
    {
      id: generateUniqueId(),
      type: 'post',
      author: users[3],
      message: {
        text: 'This image captures the essence of tranquility, with soft hues blending seamlessly. The gentle waves and the serene sky create a perfect backdrop for reflection.',
        attachments: [{ src: image(18), type: 'image' }],
      },
      createdAt: dayjs().subtract(1, 'month').subtract(5, 'day').toISOString(),
      engagement: {
        likes: 14200,
        comments: 4,
        shares: 129,
      },
      comments: [
        {
          id: generateUniqueId(),
          type: 'comment',
          author: users[4],
          message: {
            text: "Hey there! Thanks for sharing your thoughts. It's great to see such engagement. Let's keep the conversation going!",
          },
          createdAt: dayjs()
            .subtract(1, 'month')
            .subtract(4, 'day')
            .subtract(8, 'hour')
            .subtract(13, 'minute')
            .toISOString(),
          engagement: {
            likes: 9800,
          },
          replies: [
            {
              id: generateUniqueId(),
              type: 'reply',
              author: users[5],
              message: {
                text: "Join us on this journey! Our community is filled with passionate individuals eager to share insights and support each other. Don't hesitate to connect and collaborate!",
              },
              createdAt: dayjs()
                .subtract(1, 'month')
                .subtract(4, 'day')
                .subtract(7, 'hour')
                .subtract(8, 'minute')
                .toISOString(),
              engagement: {
                likes: 2000,
              },
            },
            {
              id: generateUniqueId(),
              type: 'reply',
              author: users[6],
              message: {
                text: 'Welcome to our platform! Here, you can explore a variety of features designed to enhance your experience. Dive into the tools we offer and discover how they can help you achieve your goals.',
              },
              createdAt: dayjs()
                .subtract(1, 'month')
                .subtract(2, 'day')
                .subtract(3, 'hour')
                .subtract(44, 'minute')
                .toISOString(),
              engagement: {
                likes: 1000,
              },
            },
            {
              id: generateUniqueId(),
              type: 'reply',
              author: users[7],
              message: {
                text: "Get ready to unlock new possibilities! With our innovative solutions, you'll find everything you need to succeed right at your fingertips.",
              },
              createdAt: dayjs()
                .subtract(1, 'month')
                .subtract(2, 'day')
                .subtract(2, 'hour')
                .subtract(21, 'minute')
                .toISOString(),
              engagement: {
                likes: 38,
              },
            },
          ],
        },
        {
          id: generateUniqueId(),
          type: 'comment',
          author: users[8],
          message: {
            text: 'Thanks for sharing your thoughts on the image! I really appreciate your perspective. What do you think about the colors used?',
          },
          createdAt: dayjs()
            .subtract(1, 'month')
            .subtract(4, 'day')
            .subtract(5, 'hour')
            .subtract(51, 'minute')
            .toISOString(),
          engagement: {
            likes: 79,
          },
          replies: [],
        },
        {
          id: generateUniqueId(),
          type: 'comment',
          author: users[9],
          message: {
            text: 'I love how you interpreted the image! It really captures the essence of the moment. Do you have any favorite details that stand out to you?',
          },
          createdAt: dayjs()
            .subtract(1, 'month')
            .subtract(3, 'day')
            .subtract(8, 'hour')
            .subtract(5, 'minute')
            .toISOString(),
          engagement: {
            likes: 345,
          },
          replies: [],
        },
        {
          id: generateUniqueId(),
          type: 'comment',
          author: users[10],
          message: {
            text: "This image beautifully captures the essence of tranquility and nature's charm.",
          },
          createdAt: dayjs()
            .subtract(1, 'month')
            .subtract(1, 'day')
            .subtract(4, 'hour')
            .subtract(27, 'minute')
            .toISOString(),
          engagement: {
            likes: 67,
          },
          replies: [
            {
              id: generateUniqueId(),
              type: 'reply',
              author: users[5],
              message: {
                text: "You're absolutely right, that picture is amazing! The quick brown fox jumps over the lazy dog, and the sunset in the west paints the sky with beautiful shades of orange and pink. The gentle breeze rustles the leaves, creating a calming melody.",
              },
              createdAt: dayjs().subtract(25, 'day').subtract(8, 'hour').toISOString(),
              engagement: {
                likes: 450,
              },
            },
          ],
        },
      ],
    },
    {
      author: users[4],
      id: generateUniqueId(),
      type: 'post',
      message: {
        text: "This tour features stunning views that highlight nature's beauty. The vibrant landscapes and serene settings create memorable moments, inviting you to explore the world's wonders.",
        attachments: [
          { src: image(19), type: 'image' },
          { src: image(20), type: 'image' },
          { src: image(21), type: 'image' },
          { src: image(22), type: 'image' },
          { src: image(23), type: 'image' },
          { src: image(1), type: 'image' },
          { src: image(2), type: 'image' },
          { src: image(3), type: 'image' },
          { src: image(4), type: 'image' },
          { src: image(5), type: 'image' },
        ],
      },
      createdAt: dayjs().subtract(5, 'day').subtract(3, 'hour').toISOString(),
      engagement: {
        likes: 900,
        comments: 0,
        shares: 90,
      },
      comments: [],
    },
    {
      author: users[2],
      id: generateUniqueId(),
      type: 'post',
      message: {
        text: 'Our tour was incredible! From stunning landscapes to vibrant cultures, every moment was an adventure. We began in Eldoria, a lively city full of music and laughter. The highlight was hiking the Misty Mountains, where breathtaking views awaited us. Each stop offered unique experiences, from local delicacies to friendly locals sharing their stories.',
      },
      createdAt: dayjs()
        .subtract(6, 'year')
        .add(1, 'day')
        .add(1, 'hour')
        .add(44, 'minute')
        .toISOString(),
      engagement: {
        likes: 100,
        comments: 0,
        shares: 24,
      },
      comments: [],
    },
    {
      author: users[3],
      id: generateUniqueId(),
      type: 'post',
      message: {
        text: 'This place is a captivating hidden gem. Its lush greenery and vibrant flowers, along with the gentle breeze and rustling leaves, create a peaceful ambiance perfect for relaxation.',
      },
      createdAt: dayjs()
        .subtract(4, 'year')
        .subtract(1, 'day')
        .add(6, 'hour')
        .add(51, 'minute')
        .toISOString(),
      engagement: {
        likes: 900,
        comments: 1,
        shares: 23,
      },
      comments: [
        {
          id: generateUniqueId(),
          type: 'comment',
          author: users[10],
          message: {
            text: 'I also visited that place! Here’s a picture I took while I was there. The scenery was stunning, with vibrant colors and a peaceful atmosphere.',
            attachments: [{ src: image(17), type: 'image' }],
          },
          createdAt: dayjs().subtract(30, 'day').subtract(8, 'hour').toISOString(),
          engagement: {
            likes: 2001,
          },
          replies: [],
        },
      ],
    },
  ],

  photos: [
    image(1),
    image(2),
    image(3),
    image(4),
    image(5),
    image(6),
    image(7),
    image(8),
    image(9),
    image(10),
    image(11),
    image(12),
    image(13),
    image(14),
    image(15),
    image(16),
  ],
};
