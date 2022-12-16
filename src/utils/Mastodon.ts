import { List, login } from 'masto'
import type { Client } from 'masto'

const REDIRECT_URL = `${process.env.HOST}/oauth`
const SCOPES = `read:accounts read:follows read:lists write:lists` as const

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

type AccessToken = {
  access_token: string,
  created_at: number,
  scope: string,
  token_type: `Bearer`
}

const codeToAccessToken = async (apiURL: string, clientId: string, clientSecret: string, code: string) : Promise<AccessToken>=> {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: `authorization_code`,
    redirect_uri: REDIRECT_URL,
    scope: SCOPES,
  })
  const tokenResponse = await fetch(`${apiURL}/oauth/token`, {
    body: params.toString(),
    headers: {
      'Content-Type': `application/x-www-form-urlencoded`,
    },
    method: `POST`,
  })
  return await tokenResponse.json()
}

const getLists = async (apiURL: string, accessToken: string): Promise<List[]>=> {
  const m = await login({ accessToken, url: apiURL })
  return m.lists.fetchAll()
}

const getSelf = async () => {

}

const Mastodon = {
  codeToAccessToken,
  createApp,
  getLists,
  makeOAuthURL,
}

export default Mastodon