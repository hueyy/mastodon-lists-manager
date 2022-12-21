import * as React from "react"

type Props = {
  className?: string,
  placeholder?: string,
  value?: string,
  onChange?: (t: string) => void,
  onEnter?: () => void,
}

const TextInput: React.FC<Props> = ({
  className = ``,
  placeholder = ``,
  value = ``,
  onChange = () => {},
  onEnter = () => {},
}) => {
  const _onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }, [onChange])
  const onKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === `Enter`){
      onEnter()
    }
  }, [onEnter])
  return (
    <input
        className={`block py-2 px-4 border border-solid border-neutral-700 ${className}`}
        type="text"
        onChange={_onChange}
        placeholder={placeholder}
        value={value}
        onKeyDown={onKeyDown}
      >
      </input>
  )
}

export default TextInput