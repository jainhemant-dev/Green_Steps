function sanitizeUser(user) {
  let safeUserObject = null;

  if (user) {
    safeUserObject = {
      _id: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
      ecoPoints: user.ecoPoints,
      level: user.level,
      longestStreak: user.longestStreak,
      currentStreak: user.currentStreak,
      badges: user.badges,
      profileImgLink: user.profileImgLink,
    };
  }
  return safeUserObject;
}

export { sanitizeUser };
