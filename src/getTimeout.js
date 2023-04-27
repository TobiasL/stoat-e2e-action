const core = require('@actions/core')

const getTimeout = () => {
  const rawTimeout = core.getInput('timeout') || '10'
  const timeout = parseInt(rawTimeout, 10)

  if (Number.isNaN(timeout)) {
    throw new Error('Error converting input value "timeout" into an integer')
  }

  return timeout
}

module.exports = getTimeout
