import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  name: { type: String, required: true }, // action name (e.g. "Recycle Plastic")
  description: { type: String }, // optional detail
  isGlobal: { type: Boolean, default: true }, // global vs custom action
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // if custom, who created it
  co2PerUnit: { type: Number, default: 0 }, // CO₂ saved per action (e.g. kg CO₂)
  pointsPerUnit: { type: Number, default: 0 }, // points earned per action unit
  category: { type: String }, // e.g. "Transport", "Energy"
  createdAt: { type: Date, default: Date.now },
});

HabitSchema.statics.initGlobalHabits = async function () {
  const globalHabits = [
    {
      name: 'Carpooling',
      pointsPerUnit: 1,
      co2PerUnit: 0.5,
      category: 'Transport',
    },
    {
      name: 'Reused Container',
      pointsPerUnit: 1,
      co2PerUnit: 0.2,
      category: 'Waste',
    },
    {
      name: 'Skipped Meat',
      pointsPerUnit: 2,
      co2PerUnit: 1.0,
      category: 'Food',
    },
    {
      name: 'Used Public Transport',
      pointsPerUnit: 1,
      co2PerUnit: 0.7,
      category: 'Transport',
    },
    {
      name: 'No-Plastic Day',
      pointsPerUnit: 1,
      co2PerUnit: 0.3,
      category: 'Waste',
    },
  ];

  for (const habit of globalHabits) {
    // Check if the habit already exists by name
    // eslint-disable-next-line no-await-in-loop
    const exists = await this.findOne({ name: habit.name });
    if (!exists) {
      // Create the habit if it does not exist
      // eslint-disable-next-line no-await-in-loop
      await this.create({
        ...habit,
        isGlobal: true,
        createdBy: null,
      });
    }
  }
};

const Habit = mongoose.model('Habit', HabitSchema);

export default Habit;
