import * as React from 'react'
import { navigate } from "gatsby"
import Storage from "../utils/Storage"
import { isValidString, makeAPIURL } from "../utils/Utils"
import Mastodon from '../utils/Mastodon'
import Container from '../components/Container'
import useRedirect from '../hooks/useRedirect'

const OAuth = () => {

  const onRedirectDone = React.useCallback(() => {
    const homeInstance = Storage.User.get(`home_instance`)
    const apiURL = makeAPIURL(homeInstance)
    const clientID = Storage.User.get(`client_id`)
    const clientSecret = Storage.User.get(`client_secret`)
   
    if(window.location.search.length > 0){
      const queryParams = new URLSearchParams(window.location.search)
      const code = queryParams.get(`code`) as string
      if(isValidString(code)){
        (async () => {
          try {
            const { access_token: accessToken } = await Mastodon.codeToAccessToken(apiURL, clientID, clientSecret, code)
            Storage.User.set(`access_token`, accessToken)
            navigate(`/lists_manage`)
          } catch (error){
            console.error(`Could not exchange code for access token: `, error)
          }
        })()
      } else {
        console.error(`Invalid OAuth code`)
      }
    } else {
      const OAuthURL = Mastodon.makeOAuthURL(apiURL, clientID)
      window.location.href = OAuthURL
    }
  }, [])

  useRedirect({ done: onRedirectDone })

  return (
    <Container>
      OAuth: obtaining access token
    </Container>
  )
}

export default OAuth