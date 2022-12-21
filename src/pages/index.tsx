import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import PrimaryButton from "../components/PrimaryButton"
import Container from "../components/Container"
import SecondaryButton from "../components/SecondaryButton"
import Storage from "../utils/Storage"

const IndexPage: React.FC<PageProps> = () => {
  const onClickClear = React.useCallback(() => {
    Storage.User.clearAll()
  }, [])
  return (
    <Container>
      <h1>Mastodon Lists Manager</h1>
      <PrimaryButton href="/set_instance">START</PrimaryButton>

      <div className="mt-4">
        <label>Clear localStorage</label>
        <p>Use this if something doesn't seem to be working right</p>
        <SecondaryButton onClick={onClickClear}>
          CLEAR
        </SecondaryButton>
      </div>
    </Container>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
