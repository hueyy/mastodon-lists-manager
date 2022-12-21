import { useEffect } from "react"

// eslint-disable-next-line react-hooks/exhaustive-deps
const useRunOnce = (func: () => void) => useEffect(func, [])

export default useRunOnce