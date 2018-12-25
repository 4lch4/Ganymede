const tools = require('./tools')

tools.getTeamSchedule('Houston Outlaws').then(schedule => {
  console.log(`Schedule received...`)
  console.log(schedule)
}).catch(console.error)
