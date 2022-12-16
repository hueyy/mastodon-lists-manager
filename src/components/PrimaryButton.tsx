import * as React from "react"

type Props = {
  onClick?: () => void,
  children: React.ReactNode,
}

const PrimaryButton: React.FC<Props> = ({
  onClick = () => {},
  children,
}) => {
  return (
    <button type="button" onClick={onClick} className="px-4 bg-violet-500 text-white">
      {children}
    </button>
  )
}

export default PrimaryButton