import mongoose from 'mongoose';

const ActionLog = mongoose.model('ActionLog');
const Habit = mongoose.model('Habit');
const User = mongoose.model('User');
import { checkAndAssignBadges } from '##/server/controllers/badge.controller.js';

/**
 * Create an action log (calculates eco-points and CO2 saved)
 */
// async function createLog(req, res) {
//   const userId = req.params.userId;
//   const { habitId, quantity, date, note = '' } = req.body;
//   if (!habitId || quantity == null) {
//     res.status(400).json({ message: 'habitId and quantity are required.' });
//     return;
//   }
//   // Fetch habit to get point & CO₂ rates
//   const habit = await Habit.findById(habitId);
//   if (!habit) {
//     res.status(404).json({ message: 'Habit not found.' });
//     return;
//   }
//   // Calculate points and CO₂ saved
//   const ecoPoints = habit.pointsPerUnit * quantity;
//   const co2Saved = habit.co2PerUnit * quantity;
//   // Create log entry
//   const log = new ActionLog({
//     user: userId,
//     habit: habitId,
//     quantity,
//     notes: note,
//     date: date || new Date(),
//     points: ecoPoints,
//     co2Saved,
//   });
//   await log.save();
//   // Update user's points and streak
//   const user = await User.findById(userId);
//   user.ecoPoints = (user.ecoPoints || 0) + ecoPoints;
//   // Streak logic: increment if previous log was yesterday; else reset
//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);
//   if (
//     user.lastLogDate &&
//     user.lastLogDate.toDateString() === yesterday.toDateString()
//   ) {
//     user.streak = (user.streak || 0) + 1;
//   } else {
//     user.streak = 1;
//   }
//   user.lastLogDate = log.date;
//   await user.save();
//   await log.populate('habit', 'name');
//   // Check and assign any earned badges after this log
//   // await checkAndAssignBadges(user);
//   res.status(201).json(log);
// }

async function createLog(req, res) {
  const userId = req.params.userId;
  const { habitId, quantity, date, note = '' } = req.body;

  if (!habitId || quantity == null) {
    res.status(400).json({ message: 'habitId and quantity are required.' });
    return;
  }

  // Normalize date to midnight to ensure uniqueness across the day
  const logDate = new Date(date || new Date());
  logDate.setHours(0, 0, 0, 0);

  // Check if a log already exists for this user, habit, and date
  const existingLog = await ActionLog.findOne({
    user: userId,
    habit: habitId,
    date: logDate,
  });

  if (existingLog) {
    return res.status(409).json({
      message: 'You have already logged this habit for today.',
    });
  }

  // Fetch habit to get point & CO₂ rates
  const habit = await Habit.findById(habitId);
  if (!habit) {
    return res.status(404).json({ message: 'Habit not found.' });
  }

  const ecoPoints = habit.pointsPerUnit * quantity;
  const co2Saved = habit.co2PerUnit * quantity;

  // Create new log entry
  const log = new ActionLog({
    user: userId,
    habit: habitId,
    quantity,
    notes: note,
    date: logDate,
    points: ecoPoints,
    co2Saved,
  });

  await log.save();

  // Update user's eco points and streak
  const user = await User.findById(userId);
  user.ecoPoints = (user.ecoPoints || 0) + ecoPoints;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  if (
    user.lastLogDate &&
    new Date(user.lastLogDate).toDateString() === yesterday.toDateString()
  ) {
    user.streak = (user.streak || 0) + 1;
  } else {
    user.streak = 1;
  }

  user.lastLogDate = logDate;
  await user.save();

  await log.populate('habit', 'name');
  res.status(201).json(log);
}

/**
 * Edit an existing action log (recalculate points and adjust streaks)
 */
async function editLog(req, res) {
  const userId = req.params.userId;
  const logId = req.params.logId;
  const { quantity, date } = req.body;
  // Find log and validate ownership
  const log = await ActionLog.findOne({ _id: logId, user: userId });
  if (!log) {
    res.status(404).json({ message: 'Log not found or not owned by user.' });
    return;
  }
  // Recalculate points & CO₂ if quantity changed
  if (quantity != null) {
    const habit = await Habit.findById(log.habit);
    const oldPoints = log.ecoPoints;
    const oldCo2 = log.co2Saved;
    const newPoints = habit.pointsPerUnit * quantity;
    const newCo2 = habit.co2PerUnit * quantity;
    log.quantity = quantity;
    log.ecoPoints = newPoints;
    log.co2Saved = newCo2;
    // Update user points by the difference
    const user = await User.findById(userId);
    user.ecoPoints += newPoints - oldPoints;
    await user.save();
  }
  // If date changed, update and (optionally) adjust streak logic
  if (date) {
    log.date = date;
    // Complex streak recalculation could be done here if needed
  }
  await log.save();
  // Check badges again (streak/points may have changed)
  const user = await User.findById(userId);
  await checkAndAssignBadges(user);
  res.json(log);
}

/**
 * Delete an action log (rollback points and adjust streaks)
 */
async function deleteLog(req, res) {
  const userId = req.params.userId;
  const logId = req.params.logId;
  // Delete the log entry if owned by user
  const log = await ActionLog.findOneAndDelete({ _id: logId, user: userId });
  if (!log) {
    res.status(404).json({ message: 'Log not found or not owned by user.' });
    return;
  }
  // Rollback user points
  const user = await User.findById(userId);
  user.ecoPoints -= log.points;
  // Adjust streak: recalc based on remaining logs
  const remainingLogs = await ActionLog.find({ user: userId }).sort({
    date: -1,
  });
  if (remainingLogs.length) {
    // Recompute current streak from most recent logs (simplified)
    user.lastLogDate = remainingLogs[0].date;
    user.streak = 1;
    for (let i = 1; i < remainingLogs.length; i++) {
      const prevDate = new Date(remainingLogs[i - 1].date);
      const currDate = new Date(remainingLogs[i].date);
      prevDate.setDate(prevDate.getDate() - 1);
      if (prevDate.toDateString() === currDate.toDateString()) {
        user.streak += 1;
      } else {
        break;
      }
    }
  } else {
    user.lastLogDate = null;
    user.streak = 0;
  }
  await user.save();
  res.json({ message: 'Log deleted and user points/streak updated.' });
}

/**
 * Get logs by user with pagination and optional date filtering
 */
async function getLogsByUser(req, res) {
  const userId = req.params.userId;
  const { page = 1, limit = 10, startDate, endDate } = req.query;
  const filter = { user: userId };
  if (startDate) {
    filter.date = { $gte: new Date(startDate) };
  }
  if (endDate) {
    filter.date = filter.date || {};
    filter.date.$lte = new Date(endDate);
  }
  const logs = await ActionLog.find(filter)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('habit', 'name'); // include habit name
  res.json(logs);
}

/**
 * Get logs by date (all users on that date)
 * Note: This may be an admin route; returns all users' logs for a given date.
 */
async function getLogsByDate(req, res) {
  const { date } = req.query;
  if (!date) {
    res.status(400).json({ message: 'Date query parameter is required.' });
    return;
  }
  const day = new Date(date);
  const nextDay = new Date(day);
  nextDay.setDate(day.getDate() + 1);
  const logs = await ActionLog.find({
    date: { $gte: day, $lt: nextDay },
  })
    .populate('habit', 'name')
    .populate('user', 'username');
  res.json(logs);
}

/**
 * Controller to compute global statistics:
 * - Total actions logged (i.e. total log count)
 * - Most common habit (the one that appears most frequently)
 */
async function getGlobalStats(req, res) {
  try {
    // Count all action logs (total actions logged)
    const totalActions = await ActionLog.countDocuments();

    // Aggregate logs to group by habit, sort by frequency, and lookup habit name
    const commonHabitAgg = await ActionLog.aggregate([
      {
        $group: {
          _id: '$habit',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'habits', // Make sure this matches your Habit collection name
          localField: '_id',
          foreignField: '_id',
          as: 'habitData',
        },
      },
      { $unwind: '$habitData' },
      {
        $project: {
          _id: 0,
          habitName: '$habitData.name',
          count: 1,
        },
      },
    ]);

    // Extract the common habit name (or fallback to "N/A" if none exists)
    const commonHabit =
      commonHabitAgg.length > 0 ? commonHabitAgg[0].habitName : 'N/A';

    // Return the two values
    res.json({
      totalActions,
      commonHabit,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}

async function updateLog(req, res) {
  const logId = req.params.logId;

  if (!logId) {
    res.status(400).json({ message: 'logId is required.' });
    return;
  }
  // Fetch habit to get point & CO₂ rates
  const log = await ActionLog.findById(logId);
  if (!log) {
    res.status(404).json({ message: 'Log not found.' });
    return;
  }

  log.isCompleted = true;
  await log.save();
  await log.populate('habit', 'name');
  // Check and assign any earned badges after this log
  await checkAndAssignBadges(req.user);
  res.status(201).json(log);
}

export {
  createLog,
  updateLog,
  editLog,
  deleteLog,
  getLogsByUser,
  getLogsByDate,
  getGlobalStats,
};
