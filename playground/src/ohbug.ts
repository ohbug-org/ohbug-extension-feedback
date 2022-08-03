import Ohbug from '@ohbug/browser'
import { OhbugErrorBoundary } from '@ohbug/react'
import OhbugExtensionFeedback from '../..'

export const client = Ohbug.setup({
  apiKey: 'eae0790e73c5e501db86f88a05d31775c6b9a9d70cda230fef2a15ac66ace71e',
  appType: 'react',
  appVersion: __APP_VERSION__,
})
client.use(OhbugExtensionFeedback)

export { OhbugErrorBoundary }
