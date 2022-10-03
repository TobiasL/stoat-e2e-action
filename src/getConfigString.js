const { readFile } = require('fs/promises')

const CONFIG_FILENAME = 'e2e.toml'

const getConfigString = async () => {
  try {
    const configBuffer = await readFile(CONFIG_FILENAME)

    return configBuffer.toString()
  } catch (error) {
    throw new Error(`E2E config file named "${CONFIG_FILENAME}" not found in current working directory.`)
  }
}

module.exports = getConfigString
