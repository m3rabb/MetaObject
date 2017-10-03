HandAxe(function (
  $BLANKER, $INNER, $IS_INNER, $OUTER, $OUTER_WRAPPER, $PULP, $RIND,
  DISGUISE_PULP, DISGUISE_RIND, IMMUTABLE, PROOF, SYMBOL_1ST_CHAR, _DURABLES,
  ASSIGNER_FUNC, BLANKER_FUNC, HANDLER_FUNC, INNER_FUNC,
  OUTER_FUNC, SAFE_FUNC, SUPER_FUNC, TAMED_FUNC,
  InterMap, KnowAndSetFuncImmutable, KnownFuncs, ObjectCopy, _$Copy,
  AssignmentOfUndefinedError, AssignmentToPrivateSymbolError,
  DetectedInnerError,
  _Shared
) {
  "use strict"


  const STANDARD_FUNC_MATCHER = /^function/

  function AsTameFunc(Func) {
    const name = `${Func.name}_$tamed`
    const func = STANDARD_FUNC_MATCHER.test(Func) ?
      {
        [name] : function (...args) {
          const receiver =
            (this != null && this[$IS_INNER] === PROOF) ? this[$RIND] : this
          return Func.apply(receiver, args)
        }
      }[name] :
      {
        [name] : function (...args) {
          const result = Func.apply(null, args)
          return (result != null && result[$IS_INNER] === PROOF) ?
            result[$RIND] : result
        }
      }[name]
    return KnowAndSetFuncImmutable(func, TAMED_FUNC)
  }



  function SetProperty(_$target, selector, value, isPublic) {
    var _$value

    if (isPublic) {
      const $target = _$target[$OUTER]

      switch (typeof value) {
        case "undefined" :
          // Storing undefined is prohibited!
          return AssignmentOfUndefinedError(_$target, selector)

        case "object" :
               if (value === null)                {        /* NOP */        }
          else if (value[$IS_INNER] === PROOF)    {
            if (value === _$target[$PULP])        { value = _$target[$RIND] }
           // Safety check: detect failure to use 'this.self' elsewhere.
            else { return DetectedInnerError(_$target, value) }
          }
          else if (value[IMMUTABLE])              {        /* NOP */        }
          else if (value.id != null)              {        /* NOP */        }
          else if (value === _$target[$RIND])     {        /* NOP */        }
          else {   value = (_$value = InterMap.get(value)) ?
                     _$Copy(_$value, true)[$RIND] : ObjectCopy(value, true) }
          break

        case "function" : // LOOK: will catch Type things!!!
          // Note: Checking for value.constructor is inadequate to prevent func spoofing
          switch (KnownFuncs.get(value)) {
            case DISGUISE_RIND :
            case SAFE_FUNC     :
            case OUTER_FUNC    :
            case TAMED_FUNC    :
            case BLANKER_FUNC  :
              break

            case DISGUISE_PULP :
              // Safety check: detect failure to use 'this.self' elsewhere.
              return DetectedInnerError(_$target, value)

            case INNER_FUNC    :
            case SUPER_FUNC    :
              // Revisit this if $OUTER_WRAPPER can hold NONE instead
              $target[selector] = value[$OUTER_WRAPPER]
              return (_$target[selector] = value)

            case undefined     : // New unknown untrusted function to be wrapped.
            case HANDLER_FUNC  :
            case ASSIGNER_FUNC :
            default :
              value = AsTameFunc(value)
              break
          }
          break
      }
      $target[selector] = value
    }
    else {
      if (value == null) {
        if (value === undefined) {
          return AssignmentOfUndefinedError(_$target, selector)
        }
      }
      else if (value[$IS_INNER] === PROOF && value !== _$target[$PULP]) {
        // Safety check: detect failure to use 'this.self' elsewhere.
        return DetectedInnerError(_$target, value)
      }
    }

    return (_$target[selector] = value)
  }


  _Shared.SetProperty = SetProperty

})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
