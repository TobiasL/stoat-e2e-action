const core = require('@actions/core')
const http = require('@actions/http-client')
const exec = require('@actions/exec')
const { open } = require('fs/promises')

const getConfigString = require('./getConfigString')

const runE2E = async () => {
  const apiKey = core.getInput('api-key', { required: true })

  await getConfigString()

  await exec.exec('zip -r e2e.zip . -x ".git/*" ".github/*"')

  const client = new http.HttpClient('e2e-tool-action')

  const { result } = await client.postJSON('http://host.docker.internal:4444/runs', {
    apiKey,
    actionVersion: '0.0.1',
  })

  const filehandle = await open('e2e.zip')

  const url = `http://host.docker.internal:4444/stream/${result.runId}`

  await client.sendStream('POST', url, filehandle.createReadStream())

  core.info('E2E run has been started.')

  // TODO: Set up the polling of the run status with the runId.
}

module.exports = runE2E
