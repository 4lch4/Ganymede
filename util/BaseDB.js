const { join } = require('path')
const logosPath = join(__dirname, '..', 'assets', 'img', 'logos')

// #region Helper Data
const teamNames = [
  'Atlanta Reign',
  'Boston Uprising',
  'Chengou Hunters',
  'Dallas Fuel',
  'Florida Mayhem',
  'Guangzhou Charge',
  'Hangzhou Spark',
  'Houston Outlaws',
  'London Spitfire',
  'Los Angeles Gladiators',
  'Los Angeles Valiant',
  'New York Excelsior',
  'Paris Eternal',
  'Philadelphia Fusion',
  'San Francisco Shock',
  'Seoul Dynasty',
  'Shanghai Dragons',
  'Toronto Defiant',
  'Vancouver Titans',
  'Washington Justice'
]

/**
 * Contains the path to the logo for every team in the Overwatch league. Each
 * entry has a key that is the name of the team in lowercase and without the
 * city name. Therefore, the `Atlanta Reign`, is available under `reign`, and
 * the `Chengdu Hunters` is located under `hunters`. Each object also contains
 * a name and path value, the name being the full name of the team and path
 * being the full path to the teams logo as a png.
 */
const teamLogos = {
  reign: {
    name: 'Atlanta Reign',
    path: join(logosPath, 'Atlanta_Reign.png')
  },
  uprising: {
    name: 'Boston Uprising',
    path: join(logosPath, 'Boston_Uprising.png')
  },
  hunters: {
    name: 'Chengdu Hunters',
    path: join(logosPath, 'Chengdu_Hungers.png')
  },
  fuel: {
    name: 'Dallas Fuel',
    path: join(logosPath, 'Dallas_Fuel.png')
  },
  mayhem: {
    name: 'Florida Mayhem',
    path: join(logosPath, 'Florida_Mayhem.png')
  },
  charge: {
    name: 'Guangzhou Charge',
    path: join(logosPath, 'Guangzhou_Charge.png')
  },
  spark: {
    name: 'Hangzhou Spark',
    path: join(logosPath, 'Hangzhou_Spark.png')
  },
  outlaws: {
    name: 'Houston Outlaws',
    path: join(logosPath, 'Houston_Outlaws.png')
  },
  spitfire: {
    name: 'London Spitfire',
    path: join(logosPath, 'London_Spitfire.png')
  },
  gladiators: {
    name: 'Los Angeles Gladiators',
    path: join(logosPath, 'Los_Angeles_Gladiators.png')
  },
  valiant: {
    name: 'Los Angeles Valiant',
    path: join(logosPath, 'Los_Angeles_Valiant.png')
  },
  excelsior: {
    name: 'New York Excelsior',
    path: join(logosPath, 'New_York_Excelsior.png')
  },
  eternal: {
    name: 'Paris Eternal',
    path: join(logosPath, 'Paris_Eternal.png')
  },
  fusion: {
    name: 'Philadelphia Fusion',
    path: join(logosPath, 'Philadelphia_Fusion.png')
  },
  shock: {
    name: 'San Francisco Shock',
    path: join(logosPath, 'San_Francisco_Shock.png')
  },
  dynasty: {
    name: 'Seoul Dynasty',
    path: join(logosPath, 'Seoul_Dynasty.png')
  },
  dragons: {
    name: 'Shanghai Dragons',
    path: join(logosPath, 'Shanghai_Dragons.png')
  },
  titans: {
    name: 'Vancouver Titans',
    path: join(logosPath, 'Vancouver_Titans.png')
  },
  justice: {
    name: 'Washington Justice',
    path: join(logosPath, 'Washington_Justice.png')
  }
}
// #endregion Helper Data

const getDbChoice = () => {
  try {
    require('mongoose')
    return 'mongoose'
  } catch (err) { return 'file' }
}

class Base {
  // #region Static Constants
  static get teamLogos () {
    return teamLogos
  }

  static get teamNames () {
    return teamNames
  }
  // #endregion Static Constants

  // #region Functions to Override
  getTeamSchedule () {}
  getDaySchedule () {}
  getScheduledDates () {}
  // #endregion Functions to Override

  // #region Helper Functions
  /**
   * Determines the currently installed image processor. Is it Canvas or Jimp?
   * If either one is found, the name is returned as a String, otherwise
   * undefined is returned.
   *
   * @returns {String} `mongoose` or `file`
   */
  getDbChoice () {
    try {
      require('mongoose')
      return 'mongoose'
    } catch (err) { return 'file' }
  }

  /**
   * Formats the stored team names for output as a numbered list.
   *
   * @param {String[]} teamNames
   *
   * @returns {String}
   */
  formatTeamOutput (teamNames) {
    let output = ''

    for (let x = 0; x < teamNames.length; x++) {
      output += `**${x})** \`${teamNames[x]}\`\n`
    }

    return output
  }

  /**
   * Gets the shortened version of the team name, which is simply the team name
   * without the city name attached to it. Therefore, `Houston Outlaws` becomes
   * `Outlaws`, or `New York Excelsior` becomes `Excelsior`.
   *
   * @param {String} team The team name you wish to get the shortened version of.
   *
   * @returns {String} The team name without the city name in front.
   */
  getTeamShortName (teamName) {
    return teamName.substring(teamName.lastIndexOf(' ') + 1)
  }

  /**
   * Determines if the given team name is included the given event. Checks against
   * the home and away team to see if they are an exact match or if the short
   * version of the away/home team matches the given team name. Returns true or
   * false, is the team involved in this event?
   *
   * If you provide a **DayInfo** object, this function tests against the event
   * object contained within which has the actual away/home names.
   *
   * @param {Event|DayInfo} event The event to test against.
   * @param {String} teamName The team to look for.
   *
   * @returns {Boolean} True or false, is the given team involved in the given event?
   */
  eventIncludesTeam (event, teamName) {
    if (event.event !== undefined) event = event.event
    return event.away === teamName ||
            event.home === teamName ||
            this.getTeamShortName(event.away) === teamName ||
            this.getTeamShortName(event.home) === teamName
  }
  // #endregion Helper Functions
}

module.exports = Base

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
