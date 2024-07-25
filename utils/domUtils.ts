export function checkForEnter(
  e: React.KeyboardEvent<HTMLSpanElement>,
  callback: () => void,
) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    callback()
  }
}
