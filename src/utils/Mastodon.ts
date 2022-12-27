import { List, login } from 'masto'
import type { Client } from 'masto'

const REDIRECT_URL = `${process.env.HOST}/oauth`
const SCOPES = `read:accounts read:follows read:lists write:lists write:follows` as const

const createApp = async (apiURL: string): Promise<Client> => {
  const m = await login({ disableVersionCheck: true, url: apiURL })
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

const getClient = async (apiURL: string, accessToken: string) => {
  return await login({ accessToken, disableVersionCheck: true, url: apiURL })
}

const getLists = async (apiURL: string, accessToken: string): Promise<List[]>=> {
  return (await getClient(apiURL, accessToken)).lists.fetchAll()
}

const createList = async (apiURL: string, accessToken: string, title: string) => {
  return (await getClient(apiURL, accessToken)).lists.create({ title })
}

const addToList = async (apiURL: string, accessToken: string, listId: string, accountIDs: string[]) => {
  return (await getClient(apiURL, accessToken)).lists.addAccount(listId, { accountIds: accountIDs})
}

const unfollow = async (apiURL: string, accessToken: string, accountID: string) => {
  return (await getClient(apiURL, accessToken)).accounts.unfollow(accountID)
}

const Mastodon = {
  addToList,
  codeToAccessToken,
  createApp,
  createList,
  getLists,
  makeOAuthURL,
  unfollow,
}

export default Mastodon