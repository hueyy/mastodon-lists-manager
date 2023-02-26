import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import PrimaryButton from "../components/PrimaryButton"
import Container from "../components/Container"
import SecondaryButton from "../components/SecondaryButton"
import Storage from "../utils/Storage"

const IndexPage: React.FC<PageProps> = () => {
  const onClickClear = React.useCallback(() => {
    Storage.User.clearAll()
    window.alert(`Cleared your localStorage!`)
  }, [])
  return (
    <Container>
      <h1 className="font-bold text-xl mb-2">Mastodon Lists Manager</h1>
      <p>
        Perform bulk actions on your Mastodon lists, including:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>View all the users you follow who are not in lists and add them to lists</li>
        <li>Unfollow multiple users at once</li>
      </ul>
      <p className="my-2">
        This should also work on instances that implement the Mastodon follower and list APIs.
      </p>

      <p className="mb-4">
        Your personal data (including your lists and your access token) is only sent to and from your Mastodon instance and your browser and stored in your browser's localStorage.&nbsp;
        No personal data is sent to or stored on the server hosting this webpage (in fact, this is a static site so there is no backend to process or store the data anyway).
      </p>

      <PrimaryButton href="/set_instance">START</PrimaryButton>

      <div className="mt-10">
        <em>Problems?</em>
        <p className="my-2">Use this if something doesn't seem to be working right</p>
        <SecondaryButton onClick={onClickClear}>
          CLEAR STORAGE
        </SecondaryButton>
      </div>

      <footer className="mt-10 text-neutral-600 text-center">
        <p>
          <a href="https://github.com/hueyy/mastodon-lists-manager">source code</a>
        </p>
        <p>
          send your complaints and suggestions to <a href="https://kopiti.am/@huey">@huey@kopiti.am</a><br />or <a href="https://github.com/hueyy/mastodon-lists-manager/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc">open an issue</a>
        </p>
      </footer>
    </Container>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Mastodon Lists Manager</title>
