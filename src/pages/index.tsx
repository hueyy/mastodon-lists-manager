import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import PrimaryButton from "../components/PrimaryButton"

const IndexPage: React.FC<PageProps> = () => {
  React.useEffect(() => {
    (async () => {
    })()
    
  }, [])
  return (
    <main>
      <h1>Mastodon Lists Manager</h1>
      <PrimaryButton href="/set_instance">START</PrimaryButton>
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
