import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import TextInput from '../components/TextInput'
import PrimaryButton from "../components/PrimaryButton"
import Storage from '../utils/Storage'

const clean_home_instance_input = (input_str: string) => {
  const url = new URL(input_str)
  return url.host
}

const set_instance_page: React.FC<PageProps> = () => {
  const [home_instance, set_home_instance] = React.useState("")
  const on_home_instance_change = React.useCallback((data: string) => {
    set_home_instance(data)
  }, [])
  const save_home_instance = React.useCallback(() => {
    const input = clean_home_instance_input(home_instance)
    set_home_instance(input)
    Storage.User.set("home_instance", input)
  }, [home_instance])
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

export default set_instance_page

export const Head: HeadFC = () => <title>Set your home instance</title>
