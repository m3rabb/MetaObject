Tranya(function (
  $IS_IMPENETRABLE, $RIND, AsName, MarkFunc, Shared, _Shared
) {
  "use strict"

  const ErrorLog = []

  // eslint-disable-next-line
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

  Shared.errorLog    = ErrorLog
  Shared.signalError = MarkFunc(SignalError)

  Shared.setLogErrors = MarkFunc(function (bool) {
    if (!this[$IS_IMPENETRABLE]) { LogErrors = !!bool }
    return this[$RIND]
  })

  Shared.setHandleErrorsQuietly = MarkFunc(function (bool) {
    if (!this[$IS_IMPENETRABLE]) { HandleErrorsQuietly = !!bool }
    return this[$RIND]
  })


  // _Shared.ImproperMethodHandlerError = function (target) {
  //   SignalError(target[$RIND], "Can't reuse same handler function for different types of methods!!")
  // }


  _Shared.DetectedInnerError = function (target, value) {
    SignalError(target[$RIND], `On attempted assignment, detected that you forgot to pass the 'this' with '$' for ${value.name}#${value.oid}!!`)
  }


  _Shared.DirectAssignmentFromOutsideError = function (target) {
    SignalError(target[$RIND], "Direct assignment is not allowed from the outside of an object, use a method instead!!")
  }

  _Shared.AttemptSetOnSuperError = function (target) {
    SignalError(target[$RIND], "Setting properties via _super in forbidden!!")
  }

  _Shared.PrivateAccessFromOutsideError = function (target, selector) {
    SignalError(target[$RIND], `Access to private property '${AsName(selector)}' from outside of an object is forbidden!!`)
  }

  _Shared.DisallowedDeleteError = function (target, selector) {
    SignalError(target[$RIND], `Delete of property '${AsName(selector)}' is not allowed!!`)
  }

  _Shared.DisallowedAssignmentError = function (target, selector, setter) {
    SignalError(target[$RIND], `Assignment of property '${AsName(selector)}' is not allowed, use '${setter}' method instead!!`)
  }

  _Shared.UnnamedFuncError = function (target, func) {
    SignalError(target[$RIND], `${func} function must be named!!`)
  }

  _Shared.AssignmentOfUndefinedError = function (target, selector) {
    SignalError(target[$RIND], `Assignment of undefined to property '${AsName(selector)}' is forbidden, use null instead!!`)
  }

  _Shared.InvalidCopyTypeError = function (target) {
    SignalError(target, `Cannot use InAtPut with ${target.constructor.name}!!`)
  }



  _Shared.ImproperChangeToAncestryError = function (target) {
    SignalError(target[$RIND], "Cannot change supertype ancestry from one including Thing, or vis a versa!!")
  }

  _Shared.AttemptedChangeOfAncestryOfPermeableTypeError = function (target) {
    SignalError(target[$RIND], `Cannot change supertypes of permeable Type '${target.name}', change impermeable version instead!!`)
  }

  _Shared.DuplicateSupertypeError = function (target) {
    SignalError(target[$RIND], "Duplicate supertypes are not allowed!!")
  }

  _Shared.AssignerSetterError = function (target) {
    SignalError(target[$RIND], "Cannot define setter and assigner functions for the same property!!")
  }

  _Shared.AttemptInvertedFuncCopyError = function (func) {
    SignalError(func, "Cannot make a copy of a function with different mutability! Try AsRigid, AsFact, BeImmutable instead!!")
  }

  _Shared.AttemptToMakeLockedObjectPermeableError = function (target) {
    SignalError(target[$RIND], "Cannot make a locked object ${target} permeable!!")
  }

})



/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
