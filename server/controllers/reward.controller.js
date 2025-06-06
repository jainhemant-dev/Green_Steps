import mongoose from 'mongoose';

const Reward = mongoose.model('Reward');
const UserReward = mongoose.model('UserReward');
const User = mongoose.model('User');

/**
 * Get all rewards with pagination
 */
async function getAllRewards(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const rewards = await Reward.find()
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(rewards);
}

/**
 * Redeem a reward (deduct points, check availability, create record)
 */
async function redeemReward(req, res) {
  const userId = req.params.userId;
  const rewardId = req.params.rewardId;
  const user = await User.findById(userId);
  const reward = await Reward.findById(rewardId);
  if (!user || !reward) {
    res.status(404).json({ message: 'User or reward not found.' });
    return;
  }
  // Check availability and user points
  if (reward.quantity != null && reward.quantity <= 0) {
    res.status(400).json({ message: 'Reward is no longer available.' });
    return;
  }
  if (user.ecoPoints < reward.cost) {
    res.status(400).json({ message: 'Insufficient points.' });
    return;
  }
  // Deduct points and update reward
  user.ecoPoints -= reward.cost;
  if (reward.quantity != null) {
    reward.quantity -= 1;
    await reward.save();
  }
  await user.save();
  // Create redemption record
  const userReward = new UserReward({
    user: userId,
    reward: rewardId,
    redeemedAt: new Date(),
  });
  await userReward.save();
  res.status(201).json({ message: 'Reward redeemed successfully.' });
}

/**
 * Get a user's redemption history
 */
async function getUserRedemptions(req, res) {
  const userId = req.params.userId;
  const redemptions = await UserReward.find({ user: userId }).populate(
    'reward',
  );
  res.json(redemptions);
}

export { getAllRewards, redeemReward, getUserRedemptions };
