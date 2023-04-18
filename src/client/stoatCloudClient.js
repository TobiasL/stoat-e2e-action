const http = require('@actions/http-client')

const npmPackage = require('../../package.json')

const client = new http.HttpClient('stoat-e2e-action')

const baseUrl = process.env.BASE_URL || 'http://host.docker.internal:4444'

const defaultHeaders = {
  'x-action-version': npmPackage.version,
}

const handleResponse = async (request) => {
  try {
    const { result } = await request

    return result
  } catch (error) {
    if (error.statusCode === 401) {
      throw new Error('Unauthorized. Check that the variable API_KEY is correct.')
    } else if (error.statusCode === 403) {
      throw new Error('Forbidden. Check that the environment variable BASE_URL is correct and reachable.')
    }

    throw new Error(`Unknown error: ${error}`)
  }
}
const createRun = async (apiKey) => {
  const headers = { ...defaultHeaders, 'x-api-key': apiKey }
  const request = client.postJson(`${baseUrl}/runs`, {}, headers)

  return handleResponse(request)
}

const uploadRunZip = async (apiKey, runId, zipStream) => {
  const headers = { ...defaultHeaders, 'x-api-key': apiKey }
  const request = client.sendStream('POST', `${baseUrl}/runs/${runId}/zip`, zipStream, headers)

  return handleResponse(request)
}

const getRunStatus = async (runId, apiKey) => {
  const headers = { ...defaultHeaders, 'x-api-key': apiKey }
  const request = client.getJson(`${baseUrl}/runs/${runId}`, headers)

  return handleResponse(request)
}

module.exports = {
  createRun,
  uploadRunZip,
  getRunStatus,
}
