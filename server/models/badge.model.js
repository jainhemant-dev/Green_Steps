import mongoose from 'mongoose';

const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String },
  type: {
    type: String,
    enum: ['points', 'streak', 'milestone'],
    required: true,
  },
  threshold: { type: Number, required: true }, // e.g. points needed or days in streak
  createdAt: { type: Date, default: Date.now },
});

BadgeSchema.statics.initGlobalBadges = async function () {
  const defaultBadges = [
    // Points-based Badges
    {
      name: 'Eco Newbie',
      type: 'points',
      threshold: 10,
      description: 'Earn 10 eco-points',
    },
    {
      name: 'Eco Starter',
      type: 'points',
      threshold: 50,
      description: 'Earn 50 eco-points',
    },
    {
      name: 'Green Climber',
      type: 'points',
      threshold: 100,
      description: 'Earn 100 eco-points',
    },
    {
      name: 'Eco Warrior',
      type: 'points',
      threshold: 250,
      description: 'Earn 250 eco-points',
    },
    {
      name: 'Eco Master',
      type: 'points',
      threshold: 500,
      description: 'Earn 500 eco-points',
    },
    {
      name: 'Planet Hero',
      type: 'points',
      threshold: 1000,
      description: 'Earn 1000 eco-points',
    },

    // Streak-based Badges
    {
      name: '3-Day Streak',
      type: 'streak',
      threshold: 3,
      description: 'Log actions 3 days in a row',
    },
    {
      name: '7-Day Streak',
      type: 'streak',
      threshold: 7,
      description: 'Log actions 7 days in a row',
    },
    {
      name: '14-Day Streak',
      type: 'streak',
      threshold: 14,
      description: 'Log actions 14 days in a row',
    },
    {
      name: '30-Day Streak',
      type: 'streak',
      threshold: 30,
      description: 'Log actions 30 days in a row',
    },
    {
      name: 'Streak Legend',
      type: 'streak',
      threshold: 60,
      description: 'Log actions 60 days in a row',
    },

    // Milestone/Category-based Badges
    {
      name: 'Transport Champ',
      type: 'milestone',
      threshold: 15,
      description: 'Used public transport 15 times',
    },
    {
      name: 'Food Footprint Reducer',
      type: 'milestone',
      threshold: 10,
      description: 'Skipped meat 10 times',
    },
    {
      name: 'Plastic-Free Warrior',
      type: 'milestone',
      threshold: 10,
      description: 'Completed 10 No-Plastic Days',
    },
    {
      name: 'Carpool Commando',
      type: 'milestone',
      threshold: 10,
      description: 'Logged 10 carpooling actions',
    },
    {
      name: 'Waste Conscious',
      type: 'milestone',
      threshold: 15,
      description: 'Used reusable containers 15 times',
    },

    // Combo/Mixed Achievement Badges
    {
      name: 'Eco All-Rounder',
      type: 'milestone',
      threshold: 5,
      description: 'Logged at least 1 of each global habit',
    },
    {
      name: 'Consistency is Key',
      type: 'milestone',
      threshold: 21,
      description: 'Log any habit for 21 days total',
    },
    {
      name: 'GreenMonth',
      type: 'milestone',
      threshold: 30,
      description: 'Log habits for 30 different days',
    },
    {
      name: 'Super Saver',
      type: 'milestone',
      threshold: 100,
      description: 'Save 100 kg of CO₂ (calculated)',
    },
    {
      name: 'Habit Master',
      type: 'milestone',
      threshold: 50,
      description: 'Log a single habit 50 times',
    },
    {
      name: 'First Step',
      type: 'milestone',
      threshold: 1,
      description: 'Log your first eco habit',
    },
    {
      name: 'Social Impact',
      type: 'milestone',
      threshold: 10,
      description: 'Rank in top 10 for any week',
    },
    {
      name: 'Reflection Keeper',
      type: 'milestone',
      threshold: 15,
      description: 'Add notes to 15 habit logs',
    },
    {
      name: 'Eco Explorer',
      type: 'milestone',
      threshold: 5,
      description: 'Create 5 custom habits',
    },
    {
      name: 'Daily Devotee',
      type: 'milestone',
      threshold: 5,
      description: 'Log habits 5 days in a week',
    },
    {
      name: 'GreenSteps Champion',
      type: 'milestone',
      threshold: 365,
      description: 'Be consistent for a year',
    },
  ];

  for (const badge of defaultBadges) {
    // eslint-disable-next-line no-await-in-loop
    const exists = await this.findOne({ name: badge.name });
    if (!exists) {
      // eslint-disable-next-line no-await-in-loop
      await this.create(badge);
    }
  }
};

const Badge = mongoose.model('Badge', BadgeSchema);

export default Badge;
