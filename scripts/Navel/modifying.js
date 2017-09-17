ObjectSauce(function (
  $BLANKER, $INNER, $IS_INNER, $OUTER, $OUTER_WRAPPER, $PULP, $RIND,
  DISGUISE_PULP, IS_IMMUTABLE, PROOF, _DURABLES,
  ASSIGNER_FUNC, BLANKER_FUNC, HANDLER_FUNC, INNER_FUNC, OUTER_FUNC,
  SAFE_FUNC, TAMED_FUNC,
  Frost, InterMap, IsFact, MarkFunc, OwnNames, SetInvisibly, SpawnFrom, RootOf,
  _BasicSetImmutable,
  AssignmentOfUndefinedError, AttemptInvertedFuncCopyError, DetectedInnerError,
  OSauce, _OSauce
) {
  "use strict"


  function FindAndSetDurables(_$target) {
    const durables = OwnNames(_$target)
    durables[IS_IMMUTABLE] = true
    return (_$target[_DURABLES] = Frost(durables))
  }


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
    return MarkAndSetFuncImmutable(func, TAMED_FUNC)
  }


  function InSetProperty(_$target, selector, value, _target) {
    if (selector[0] !== "_") {    // Public selector
      var _$value, writeOuter
      const $target = _$target[$OUTER]

      writeOuter = !_$target[IS_IMMUTABLE]

      switch (typeof value) {
        case "undefined" :
          // Storing undefined is prohibited!
          return AssignmentOfUndefinedError(_target, selector)

        case "object" :
               if (value === null)                 {        /* NOP */        }
          else if (value[$IS_INNER] === PROOF)     {
            if (value === _target)                 { value = _$target[$RIND] }
           // Safety check: detect failure to use 'this.$' elsewhere.
            else                 { return DetectedInnerError(_target, value) }
          }
          else if (value[IS_IMMUTABLE])            {        /* NOP */        }
          else if (value.id != null)               {        /* NOP */        }
          else if (value === _$target[$RIND])      {        /* NOP */        }
          else {   value = (_$value = InterMap.get(value)) ?
                     _$Copy(_$value, true)[$RIND] : ObjectCopy(value, true)  }
          break

        case "function" : // LOOK: will catch Type things!!!
          // Note: Checking for value.constructor is inadequate to prevent func spoofing
          switch (InterMap.get(value)) {
            case DISGUISE_PULP :
              // Safety check: detect failure to a type's 'this.$' elsewhere.
              return DetectedInnerError(_target, value)

            case INNER_FUNC    :
              if (writeOuter) { $target[selector] = value[$OUTER_WRAPPER] }
              writeOuter = false
              break

            case undefined     : // New unknown untrusted function to be wrapped.
            case HANDLER_FUNC  :
            case ASSIGNER_FUNC :
              value = AsTameFunc(value)
              // break omitted

            case OUTER_FUNC    :
            case TAMED_FUNC    :
            case SAFE_FUNC     :
            case BLANKER_FUNC  :
            default            : // value is a type's $rind, etc
              break
          }
          break
      }
      if (writeOuter) { $target[selector] = value }
    }
    else if (value && value[$IS_INNER] === PROOF && value[$PULP] !== _target) {
      // Safety check: detect failure to use 'this.$' elsewhere.
      return DetectedInnerError(_target, value)
    }

    return (_$target[selector] = value)
  }



  // Still need to ensure ownMethods are copied a well!!!
  function _$Copy(_$source, asImmutable, visited, context, exceptSelector_) {
    var newType, durables, selector, next, value
    const source  = _$source[$RIND]
    const blanker = (context && (newType = context[_$source.type.name])) ?
      InterMap.get(newType)._blanker : _$source[$BLANKER]

    const _$target   = new blanker(_$source)
    const  $target   = _$target[$OUTER]
    const  _target   = _$target[$PULP]
    const   target   = _$target[$RIND]
    const _initFrom_ = _$target._initFrom_

    visited = visited || new WeakMap()
    visited.set(source, target) // to manage cyclic objects

    if (_$source[$OUTER].this) { SetInvisibly($target, "this", _target) }

    if (_initFrom_) {
     _initFrom_.call(_target, _$source[$PULP], asImmutable, visited, context)
    }
    else {
      durables = _$source[_DURABLES] || FindAndSetDurables(_$source)
      next      = durables.length

      while (next--) {
        selector = durables[next]
        if (selector === exceptSelector_) { continue }

        value = _$source[selector]
        if (selector[0] !== "_") {  // public selector
          $target[selector] = (value === source) ? (value = target) : value
        }                           // private selector
        else { value = ValueAsNext(value, asImmutable, visited, context) }

        _$target[selector] = value
      }

      _$target[_DURABLES] = durables
    }

    const immutability = (asImmutable !== undefined) ?
      asImmutable : _$source[IS_IMMUTABLE] || false

    if (_$target._postInit) {
      const result = _$target._postInit.call(_target)
      if (result !== undefined && result !== _target) {
        return immutability ? result.asImmutable : result
      }
    }

    if (immutability) {
      $target[IS_IMMUTABLE] = _$target[IS_IMMUTABLE] = true
      Frost($target)
    }

    return _$target
  }


  const ReliableObjectCopy = function copy(visited_asImmutable_, visited_, context__) {
    const [asImmutable, visited, context] =
      (typeof visited_asImmutable_ === "object") ?
        [undefined, visited_asImmutable_, visited_ ] :
        [visited_asImmutable_,  visited_, context__]

    return (this[IS_IMMUTABLE] && asImmutable !== false) ?
      this : ObjectCopy(this, asImmutable, visited, context)
  }


  // Note: The ObjectCopy is only called AFTER confirming that the source
  //       is NOT a fact!!! ***
  function ObjectCopy(source, asImmutable, visited, context) {
    var target, next, value, property, properties
    visited = visited || new WeakMap()

    const immutability = (asImmutable !== undefined) ?
      asImmutable : source[IS_IMMUTABLE] || false

    switch (source.constructor) {
      case WeakMap : return source
      case WeakSet : return source

      default : // Custom Object
        if ((target = source.copy)) {
          if (target !== ReliableObjectCopy) {
            // If copy method was a getter or precopied object
            if (typeof target === "function") { target = source.copy(visited) }

            // ensure logging, just in case receiver's copy method didn't
            visited.set(source, target)

            return (immutability && target !== source) ?
              ObjectSetImmutable(target) : target
            // The 2nd check is somewhat paranoid, but we don't want to mess up
            // an outside object by making it immutable, if and when it returns
            // itself as a 'copy'.
          }
        }
        else if (source.id === null || source[_DURABLES]) {
          // Only copy ordinary custom object with expressed intention
        }
        else { return source } // Don't copy ordinary custom objects

        target = SpawnFrom(RootOf(source))
      // break omitted

      case Object :
        visited.set(source, (target = target || {})) // Handles cyclic objects

        properties = source[_DURABLES] || FindAndSetDurables(source)
        if (!target[_DURABLES]) { target[_DURABLES] = properties }
        next = properties.length

        while (next--) {
          property         = properties[next]
          value            = source[property]
          target[property] = ValueAsNext(value, asImmutable, visited, context)
        }
      break

      case Array :
        visited.set(source, (target = [])) // Handles cyclic objects
        next = source.length

        while (next--) {
          value        = source[next]
          target[next] = ValueAsNext(value, asImmutable, visited, context)
        }
      break

      case Map :
        visited.set(source, (target = new Map())) // Handles cyclic objects

        source.forEach((value, key) => {
          var nextKey   = ValueAsNext(key  , asImmutable, visited, context)
          var nextValue = ValueAsNext(value, asImmutable, visited, context)
          target.set(nextKey, nextValue)
        })
      break

      case Set :
        visited.set(source, (target = new Set())) // Handles cyclic objects

        source.forEach((value) => {
          var nextValue = ValueAsNext(value, asImmutable, visited, context)
          target.add(nextValue)
        })
      break
    }

    if (immutability) {
      target[IS_IMMUTABLE] = true
      Frost(target)
    }
    return target
  }


  function ObjectSetImmutable(target, inPlace, visited) {
    var keys, key, values, value, next, nextKey, nextValue, properties, property

    visited = visited || new WeakMap()
    visited.set(target, target)

    switch (target.constructor) {
      case WeakMap : return target
      case WeakSet : return target

      default :
        properties = target[_DURABLES] || FindAndSetDurables(target)
        next       = properties.length

        while (next--) {
          property  = properties[next]
          value     = target[property]
          nextValue = ValueAsFact(value, inPlace, visited)
          if (nextValue === value) { continue }
          target[property] = nextValue
        }
      break

      case Array :
        next = target.length

        while (next--) {
          value     = target[next]
          nextValue = ValueAsFact(value, inPlace, visited)
          if (nextValue === value) { continue }
          target[next] = nextValue
        }
      break

      case Map :
        keys = target.keys()

        for (key of keys) {
          value     = target.get(key)
          nextKey   = ValueAsFact(key  , inPlace, visited)
          nextValue = ValueAsFact(value, inPlace, visited)

          if (nextKey !== key) {
            target.delete(key)
          }
          else if (nextValue === value) { continue }
          target.set(nextKey, nextValue)
        }
      break

      case Set :
        values = target.values()

        for (value of values) {
          nextValue = ValueAsFact(value, inPlace, visited)

          if (nextValue === value) { continue }
          target.delete(value)
          target.add(nextValue)
        }
      break
    }

    target[IS_IMMUTABLE] = true
    return Frost(target)
  }


  function MarkAndSetFuncImmutable(func, marker) {
    if (InterMap.get(func)) { return func }
    func[IS_IMMUTABLE] = true
    InterMap.set(func, marker)
    Frost(func.prototype)
    return Frost(func)
  }

  function SetFuncImmutable(func) {
    func[IS_IMMUTABLE] = true
    Frost(func.prototype)
    return Frost(func)
  }



  function ValueAsFact(value, inPlace, visited) {
    // Next line properly handlers contexts and types since they always have id.
    if (typeof value !== "object") { return value }
    if (value === null)            { return value }
    if (value[IS_IMMUTABLE])       { return value }
    if (value.id != null)          { return value }
    if (visited.get(value))        { return value }

    const _$value = InterMap.get(value)
    if (inPlace) {
      if (_$value) {
        _$value._setImmutable.call(_$value[$PULP], true, visited)
        return _$value[$RIND]
      }
      return ObjectSetImmutable(value, true, visited)
    }
    return (_$value) ?
      _$Copy(  _$value, true, visited)[$RIND] :
      ObjectCopy(value, true, visited)
  }



  function ValueAsNext(value, asImmutable, visited, context) {
    var traversed, _$value

    switch(typeof value) {
      default         : return value
      case "function" : if (!value[$RIND])  { return value } else { break }
      case "object"   : if (value === null) { return null  } else { break }
    }

    if ((traversed = visited.get(value)))              { return traversed }
    if (value[IS_IMMUTABLE]) {
      if (!context)                                      { return value }
      if (value.id != null)                              { return value }

      // If we're copying properties to a new object in a new context, but
      // the context is the same...
      if ((_$value = InterMap.get(value)) && context === _$value.context) {
        // ... and the tranya value is already in that context ...
            // ... and the value is simple in that it only references primitive
            // values, such that it only needs to use _BasicSetImmutable
            // (e.g. Definitions), then simply answer the immutable value.
        if (_$value._setImmutable === _BasicSetImmutable) { return value }
      }
    }
    else {
      if (value.id != null)                               { return value }
      _$value = InterMap.get(value)
    }

    return (_$value) ?
      _$Copy(  _$value, asImmutable, visited, context)[$RIND] :
      ObjectCopy(value, asImmutable, visited, context)
  }


    // asImmutable
    // true       make immutable copy
    // false      make mutable copy
    // undefined  make copy of same mutability as the receiver

  function ValueCopy(value, visited_asImmutable_, visited_, context__) {
    var asImmutable, visited, context, _$value
    ;[asImmutable, visited, context] =
      (typeof visited_asImmutable_ === "object") ?
        [undefined           , visited_asImmutable_, visited_ ] :
        [visited_asImmutable_, visited_            , context__]

    switch (typeof value) {
      case "function" :
        if (value[$RIND]) { return value.copy(asImmutable, visited, context) }
        if (value[IS_IMMUTABLE] === asImmutable) { return value }
        if (asImmutable === undefined)           { return value }
        return (context) ? value : AttemptInvertedFuncCopyError(value)

      case "object"   :
        if (value === null) { return value }
        if (!context) {
          if (value[IS_IMMUTABLE] && asImmutable !== false) { return value }
        }

        return ((_$value = InterMap.get(value))) ?
          _$Copy(  _$value, asImmutable, visited, context)[$RIND] :
          ObjectCopy(value, asImmutable, visited, context)
    }
    return value
  }


  function ValueAsImmutable(value) {
    switch (typeof value) {
      case "function" :
        return value[IS_IMMUTABLE] ? value :
          value.asImmutable || AttemptInvertedFuncCopyError(value)

      case "object"   :
        return value && value.asImmutable ||
          (value[IS_IMMUTABLE] ? value : ObjectCopy(value, true))
    }
    return value
  }

  function ValueBeImmutable(value, inPlace_) {
    var _$value
    switch (typeof value) {
      case "function" :
        return value.beImmutable ||
          (value[IS_IMMUTABLE] ? value : SetFuncImmutable(value))

      case "object"   :
        return value[IS_IMMUTABLE] ? value :
          ((_$value = InterMap.get(value))) ?
            _$value._setImmutable.call(_$value[$PULP], inPlace_)[$RIND] :
            ObjectSetImmutable(value, inPlace_)
    }
    return value
  }

  function CrudeAsImmutable(object) {
    if (object[IS_IMMUTABLE]) { return object }
    object[IS_IMMUTABLE] = true
    return Frost(object)
  }


  _OSauce.InSetProperty           = InSetProperty
  _OSauce._$Copy                  = _$Copy
  _OSauce.ObjectCopy              = ObjectCopy
  _OSauce.MarkAndSetFuncImmutable = MarkAndSetFuncImmutable
  _OSauce.ObjectSetImmutable      = ObjectSetImmutable  // Necessary???s

  OSauce.findAndSetDurables       = MarkFunc(FindAndSetDurables)
  OSauce.reliableObjectCopy       = MarkFunc(ReliableObjectCopy)
  OSauce.valueAsNext              = MarkFunc(ValueAsNext)
  OSauce.valueAsFact              = MarkFunc(ValueAsFact)
  OSauce.valueCopy                = MarkFunc(ValueCopy)
  OSauce.valueAsImmutable         = MarkFunc(ValueAsImmutable)
  OSauce.valueBeImmutable         = MarkFunc(ValueBeImmutable)
  OSauce.CrudeAsImmutable         = MarkFunc(CrudeAsImmutable)

})



/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/




// function InAtPut(source, property, value) {
//   var isImmutable = source[IS_IMMUTABLE]
//   var target = isImmutable ? ObjectCopy(source) : source
//
//   switch (source.constructor) {
//     case WeakSet :
//     case Set :
//       return InvalidCopyTypeError(source)
//
//     case WeakMap :
//       if (isImmutable) { return InvalidCopyTypeError(source) }
//       // break omitted
//
//     case Map :
//       target.set(property, value)
//       break
//
//     default :
//       target[property] = value
//       break
//   }
//
//   if (source[IS_IMMUTABLE]) {
//     target[IS_IMMUTABLE] = true
//     Frost(target)
//   }
//   return target
// }
//
// function CopyAtPut(source, property, value) {
//   var target = ObjectCopy(source)
//
//   switch (source.constructor) {
//     case WeakMap :
//     case WeakSet :
//     case Set :
//       return InvalidCopyTypeError(source)
//
//     case Map :
//       target.set(property, value)
//       break
//
//     default :
//       target[property] = value
//       break
//   }
//
//   if (source[IS_IMMUTABLE]) {
//     target[IS_IMMUTABLE] = true
//     Frost(target)
//   }
//   return target
// }
