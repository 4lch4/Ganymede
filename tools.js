const { join } = require('path')
const dataPath = join(__dirname, 'assets')
const logosPath = join(dataPath, 'images', 'logos')
const scheduleDataPath = join(dataPath, '2019-01_Schedule.json')

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

// #region Helper Functions
/**
 * Gets the shortened version of the team name, which is simply the team name
 * without the city name attached to it. Therefore, `Houston Outlaws` becomes
 * `Outlaws`, or `New York Excelsior` becomes `Excelsior`.
 *
 * @param {String} team The team name you wish to get the shortened version of.
 *
 * @returns {String} The team name without the city name in front.
 */
const getTeamShortName = team => {
  return team.substring(team.lastIndexOf(' ') + 1)
}

/**
 * Determines if the given team name is included the given event. Checks against
 * the home and away team to see if they are an exact match or if the short
 * version of the away/home team matches the given team name. Returns true or
 * false, is the team involved in this event?
 *
 * If you provide an **EventInfo** object, this function tests against the event
 * object contained within which has the actual away/home names.
 *
 * @param {Event|EventInfo} event The event to test against.
 * @param {String} teamName The team to look for.
 *
 * @returns {Boolean} True or false, is the given team involved in the given event?
 */
const eventIncludesTeam = (event, teamName) => {
  if (event.event !== undefined) event = event.event
  return event.away === teamName ||
          event.home === teamName ||
          getTeamShortName(event.away) === teamName ||
          getTeamShortName(event.home) === teamName
}

/**
 * Retrieves the schedule for a given team over the 2019 schedule.
 *
 * @param {String} teamName The name of the team you wish to retrieve.
 */
const getTeamSchedule = async teamName => {
  let scheduleData = require(scheduleDataPath)
  let out = []

  for (let day of scheduleData) {
    for (let event of day.events) {
      if (eventIncludesTeam(event, teamName)) {
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
 * Formats the stored team names for output as a numbered list.
 *
 * @returns {String}
 */
const formatTeamOutput = () => {
  let output = ''

  for (let x = 0; x < teamNames.length; x++) {
    output += `**${x})** \`${teamNames[x]}\`\n`
  }

  return output
}

/**
 * Parses the given team arg and returns the proper value. For example, if the
 * user does `+owl 0`, it returns the first team in the list, currently the
 * **Atlanta Reign**. If they do `+owl Houston Outlaws`, it simply returns
 * `Houston Outlaws`, since it's a valid team name.
 *
 * @param {String|Number} val The team arg to be parsed.
 *
 * @returns {String}
 */
const parseTeamArg = val => {
  if (isNaN(val)) {
    return val
  } else return teamNames[val]
}

/**
 * Validates the given team argument to ensure only valid input is provided.
 * Valid input includes a full team name such as `Houston Outlaws`, the number
 * of the team, such as `0` for the first team in the list, or `list` to list
 * all of the available teams.
 *
 * @param {String|Number} val The team arg value to be validated.
 *
 * @returns {boolean|String}
 */
const validateTeamArg = val => {
  if (isNaN(val)) var lcVal = getTeamShortName(val).toLowerCase()
  if (teamNames.includes(val) || teamLogos[lcVal] !== undefined ||
      val.toLowerCase() === 'list' ||
      (val >= 0 && val < teamNames.length)) return true
  else return 'Please provide a valid team name, including their city, or `list` to list available team names.'
}

/**
 * A list of valid 2nd arguments, called the instruction argument, for the OWL
 * command.
 */
const validInstructionArgs = [
  'list', 'ls',
  'schedule', 'sched',
  'reminder', 'remind'
]

/**
 * Validates the given type argument, usually retrieved from Discord.js-Commando
 * when the `OWL` command is executed. The input is tested against the valid
 * variations the command can do, such as listing a team schedule, a days
 * schedule, reminding you when a team is playing, etc.
 * @param {String} val The type arg to be validated.
 */
const validateInstructionArg = val => {
  if (validInstructionArgs.includes(val.toLowerCase())) return true
  else return 'Please provide a valid instruction. If you\'re unsure, you can use the `list` option to display the available options (`+owl list`).'
}

/**
 * Parses the given instruction argument and returns it.
 * @param {String} val The value to parse.
 */
const parseInstructionArg = val => {
  val = val.toLowerCase()
  switch (val) {
    case 'sched':
    case 'schedule':
      return 'schedule'

    case 'list':
    case 'ls':
      return 'list'

    case 'remind':
    case 'reminder':
      return 'reminder'

    default: return undefined
  }
}
// #endregion Helper Functions

// #region Module Exports
module.exports.logosPath = logosPath
module.exports.teamLogos = teamLogos
module.exports.teamNames = teamNames
module.exports.parseTeamArg = parseTeamArg
module.exports.getTeamSchedule = getTeamSchedule
module.exports.validateTeamArg = validateTeamArg
module.exports.formatTeamOutput = formatTeamOutput
module.exports.getTeamShortName = getTeamShortName
module.exports.scheduleDataPath = scheduleDataPath
module.exports.parseInstructionArg = parseInstructionArg
module.exports.validInstructionArgs = validInstructionArgs
module.exports.validateInstructionArg = validateInstructionArg
// #endregion Module Exports

/**
 * @typedef {Object} EventInfo
 * @property {String} date
 * @property {Event} event
 */

/**
 * @typedef {Object} Event
 * @prop {String} time
 * @prop {String} away
 * @prop {String} home
 */
