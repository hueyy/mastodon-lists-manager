import * as React from "react"
import { HeadFC, navigate, PageProps } from "gatsby"
import TextInput from '../components/TextInput'
import PrimaryButton from "../components/PrimaryButton"
import Storage from '../utils/Storage'
import { isValidString } from "../utils/Utils"

const clean_home_instance_input = (input_str: string) => {
  const str = /^https?:\/\//.test(input_str)
    ? input_str
    : `https://${input_str}`
  const url = new URL(str)
  return url.host
}

const SetInstancePage: React.FC<PageProps> = () => {
  const [home_instance, set_home_instance] = React.useState(``)
  const on_home_instance_change = React.useCallback((data: string) => {
    set_home_instance(data)
  }, [])
  const save_home_instance = React.useCallback(() => {
    const input = clean_home_instance_input(home_instance)
    set_home_instance(input)
    Storage.User.set(`home_instance`, input)
    navigate(`/client_details`)
  }, [home_instance])

  React.useEffect(() => {
    const homeInstance = Storage.User.get(`home_instance`)
    if(isValidString(homeInstance)){
      navigate(`/client_details`)
    }
  }, [])

  return (
    <main>
      <p>
        What's your home Mastodon instance?
      </p>
      
      <TextInput
        placeholder="mastodon.social"
        value={home_instance}
        onChange={on_home_instance_change}
      />
      
      <PrimaryButton onClick={save_home_instance}>SAVE</PrimaryButton>
    </main>
  )
}

export default SetInstancePage

export const Head: HeadFC = () => <title>Set your home instance</title>
