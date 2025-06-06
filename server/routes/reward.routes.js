import * as rewardController from '##/server/controllers/reward.controller.js';
import { isAllowed } from '##/server/policies/api.policies.js';
import { withAsyncErrorHandling } from '##/server/utility/utility.js';

export default function routes(app) {
  // Get all available rewards (paginated)
  app
    .route('/api/reward/all')
    .all(isAllowed)
    .get(withAsyncErrorHandling(rewardController.getAllRewards));

  // Redeem a reward
  app
    .route('/api/reward/redeem/:userId/:rewardId')
    .all(isAllowed)
    .post(withAsyncErrorHandling(rewardController.redeemReward));

  // Get a user's redemption history
  app
    .route('/api/reward/user/:userId')
    .all(isAllowed)
    .get(withAsyncErrorHandling(rewardController.getUserRedemptions));
}
