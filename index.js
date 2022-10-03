const core = require('@actions/core')

const runE2E = require('./src/runE2E')

const index = async () => {
  try {
    await runE2E()

    core.info('E2E run has finished successfully.')
  } catch (error) {
    core.setFailed(error.message)
  }
}

index()
