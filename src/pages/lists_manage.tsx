import * as React from "react"
import { navigate } from "gatsby"
import Storage from "../utils/Storage"
import { isValidString } from "../utils/Utils"

const ListsManage = () => {

  React.useEffect(() => {
    const homeInstance = Storage.User.get(`home_instance`)
    if(!isValidString(homeInstance)) {
      // go back home
      navigate(`/set_instance`)
    } else if(!isValidString(Storage.User.get(`client_id`)) || !isValidString(Storage.User.get(`client_secret`))){
      // no need to create app, proceed
      navigate(`/client_details`)
    } else if (!isValidString(`access_token`)) {
      navigate(`/oauth`)
    }
  })
  
  return (
    <main>
      Lists Manager
    </main>
  )
}

export default ListsManage