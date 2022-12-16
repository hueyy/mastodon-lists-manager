import { login } from 'masto'
import type { Client } from 'masto'

const REDIRECT_URL = `${process.env.HOST}/oauth`
const SCOPES = `read:follows read:lists write:lists` as const

const createApp = async (apiURL: string): Promise<Client> => {
  const m = await login({ url: apiURL })
  return m.apps.create({
    clientName: `mastodon-lists-manager`,
    redirectUris: REDIRECT_URL,
    scopes: SCOPES,
    website: `https://mastodon-lists-manager.huey.xyz`,
  })
}

const makeOAuthURL = (apiURL: string, clientId: string) => {
  const authorizationParams = new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URL,
    response_type: `code`,
    scope: SCOPES,
  })
  return `${apiURL}/oauth/authorize?${authorizationParams.toString()}`
}

const Mastodon = {
  createApp,
  makeOAuthURL,
}

export default Mastodon