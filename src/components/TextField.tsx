import * as React from "react"
import TextInput from "./TextInput"

type Props = {
  label: string,
  className?: string,
  placeholder?: string,
  value?: string,
  onChange?: (t: string) => void
}

const TextField: React.FC<Props> = ({
  label,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="flex gap-4">
      <label>{label}</label>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default TextField