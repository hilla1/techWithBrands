// components/collaboration/constants.js
import { z } from 'zod';

export const schema = z.object({
  message: z.string().min(1, 'Message is required'),
  email: z.string().email('Invalid email').optional(),
  designation: z.string().optional(),
});

export const initialMessages = [
  {
    id: 1,
    user: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/40?img=1',
    time: '10:30 AM',
    date: '2025-06-18',
    content: 'Hi team, please check the latest updates.',
    attachments: [],
    replies: [],
  },
  {
    id: 2,
    user: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/40?img=2',
    time: '10:45 AM',
    date: '2025-06-18',
    content: 'Uploaded new files for review.',
    attachments: ['report.pdf'],
    replies: [],
  },
];

export const initialSharedFiles = [
  { fileName: 'project_plan.pdf', sharedBy: 'Alice Johnson', date: '2025-06-15', time: '09:00 AM' },
  { fileName: 'design_mockup.png', sharedBy: 'Bob Smith', date: '2025-06-16', time: '11:15 AM' },
];

export const teamMembers = [
  { name: 'Alice Johnson', designation: 'Project Manager', avatar: 'https://i.pravatar.cc/40?img=1', status: 'online' },
  { name: 'Bob Smith', designation: 'Developer', avatar: 'https://i.pravatar.cc/40?img=2', status: 'offline' },
  { name: 'Charlie Brown', designation: 'Designer', avatar: 'https://i.pravatar.cc/40?img=3', status: 'online' },
];
