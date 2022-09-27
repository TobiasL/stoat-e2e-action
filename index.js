const core = require('@actions/core')
const http = require('@actions/http-client')
const exec = require('@actions/exec')
const { open, readFile } = require('fs/promises')

// TODO: Make sure that we send the Action version so that old ones can be rejected.
const CONFIG_FILENAME = 'e2e.toml'

const getConfigString = async () => {
  try {
    const configBuffer = await readFile(CONFIG_FILENAME)

    return configBuffer.toString()
  } catch (error) {
    core.setFailed(`E2E config file named "${CONFIG_FILENAME}" not found in current working directory.`)

    process.exit(1)
  }
}

async function run() {
  try {
    const apiKey = core.getInput('api-key', { required: true })

    await getConfigString()

    await exec.exec('zip -r e2e.zip . -x ".git/*" ".github/*"')

    const client = new http.HttpClient('e2e-tool-action')

    const { result } = await client.post('http://host.docker.internal:4444/runs', apiKey)

    console.log('result', result)

    const filehandle = await open('e2e.zip')

    const url = `http://host.docker.internal:4444/stream/${result.runId}`

    await client.sendStream('POST', url, filehandle.createReadStream())

    core.info('E2E run has been started.')

    // TODO: Set up the polling of the run status with the runId.
  } catch (error) {
    console.log(error)

    core.setFailed(error.message)
  }
}

run()
