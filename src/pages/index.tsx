import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import PrimaryButton from "../components/PrimaryButton"
import Container from "../components/Container"

const IndexPage: React.FC<PageProps> = () => {
  React.useEffect(() => {
    (async () => {
    })()
    
  }, [])
  return (
    <Container>
      <h1>Mastodon Lists Manager</h1>
      <PrimaryButton href="/set_instance">START</PrimaryButton>
    </Container>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
