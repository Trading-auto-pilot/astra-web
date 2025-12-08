import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  timelineContentClasses,
  timelineItemClasses,
  timelineOppositeContentClasses,
} from '@mui/lab';
import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import { kebabCase } from 'lib/utils';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicTimelineCode = `import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';

const BasicTimeline = () => {  
  return (
    <Timeline>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Eat</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Code</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
        </TimelineSeparator>
        <TimelineContent>Sleep</TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
render(<BasicTimeline />)`;

const leftPositionedTimelineCode = `import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';

const LeftPositionedTimeline = () => {  
  return (
    <Timeline position="left">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Eat</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Code</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Sleep</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
        </TimelineSeparator>
        <TimelineContent>Repeat</TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
render(<LeftPositionedTimeline />)`;

const alternatingTimelineCode = `import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';

const AlternateTimeline = () => {  
  return (
    <Timeline position="alternate">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Eat</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Code</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Sleep</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
        </TimelineSeparator>
        <TimelineContent>Repeat</TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
render(<AlternateTimeline />)`;

const reverseAlternatingTimelineCode = `import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';

const ReverseAlternateTimeline = () => {  
  return (
    <Timeline position="alternate-reverse">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Eat</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Code</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Sleep</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
        </TimelineSeparator>
        <TimelineContent>Repeat</TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
render(<ReverseAlternateTimeline />)`;

const coloredTimelineCode = `import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';

const ColorsTimeline = () => {  
  return (
    <Timeline position="alternate">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Eat</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="secondary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Code</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="warning" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Debug</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="success" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Sleep</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="error" />
        </TimelineSeparator>
        <TimelineContent>Repeat</TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
render(<ColorsTimeline />)`;

const outlinedTimelineCode = `import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';

const OutlinedTimeline = () => {  
  return (
    <Timeline position="alternate-reverse">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Eat</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Code</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="secondary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Debug</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="info" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Sleep</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" />
        </TimelineSeparator>
        <TimelineContent>Repeat</TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
render(<OutlinedTimeline />)`;

const oppositeContentTimelineCode = `import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator, TimelineOppositeContent } from '@mui/lab';

const OppositeContentTimeline = () => {
  return (
    <Timeline position="alternate">
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          09:30 am
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Eat</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          10:00 am
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Code</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          12:00 am
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Sleep</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          9:00 am
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Repeat</TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
render(<OppositeContentTimeline />)`;

const leftAlignedCode = `import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator, TimelineOppositeContent, timelineOppositeContentClasses } from '@mui/lab';

const LeftAlignedTimeline = () => {
  return (
    <Timeline
      sx={{
        [\`& .\${timelineOppositeContentClasses.root}\`]: {
          flex: 0.2,
        },
      }}
    >
      <TimelineItem>
        <TimelineOppositeContent color="textSecondary">
          09:30 am
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Eat</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent color="textSecondary">
          10:00 am
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
        </TimelineSeparator>
        <TimelineContent>Code</TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
render(<LeftAlignedTimeline />)`;

const rightAlignedCode = `import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineConnector, TimelineSeparator, timelineContentClasses, TimelineOppositeContent } from '@mui/lab';

const RightAlignedTimeline = () => {
  return (
    <Timeline
      sx={{
        [\`& .\${timelineContentClasses.root}\`]: {
          flex: 0.2,
        },
      }}
    >
      <TimelineItem>
        <TimelineOppositeContent color="textSecondary">
          09:30 am
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Eat</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent color="textSecondary">
          10:00 am
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
        </TimelineSeparator>
        <TimelineContent>Code</TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
render(<RightAlignedTimeline />)`;

const leftAlignedNoOppositeContentCode = `import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineConnector, TimelineSeparator, timelineItemClasses } from '@mui/lab';

const NoOppositeContent = () => {
  return (
    <Timeline
      sx={{
        [\`& .\${timelineItemClasses.root}:before\`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Eat</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
        </TimelineSeparator>
        <TimelineContent>Code</TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
render(<NoOppositeContent />)`;

const TimelineDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Timeline',
        description: 'The Timeline displays a list of events in chronological order.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Timeline',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-timeline`,
        folderLink: `${folderBaseLink}/TimelineDoc.jsx`,
      }}
    >
      <DocSection title="Basic timeline" description="A basic timeline showing list of events.">
        <DocCard
          code={basicTimelineCode}
          noInline
          scope={{
            Timeline,
            TimelineItem,
            TimelineSeparator,
            TimelineDot,
            TimelineConnector,
            TimelineContent,
          }}
        />
      </DocSection>
      <DocSection
        title="Left-positioned timeline"
        description="The main content of the timeline can be positioned on the left side relative to the time axis."
      >
        <DocCard
          code={leftPositionedTimelineCode}
          noInline
          scope={{
            Timeline,
            TimelineItem,
            TimelineSeparator,
            TimelineDot,
            TimelineConnector,
            TimelineContent,
          }}
        />
      </DocSection>
      <DocSection
        title="Alternating timeline"
        description="The timeline can display the events on alternating sides."
      >
        <DocCard
          code={alternatingTimelineCode}
          noInline
          scope={{
            Timeline,
            TimelineItem,
            TimelineSeparator,
            TimelineDot,
            TimelineConnector,
            TimelineContent,
          }}
        />
      </DocSection>
      <DocSection
        title="Reverse Alternating timeline"
        description="The timeline can display the events on alternating sides in reverse order."
      >
        <DocCard
          code={reverseAlternatingTimelineCode}
          noInline
          scope={{
            Timeline,
            TimelineItem,
            TimelineSeparator,
            TimelineDot,
            TimelineConnector,
            TimelineContent,
          }}
        />
      </DocSection>
      <DocSection
        title="Color"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The <Code>TimelineDot</Code> can appear in different colors from theme palette.
          </Typography>
        }
      >
        <DocCard
          code={coloredTimelineCode}
          noInline
          scope={{
            Timeline,
            TimelineItem,
            TimelineSeparator,
            TimelineDot,
            TimelineConnector,
            TimelineContent,
          }}
        />
      </DocSection>
      <DocSection title="Outlined">
        <DocCard
          code={outlinedTimelineCode}
          noInline
          scope={{
            Timeline,
            TimelineItem,
            TimelineSeparator,
            TimelineDot,
            TimelineConnector,
            TimelineContent,
          }}
        />
      </DocSection>
      <DocSection
        title="Opposite content"
        description="The timeline can display content on opposite sides."
      >
        <DocCard
          code={oppositeContentTimelineCode}
          noInline
          scope={{
            Timeline,
            TimelineDot,
            TimelineItem,
            TimelineContent,
            TimelineConnector,
            TimelineSeparator,
            TimelineOppositeContent,
            timelineOppositeContentClasses,
          }}
        />
      </DocSection>
      <DocSection
        title="Alignment"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 2,
            }}
          >
            There are different ways in which a Timeline can be placed within the container. You can
            do it by overriding the styles. A Timeline centers itself in the container by default.
          </Typography>
        }
      >
        <DocNestedSection title="Left-aligned" id={kebabCase('Left-aligned')}>
          <DocCard
            code={leftAlignedCode}
            noInline
            scope={{
              Timeline,
              TimelineDot,
              TimelineItem,
              TimelineContent,
              TimelineConnector,
              TimelineSeparator,
              TimelineOppositeContent,
              timelineOppositeContentClasses,
            }}
            sx={{ mb: 4 }}
          />
        </DocNestedSection>

        <DocNestedSection title="Right-aligned" id={kebabCase('Right-aligned')}>
          <DocCard
            code={rightAlignedCode}
            noInline
            scope={{
              Timeline,
              TimelineDot,
              TimelineItem,
              TimelineContent,
              TimelineConnector,
              TimelineSeparator,
              timelineContentClasses,
              TimelineOppositeContent,
            }}
            sx={{ mb: 4 }}
          />
        </DocNestedSection>

        <DocNestedSection
          title="Left-aligned with no opposite content"
          id={kebabCase('Left-aligned with no opposite content')}
        >
          <DocCard
            code={leftAlignedNoOppositeContentCode}
            noInline
            scope={{
              Timeline,
              TimelineDot,
              TimelineItem,
              TimelineContent,
              TimelineConnector,
              TimelineSeparator,
              timelineItemClasses,
            }}
            sx={{ mb: 4 }}
          />
        </DocNestedSection>
      </DocSection>
    </DocPageLayout>
  );
};

export default TimelineDoc;
