HandAxe(function (
  $BLANKER, $INNER, $IS_INNER, $OUTER, $PULP, $RIND, IMMUTABLE,
  _DURABLES,
  BasicSetInvisibly, FindAndSetDurables, FindDurables, FreezeSurface, InterMap,
  KnowFunc, SetFuncImmutable, SpawnFrom, RootOf, _BasicSetImmutable,
  AssignmentOfUndefinedError, InvertedFuncCopyError,
  Shared, _Shared
) {
  "use strict"



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

    if (_$source[$OUTER].this) { BasicSetInvisibly($target, "this", _target) }

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
        else { value = _ValueAsNext(value, asImmutable, visited, context) }

        _$target[selector] = value
      }

      _$target[_DURABLES] = durables
    }

    const immutability = (asImmutable !== undefined) ?
      asImmutable : _$source[IMMUTABLE] || false

    if (_$target._postInit) {
      const result = _$target._postInit.call(_target)
      if (result !== _target && result !== undefined) {
        return immutability ? result.asImmutable : result
      }
    }

    if (immutability) {
      $target[IMMUTABLE] = _$target[IMMUTABLE] = true
    }

    return _$target
  }


  const ReliableObjectCopy = function copy(visited_asImmutable_, visited_, context__) {
    const [asImmutable, visited, context] =
      (typeof visited_asImmutable_ === "object") ?
        [undefined, visited_asImmutable_, visited_ ] :
        [visited_asImmutable_,  visited_, context__]

    return (this[IMMUTABLE] && asImmutable !== false) ?
      this : ObjectCopy(this, asImmutable, visited, context)
  }


  // Note: The ObjectCopy is only called AFTER confirming that the source
  //       is NOT a fact!!! ***
  function ObjectCopy(source, asImmutable, visited, context) {
    var target, next, value, selector, selectors
    visited = visited || new WeakMap()

    const immutability = (asImmutable !== undefined) ?
      asImmutable : source[IMMUTABLE] ? true : false

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

        selectors = source[_DURABLES] || FindDurables(source)
        if (immutability && !target[_DURABLES]) {
          target[_DURABLES] = selectors
        }
        next = selectors.length

        while (next--) {
          selector         = selectors[next]
          value            = source[selector]
          target[selector] = _ValueAsNext(value, asImmutable, visited, context)
        }
      break

      case Array :
        visited.set(source, (target = [])) // Handles cyclic objects
        next = source.length

        while (next--) {
          value        = source[next]
          target[next] = _ValueAsNext(value, asImmutable, visited, context)
        }
      break

      case Map :
        visited.set(source, (target = new Map())) // Handles cyclic objects

        source.forEach((value, key) => {
          var nextKey   = _ValueAsNext(key  , asImmutable, visited, context)
          var nextValue = _ValueAsNext(value, asImmutable, visited, context)
          target.set(nextKey, nextValue)
        })
      break

      case Set :
        visited.set(source, (target = new Set())) // Handles cyclic objects

        source.forEach((value) => {
          var nextValue = _ValueAsNext(value, asImmutable, visited, context)
          target.add(nextValue)
        })
      break
    }

    if (immutability) {
      target[IMMUTABLE] = true
      FreezeSurface(target)
    }
    return target
  }


  function ObjectSetImmutable(target, inPlace, visited) {
    var keys, key, values, value, next, nextKey, nextValue, selectors, selector

    visited = visited || new WeakMap()
    visited.set(target, target)

    switch (target.constructor) {
      case WeakMap : return target
      case WeakSet : return target

      default :
        selectors = target[_DURABLES] || FindAndSetDurables(target)
        next       = selectors.length

        while (next--) {
          selector  = selectors[next]
          value     = target[selector]
          nextValue = ValueAsFact(value, inPlace, visited)
          if (nextValue === value) { continue }
          target[selector] = nextValue
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

    target[IMMUTABLE] = true
    return FreezeSurface(target)
  }



  function ValueAsFact(value, inPlace_, visited__) {
    // Next line properly handlers contexts and types since they always have id.
    if (typeof value !== "object")         { return value }
    if (value === null)                    { return value }
    if (value[IMMUTABLE])                  { return value }
    if (value.id != null)                  { return value }
    if (visited__ && visited__.get(value)) { return value }

    const _$value = InterMap.get(value)
    if (inPlace_) {
      if (_$value) {
        _$value._setImmutable.call(_$value[$PULP], true, visited__)
        return _$value[$RIND]
      }
      return ObjectSetImmutable(value, true, visited__)
    }
    return (_$value) ?
      _$Copy(  _$value, true, visited__)[$RIND] :
      ObjectCopy(value, true, visited__)
  }


  function ValueAsNext(value, visited_asImmutable_, visited_, context__) {
    const [asImmutable, visited, context] =
      (typeof visited_asImmutable_ === "object") ?
        [undefined           , visited_asImmutable_, visited_ ] :
        [visited_asImmutable_, visited_            , context__]
    return _ValueAsNext(value, asImmutable, visited, context)
  }

  function _ValueAsNext(value, asImmutable, visited, context) {
    var traversed, _$value, _value

    switch(typeof value) {
      default : return value

      case "function" :
        if ((_$value = InterMap.get(value)) === undefined)  { return value }
        if ((traversed = visited.get(value)))           { return traversed }

        _value = _$value[$PULP]
        if (_value.id != null)                              { return value }
        if (_$value[IMMUTABLE]) {
          if (!context || _value.context === context)       { return value }
          // If the value is simple in that it only references primitive
          // values, such that it only needs to use _BasicSetImmutable
          // (e.g. Definitions), then simply answer the immutable value.
          if (_$value._setImmutable === _BasicSetImmutable) { return value }
        }
        return _$Copy(_$value, asImmutable, visited, context)[$RIND]

      case "object" :
        if (value === null)                                 { return value }
        if ((traversed = visited.get(value)))           { return traversed }
        if (value.id != null)                               { return value }
        if (value[IMMUTABLE]) {
          if (!context || value.context === context)        { return value }
          if ((_$value = InterMap.get(value))) {
            return (_$value._setImmutable === _BasicSetImmutable) ?
              value : _$Copy(_$value, asImmutable, visited, context)[$RIND]
          }
        }
        else if ((_$value = InterMap.get(value))) {
          return _$Copy(_$value, asImmutable, visited, context)[$RIND]
        }

        return ObjectCopy(value, asImmutable, visited, context)
    }
  }


  // asImmutable
  // true       make immutable copy
  // false      make mutable copy
  // undefined  make copy of same mutability as the receiver

  function ValueCopy(value, visited_asImmutable_, visited_, context__) {
    const [asImmutable, visited, context] =
      (typeof visited_asImmutable_ === "object") ?
        [undefined           , visited_asImmutable_, visited_ ] :
        [visited_asImmutable_, visited_            , context__]
    return _ValueCopy(value, asImmutable, visited, context)
  }

  function _ValueCopy(value, asImmutable, visited, context) {
    var _$value

    switch (typeof value) {
      case "function" :
        if ((_$value = InterMap.get(value))) {
          return _$value.copy.call(_$value[$PULP], asImmutable, visited, context)
        }
        if (value[IMMUTABLE] === asImmutable) { return value }
        if (asImmutable === undefined)        { return value }
        return (context) ? value : InvertedFuncCopyError(value)

      case "object"   :
        if (value === null) { return value }
        if (!context) {
          if (value[IMMUTABLE] && asImmutable !== false) { return value }
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
        return value[IMMUTABLE] ? value :
          value.asImmutable || InvertedFuncCopyError(value)

      case "object"   :
        return value && value.asImmutable ||
          (value[IMMUTABLE] ? value : ObjectCopy(value, true))
    }
    return value
  }

  function ValueBeImmutable(value, inPlace_) {
    var _$value
    switch (typeof value) {
      case "function" :
        return value.beImmutable ||
          (value[IMMUTABLE] ? value : SetFuncImmutable(value))

      case "object"   :
        return value[IMMUTABLE] ? value :
          ((_$value = InterMap.get(value))) ?
            _$value._setImmutable.call(_$value[$PULP], inPlace_)[$RIND] :
            ObjectSetImmutable(value, inPlace_)
    }
    return value
  }



  _Shared._$Copy                  = _$Copy
  _Shared.ObjectCopy              = ObjectCopy
  _Shared.ObjectSetImmutable      = ObjectSetImmutable  // Necessary???s
  _Shared._ValueAsNext            = _ValueAsNext
  _Shared._ValueCopy              = _ValueCopy

  Shared.reliableObjectCopy       = KnowFunc(ReliableObjectCopy)
  Shared.valueAsFact              = KnowFunc(ValueAsFact)
  Shared.valueAsNext              = KnowFunc(ValueAsNext)
  Shared.valueCopy                = KnowFunc(ValueCopy)
  Shared.valueAsImmutable         = KnowFunc(ValueAsImmutable)
  Shared.valueBeImmutable         = KnowFunc(ValueBeImmutable)

})



/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// function ValueAsNext(value, asImmutable, visited, context) {
//   var traversed, _$value
//
//   switch(typeof value) {
//     default         : return value
//     case "function" : if (!value[$RIND])  { return value } else { break }
//     case "object"   : if (value === null) { return null  } else { break }
//   }
//
//   if ((traversed = visited.get(value)))              { return traversed }
//   if (value[IMMUTABLE]) {
//     if (!context)                                      { return value }
//     if (value.id != null)                              { return value }
//
//     // If we're copying selectors to a new object in a new context, but
//     // the context is the same...
//     if ((_$value = InterMap.get(value)) && context === _$value.context) {
//       // ... and the tranya value is already in that context ...
//           // ... and the value is simple in that it only references primitive
//           // values, such that it only needs to use _BasicSetImmutable
//           // (e.g. Definitions), then simply answer the immutable value.
//       if (_$value._setImmutable === _BasicSetImmutable) { return value }
//     }
//   }
//   else {
//     if (value.id != null)                               { return value }
//     _$value = InterMap.get(value)
//   }
//
//   return (_$value) ?
//     _$Copy(  _$value, asImmutable, visited, context)[$RIND] :
//     ObjectCopy(value, asImmutable, visited, context)
// }


// function InAtPut(source, selector, value) {
//   var isImmutable = source[IMMUTABLE]
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
//       target.set(selector, value)
//       break
//
//     default :
//       target[selector] = value
//       break
//   }
//
//   if (source[IMMUTABLE]) {
//     target[IMMUTABLE] = true
//     FreezeSurface(target)
//   }
//   return target
// }
//
// function CopyAtPut(source, selector, value) {
//   var target = ObjectCopy(source)
//
//   switch (source.constructor) {
//     case WeakMap :
//     case WeakSet :
//     case Set :
//       return InvalidCopyTypeError(source)
//
//     case Map :
//       target.set(selector, value)
//       break
//
//     default :
//       target[selector] = value
//       break
//   }
//
//   if (source[IMMUTABLE]) {
//     target[IMMUTABLE] = true
//     FreezeSurface(target)
//   }
//   return target
// }
