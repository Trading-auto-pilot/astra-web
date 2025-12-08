import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  accordionClasses,
  accordionSummaryClasses,
} from '@mui/material';
import RevealItems from '../common/RevealItems';
import SectionHeader from '../common/SectionHeader';

const FAQSection = ({ data }) => {
  const [expanded, setExpanded] = useState(0);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : -1);
  };

  return (
    <Box sx={{ px: { xs: 3, md: 5 }, pt: { xs: 8, sm: 16 }, pb: 8 }}>
      <SectionHeader title="FAQ" subtitle="Here are some common enquiries we face" sx={{ mb: 3 }} />

      <RevealItems component={Container} maxWidth={false} sx={{ maxWidth: 582, px: { xs: 0 } }}>
        {data.map((item, i) => (
          <Accordion
            key={i}
            expanded={expanded === i}
            onChange={handleChange(i)}
            sx={{
              [`&.${accordionClasses.expanded}`]: {
                bgcolor: 'background.elevation1',
              },
              [`& .${accordionSummaryClasses.content}`]: {
                fontSize: '16px !important',
              },
            }}
          >
            <AccordionSummary>{item.summary}</AccordionSummary>

            <AccordionDetails sx={{ fontWeight: 500 }}>{item.details}</AccordionDetails>
          </Accordion>
        ))}
      </RevealItems>
    </Box>
  );
};

export default FAQSection;
