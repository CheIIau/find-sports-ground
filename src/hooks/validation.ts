export const useValidation = () => {
  const emailTypingRegex = /[^a-z0-9_\-@.!#$%&+=?^`{}|~]*/gi
  const emailValidationRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/

  const validateInput = (
    value: string,
    rules: Array<(val: string) => boolean | string>
  ) => {
    let err: string
    rules.every((rule) => {
      const result = rule(value)
      if (typeof result === 'string') {
        err = result
        return false
      } else {
        return true
      }
    })
    if (err) return err
    return false
  }
  return {
    emailTypingRegex,
    emailValidationRegex,
    validateInput
  }
}
