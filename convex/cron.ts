import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval(
  'update all server metrics',
  { minutes: 1 },
  internal.discord.updateAllServerMetrics
);

export default crons;
