const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

class ScheduleManager {
  constructor(chromecastManager) {
    this.chromecastManager = chromecastManager;
    this.schedules = new Map();
    this.jobs = new Map();
  }

  createSchedule(name, deviceIds, url, cronExpression, duration = null) {
    const scheduleId = uuidv4();

    const schedule = {
      id: scheduleId,
      name,
      deviceIds,
      url,
      cronExpression,
      duration, // Duration in seconds, null for indefinite
      createdAt: new Date().toISOString(),
      enabled: true
    };

    // Validate cron expression
    if (!cron.validate(cronExpression)) {
      throw new Error('Invalid cron expression');
    }

    // Create cron job
    const job = cron.schedule(cronExpression, async () => {
      logger.info(`Executing schedule: ${name}`);
      try {
        await this.chromecastManager.castToDevices(deviceIds, url);

        // If duration is set, stop after duration
        if (duration) {
          setTimeout(async () => {
            await this.chromecastManager.stopDevices(deviceIds);
          }, duration * 1000);
        }
      } catch (error) {
        logger.error(`Failed to execute schedule ${name}:`, error);
      }
    });

    this.schedules.set(scheduleId, schedule);
    this.jobs.set(scheduleId, job);

    return schedule;
  }

  getSchedules() {
    return Array.from(this.schedules.values());
  }

  deleteSchedule(scheduleId) {
    const job = this.jobs.get(scheduleId);
    if (job) {
      job.stop();
      this.jobs.delete(scheduleId);
    }
    this.schedules.delete(scheduleId);
  }

  stopAll() {
    this.jobs.forEach((job) => {
      job.stop();
    });
    this.jobs.clear();
  }
}

module.exports = ScheduleManager;
