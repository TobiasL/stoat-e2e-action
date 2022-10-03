const VALID_RUNNER_OS = ['Linux', 'macOS']

const isValidRunnerOS = () => process.env.RUNNER_OS
  && VALID_RUNNER_OS.includes(process.env.RUNNER_OS)

module.exports = isValidRunnerOS
