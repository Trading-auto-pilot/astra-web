import { Typography } from '@mui/material';
import { initialConfig } from 'config';
import dayjs from 'dayjs';
import { users } from './users';

const gallery = (index) => `${initialConfig.assetsDir}/images/email/${index}.webp`;

export const defaultEmails = [
  'manami.suda@gmail.com',
  'okkotsu.yuta@gmail.com',
  'kugisaki.nobara@gmail.com',
  'todo.aoi@gmail.com',
  'tsukumo.yuki@gmail.com',
];

export const emailCategory = [
  {
    title: 'Inbox',
    icon: 'material-symbols:inbox-outline-rounded',
  },
  {
    title: 'Starred',
    icon: 'material-symbols:star-rate-outline-rounded',
  },
  {
    title: 'Snoozed',
    icon: 'material-symbols:snooze-outline-rounded',
  },
  {
    title: 'Sent',
    icon: 'material-symbols:send-outline-rounded',
  },
  {
    title: 'Draft',
    icon: 'material-symbols:draft-outline-rounded',
  },
  {
    title: 'Important',
    icon: 'material-symbols:label-important-outline-rounded',
  },
  {
    title: 'Spam',
    icon: 'material-symbols:report-outline-rounded',
  },
  {
    title: 'Archived',
    icon: 'material-symbols:archive-outline-rounded',
  },
  {
    title: 'Trash',
    icon: 'material-symbols:delete-outline-rounded',
  },
];

export const emails = [
  {
    id: 1,
    user: users[1],
    subject: 'Meeting Confirmation for Tomorrow',
    description:
      'Hi, just wanted to confirm our meeting scheduled for tomorrow at 10 AM. I’ve prepared a detailed summary of the project updates we can review together during the discussion.',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          Hi, just wanted to confirm our meeting scheduled for tomorrow at 10 AM. I’ve prepared a
          detailed summary of the project updates we can review together during the discussion. If
          there’s anything specific you’d like to add to the agenda, feel free to let me know in
          advance so we can allocate time accordingly. Looking forward to a productive conversation
          and making meaningful progress on the project!
        </Typography>
        <Typography variant="body1">Best regards, {users[1].name}</Typography>
      </>
    ),
    time: dayjs().subtract(1, 'm').toDate(),
    starred: true,
    important: true,
    readAt: null,
    snoozedTill: null,
    folder: 'inbox',
    label: 'inbox',
    attachments: [
      {
        id: 1,
        file: gallery(1),
        fileType: 'image',
      },
      {
        id: 2,
        file: gallery(2),
        fileType: 'image',
      },
      {
        id: 3,
        file: gallery(3),
        fileType: 'image',
      },
    ],
  },
  {
    id: 2,
    user: users[2],
    subject: 'Edited Photos from the Shoot',
    description:
      'I’ve completed editing the photos from last week’s shoot, and I’m thrilled with how they’ve turned out! I’ve attached a preview for your review, with particular attention to the lighting and composition aspects.',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          I’ve completed editing the photos from last week’s shoot, and I’m thrilled with how
          they’ve turned out! I’ve attached a preview for your review, with particular attention to
          the lighting and composition aspects. Please take a look when you get a chance, and let me
          know if there are any further adjustments or specific edits you’d like me to make. I hope
          you’re as excited about these as I am!
        </Typography>
        <Typography variant="body1">Best regards, {users[2].name}</Typography>
      </>
    ),
    time: dayjs().subtract(2, 'h').toDate(),
    starred: false,
    important: true,
    readAt: dayjs().toISOString(),
    snoozedTill: null,
    folder: 'sent',
    label: 'sent',
  },
  {
    id: 3,
    user: users[3],
    subject: 'Proposal Follow-Up',
    description:
      'Following up on our recent conversation regarding the proposal, I truly believe this presents a strong opportunity with significant potential for success.',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          Following up on our recent conversation regarding the proposal, I truly believe this
          presents a strong opportunity with significant potential for success. To help move things
          forward, I’ve conducted additional research and compiled some key points for us to discuss
          in detail. Please let me know your availability this week so we can connect and finalize
          our approach. Looking forward to collaborating on this!
        </Typography>
        <Typography variant="body1">Best regards, {users[3].name}</Typography>
      </>
    ),
    time: dayjs().subtract(5, 'h').toDate(),
    starred: true,
    important: false,
    readAt: dayjs().toISOString(),
    snoozedTill: null,
    folder: 'inbox',
    label: 'inbox',
  },
  {
    id: 4,
    user: users[4],
    subject: 'Bug Fixes Complete',
    description:
      'I’ve addressed the bugs in the codebase, including the issue with the login functionality. The system has been tested across various environments, and everything should now be running smoothly.',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          I’ve addressed the bugs in the codebase, including the issue with the login functionality.
          The system has been tested across various environments, and everything should now be
          running smoothly. Please check on your end and let me know if there are any remaining
          issues or additional features you’d like implemented. I’m here to help ensure everything
          is working perfectly!
        </Typography>
        <Typography variant="body1">Best regards, {users[4].name}</Typography>
      </>
    ),
    time: dayjs().subtract(8, 'h').toDate(),
    starred: false,
    important: false,
    readAt: dayjs().toISOString(),
    snoozedTill: null,
    folder: 'draft',
    label: 'draft',
  },
  {
    id: 5,
    user: users[5],
    subject: 'Greetings from Bali',
    description:
      'Greetings from Bali! The trip has been incredible so far, and I couldn’t resist sharing some moments with you. The beaches are absolutely stunning, and the sunsets here are beyond breathtaking.',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          Greetings from Bali! The trip has been incredible so far, and I couldn’t resist sharing
          some moments with you. The beaches are absolutely stunning, and the sunsets here are
          beyond breathtaking. I’ve also been immersing myself in the local culture by exploring
          vibrant markets and indulging in the most delicious food. I hope all is going well back
          home and can’t wait to share more stories and catch up when I return!
        </Typography>
        <Typography variant="body1">Best regards, {users[5].name}</Typography>
      </>
    ),
    time: dayjs().subtract(1, 'd').toDate(),
    starred: false,
    important: false,
    readAt: null,
    snoozedTill: null,
    folder: 'inbox',
    label: 'inbox',
  },
  {
    id: 6,
    user: users[6],
    subject: 'Completed Financial Report',
    description:
      'The financial report you requested is now complete and attached for your review. It includes a comprehensive breakdown of expenses, revenue streams, and projections for the upcoming period.',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          The financial report you requested is now complete and attached for your review. It
          includes a comprehensive breakdown of expenses, revenue streams, and projections for the
          upcoming period. Please take a look when you have a moment, and let me know if you’d like
          further analysis or have specific questions. I’m happy to assist with any additional
          insights you may need.
        </Typography>
        <Typography variant="body1">Best regards, {users[6].name}</Typography>
      </>
    ),
    time: dayjs().subtract(1, 'd').toDate(),
    starred: false,
    important: true,
    readAt: dayjs().toISOString(),
    snoozedTill: null,
    folder: 'spam',
    label: 'spam',
  },
  {
    id: 7,
    user: users[7],
    subject: 'Reviewed Documents',
    description:
      'Thank you for sharing the documents! I’ve carefully reviewed them, and I must say they look excellent. The structure is clear and well-organized, and I can see the effort that went into creating them.',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          Thank you for sharing the documents! I’ve carefully reviewed them, and I must say they
          look excellent. The structure is clear and well-organized, and I can see the effort that
          went into creating them. If there’s anything specific you’d like to adjust or add before
          moving forward, feel free to let me know. I’m happy to collaborate and assist in any way
          to ensure everything aligns perfectly.
        </Typography>
        <Typography variant="body1">Best regards, {users[7].name}</Typography>
      </>
    ),
    time: dayjs().subtract(1, 'd').hour(3).minute(11).second(0).toDate(),
    starred: true,
    important: true,
    readAt: null,
    snoozedTill: null,
    folder: 'inbox',
    label: 'inbox',
  },
  {
    id: 8,
    user: users[8],
    subject: 'New Yoga Class',
    description:
      'Hope this message finds you well! I recently discovered a new yoga class, and I immediately thought of you because it’s something I think you’d really enjoy.',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          Hope this message finds you well! I recently discovered a new yoga class, and I
          immediately thought of you because it’s something I think you’d really enjoy. The
          instructor is highly skilled, and the sessions are designed to be incredibly calming,
          focusing on mindfulness and relaxation. The class is scheduled for this weekend at a
          lovely, serene studio. I thought it would be a great way for us to unwind, recharge, and
          spend some quality time together. Let me know if this sounds like something you’d be
          interested in. I’d love to share this experience with you!
        </Typography>
        <Typography variant="body1">Best regards, {users[8].name}</Typography>
      </>
    ),
    time: dayjs().subtract(2, 'd').hour(3).minute(33).second(0).toDate(),
    starred: false,
    important: false,
    readAt: dayjs().toISOString(),
    snoozedTill: null,
    folder: 'trash',
    label: 'inbox',
  },
  {
    id: 9,
    user: users[9],
    subject: 'Team Meeting Reminder',
    description:
      'This is a friendly reminder about the upcoming team meeting scheduled for Friday at 3 PM. During the meeting, we’ll be discussing the newly proposed policies and reviewing our team goals for the next quarter.',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          This is a friendly reminder about the upcoming team meeting scheduled for Friday at 3 PM.
          During the meeting, we’ll be discussing the newly proposed policies and reviewing our team
          goals for the next quarter. If there’s anything specific you’d like added to the agenda,
          please don’t hesitate to let me know by Thursday. Your input is highly valued, and I’m
          looking forward to a productive discussion!
        </Typography>
        <Typography variant="body1">Best regards, {users[9].name}</Typography>
      </>
    ),
    time: dayjs().subtract(2, 'd').hour(6).minute(11).second(0).toDate(),
    starred: true,
    important: false,
    readAt: null,
    snoozedTill: null,
    folder: 'inbox',
    label: 'inbox',
  },
  {
    id: 10,
    user: users[10],
    subject: 'Latest Artwork Preview',
    description:
      'Thank you so much for your insightful feedback on my artwork—it was incredibly helpful! I’ve made a few updates based on your suggestions,',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          Thank you so much for your insightful feedback on my artwork—it was incredibly helpful!
          I’ve made a few updates based on your suggestions, with a focus on refining the color
          palette and enhancing the composition. Attached are the revised versions for your review.
          Please take a look and let me know if there’s anything else you’d like me to adjust. I’m
          excited to hear your thoughts!
        </Typography>
        <Typography variant="body1">Best regards, {users[10].name}</Typography>
      </>
    ),
    time: dayjs().subtract(3, 'd').hour(7).minute(5).second(0).toDate(),
    starred: false,
    important: false,
    readAt: dayjs().toISOString(),
    snoozedTill: null,
    folder: 'sent',
    label: 'sent',
  },
  {
    id: 11,
    user: users[11],
    subject: 'Course Details Attached',
    description:
      'Thank you for expressing interest in our course offerings—it’s wonderful to hear from you! To make things easier, I’ve attached a detailed brochure that includes everything you need to know, such as enrollment requirements',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          Thank you for expressing interest in our course offerings—it’s wonderful to hear from you!
          To make things easier, I’ve attached a detailed brochure that includes everything you need
          to know, such as enrollment requirements, class schedules, course fees, and other
          essential details. If you have any questions or require assistance with the registration
          process, please don’t hesitate to reach out to me directly. I’m here to ensure the process
          is as smooth as possible for you. Looking forward to helping you get started and hearing
          what you think about our courses!
        </Typography>
        <Typography variant="body1">Best regards, {users[11].name}</Typography>
      </>
    ),
    time: dayjs().subtract(5, 'd').hour(10).minute(43).second(0).toDate(),
    starred: false,
    important: true,
    readAt: null,
    snoozedTill: null,
    folder: 'inbox',
    label: 'inbox',
  },
  {
    id: 12,
    user: users[12],
    subject: 'New Chapter Draft',
    description:
      'I’m excited to share that I’ve started drafting the next chapter of the novel, and I’d love to get your feedback on the direction it’s taking. The story has reached an exciting turning point,',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          I’m excited to share that I’ve started drafting the next chapter of the novel, and I’d
          love to get your feedback on the direction it’s taking. The story has reached an exciting
          turning point, and I’ve introduced a new character who plays a pivotal role in the
          unfolding plot. I’m eager to hear your thoughts on how this character fits into the
          storyline and whether the pacing feels right. I’ve sent over the first few pages for your
          review, and I’d appreciate any suggestions or critiques you have. Your perspective always
          helps bring out the best in my writing, so I’m looking forward to your input!
        </Typography>
        <Typography variant="body1">Best regards, {users[12].name}</Typography>
      </>
    ),
    time: dayjs().subtract(3, 'day').hour(15).minute(10).second(0).toDate(),
    starred: true,
    important: false,
    readAt: dayjs().toISOString(),
    snoozedTill: null,
    folder: 'spam',
    label: 'spam',
  },
  {
    id: 13,
    user: users[13],
    subject: 'Updated Event Itinerary',
    description:
      'The event planning is nearing completion, and I’m excited to share the updated itinerary with you! I’ve incorporated some new activities that I believe will make the event even more engaging.',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          The event planning is nearing completion, and I’m excited to share the updated itinerary
          with you! I’ve incorporated some new activities that I believe will make the event even
          more engaging. Attached is the latest version for your review and approval. Please take a
          moment to look it over, and let me know if you have any additional suggestions or changes.
          I’d be happy to incorporate your feedback!
        </Typography>
        <Typography variant="body1">Best regards, {users[13].name}</Typography>
      </>
    ),
    time: dayjs().subtract(3, 'h').toDate(),
    starred: false,
    important: true,
    readAt: null,
    snoozedTill: null,
    folder: 'inbox',
    label: 'inbox',
  },
  {
    id: 14,
    user: users[14],
    subject: 'Let’s Catch Up Over Dinner!',
    description:
      'I hope you’re doing well. It feels like it’s been ages since we last caught up, and I’d love to spend some quality time together. How about dinner this Saturday?',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          I hope you’re doing well. It feels like it’s been ages since we last caught up, and I’d
          love to spend some quality time together. How about dinner this Saturday? I recently
          discovered a cozy restaurant downtown that serves fantastic Mediterranean cuisine. I think
          you’d really enjoy it! Let me know if you’re available, and we can finalize the time.
          Looking forward to catching up and sharing some laughs!
        </Typography>
        <Typography variant="body1">Best regards, {users[14].name}</Typography>
      </>
    ),
    time: dayjs().subtract(1, 'd').hour(5).minute(10).second(0).toDate(),
    starred: true,
    important: true,
    readAt: dayjs().subtract(6, 'd').toISOString(),
    snoozedTill: null,
    folder: 'inbox',
    label: 'inbox',
  },
  {
    id: 15,
    user: users[15],
    subject: 'Reminder: Productivity Workshop This Thursday',
    description:
      'Just a quick reminder about the workshop happening this Thursday at 10 AM in the conference room. The session will focus on enhancing productivity and time management skills, facilitated by a highly recommended expert.',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          Just a quick reminder about the workshop happening this Thursday at 10 AM in the
          conference room. The session will focus on enhancing productivity and time management
          skills, facilitated by a highly recommended expert. Please bring a notebook and any
          questions you’d like to discuss. If you haven’t RSVP’d yet, kindly do so by tomorrow to
          assist with the final arrangements. Let me know if you have any questions. Looking forward
          to seeing you all there!
        </Typography>
        <Typography variant="body1">Best regards, {users[15].name}</Typography>
      </>
    ),
    time: dayjs().subtract(10, 'h').toDate(),
    starred: false,
    important: false,
    readAt: null,
    snoozedTill: dayjs().add(1, 'd').toDate(),
    folder: 'archived',
    label: 'sent',
  },
  {
    id: 16,
    user: users[11],
    subject: 'Request for Feedback on Presentation Draft',
    description:
      'I’ve attached the draft of the presentation I’m preparing for next week’s meeting. It outlines the main points we discussed, including proposed strategies and expected outcomes.',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          I’ve attached the draft of the presentation I’m preparing for next week’s meeting. It
          outlines the main points we discussed, including proposed strategies and expected
          outcomes. Could you review it and share your feedback? Let me know if there are any areas
          you think need adjustment or further elaboration to make it more impactful. Your insights
          are always valuable, and I’d greatly appreciate your input. Thanks in advance for your
          help!
        </Typography>
        <Typography variant="body1">Best regards, {users[11].name}</Typography>
      </>
    ),
    time: dayjs().subtract(12, 'h').toDate(),
    starred: true,
    important: false,
    readAt: dayjs().subtract(2, 'h').toISOString(),
    snoozedTill: dayjs().add(1, 'd').toDate(),
    folder: 'spam',
    label: 'spam',
  },
  {
    id: 17,
    user: users[10],
    subject: 'Thank You for Today’s Meeting',
    description:
      'Thank you for taking the time to meet today. I appreciate your insights on [Topic], and I’m excited to move forward with the next steps we discussed.',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          Thank you for taking the time to meet today. I appreciate your insights on [Topic], and
          I’m excited to move forward with the next steps we discussed. Please let me know if
          there’s anything else you’d like me to prioritize. Looking forward to collaborating
          further!
        </Typography>
        <Typography variant="body1">Best regards, {users[10].name}</Typography>
      </>
    ),
    time: dayjs().subtract(7, 'd').hour(3).minute(20).second(0).toDate(),
    starred: false,
    important: false,
    readAt: null,
    snoozedTill: null,
    folder: 'inbox',
    label: 'inbox',
  },
  {
    id: 18,
    user: users[0],
    subject: 'Just Checking In',
    description:
      'I hope everything’s going well on your end! I just wanted to check in and see how things are progressing with [specific task or topic].',
    details: (
      <>
        <Typography variant="body1">Hello Merchant Captain</Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          I hope everything’s going well on your end! I just wanted to check in and see how things
          are progressing with [specific task or topic]. If there are any updates, challenges, or
          areas where you need support, please don’t hesitate to let me know. I’m here to help
          ensure everything goes smoothly and would be happy to discuss anything further if needed.
          Looking forward to hearing from you!
        </Typography>
        <Typography variant="body1">Best regards, {users[9].name}</Typography>
      </>
    ),
    time: dayjs().subtract(15, 'd').hour(5).minute(30).second(0).toDate(),
    starred: false,
    important: true,
    readAt: dayjs().subtract(10, 'h').toISOString(),
    snoozedTill: null,
    folder: 'inbox',
    label: 'inbox',
  },
];
