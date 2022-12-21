import * as React from "react"
import { HeadFC, navigate, PageProps } from "gatsby"
import TextInput from '../components/TextInput'
import PrimaryButton from "../components/PrimaryButton"
import Storage from '../utils/Storage'
import Container from "../components/Container"
import useRedirect from "../hooks/useRedirect"

const cleanHomeInstanceInput = (input_str: string) => {
  const str = /^https?:\/\//.test(input_str)
    ? input_str
    : `https://${input_str}`
  const url = new URL(str)
  return url.host
}

const SetInstancePage: React.FC<PageProps> = () => {
  const [homeInstance, setHomeInstance] = React.useState(``)
  const onHomeInstanceChange = React.useCallback((data: string) => {
    setHomeInstance(data)
  }, [])
  const saveHomeInstance = React.useCallback(() => {
    const input = cleanHomeInstanceInput(homeInstance)
    setHomeInstance(input)
    Storage.User.set(`home_instance`, input)
    navigate(`/client_details`)
  }, [homeInstance])

  useRedirect()

  return (
    <Container>
      <p>
        What's your home Mastodon instance?
      </p>
      
      <TextInput
        className="my-4"
        placeholder="mastodon.sdf.org"
        value={homeInstance}
        onChange={onHomeInstanceChange}
        onEnter={saveHomeInstance}
      />
      
      <PrimaryButton onClick={saveHomeInstance}>SAVE</PrimaryButton>
    </Container>
  )
}

export default SetInstancePage

export const Head: HeadFC = () => <title>Set your home instance</title>
