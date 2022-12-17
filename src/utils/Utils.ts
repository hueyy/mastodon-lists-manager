import Storage from "./Storage"

export const isValidString = (input: string) => typeof input === `string` && input.length > 0
export const makeAPIURL = (host: string) => `https://${host}`

export const getRequestEssentials = () => {
  const homeInstance = Storage.User.get(`home_instance`)
  const apiURL = makeAPIURL(homeInstance)
  const accessToken = Storage.User.get(`access_token`)
  return { accessToken, apiURL }
}