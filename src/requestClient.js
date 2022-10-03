const http = require('@actions/http-client')
const core = require('@actions/core')
const { retry, delay } = require('already')

const npmPackage = require('../package.json')

const client = new http.HttpClient('e2e-tool-action')

const defaultHeaders = {
  'x-action-version': npmPackage.version,
}

const createRun = async (apiKey) => {
  const url = process.env.BASE_URL || 'http://host.docker.internal:4444'

  const headers = { ...defaultHeaders, 'x-api-key': apiKey }

  const { result } = await client.postJson(`${url}/runs`, {}, headers)

  core.info(`See the E2E run on Stoat Cloud: ${result.url}`)

  if (result.newReleaseUrl) {
    core.warning(`Please upgrade to the newest version of this GitHub Action: ${result.newReleaseUrl}`)
  }

  return result?.runId
}

const uploadRunZip = async (apiKey, runId, runZip) => {
  const url = process.env.BASE_URL || 'http://host.docker.internal:4444'
  const zipStream = runZip.createReadStream()

  const headers = { ...defaultHeaders, 'x-api-key': apiKey }

  await client.sendStream('POST', `${url}/runs/${runId}/zip`, zipStream, headers)
}

const pollRunStatus = async (apiKey, runId) => {
  const url = process.env.BASE_URL || 'http://host.docker.internal:4444'

  const headers = { ...defaultHeaders, 'x-api-key': apiKey }

  const getRunStatus = async () => {
    const { result, statusCode } = await client.getJson(`${url}/runs/${runId}`, headers)

    if (statusCode !== 200) {
      throw new Error(`Got status code ${statusCode} when polling for run status.`)
    }

    if (result.status === 'created') {
      await delay(2000)

      throw new Error('Retry')
    }

    return result
  }

  const result = await retry(100, getRunStatus, (error) => error.message === 'Retry')

  core.info(`Duration of the E2E run on Stoat Cloud: ${result.duration}`)

  return result
}

module.exports = {
  createRun,
  uploadRunZip,
  pollRunStatus,
}
