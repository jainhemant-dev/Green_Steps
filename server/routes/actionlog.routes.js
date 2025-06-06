import * as actionLogController from '##/server/controllers/actionLog.controller.js';
import { isAllowed } from '##/server/policies/api.policies.js';
import { withAsyncErrorHandling } from '##/server/utility/utility.js';

export default function routes(app) {
  // Create new log for a user
  app
    .route('/api/log/:userId')
    .all(isAllowed)
    .post(withAsyncErrorHandling(actionLogController.createLog));

  // Edit an existing log
  app
    .route('/api/log/:userId/:logId')
    .all(isAllowed)
    .patch(withAsyncErrorHandling(actionLogController.editLog));

  // Delete a log
  app
    .route('/api/log/:userId/:logId')
    .all(isAllowed)
    .delete(withAsyncErrorHandling(actionLogController.deleteLog));

  // Get logs for a user (with optional date filtering)
  app
    .route('/api/user-log/user/:userId')
    .all(isAllowed)
    .get(withAsyncErrorHandling(actionLogController.getLogsByUser));

  // Get logs by date (admin/global)
  app
    .route('/api/log/date')
    .all(isAllowed)
    .get(withAsyncErrorHandling(actionLogController.getLogsByDate));
  app
    .route('/api/global-log-data/globalStates')
    .all(isAllowed)
    .get(withAsyncErrorHandling(actionLogController.getGlobalStats));
  app
    .route('/api/update/log/:logId')
    .all(isAllowed)
    .patch(withAsyncErrorHandling(actionLogController.updateLog));
}
