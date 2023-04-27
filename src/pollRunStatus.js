const core = require('@actions/core')
const { retry, delay } = require('already')

const { getRunStatus } = require('./client/stoatCloudClient')

let hasTimedOut = false

const pollRunStatus = async (apiKey, runId, timeout) => {
  setTimeout(() => {
    hasTimedOut = true
  }, timeout * 60 * 1000)

  const testRunStatus = async () => {
    const { status, duration } = await getRunStatus(runId, apiKey)

    if (hasTimedOut) {
      throw new Error(`E2E run has timed out after ${timeout} minutes. Raise the timeout if needed`)
    }

    if (status === 'created') {
      await delay(2000)

      throw new Error('Retry')
    }

    return duration
  }

  const duration = await retry(Infinity, testRunStatus, (error) => error.message === 'Retry')

  core.notice(`Duration of the E2E run on Stoat Cloud: ${duration}`)
}

module.exports = pollRunStatus
