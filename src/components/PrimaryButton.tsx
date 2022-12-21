import { Link } from "gatsby"
import * as React from "react"

type Props = {
  className?: string,
  onClick?: () => void,
  href?: string,
  children: React.ReactNode,
  isLoading?: boolean,
  loadingText?: string,
}

const PrimaryButton: React.FC<Props> = ({
  className = ``,
  onClick = () => {},
  href = ``,
  children,
  isLoading = false,
  loadingText = ``,
}) => {
  const aggregateClassName= `px-4 py-2 bg-violet-500 text-white ${className}`
  const content = isLoading ? loadingText: children
  if(href){
    return (
      <Link to={href} className={aggregateClassName}>
        {content}
      </Link>
    )
  } else {
    return (
      <button type="button" onClick={onClick} className={aggregateClassName} disabled={isLoading}>
        {content}
      </button>
    )
  }
  
}

export default PrimaryButton