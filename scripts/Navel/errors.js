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
  SignalError(target[$RIND], "Direct assignment is not allowed from the outside of an object, use a method instead!!")
}

function PrivateAccessFromOutsideError(target, selector) {
  SignalError(target[$RIND], `Access to private property '${AsName(selector)}' from outside of an object is forbidden!!`)
}

function DisallowedDeleteError(target, selector) {
  SignalError(target[$RIND], `Delete of property '${AsName(selector)}' is not allowed!!`)
}

function DisallowedAssignmentError(target, selector, setter) {
  SignalError(target[$RIND], `Assignment of property '${AsName(selector)}' is not allowed, use '${setter}' method instead!!`)
}

function UnnamedFuncError(target, func) {
  SignalError(target[$RIND], `${func} function must be named!!`)
}

function AssignmentOfUndefinedError(target, selector) {
  SignalError(target[$RIND], `Assignment of undefined to property '${AsName(selector)}' is forbidden, use null instead!!`)
}

function DetectedInnerError(target, value) {
  SignalError(target[$RIND], `On attempted assignment, detected that you forgot to pass the 'this' with '$' for ${value.name}#${value.oid}!!`)
}

function InvalidCopyType(target) {
  SignalError(target, `Cannot use InAtPut with ${target.constructor.name}!!`)
}



function ImproperChangeToAncestryError(target) {
  SignalError(target[$RIND], "Cannot change supertype ancestry from one including Thing, or vis a versa!!")
}

function AttemptedChangeOfAncestryOfPermeableTypeError(target) {
  SignalError(target[$RIND], `Cannot change supertypes of permeable Type '${target.name}', change impermeable version instead!!`)
}

function DuplicateSupertypeError(target) {
  SignalError(target[$RIND], "Duplicate supertypes are not allowed!!")
}

function AssignerSetterError(target) {
  SignalError(target[$RIND], "Cannot define setter and assigner functions for the same property!!")
}
