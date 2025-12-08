import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ButtonBase,
  Container,
  Divider,
  Stack,
  Typography,
  accordionDetailsClasses,
  accordionSummaryClasses,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const SelectedCategory = ({
  selectedCategory,
  handleResetCategory,
  selectedCategoryRef,
  accordionListRef,
}) => {
  return (
    <Container maxWidth="md" sx={{ px: { xs: 3, md: 5 } }} ref={selectedCategoryRef}>
      <Box sx={{ pt: 2, pb: 3 }}>
        <Stack
          component={ButtonBase}
          disableRipple
          onClick={handleResetCategory}
          sx={{
            gap: 1,
            mb: 3,
            alignItems: 'center',
            '&:hover .back-icon': { transform: 'translateX(-4px)' },
          }}
        >
          <IconifyIcon
            icon="material-symbols:chevron-left-rounded"
            fontSize={32}
            className="back-icon"
            style={{
              transition: 'transform 0.2s ease',
              display: 'flex',
              alignItems: 'center',
            }}
          />
          <Typography variant="h5" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
            {selectedCategory.title}
          </Typography>
        </Stack>

        <Stack
          direction="column"
          divider={<Divider flexItem sx={{ borderColor: 'dividerLight' }} />}
          ref={accordionListRef}
        >
          {selectedCategory.items.map((item) => (
            <Accordion
              key={item.id}
              disableGutters
              sx={{
                '&:hover': { bgcolor: 'transparent' },
                [`& .${accordionSummaryClasses.root}`]: { px: 0 },
                [`& .${accordionDetailsClasses.root}`]: { pl: 4 },
              }}
            >
              <AccordionSummary>
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Box>
    </Container>
  );
};

export default SelectedCategory;
