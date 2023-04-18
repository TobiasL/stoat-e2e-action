const core = require('@actions/core')
const { retry, delay } = require('already')

const { getRunStatus } = require('./client/stoatCloudClient')

const pollRunStatus = async (apiKey, runId) => {
  const testRunStatus = async () => {
    const { status, duration } = await getRunStatus(runId, apiKey)

    if (status === 'created') {
      await delay(2000)

      throw new Error('Retry')
    }

    return duration
  }

  const duration = await retry(100, testRunStatus, (error) => error.message === 'Retry')

  core.notice(`Duration of the E2E run on Stoat Cloud: ${duration}`)
}

module.exports = pollRunStatus
