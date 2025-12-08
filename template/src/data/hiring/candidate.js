import { initialConfig } from 'config';

const logo = (index) => `${initialConfig.assetsDir}/images/brands/${index}.webp`;

// Job List
export const jobList = [
  {
    id: 1,
    company: {
      name: 'Waka Waka PLC',
      logo: logo(5),
      type: 'Media Production',
      employees: 220,
      desc: 'Waka Waka PLC is a creative production company delivering high-quality video, animation, and advertising campaigns to brands worldwide.',
    },
    title: 'Animation Specialist',
    overview: {
      location: 'Vietnam',
      employmentType: 'Part-Time',
      workMode: 'Hybrid',
      postedDate: '2025-04-30',
      deadline: '2025-05-25',
      experience: 2,
      offeredSalary: 6000,
    },
    details: {
      aboutRole:
        'We are seeking a part-time Animation Specialist to join our studio team. You will create stunning 2D and 3D animations that bring stories to life.',
      responsibilities: [
        'Produce engaging animations for digital campaigns and social platforms.',
        'Work with scriptwriters and art directors to visualize concepts.',
        'Ensure animations meet brand guidelines and creative direction.',
        'Collaborate with cross-functional teams to deliver projects on time.',
      ],
      requirements: [
        'Bachelor’s degree in Animation, Fine Arts, or related field.',
        '1+ year of professional animation experience.',
        'Strong portfolio showcasing 2D or 3D work.',
        'Proficiency in After Effects, Maya, or Blender.',
        'Excellent communication and collaboration skills.',
      ],
      bonusPoints: [
        'Experience with character animation.',
        'Knowledge of gaming animation pipelines.',
      ],
      benefits: [
        'Flexible working hours.',
        'Opportunity to work with global brands.',
        'Learning stipend for courses.',
      ],
    },
  },
  {
    id: 2,
    company: {
      name: 'BrightWave Media',
      logo: logo(3),
      type: 'Advertising Agency',
      employees: 95,
      desc: 'BrightWave Media is a creative agency specializing in storytelling through video, design, and marketing innovation.',
    },
    title: 'Visual Effects Artist',
    overview: {
      location: 'Nepal',
      employmentType: 'Part-Time',
      workMode: 'Remote',
      postedDate: '2025-03-22',
      deadline: '2025-04-15',
      experience: 3,
      offeredSalary: 7000,
    },
    details: {
      aboutRole:
        'We are looking for a talented VFX Artist to work remotely on commercials and short-form content, creating compelling visuals and special effects.',
      responsibilities: [
        'Create visual effects including compositing, particle effects, and simulations.',
        'Collaborate with directors and animators to achieve creative vision.',
        'Enhance live-action footage with realistic effects.',
        'Maintain quality and delivery timelines for projects.',
      ],
      requirements: [
        '3+ years of VFX experience in film, commercials, or games.',
        'Proficiency in Nuke, Houdini, or After Effects.',
        'Understanding of lighting, rendering, and camera tracking.',
        'Ability to work independently in a remote environment.',
      ],
      bonusPoints: [
        'Experience in 3D rendering software.',
        'Knowledge of color grading and sound syncing.',
      ],
      benefits: [
        'Remote-first work culture.',
        'Competitive pay on a per-project basis.',
        'Creative and collaborative environment.',
      ],
    },
  },
  {
    id: 3,
    company: {
      name: 'Victory Tech Outfitters Ltd.',
      logo: logo(1),
      type: 'IT Services',
      employees: 160,
      desc: 'Victory Outfitters Ltd. is a premier outdoor gear company dedicated to providing adventurers with high-quality equipment and apparel. With a passion for exploration and a commitment to sustainability, we empower outdoor enthusiasts to conquer the wild with confidence and style.',
    },
    title: 'Motion Graphics Designer',
    overview: {
      location: 'Bangladesh',
      employmentType: 'Full-Time',
      workMode: 'On-site',
      postedDate: '2024-11-18',
      deadline: '2024-08-21',
      experience: 5,
      offeredSalary: 10000,
    },
    details: {
      aboutRole:
        'We are looking for a talented Motion Graphic Designer to join our growing creative team. You will be responsible for creating dynamic, engaging visuals that bring our brand stories to life across digital and social platforms.',
      responsibilities: [
        'Design and animae high-quality motion graphics for marketing videos, social media content, ads and product launches.',
        'Collaborate closely with the marketing, product, and creative teams to conceptualize and execute visual storytelling ideas.',
        'Create explainer videos, animated UI mockups, and logo animations.',
        'Edit and enhance video content with motion graphics, effects, and sound syncing.',
        'Maintain consistent brand voice and visual style across all assets.',
        'Manage multiple projects under tight deadlines without compromising quality.',
      ],
      requirements: [
        '2+ years of experience in motion design, animation, or related creative fields.',
        'Strong portfolio showcasing motion graphics work (attach links or upload).',
        'Proficient in Adobe After Effects, Premiere Pro, Photoshop, Illustrator.',
        'Experience with 2D animation (knowledge of 3D animation is a plus!).',
        'Ability to storyboard and conceptualize ideas visually.',
        'Strong understanding of timing, pacing, and visual storytelling.',
        'Attention to detail and passion for creativity.',
        'Familiarity with video editing, typography, and sound editing.',
      ],
      bonusPoints: [
        'Experience working in tech, SaaS, or marketing agencies.',
        'Knowledge of Figma, Blender, or Cinema4D.',
        'Basic understanding of UX/UI motion principles.',
      ],
      benefits: [
        'Competitive salary',
        'Flexible working hours.',
        'Remote-friendly culture.',
        'Professional development support(courses, conferences).',
        'Health, dental, and vision insurance.',
      ],
    },
  },
  {
    id: 4,
    company: {
      name: 'ShieldNet Security',
      logo: logo(9),
      type: 'Cybersecurity',
      employees: 340,
      desc: 'ShieldNet Security is a leading provider of digital security solutions, safeguarding businesses with innovative cybersecurity products and services.',
    },
    title: 'Digital Animation Artist',
    overview: {
      location: 'Bangladesh',
      employmentType: 'Full-Time',
      workMode: 'Hybrid',
      postedDate: '2024-09-12',
      deadline: '2024-10-01',
      experience: 4,
      offeredSalary: 12000,
    },
    details: {
      aboutRole:
        'We are hiring a Digital Animation Artist to support our marketing and product teams in delivering engaging animated content that simplifies complex cybersecurity concepts.',
      responsibilities: [
        'Develop animations for marketing campaigns, product demos, and educational content.',
        'Collaborate with product teams to visualize security concepts.',
        'Ensure animations align with company brand and messaging.',
      ],
      requirements: [
        'Bachelor’s degree in Animation, Media Arts, or related field.',
        '4+ years of experience creating digital animations.',
        'Proficiency with After Effects, Illustrator, and Photoshop.',
        'Understanding of technical and creative workflows.',
      ],
      bonusPoints: [
        'Experience working in the tech/cybersecurity space.',
        'Knowledge of motion design for SaaS products.',
      ],
      benefits: [
        'Hybrid work environment.',
        'Health and wellness benefits.',
        'Generous annual bonus.',
      ],
    },
  },
  {
    id: 5,
    company: {
      name: 'O-Ecopower Innovations',
      logo: logo(8),
      type: 'Renewable Energy',
      employees: 75,
      desc: 'O-Ecopower Innovations is focused on building eco-friendly energy solutions, with a strong emphasis on innovation and sustainable design.',
    },
    title: '3D Motion Designer',
    overview: {
      location: 'Maldives',
      employmentType: 'Full-Time',
      workMode: 'On-site',
      postedDate: '2024-08-01',
      deadline: '2024-09-01',
      experience: 3,
      offeredSalary: 11000,
    },
    details: {
      aboutRole:
        'We are looking for a 3D Motion Designer to create impactful visualizations for renewable energy projects and marketing initiatives.',
      responsibilities: [
        'Produce 3D motion graphics, product visualizations, and animated explainer videos.',
        'Work closely with engineers and marketing staff to create visuals that inspire.',
        'Deliver creative solutions to support branding and awareness.',
      ],
      requirements: [
        '3+ years of professional experience as a 3D motion designer.',
        'Strong knowledge of Blender, Cinema4D, or Maya.',
        'Understanding of renewable energy or industrial design is a plus.',
      ],
      bonusPoints: [
        'Experience working with sustainability projects.',
        'Skills in AR/VR visualizations.',
      ],
      benefits: [
        'Competitive pay.',
        'Work on sustainability-driven projects.',
        'Housing allowance for relocation to Maldives.',
      ],
    },
  },
  {
    id: 6,
    company: {
      name: 'G Equipment Co.',
      logo: logo(4),
      type: 'Manufacturing',
      employees: 500,
      desc: 'G Equipment Co. is a global manufacturer of heavy equipment with a strong focus on innovation and reliability.',
    },
    title: 'Creative Designer',
    overview: {
      location: 'Thailand',
      employmentType: 'Contract',
      workMode: 'On-site',
      postedDate: '2024-04-10',
      deadline: '2024-05-05',
      experience: 2,
      offeredSalary: 8000,
    },
    details: {
      aboutRole:
        'We are seeking a contract Creative Designer to support our product marketing and branding efforts in Thailand.',
      responsibilities: [
        'Create product brochures, digital assets, and marketing visuals.',
        'Collaborate with the product team to ensure designs meet technical standards.',
        'Maintain consistency with global brand identity.',
      ],
      requirements: [
        '2+ years in graphic or creative design.',
        'Proficiency in Adobe Creative Suite.',
        'Portfolio demonstrating creative and industrial design work.',
      ],
      bonusPoints: [
        'Experience in manufacturing or industrial sectors.',
        'Knowledge of motion design.',
      ],
      benefits: [
        'Fixed-term contract with competitive pay.',
        'On-site meals and transport support.',
        'Networking opportunities with global teams.',
      ],
    },
  },
  {
    id: 7,
    company: {
      name: 'SwiftPay Systems',
      logo: logo(6),
      type: 'Fintech',
      employees: 180,
      desc: 'SwiftPay Systems provides innovative payment solutions to businesses and consumers, driving the future of secure digital transactions.',
    },
    title: 'Multimedia Designer',
    overview: {
      location: 'Sri Lanka',
      employmentType: 'Contract',
      workMode: 'Remote',
      postedDate: '2024-02-05',
      deadline: '2024-03-01',
      experience: 2,
      offeredSalary: 7500,
    },
    details: {
      aboutRole:
        'We are hiring a Multimedia Designer to create impactful visuals and marketing assets for our fintech products.',
      responsibilities: [
        'Design multimedia assets for social media, campaigns, and product launches.',
        'Support the UX team with digital assets and micro-animations.',
        'Ensure all materials align with SwiftPay’s brand identity.',
      ],
      requirements: [
        'Bachelor’s degree in Design, Multimedia, or related field.',
        '2+ years of experience in multimedia/graphic design.',
        'Proficiency in Adobe Suite, Figma, and motion tools.',
      ],
      bonusPoints: [
        'Experience in fintech or tech startups.',
        'Video editing and audio syncing skills.',
      ],
      benefits: [
        'Fully remote role.',
        'Flexible working hours.',
        'Opportunity to grow in a fast-paced fintech company.',
      ],
    },
  },
];
