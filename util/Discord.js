
// #region Discord Helper Functions
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
  } else return new FileDb().teamLogos[val]
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
// #endregion Discord Helper Functions

module.exports.parseTeamArg = parseTeamArg
module.exports.validateTeamArg = validateTeamArg
module.exports.parseInstructionArg = parseInstructionArg
module.exports.validInstructionArgs = validInstructionArgs
module.exports.validateInstructionArg = validateInstructionArg
