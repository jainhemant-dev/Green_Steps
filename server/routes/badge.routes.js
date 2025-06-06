import * as badgeController from '##/server/controllers/badge.controller.js';
import { isAllowed } from '##/server/policies/api.policies.js';
import { withAsyncErrorHandling } from '##/server/utility/utility.js';

export default function routes(app) {
  // Get all badges (system-defined, for display)
  app
    .route('/api/badge/all')
    .all(isAllowed)
    .get(withAsyncErrorHandling(badgeController.getAllBadges));

  // Get earned badges by user
  app
    .route('/api/badge/user/:userId')
    .all(isAllowed)
    .get(withAsyncErrorHandling(badgeController.getUserBadges));
}
