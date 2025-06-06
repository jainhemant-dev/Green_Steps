import mongoose from 'mongoose';

const Habit = mongoose.model('Habit');
const User = mongoose.model('User');

/**
 * Get all global habits (pre-defined by system)
 */
async function getGlobalHabits(req, res) {
  // Global habits are those without a creator (createdBy: null)
  const habits = await Habit.find({ createdBy: null });
  res.json(habits);
}

/**
 * Get user's custom habits
 */
async function getUserCustomHabits(req, res) {
  const userId = req.params.userId;
  // Fetch habits created by this user
  const habits = await Habit.find({ createdBy: userId });
  res.json(habits);
}

/**
 * Create a custom habit for the user
 */
async function createCustomHabit(req, res) {
  const userId = req.params.userId;
  const { name, description, pointsPerUnit, co2PerUnit } = req.body;
  // Validate required fields
  if (!name || pointsPerUnit == null) {
    res.status(400).json({ message: 'Name and pointsPerUnit are required.' });
    return;
  }
  const habit = new Habit({
    name,
    description,
    pointsPerUnit,
    co2PerUnit,
    createdBy: userId,
  });
  await habit.save();
  res.status(201).json(habit);
}

/**
 * Update a custom habit
 */
async function updateCustomHabit(req, res) {
  const userId = req.params.userId;
  const habitId = req.params.habitId;
  // Find habit owned by user
  const habit = await Habit.findOne({ _id: habitId, createdBy: userId });
  if (!habit) {
    res.status(404).json({ message: 'Habit not found or not owned by user.' });
    return;
  }
  // Apply updates (only allow certain fields if needed)
  Object.assign(habit, req.body);
  await habit.save();
  res.json(habit);
}

/**
 * Delete a custom habit
 */
async function deleteCustomHabit(req, res) {
  const userId = req.params.userId;
  const habitId = req.params.habitId;
  // Remove habit only if owned by user
  const habit = await Habit.findOneAndDelete({
    _id: habitId,
    createdBy: userId,
  });
  if (!habit) {
    res.status(404).json({ message: 'Habit not found or not owned by user.' });
    return;
  }
  res.json({ message: 'Habit deleted successfully.' });
}

export {
  getGlobalHabits,
  getUserCustomHabits,
  createCustomHabit,
  updateCustomHabit,
  deleteCustomHabit,
};
