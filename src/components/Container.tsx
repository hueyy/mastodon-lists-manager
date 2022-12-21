import * as React from "react"

type Props = {
  className?: string,
  children: React.ReactNode
}

const Container: React.FC<Props> = ({ className, children }) => {
  return (
    <main className={`max-w-screen-xl h-screen mx-auto px-2 py-4 ${className}`}>
      {children}
    </main>
  )
}

export default Container