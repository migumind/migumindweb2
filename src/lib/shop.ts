// Where the store lives, and where signups are sent.
export const SHOP_URL = 'https://shop.migumind.com'

/** The signup Worker's URL (workers/signup). Unset = forms stay hidden on the live site. */
export const SIGNUP_ENDPOINT: string = import.meta.env.PUBLIC_SIGNUP_ENDPOINT ?? ''

/** In dev, forms render even without an endpoint so the design can be reviewed. */
export const SIGNUP_ENABLED = Boolean(SIGNUP_ENDPOINT) || import.meta.env.DEV
