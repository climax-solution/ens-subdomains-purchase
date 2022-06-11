import { setup as setupENS } from '../apollo/mutations/ens'
import SafeAppSDK from '@gnosis.pm/safe-apps-sdk'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'

let isSafeAppSetup = false

export function isRunningAsSafeApp() {
  return isSafeAppSetup
}

export const safeInfo = async () => {
  try {
    const safeAppsSdk = new SafeAppSDK()
    return await Promise.race([
      safeAppsSdk.safe.getInfo(),
      new Promise(resolve => setTimeout(resolve, 200))
    ])
  } catch (e) {
    console.error(e)
    return undefined
  }
}

export const setupSafeApp = async safeInfo => {
  const safeAppsSdk = new SafeAppSDK()
  const provider = new SafeAppProvider(safeInfo, safeAppsSdk)
  const { providerObject } = await setupENS({
    customProvider: provider,
    reloadOnAccountsChange: true,
    enforceReload: true
  })
  isSafeAppSetup = true

  return providerObject
}
