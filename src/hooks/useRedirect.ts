import { navigate } from "gatsby"
import Storage from "../utils/Storage"
import { isValidString } from "../utils/Utils"
import useRunOnce from "./useRunOnce"

const useRedirect = ({ done = () => {} } = {}) => {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  useRunOnce(() => {
    const currentPath = window.location.pathname
    const homeInstance = Storage.User.get(`home_instance`)
    if(/\/set_instance\/?/.test(currentPath)){
      if(isValidString(homeInstance)){
        navigate(`/client_details`)
      } else {
        done()
      }
      return
    }
    
    const clientID = Storage.User.get(`client_id`)
    const clientSecret = Storage.User.get(`client_secret`)
    if (/\/client_details\/?/.test(currentPath)){
      if(isValidString(clientID) && isValidString(clientSecret)){
        navigate(`/oauth`)
      } else if (!isValidString(homeInstance)){
        navigate(`/set_instance`)
      } else {
        done()
      }
      return
    }

    const accessToken = Storage.User.get(`access_token`)
    if(/\/oauth\/?/.test(currentPath)){
      if(isValidString(accessToken)){
        navigate(`/lists_manage`)
      } else if (!isValidString(clientID) || !isValidString(clientSecret) || !isValidString(homeInstance)){
        navigate(`/client_details`)
      } else {
        done()
      }
      return
    }
    
    if(/\/lists_manage\/?/.test(currentPath)){
      if (!isValidString(clientID) || !isValidString(clientSecret) || !isValidString(homeInstance) || !isValidString(accessToken)){
        navigate(`/oauth`)
      } else {
        done()
      }
    }
  })

  return {}
}

export default useRedirect