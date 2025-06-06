import * as userController from '##/server/controllers/user.controller.js';
import { isAllowed } from '##/server/policies/api.policies.js';
import { withAsyncErrorHandling } from '##/server/utility/utility.js';

export default function routes(app) {
  app
    .route('/api/user/update/:userId')
    .all(isAllowed)
    .patch(withAsyncErrorHandling(userController.updateUser));

  app
    .route('/api/user/getAll')
    .all(isAllowed)
    .get(withAsyncErrorHandling(userController.getAllUsers));

  app
    .route('/api/user/:userId')
    .all(isAllowed)
    .get(withAsyncErrorHandling(userController.getUserById));
}
