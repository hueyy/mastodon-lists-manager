import * as React from "react"

type Props = {
  className?: string,
  placeholder?: string,
  value?: string,
  onChange?: (t: string) => void
}

const TextInput: React.FC<Props> = ({
  className = "",
  placeholder = "",
  value = "",
  onChange = () => {},
}) => {
  const on_change = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }, [onChange])
  return (
    <input
        className={`block py-2 px-4 border border-solid border-neutral-700 ${className}`}
        type="text"
        onChange={on_change}
        placeholder={placeholder}
        value={value}
      >
      </input>
  )
}

export default TextInput