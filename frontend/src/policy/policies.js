import { USER_ROLES } from '##/shared/directory.js';

export default {
  [USER_ROLES.guest]: {
    static: ['sign-in:visit', 'sign-up:visit'],
  },
  [USER_ROLES.admin]: {
    static: ['admin-dashboard-visit'],
  },
  [USER_ROLES.user]: {
    static: [
      'user-dashboard-visit',
      'user-history-log-visit',
      'user-action-log-visit',
      'user-badges-log-visit',
      'user-rewards-log-visit',
      'user-community-visit',
      'user-profile-visit',
      'impact-journal-visit',
    ],
  },
};
