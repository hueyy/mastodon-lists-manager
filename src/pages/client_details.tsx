import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import TextField from "../components/TextField"

const client_details_page = () => {
  const [client_id, set_client_id] = React.useState("")
  const on_change_client_id = React.useCallback((input: string) => {
    set_client_id(input)
  }, [])

  const [client_secret, set_client_secret] = React.useState("")
  const on_change_client_secret = React.useCallback((input: string) => {
    set_client_secret(input)
  }, [])

  return (
    <main>
      <div>
        <TextField
          label="client_id"
          value={client_id}
          onChange={on_change_client_id}
        />

        <TextField
          label="client_secret"
          value={client_secret}
          onChange={on_change_client_secret}
        />
      </div>
    </main>
  )
}

export default client_details_page

export const Head: HeadFC = () => <title>Set client details</title>
