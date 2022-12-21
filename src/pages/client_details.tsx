import * as React from "react"
import { navigate } from 'gatsby'
import type { HeadFC } from "gatsby"
import Mastodon from "../utils/Mastodon"
import Storage from "../utils/Storage"
import { makeAPIURL } from "../utils/Utils"
import Container from "../components/Container"
import useRedirect from "../hooks/useRedirect"

const ClientDetailsPage = () => {

  const onRedirectDone = React.useCallback(async () => {
      const homeInstance = Storage.User.get(`home_instance`)
      try {
        const app = await Mastodon.createApp(makeAPIURL(homeInstance))
        Storage.User.set(`client_id`, app.clientId)
        Storage.User.set(`client_secret`, app.clientSecret)
        Storage.User.set(`vapid_key`, app.vapidKey)
      } catch (error){
        console.error(`Something went wrong`, error)
        return
      }
      navigate(`/oauth`)
  }, [])

  useRedirect({ done: onRedirectDone })

  return (
    <Container>
      <p>Automatically obtaining client ID and client secret...</p>
    </Container>
  )
}

export default ClientDetailsPage

export const Head: HeadFC = () => <title>Set client details</title>
