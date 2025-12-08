import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { initialConfig } from 'config';
import CollapsibleSection from './CollapsibleSection';
import QuestionItem from './QuestionItem';

const aurora = `${initialConfig.assetsDir}/videos/file-manager/aurora.mp4`;

const questionaries = {
  preScreenQuestions: [
    {
      question: 'Why did you choose to apply to this company?',
      answer:
        "I applied to this company because of its strong reputation for innovation and quality in content creation. The company's values align with my passion for storytelling and delivering engaging content. I am excited about the opportunity to contribute my writing expertise to a team that values creativity and impact.",
    },
    {
      question: 'What are your greatest strengths?',
      answer:
        'Strong research skills, adaptability in writing styles, SEO expertise, and the ability to create engaging, audience-focused content.',
    },
    {
      question: 'How do you prefer to work on tasks?',
      answer: 'independently',
      type: 'radio',
      options: [
        { value: 'independently', label: 'Independently' },
        { value: 'collaboratively', label: 'Collaboratively' },
        { value: 'deadlines', label: 'With clear deadlines' },
        { value: 'freedom', label: 'With creative freedom' },
      ],
    },
    {
      question: 'Have you worked remotely before?',
      answer: 'yes',
      type: 'checkbox',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },
  ],
  videoResponse: [
    {
      question: 'Why did you choose to apply to this company?',
      answer: aurora,
      type: 'video',
    },
    {
      question: 'What are your greatest strengths?',
      answer: aurora,
      type: 'video',
    },
    {
      question: 'How do you prefer to work on tasks?',
      answer: aurora,
      type: 'video',
    },
  ],
};

const Questionaries = () => {
  const [openSections, setOpenSections] = useState({
    preScreen: true,
    videoResponse: true,
  });

  const handleToggle = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Stack direction="column" gap={5} sx={{ height: 1 }}>
      <CollapsibleSection
        title="Pre-Screen Questions"
        isOpen={openSections.preScreen}
        onToggle={() => handleToggle('preScreen')}
      >
        {questionaries.preScreenQuestions.map((item, index) => (
          <QuestionItem
            key={index}
            question={item.question}
            answer={item.answer}
            type={item.type}
            options={item.options}
            index={index}
          />
        ))}
      </CollapsibleSection>

      <CollapsibleSection
        title="Video Response"
        isOpen={openSections.videoResponse}
        onToggle={() => handleToggle('videoResponse')}
        sx={{ mb: 0 }}
      >
        {questionaries.videoResponse.map((item, index) => (
          <QuestionItem
            key={index}
            question={item.question}
            answer={item.answer}
            type={item.type}
            options={item.options}
            index={index}
          />
        ))}
      </CollapsibleSection>
    </Stack>
  );
};

export default Questionaries;
