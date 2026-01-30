/**
 * Lightweight scheduler to run user schedules using node-cron.
 * Loads enabled schedules at startup and registers cron jobs.
 */
const cron = require('node-cron');
const { Schedule, SleepEntry, User, Message } = require('../models');
const { deliver } = require('./socket');

const jobs = new Map(); // key: scheduleId -> cron task


// Checks if the user has already logged their entry
async function hasLoggedSleepToday(userId) {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const entry = await SleepEntry.findOne({
      userId: userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    return !!entry; // True if found
  } catch (error) {
    console.error("Error checking sleep logs:", error);
    return false;
  }
}

// THe Message Sent to the user
async function sendPersistentNotification(userId) {
  const content = "You haven't logged your sleep today. Don't forget to add it.";

  try {
    // 1. Check if we already sent this notification TODAY
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);

    const existingMsg = await Message.findOne({
      userId: userId,
      type: 'system',
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingMsg) {
      console.log(`[Global Check] Notification already sent today for ${userId}. Skipping.`);
      return;
    }

    // 2. Save to Database (So it shows in the Announcement History)
    const newMsg = await Message.create({
      userId: userId,
      content: content,
      type: 'system',
      isRead: false,
      createdAt: new Date()
    });

    // 3. Send Socket Alert (Lights up the Bell Icon)
    deliver(userId, {
      type: 'notification',
      title: 'Missing Log',
      message: content,
      messageId: newMsg._id
    }, 'schedule:notification');

    console.log(`[Global Check] Notification SAVED for user ${userId}`);

  } catch (err) {
    console.error(`[Global Check] Failed to save notification for ${userId}`, err);
  }
}

// Runs sleep check for the day if its not already done.
async function runSleepCheckNow() {
    console.log('[Global Check] Scanning all users for missing sleep logs...');
    try {
      const users = await User.find({});
      for (const user of users) {
        const hasLogged = await hasLoggedSleepToday(user._id);
        if (!hasLogged) {
          await sendPersistentNotification(user._id);
        }
      }
    } catch (err) {
      console.error('[Global Check] Error:', err);
    }
}

// 
function startGlobalSleepCheck() {

  // The cron schedule to run the job everyday at 8am
  cron.schedule('0 8 * * *', async () => {
    console.log('[Global Check] 8:00 AM Cron Triggered.');
    await runSleepCheckNow();
  });

  // Runs immediately on Server Restart
  const now = new Date();
  const currentHour = now.getHours(); // 0-23

  if (currentHour >= 8) {
    console.log(`[Global Check] It is past 8 AM (${now.toLocaleTimeString()}). Running catch-up check...`);
    runSleepCheckNow();
  } else {
    console.log(`[Global Check] It is before 8 AM. Waiting for scheduled run.`);
  }
}

async function loadEnabledSchedules() {
  return Schedule.find({ enabled: true });
}

function registerJob(schedule) {
  const id = String(schedule._id);
  if (!schedule.cron) return;
  // Avoid duplicate
  if (jobs.has(id)) {
    jobs.get(id).stop();
    jobs.delete(id);
  }

  const task = cron.schedule(
    schedule.cron,
    async () => {
      try {
        // Placeholder: perform action based on schedule.type
        // For now, just log and update lastRunAt
        console.log(
          `[Scheduler] Trigger ${schedule.type} '${schedule.name}' for user ${schedule.userId}`
        );

        schedule.lastRunAt = new Date();
        await schedule.save();

        if (schedule.type === 'bedtime') {
          sendBedtimeNotification(schedule);
        }
      } catch (err) {
        console.error('Scheduler task failed:', err);
      }
    },
    { scheduled: true }
  );

  jobs.set(id, task);
}

/**
 * Send bedtime notification to the user who owns this schedule (by userId).
 */
function sendBedtimeNotification(schedule) {
  const userId = schedule.userId;
  if (!userId) {
    console.warn(
      '[Scheduler] Schedule has no userId, skipping notification:',
      schedule.name
    );
    return;
  }
  deliver(
    userId,
    {
      type: 'bedtime',
      title: 'Bedtime Reminder',
      message: `It's time for bed! ${schedule.name}`,
      scheduleName: schedule.name,
      timestamp: new Date(),
    },
    'schedule:notification'
  );
  console.log(
    `[Scheduler] Sent bedtime notification for schedule: ${schedule.name} to user ${userId}`
  );
}

function unregisterJob(scheduleId) {
  const id = String(scheduleId);
  const task = jobs.get(id);
  if (task) {
    try {
      task.stop();
    } catch {
      /* empty */
    }
    jobs.delete(id);
    console.log(`[Scheduler] Unregistered job ${id}.`);
  }
}

async function startScheduler() {
  const enabled = await loadEnabledSchedules();
  enabled.forEach(registerJob);
  startGlobalSleepCheck();
  console.log(`[Scheduler] Registered ${enabled.length} job(s).`);
}

function stopScheduler() {
  jobs.forEach((task) => task.stop());
  jobs.clear();
}

module.exports = { startScheduler, stopScheduler, registerJob, unregisterJob };
