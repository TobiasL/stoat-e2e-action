const { readFile } = require('fs/promises')

const runE2E = require('../src/runE2E')
const { createRun } = require('../src/client/stoatCloudClient')

jest.mock('fs/promises')
jest.mock('../src/zipRepoForE2E')
jest.mock('../src/client/stoatCloudClient')

beforeEach(() => {
  process.env.RUNNER_OS = 'Linux'

  delete process.env.INPUT_API_KEY
})

afterEach(() => jest.clearAllMocks())

test('we get an error when no api_key is provided', async () => {
  await expect(runE2E())
    .rejects
    .toThrow('Input required and not supplied: api_key')
})

test('we get an error when env RUNNER_OS is not Linux or macOS', async () => {
  process.env.INPUT_API_KEY = 'test-api-key'
  process.env.RUNNER_OS = 'Windows'

  await expect(runE2E())
    .rejects
    .toThrow('GitHub Action can only run on Linux or macOS')
})

test('we get an error when the e2e.toml file doesn\'t exist', async () => {
  process.env.INPUT_API_KEY = 'test-api-key'

  await expect(runE2E())
    .rejects
    .toThrow('E2E config file named "e2e.toml" not found in current working directory.')
})

test('we get an error when the api_key is invalid', async () => {
  process.env.INPUT_API_KEY = 'test-api-key'

  const fakeConfigFile = `
    [test]
    path = './test'

    [test]
  `

  readFile.mockResolvedValue(Buffer.from(fakeConfigFile))
  createRun.mockRejectedValue(new Error('401 Unauthorized'))

  await expect(runE2E())
    .rejects
    .toThrow('401 Unauthorized')
})
