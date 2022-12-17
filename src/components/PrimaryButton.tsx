import { Link } from "gatsby"
import * as React from "react"

type Props = {
  className?: string,
  onClick?: () => void,
  href?: string,
  children: React.ReactNode,
}

const PrimaryButton: React.FC<Props> = ({
  className = ``,
  onClick = () => {},
  href = ``,
  children,
}) => {
  const aggregateClassName= `px-4 bg-violet-500 text-white ${className}`
  if(href){
    return (
      <Link to={href} className={aggregateClassName}>
        {children}
      </Link>
    )
  } else {
    return (
      <button type="button" onClick={onClick} className={aggregateClassName}>
        {children}
      </button>
    )
  }
  
}

export default PrimaryButton