import mongoose from 'mongoose';

const RewardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  costPoints: { type: Number, required: true, index: true },
  availableQty: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

const Reward = mongoose.model('Reward', RewardSchema);
export default Reward;
