exports.sanitizeUser = (user) => {
  if (!user) {
    return null;   // <-- important: stop crashing here
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    isAdmin: user.isAdmin,
  };
};
