import mongoose from 'mongoose';

import { handleError } from '##/server/utility/utility.js';

const User = mongoose.model('User');

async function updateUser(req, res) {
  try {
    const { userId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const { name, profileImgLink } = req.body;

    // Build update object dynamically
    const updateData = {};
    if (name) updateData.name = name;
    if (profileImgLink) updateData.profileImgLink = profileImgLink;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true, lean: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ updatedUser });
  } catch (error) {
    return handleError(res, error);
  }
}

// Get user by ID - (((this Retrieves a single user by userId)))
async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(userId).populate('company');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return handleError(res, error);
  }
}

// Get all users -- this will fetch or get all the user from the data base
async function getAllUsers(req, res) {
  try {
    const users = await User.find()
      .select('name currentStreak ecoPoints longestStreak level')
      .lean();
    return res.json({ users });
  } catch (error) {
    return handleError(res, error);
  }
}

export { updateUser, getUserById, getAllUsers };
