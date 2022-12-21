import { Link } from "gatsby"
import * as React from "react"

type Props = {
  onClick?: () => void,
  href?: string,
  children: React.ReactNode,
}

const SecondaryButton: React.FC<Props> = ({
  onClick = () => {},
  href = ``,
  children,
}) => {
  if(href){
    return (
      <Link to={href} className="px-4 bg-violet-300 text-black">
        {children}
      </Link>
    )
  } else {
    return (
      <button type="button" onClick={onClick} className="px-4 bg-violet-300 text-black">
        {children}
      </button>
    )
  }
  
}

export default SecondaryButton