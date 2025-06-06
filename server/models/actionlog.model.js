import mongoose from 'mongoose';

const ActionLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
    index: true,
  },
  date: { type: Date, required: true, index: true },
  quantity: { type: Number, default: 1 }, // how many units (e.g. number of bags recycled)
  points: { type: Number, required: true }, // points earned for this log (quantity * habit.pointsPerUnit)
  co2Saved: { type: Number, default: 0 }, // CO₂ saved (quantity * habit.co2PerUnit)
  notes: { type: String }, // optional user note
  createdAt: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
});
ActionLogSchema.index({ user: 1, date: 1 });

const ActionLog = mongoose.model('ActionLog', ActionLogSchema);
export default ActionLog;
