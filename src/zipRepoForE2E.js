const exec = require('@actions/exec')
const { open } = require('fs/promises')

const zipRepoForE2E = async () => {
  await exec.exec('zip --quiet -r e2e.zip . -x ".git/*" ".github/*"')

  return open('e2e.zip')
}

module.exports = zipRepoForE2E
