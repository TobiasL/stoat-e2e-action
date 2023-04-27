const core = require('@actions/core')

const getConfigString = require('./getConfigString')
const zipRepoForE2E = require('./zipRepoForE2E')
const pollRunStatus = require('./pollRunStatus')
const { createRun, uploadRunZip } = require('./client/stoatCloudClient')

const runE2E = async () => {
  const apiKey = core.getInput('api_key', { required: true })

  if (process.env.RUNNER_OS === 'Windows') {
    throw new Error('GitHub Action can only run on Linux or macOS')
  }

  await getConfigString()

  const { url, runId, newReleaseUrl } = await createRun(apiKey)

  core.info(`See the E2E run on Stoat Cloud: ${url}`)

  if (newReleaseUrl) {
    core.warning(`Please upgrade to the newest version of this GitHub Action: ${newReleaseUrl}`)
  }

  const filehandle = await zipRepoForE2E()
  const zipStream = filehandle.createReadStream()

  await uploadRunZip(apiKey, runId, zipStream)

  core.info('E2E run has been started.')

  return pollRunStatus(apiKey, runId)
}

module.exports = runE2E
