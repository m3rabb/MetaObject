const ErrorLog = []

let HandleErrorsQuietly = true
let LogErrors           = false

// let HandleInheritancePoisoning = true

function SignalError(target, message) {
  if (LogErrors) { ErrorLog.push(`${target}: ${message}`) }

  if (HandleErrorsQuietly) {
    console.warn(message) // eslint-disable-line no-console
  } else {
    const error = new Error(message)
    error.name = "Purple Carrot Error"
    error.target = target
    throw error
  }
  return null
}
