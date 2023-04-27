const core = require('@actions/core')

const runE2E = require('./src/runE2E')

const index = async () => {
  try {
    await runE2E()

    core.notice('Stoat E2E run has finished successfully.')

    process.exit(0)
  } catch (error) {
    core.setFailed(`Stoat E2E run failed with error: ${error.message}`)

    process.exit(1)
  }
}

index()
