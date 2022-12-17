import * as React from "react"

type Props = {
  className?: string,
  checked: boolean,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

const CheckBox: React.FC<Props> = ({
  className,
  checked,
  onChange = () => {},
}) => {
  return (
    <input
      className={`cursor-pointer ${className}`}
      type="checkbox"
      checked={checked}
      onChange={onChange}
    />
  )
}

export default CheckBox