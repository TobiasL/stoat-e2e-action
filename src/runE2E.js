const core = require('@actions/core')

const getConfigString = require('./getConfigString')
const isValidRunnerOS = require('./isValidRunnerOS')
const zipRepoForE2E = require('./zipRepoForE2E')
const { createRun, uploadRunZip, pollRunStatus } = require('./requestClient')

const runE2E = async () => {
  const apiKey = core.getInput('api_key', { required: true })

  if (!isValidRunnerOS()) {
    throw new Error('GitHub Action can only run on Linux or macOS')
  }

  await getConfigString()

  const runId = await createRun(apiKey)

  const filehandle = await zipRepoForE2E()
  await uploadRunZip(apiKey, runId, filehandle)

  core.info('E2E run has been started.')

  return pollRunStatus(apiKey, runId)
}

module.exports = runE2E
