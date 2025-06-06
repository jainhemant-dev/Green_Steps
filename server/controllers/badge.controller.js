import mongoose from 'mongoose';

const Badge = mongoose.model('Badge');
const User = mongoose.model('User');
const ActionLog = mongoose.model('ActionLog');
const Habit = mongoose.model('Habit');

/**
 * Get all system badges
 */
async function getAllBadges(req, res) {
  const badges = await Badge.find();
  res.json(badges);
}

/**
 * Get user's earned badges
 */
async function getUserBadges(req, res) {
  const userId = req.params.userId;
  const user = await User.findById(userId).populate('badges');
  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }
  res.json(user.badges);
}

/**
 * Helper: check and assign badges based on user stats
 * (Called after log creation/edit.)
 */
async function checkAndAssignBadges(user) {
  const allBadges = await Badge.find();
  const logs = await ActionLog.find({ user: user._id }).populate('habit');

  const habitCounts = {};
  const datesSet = new Set();
  const notesCount = logs.filter((log) => log.notes?.trim()).length;
  const co2Saved = logs.reduce((sum, log) => sum + log.co2Saved, 0);
  const habitDayMap = new Map(); // habit._id => Set of days
  const customHabitsCount = await Habit.countDocuments({ user: user._id });

  for (const log of logs) {
    const habit = log.habit;
    const day = new Date(log.date).toDateString();
    datesSet.add(day);

    habitCounts[habit.name] =
      (habitCounts[habit.name] || 0) + (log.quantity || 1);

    if (!habitDayMap.has(habit._id)) habitDayMap.set(habit._id, new Set());
    habitDayMap.get(habit._id).add(day);
  }

  for (const badge of allBadges) {
    let earned = false;

    if (badge.type === 'points' && user.ecoPoints >= badge.threshold) {
      earned = true;
    }

    if (badge.type === 'streak' && user.currentStreak >= badge.threshold) {
      earned = true;
    }

    if (badge.type === 'milestone') {
      switch (badge.name) {
        case 'Transport Champ':
          earned = (habitCounts['Public Transport'] || 0) >= badge.threshold;
          break;
        case 'Food Footprint Reducer':
          earned = (habitCounts['Meatless Meal'] || 0) >= badge.threshold;
          break;
        case 'Plastic-Free Warrior':
          earned = (habitCounts['No-Plastic Day'] || 0) >= badge.threshold;
          break;
        case 'Carpool Commando':
          earned = (habitCounts['Carpooling'] || 0) >= badge.threshold;
          break;
        case 'Waste Conscious':
          earned = (habitCounts['Reusable Containers'] || 0) >= badge.threshold;
          break;
        case 'Eco All-Rounder': {
          // eslint-disable-next-line no-await-in-loop
          const globalHabits = await Habit.find({ isGlobal: true });
          earned = globalHabits.every((gh) => habitCounts[gh.name] > 0);
          break;
        }
        case 'Consistency is Key':
        case 'First Step':
          earned = logs.length >= badge.threshold;
          break;
        case 'GreenMonth':
        case 'GreenSteps Champion':
          earned = datesSet.size >= badge.threshold;
          break;
        case 'Super Saver':
          earned = co2Saved >= badge.threshold;
          break;
        case 'Habit Master': {
          const counts = Object.values(habitCounts);
          earned = counts.some((count) => count >= badge.threshold);
          break;
        }
        case 'Reflection Keeper':
          earned = notesCount >= badge.threshold;
          break;
        case 'Eco Explorer':
          earned = customHabitsCount >= badge.threshold;
          break;
        case 'Daily Devotee': {
          const dayOfWeekCounts = {};
          for (const dateStr of datesSet) {
            const weekday = new Date(dateStr).getDay(); // 0 = Sunday, 6 = Saturday
            dayOfWeekCounts[weekday] = (dayOfWeekCounts[weekday] || 0) + 1;
          }
          earned = Object.values(dayOfWeekCounts).some(
            (count) => count >= badge.threshold,
          );
          break;
        }
        case 'Social Impact':
          // Skipped: Implement leaderboard logic elsewhere
          break;
        default:
          break;
      }
    }

    if (earned && !user.badges.includes(badge._id)) {
      user.badges.push(badge._id);
    }
  }

  await user.save();
}

export { getAllBadges, getUserBadges, checkAndAssignBadges };
