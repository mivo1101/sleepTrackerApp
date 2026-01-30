const { Message } = require('../models');

/**
 * Profile page. Uses requireAuthRoute + res.locals (user, userRecord).
 */
async function renderProfile(req, res) {
  try {
    // Fetch the data
    const messages = await Message.find({
      userId: res.locals.user._id, // Get current user's ID
      type: { $in: ['announcement', 'system'] } // Look for both types
    }).sort({ createdAt: -1 }); // Newest on top

    // Render the page with data
    res.render('pages/profile', {
      title: 'Profile',
      activeSection: 'profile',
      announcements: messages
    });

  } catch (err) {
    console.error("Error loading profile messages:", err);
    res.render('pages/profile', {
      title: 'Profile',
      activeSection: 'profile',
      announcements: []
    });
  }
}

/**
 * Support Chat page (profile section).
 */
function renderProfileSupport(req, res) {
  res.render('pages/profileSupport', {
    title: 'Support Chat',
    activeSection: 'support',
    isSupportChat: true,
    isMessages: true,
  });
}

/**
 * Sleep Schedules page (profile section).
 */
function renderProfileSchedules(req, res) {
  res.render('pages/profileSchedules', {
    title: 'My Sleep Schedules',
    activeSection: 'schedules',
  });
}

module.exports = {
  renderProfile,
  renderProfileSupport,
  renderProfileSchedules,
};
