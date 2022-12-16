import * as React from 'react'
import { navigate } from "gatsby"
import Storage from "../utils/Storage"
import { isValidString } from "../utils/Utils"
import Mastodon from '../utils/Mastodon'

const OAuth = () => {
  React.useEffect(() => {
    const homeInstance = Storage.User.get(`home_instance`)
    if(!isValidString(homeInstance)) {
      navigate(`/set_instance`)
      return
    }
    
    const clientID = Storage.User.get(`client_id`)
    const clientSecret = Storage.User.get(`client_secret`)
    if(!isValidString(clientID) || !isValidString(clientSecret)){
      navigate(`/client_details`)
      return
    }
   
    if(window.location.search.length > 0){
      const queryParams = new URLSearchParams(window.location.search)
      const code = queryParams.get(`code`)
      if(isValidString(code as string)){
        navigate(`/lists_manage`)
      }
    } else {
      const OAuthURL = Mastodon.makeOAuthURL(`https://${homeInstance}`, clientID)
      window.location.href = OAuthURL
    }
  })

  return (
    <main>
      OAuth
    </main>
  )
}

export default OAuth