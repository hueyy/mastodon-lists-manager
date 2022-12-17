import * as React from "react"
import { HeadFC, PageProps } from "gatsby"
import Container from "../components/Container"

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Container>404</Container>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
