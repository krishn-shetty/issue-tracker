import * as repo from './repository.js';
import * as issueRepo from '../issues/repository.js';

export const getSummary = async (user) => {
  const [grouped, myIssues, recent] = await Promise.all([
    repo.countByStatus(),
    repo.countMine(user._id),
    issueRepo.findPage({}, { page: 1, limit: 5 }),
  ]);

  const statusBreakdown = { OPEN: 0, IN_PROGRESS: 0, CLOSED: 0 };
  for (const { _id, count } of grouped) statusBreakdown[_id] = count;

  return {
    totalIssues: statusBreakdown.OPEN + statusBreakdown.IN_PROGRESS + statusBreakdown.CLOSED,
    openIssues: statusBreakdown.OPEN,
    inProgressIssues: statusBreakdown.IN_PROGRESS,
    closedIssues: statusBreakdown.CLOSED,
    myIssues, // issues assigned to me or created by me
    statusBreakdown,
    recentIssues: recent.items,
  };
};
