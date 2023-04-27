# Stoat E2E Action

## Overview

The Stoat E2E Action is a GitHub Action that helps you easily build and run your end-to-end (E2E)
tests with Stoat Cloud, a cloud-based testing platform.
This action allows you to easily integrate your E2E tests into your continuous integration (CI) pipeline.

## Usage

To use the Stoat E2E Action, simply add the following step to your GitHub Actions workflow file:

```yaml
uses: TobiasL/stoat-e2e-action@v1
with:
  api_key: API_KEY
```

## Inputs

### `api_key`

**Required** The API key for the project you are testing. Found in the Stoat Cloud project page.

### `timeout`

**Optional** The API key for the project you are testing. Found in the Stoat Cloud project page.
Default 10 minutes.

## License
The Stoat E2E Action is licensed under the MIT License.
