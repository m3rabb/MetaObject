const ErrorLog = []

var HandleErrorsQuietly = true
var LogErrors           = false

// var HandleInheritancePoisoning = true

function SignalError(target, message) {
  if (LogErrors) { ErrorLog.push(`${target}: ${message}`) }

  const error = new Error(message)
  error.name = "Navel Error"
  error.target = target
  throw error
}


// function SignalError(target, message) {
//   if (LogErrors) { ErrorLog.push(`${target}: ${message}`) }
//
//   if (HandleErrorsQuietly) {
//     console.warn(message) // eslint-disable-line no-console
//   } else {
//     const error = new Error(message)
//     error.name = "Purple Carrot Error"
//     error.target = target
//     throw error
//   }
//   return null
// }




// function ImproperMethodHandlerError(target) {
//   SignalError(target[$RIND], "Can't reuse same handler function for different types of methods!!")
// }

function DisallowedAssignmentError(target, property, setter) {
  SignalError(target, `Assignment to property '${property}' is not allowed, use '${setter}' method instead!!`)
}


function UnnamedLoaderError(target) {
  SignalError(target, "Assigner function must be named!!")
}

function DirectAssignmentFromOutsideError(target) {
  SignalError(target, "Direct assignment is not allowed to the outside of an object, use a method instead!!")
}

function AssignmentOfUndefinedError(target) {
  SignalError(target, "Assignment of undefined is forbidden, use null instead!")
}

function PrivateAccessFromOutsideError(target, selector) {
  SignalError(target, `Access to private property '${selector}' from outside of an object is forbidden!!`)
}

function UnknownMethodToAliasError(target, selector) {
  SignalError(target, `Can't find method '${selector}' to alias!!`)
}
