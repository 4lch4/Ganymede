const { join } = require('path')
const dataPath = join(__dirname, '..', 'assets')
const scheduleDataPath = join(dataPath, '2019-01_Schedule.json')
const scheduleData = require(scheduleDataPath)

const Base = require('./BaseDb')
class FileDb extends Base {
  /**
   * Looks for an event on the given day/date and if one exists returns the full
   * day object with events. If none exists for the requested date, undefined is
   * returned.
   *
   * @param {String|Date} date The day to look for an event.
   *
   * @returns {DayInfo} The DayInfo object containing requested info, or undefined if no event occurs on the requested date.
   */
  getDaySchedule (date) {
    if (typeof date !== 'string') {
      try {
        let month = date.getMonth().toString().padStart(2, '0')
        let day = date.getDate().toString().padStart(2, '0')

        date = `${date.getFullYear()}-${month}-${day}`
      } catch (err) { console.error(err) }
    }

    for (let day of scheduleData) {
      if (day.date === date) return day
    }

    return undefined
  }

  /**
   * Retrieves the schedule for a given team over the 2019 schedule.
   *
   * @param {String} teamName The name of the team you wish to retrieve.
   */
  getTeamSchedule (teamName) {
    let out = []

    for (let day of scheduleData) {
      for (let event of day.events) {
        if (this.eventIncludesTeam(event, teamName)) {
          out.push({
            date: day.date,
            event: event
          })
        }
      }
    }

    return out
  }

  /**
   * Retrieves a String array of all the dates that have an event scheduled and
   * filters the results based on whether or not any parameters are provided.
   *
   * For example:
   *
   * 1. If only the start date is provided, only events that occur on or after the start date are returned.
   * 2. If only the end date is provided then only events that occur before or on that date are returned.
   * 3. If both dates are provided then events that occur on or after the start date and before or on the end date are returned.
   *
   * @param {String} [startDate] The first day you wish to filter by.
   * @param {String} [endDate] The last day you wish to filter by.
   *
   * @returns {Promise<String[]>} The dates with scheduled events.
   */
  getScheduledDates (startDate = undefined, endDate = undefined) {
    return new Promise((resolve, reject) => {
      try {
        let out = []

        for (let day of scheduleData) {
          if (startDate && !endDate) {
            // Only the startDate was provided.
            if (day.date >= startDate) out.push(day.date)
          } else if (!startDate && endDate) {
            // Only the endDate was provided.
            if (day.date <= endDate) out.push(day.date)
          } else if (startDate && endDate) {
            // Both the startDate and endDate were provided.
            if (day.date >= startDate && day.date <= endDate) out.push(day.date)
          } else out.push(day.date)
        }
        resolve(out)
      } catch (err) { reject(err) }
    })
  }
}

module.exports = FileDb

/**
 * @typedef {Object} Event
 * @prop {String} time
 * @prop {String} away
 * @prop {String} home
 */

/**
 * @typedef {Object} DayInfo
 * @prop {String} date The date of the events.
 * @prop {Event[]} events An array of events that occur on this date.
 */

/**
 * @typedef {Object} ScheduleOptions
 * @prop {String} location Home/Away/Both; if provided, searches for either one or both.
 */
