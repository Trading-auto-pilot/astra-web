import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import Video from 'components/base/Video';

const QuestionItem = ({ question, answer, type, options, index }) => {
  const renderAnswer = () => {
    switch (type) {
      case 'radio':
        return (
          <FormControl>
            <RadioGroup row>
              {options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  checked={answer === option.value}
                  value={option.value}
                  control={<Radio disabled={answer !== option.value} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl>
            <RadioGroup row>
              {options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  checked={answer === option.value}
                  value={option.value}
                  control={<Checkbox disabled={answer !== option.value} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'video':
        return (
          <Box
            sx={{
              width: 1,
              maxWidth: 480,
              aspectRatio: '16/9',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <Video
              src={answer}
              type="video/webm"
              sx={{
                width: 1,
                height: 1,
                objectFit: 'cover',
              }}
              controls
              playsInline
            />
          </Box>
        );

      default:
        return (
          <Typography variant="body2" color="textSecondary">
            {answer}
          </Typography>
        );
    }
  };

  return (
    <div>
      <Typography
        variant="body1"
        color="textPrimary"
        sx={{ fontWeight: 700, mb: type === 'video' ? 2 : 1 }}
      >
        {index + 1}. {question}
      </Typography>
      {renderAnswer()}
    </div>
  );
};

export default QuestionItem;
