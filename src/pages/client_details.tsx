import * as React from "react"
import { navigate } from 'gatsby'
import type { HeadFC } from "gatsby"
import TextField from "../components/TextField"
import Mastodon from "../utils/Mastodon"
import Storage from "../utils/Storage"
import { isValidString } from "../utils/Utils"



const ClientDetailsPage = () => {
  const [client_id, set_client_id] = React.useState(``)
  const on_change_client_id = React.useCallback((input: string) => {
    set_client_id(input)
  }, [])

  const [client_secret, set_client_secret] = React.useState(``)
  const on_change_client_secret = React.useCallback((input: string) => {
    set_client_secret(input)
  }, [])

  React.useEffect(() => {
    const homeInstance = Storage.User.get(`home_instance`)
    if(!isValidString(homeInstance)) {
      // go back home
      navigate(`/set_instance`)
    } else if(isValidString(Storage.User.get(`client_id`)) && isValidString(Storage.User.get(`client_secret`))){
      // no need to create app, proceed
      navigate(`/oauth`)
    } else {
      (async () => {
        try {
          const app = await Mastodon.createApp(`https://${homeInstance}`)
          Storage.User.set(`client_id`, app.clientId)
          Storage.User.set(`client_secret`, app.clientSecret)
          Storage.User.set(`vapid_key`, app.vapidKey)
        } catch (error){
          console.error(`Something went wrong`, error)
          return
        }
        navigate(`/oauth`)
      })()
    }
  }, [])

  return (
    <main>
      <div>
        <TextField
          label="client_id"
          value={client_id}
          onChange={on_change_client_id}
        />

        <TextField
          label="client_secret"
          value={client_secret}
          onChange={on_change_client_secret}
        />
      </div>
    </main>
  )
}

export default ClientDetailsPage

export const Head: HeadFC = () => <title>Set client details</title>
