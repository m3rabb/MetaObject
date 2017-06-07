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



function DirectAssignmentFromOutsideError(target) {
  SignalError(target, "Direct assignment is not allowed to the outside of an object, use a method instead!!")
}

function PrivateAccessFromOutsideError(target, property) {
  SignalError(target, `Access to private property '${property}' from outside of an object is forbidden!!`)
}

function ImproperChangeToAncestryError(target) {
  SignalError(target, "Cannot change supertype ancestry from one including Thing, or vis a versa!!")
}

function AttemptedChangeOfAncestryOfPermeableTypeError(target) {
  SignalError(target, `Cannot change supertypes of permeable Type '${target.name}', change impermeable version instead!!`)
}
