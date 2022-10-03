// TODO: Set env variable INPUT_API-KEY=temp123 before running the index file.
// TODO: Mock the fetching of the e2e.toml file.
// TODO: Throw error if not on Linux.

const runE2E = require('../src/runE2E')

it('main', async () => {
  await runE2E()

  expect(true).toEqual(false)
})
