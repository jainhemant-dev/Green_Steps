import mongoose from 'mongoose';

const UserRewardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  reward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reward',
    required: true,
    index: true,
  },
  quantity: { type: Number, default: 1 },
  date: { type: Date, default: Date.now },
});

const UserReward = mongoose.model('UserReward', UserRewardSchema);
export default UserReward;
