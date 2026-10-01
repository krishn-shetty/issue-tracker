import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { User } from './modules/users/model.js';
import { Issue } from './modules/issues/model.js';
import { Comment } from './modules/comments/model.js';

if (env.NODE_ENV === 'production') {
  console.error('Refusing to seed in production.');
  process.exit(1);
}

await connectDB();
await Promise.all([Comment.deleteMany({}), Issue.deleteMany({}), User.deleteMany({})]);

const admin = await User.create({ name: 'Admin User', email: 'admin@example.com', password: 'Admin@123', role: 'ADMIN' });
const rahul = await User.create({ name: 'Rahul', email: 'rahul@example.com', password: 'User@123' });
const anil = await User.create({ name: 'Anil', email: 'anil@example.com', password: 'User@123' });
const john = await User.create({ name: 'John', email: 'john@example.com', password: 'User@123' });

const issues = await Issue.insertMany([
  { title: 'Login bug on Safari', description: 'Login button does nothing on Safari 17.', status: 'OPEN', priority: 'HIGH', createdBy: admin._id, assignedTo: rahul._id },
  { title: 'Dashboard cards misaligned', description: 'Cards overflow on tablet widths.', status: 'IN_PROGRESS', priority: 'MEDIUM', createdBy: rahul._id, assignedTo: anil._id },
  { title: 'API returns 500 on empty search', description: 'GET /issues?search= returns an error in some cases.', status: 'CLOSED', priority: 'LOW', createdBy: anil._id, assignedTo: john._id },
  { title: 'Add pagination to comments', description: 'Long threads load slowly.', status: 'OPEN', priority: 'MEDIUM', createdBy: john._id, assignedTo: null },
  { title: 'Password reset flow', description: 'Users need a way to reset forgotten passwords.', status: 'OPEN', priority: 'HIGH', createdBy: admin._id, assignedTo: anil._id },
  { title: 'Improve error messages', description: 'Show friendly messages for 403 and 404 responses.', status: 'IN_PROGRESS', priority: 'LOW', createdBy: rahul._id, assignedTo: rahul._id },
  { title: 'Dark mode support', description: 'Add a dark theme toggle.', status: 'OPEN', priority: 'LOW', createdBy: anil._id, assignedTo: null },
  { title: 'Slow issues list on large datasets', description: 'Investigate indexes and query plans.', status: 'CLOSED', priority: 'HIGH', createdBy: john._id, assignedTo: john._id },
]);

await Comment.insertMany([
  { issue: issues[0]._id, author: rahul._id, content: 'Reproduced on Safari 17.2. Looking into it.' },
  { issue: issues[0]._id, author: admin._id, content: 'Thanks! Please prioritize, customers are affected.' },
  { issue: issues[1]._id, author: anil._id, content: 'Fix is in progress, needs responsive grid tweaks.' },
  { issue: issues[2]._id, author: john._id, content: 'Resolved by validating the query parameters.' },
  { issue: issues[4]._id, author: anil._id, content: 'Will use a signed, short-lived reset token.' },
  { issue: issues[4]._id, author: rahul._id, content: 'Remember to rate-limit the reset endpoint.' },
  { issue: issues[5]._id, author: rahul._id, content: 'Mapping API errors to toast messages.' },
]);

console.log('Seeded: 4 users, 8 issues, 7 comments');
console.log('Admin: admin@example.com / Admin@123');
console.log('Users: rahul@ | anil@ | john@example.com / User@123');
await disconnectDB();
