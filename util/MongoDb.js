const { mongoUrl } = require('./config.json')
const mongoose = require('mongoose')

// #region Helper Data
const EventSchema = mongoose.Schema({
  date: String,
  events: [{
    time: String,
    away: String,
    home: String
  }]
})
// #endregion Helper Data

const db = mongoose.createConnection(mongoUrl)
const model = db.model('EventInfo', EventSchema, '2019')
db.on('error', console.error.bind(console, 'connection error:'))

const Base = require('./BaseDb')
class MongoDb extends Base {
  /**
   * Looks for an event on the given day/date and if one exists, returns the full
   * day object with events. If none exists, undefined is returned.
   *
   * @param {String|Date} date The day to look for an event.
   *
   * @returns {Promise<DayInfo>} The DayInfo object containing requested info, or undefined if no event occurs on the requested date.
   */
  getDaySchedule (date) {
    if (typeof date !== 'string') {
      try {
        let month = date.getMonth().toString().padStart(2, '0')
        let day = date.getDate().toString().padStart(2, '0')
        date = `${date.getFullYear()}-${month}-${day}`
      } catch (err) { console.error(err) }
    }

    return new Promise((resolve, reject) => {
      model.findOne({ date: date }, (err, res) => {
        if (err) reject(err)
        else if (res.length > 0) resolve(res)
        else resolve(undefined)
      })
    })
  }

  /**
   * Retrieves the schedule for a given team over the 2019 schedule.
   *
   * @param {String} teamName The name of the team you wish to retrieve.
   *
   * @returns {Promise<Event[]>}
   */
  getTeamSchedule (teamName) {
    return new Promise((resolve, reject) => {
      model.find({ $or: [{ 'events.away': teamName }, {'events.home': teamName}] }, (err, res) => {
        if (err) reject(err)
        else if (res.length > 0) resolve(res)
        else resolve(undefined)
      })
    })
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
    let query = null

    return new Promise((resolve, reject) => {
      if (startDate && !endDate) {
        // Only the startDate was provided.
        query = { date: { $gte: startDate } }
      } else if (!startDate && endDate) {
        // Only the endDate was provided.
        query = { date: { $lte: endDate } }
      } else if (startDate && endDate) {
        // Both the startDate and endDate were provided.
        query = { $and: [ { date: { $gte: startDate } }, { date: { $lte: endDate } } ] }
      }

      if (query) {
        model.find(query, (err, res) => {
          if (err) reject(err)
          else if (res.length > 0) resolve(res)
          else resolve(undefined)
        })
      } else {
        model.distinct('date', (err, res) => {
          if (err) reject(err)
          else if (res.length > 0) resolve(res)
          else resolve(undefined)
        })
      }
    })
  }

  /**
   * To be used if you're done with accessing data from the MongoDB and wish to
   * close your connection. The connection is closed and if an error is returned
   * it will be rejected via a Promise. If no error is encountered, the Promise
   * resolves with a void object.
   *
   * @returns {Promise<void>}
   */
  done () {
    return new Promise((resolve, reject) => {
      db.close(err => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
}

module.exports = MongoDb

// #region Custom JSDoc Objects
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
// #endregion Custom JSDoc Objects
