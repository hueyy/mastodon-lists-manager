import * as React from "react"

type Props = {
  className?: string,
  children: React.ReactNode
}

const Container: React.FC<Props> = ({ className, children }) => {
  return (
    <main className={`max-w-screen-md h-screen mx-auto py-4 ${className}`}>
      {children}
    </main>
  )
}

export default Container