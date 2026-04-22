import { test as base } from '@playwright/test'

import { createCheckoutActions } from './actions/checkoutActions'
import { createConfiguratorActions } from './actions/configuratorActions'
import { createLandingActions } from './actions/landingActions'
import { createOrderLookupActions } from './actions/orderLookupActions'

type App = {
  checkout: ReturnType<typeof createCheckoutActions>
  configurator: ReturnType<typeof createConfiguratorActions>
  landing: ReturnType<typeof createLandingActions>
  orderLookup: ReturnType<typeof createOrderLookupActions>
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      checkout: createCheckoutActions(page),
      configurator: createConfiguratorActions(page),
      landing: createLandingActions(page),
      orderLookup: createOrderLookupActions(page),
    }
    await use(app)
  },
})

export { expect } from '@playwright/test'