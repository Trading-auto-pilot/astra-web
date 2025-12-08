import { Avatar, Box, Stack, Typography } from '@mui/material';
import { users } from 'data/users';

const feedbacks = [
  {
    id: 0,
    author: users[0],
    message:
      'Portfolio is impressive—clean design and strong attention to accessibility. Interview performance was solid. Candidate asked smart questions and showed enthusiasm for cross-functional collaboration. No red flags.',
    createdAt: 'Today at 12:10pm',
  },
  {
    id: 1,
    author: users[1],
    message:
      'Very confident communicator with good alignment to our company culture. Shared thoughtful responses about motivation and long-term goals. Slight concern over expected compensation versus budget, but open to negotiation.',
    createdAt: 'Today at 12:10pm',
  },
  {
    id: 2,
    author: users[2],
    message: 'Great CV, but senior leadership responses were weak. Better for mid-level.',
    createdAt: 'Today at 12:10pm',
  },
  {
    id: 3,
    author: users[3],
    message:
      'The candidate has strong fundamentals in data structures and algorithms, and their past projects demonstrate real-world application of problem-solving skills. However, there were a few gaps in backend architecture knowledge. Could benefit from mentorship initially but shows high potential.',
    createdAt: 'Today at 12:10pm',
  },
];

const ScorecardFeedback = () => {
  return (
    <div>
      <Typography variant="h6" mb={2}>
        Scorecard Feedback
      </Typography>

      {feedbacks.map((feedback) => {
        return (
          <Stack key={feedback.id} gap={2} sx={{ position: 'relative', py: 3 }}>
            <Avatar
              variant="circular"
              src={feedback.author.avatar}
              sx={{ height: 32, width: 32 }}
            />

            <div>
              <Box mb={1}>
                <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
                  {feedback.author.name}
                </Typography>
                <Typography variant="caption" component="p" color="textSecondary">
                  {feedback.createdAt}
                </Typography>
              </Box>

              <Typography variant="body2" color="textSecondary" sx={{ maxWidth: 800 }}>
                {feedback.message}
              </Typography>
            </div>
          </Stack>
        );
      })}
    </div>
  );
};

export default ScorecardFeedback;
