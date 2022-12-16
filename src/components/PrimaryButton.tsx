import { Link } from "gatsby"
import * as React from "react"

type Props = {
  onClick?: () => void,
  href?: string,
  children: React.ReactNode,
}

const PrimaryButton: React.FC<Props> = ({
  onClick = () => {},
  href = ``,
  children,
}) => {
  if(href){
    return (
      <Link to={href} className="px-4 bg-violet-500 text-white">
        {children}
      </Link>
    )
  } else {
    return (
      <button type="button" onClick={onClick} className="px-4 bg-violet-500 text-white">
        {children}
      </button>
    )
  }
  
}

export default PrimaryButton