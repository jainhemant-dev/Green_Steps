import * as habitController from '##/server/controllers/habit.controller.js';
import { isAllowed } from '##/server/policies/api.policies.js';
import { withAsyncErrorHandling } from '##/server/utility/utility.js';

export default function routes(app) {
  // ✅ Get all global habits (pre-defined, createdBy: null)
  app
    .route('/api/habit/global')
    .all(isAllowed)
    .get(withAsyncErrorHandling(habitController.getGlobalHabits));

  // ✅ Get custom habits for a specific user
  app
    .route('/api/habit/custom/:userId')
    .all(isAllowed)
    .get(withAsyncErrorHandling(habitController.getUserCustomHabits));

  // ✅ Create a custom habit for a user
  app
    .route('/api/habit/custom/:userId')
    .all(isAllowed)
    .post(withAsyncErrorHandling(habitController.createCustomHabit));

  // ✅ Update a custom habit (only if owned by the user)
  app
    .route('/api/habit/custom/:userId/:habitId')
    .all(isAllowed)
    .patch(withAsyncErrorHandling(habitController.updateCustomHabit));

  // ✅ Delete a custom habit (only if owned by the user)
  app
    .route('/api/habit/custom/:userId/:habitId')
    .all(isAllowed)
    .delete(withAsyncErrorHandling(habitController.deleteCustomHabit));
}
