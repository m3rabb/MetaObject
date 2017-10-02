Tranya(function (
  $IS_IMPENETRABLE, $RIND, KnowFunc, ValueAsName, Shared, _Shared
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
  Shared.signalError = KnowFunc(SignalError)

  Shared.setLogErrors = KnowFunc(function (bool) {
    if (!this[$IS_IMPENETRABLE]) { LogErrors = !!bool }
    return this[$RIND]
  })

  Shared.setHandleErrorsQuietly = KnowFunc(function (bool) {
    if (!this[$IS_IMPENETRABLE]) { HandleErrorsQuietly = !!bool }
    return this[$RIND]
  })


  // _Shared.ImproperMethodHandlerError = function (target) {
  //   SignalError(target[$RIND], "Can't reuse same handler function for different types of methods!!")
  // }



  _Shared.GlazeError = function (_target) {
    SignalError(_target, "GlazeImmutable and GlaseAsImmutable can only be called on standard JS objects!!")
  }

  _Shared.DirectAssignmentFromOutsideError = function ($target) {
    SignalError($target, "Direct assignment is not allowed from the outside of an object, use a method instead!!")
  }

  _Shared.DeleteFromOutsideError = function ($target, selector) {
    SignalError($target, `Attempt to delete '${ValueAsName(selector)}' is not allowed from the outside of an object, use a method instead!!`)
  }

  _Shared.PrivateAccessError = function ($target, selector) {
    SignalError($target, `External access to private property '${ValueAsName(selector)}' is forbidden!!`)
  }

  _Shared.ChangeToImmutableThisError = function (_$target) {
    SignalError(_$target[$RIND], "Changes to an immutable object via 'this' is forbidden!! Perhaps the result of improperly using addValueMethod!!")
  }

  _Shared.DisallowedDeleteError = function (_$target, selector) {
    SignalError(_$target[$RIND], `Delete of property '${ValueAsName(selector)}' is not allowed!!`)
  }

  _Shared.AssignmentViaSuperError = function (target) {
    SignalError(target, "Setting properties via _super in forbidden!!")
  }



  // _Shared.UnknownPropertyError = function (target, selector) {
  //   SignalError(target[$RIND], `Receiver ${this.id} doesn't have a property: ${ValueAsName(selector)}!!`)
  // }

  _Shared.DisallowedAssignmentError = function (target, selector, setter) {
    SignalError(target[$RIND], `Assignment of property '${ValueAsName(selector)}' is not allowed, try '${setter}' method instead!!`)
  }

  _Shared.DetectedInnerError = function (target, value) {
    SignalError(target[$RIND], `On attempted assignment, detected that you forgot to pass the 'this.self' for ${value}!!`)
  }

  _Shared.UnnamedFuncError = function (target, func) {
    SignalError(target[$RIND], `${func} function must be named!!`)
  }

  _Shared.AssignmentOfUndefinedError = function (target, selector) {
    SignalError(target[$RIND], `Assignment of undefined to property '${ValueAsName(selector)}' is forbidden, use null instead!!`)
  }

  _Shared.InvalidCopyTypeError = function (target) {
    SignalError(target, `Cannot use InAtPut with ${target.constructor.name}!!`)
  }



  _Shared.ImproperChangeToAncestryError = function (target) {
    SignalError(target[$RIND], "Cannot change supertype ancestry from one including Thing, or vis a versa!!")
  }

  _Shared.AncestryOfPermeableTypeError = function (type) {
    SignalError(type[$RIND], `Cannot change supertypes of permeable Type '${type.name}', change impermeable version instead!!`)
  }

  _Shared.DuplicateSupertypeError = function (target) {
    SignalError(target[$RIND], "Duplicate supertypes are not allowed!!")
  }

  _Shared.AssignerSetterError = function (target) {
    SignalError(target[$RIND], "Cannot define setter and assigner functions for the same property!!")
  }

  _Shared.InvertedFuncCopyError = function (func) {
    SignalError(func, "Cannot make a copy of a function with different mutability! Try AsRigid, AsFact, BeImmutable instead!!")
  }

  _Shared.BecomePermeableError = function (target) {
    SignalError(target[$RIND], "Cannot make an impenetrable object ${target} permeable!!")
  }

})



/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
