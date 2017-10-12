HandAxe(function (
  $BLANKER, $INNER, $IS_INNER, $OUTER, $PULP, $RIND, IMMUTABLE,
  _DURABLES,
  BasicSetInvisibly, FreezeSurface, GetDurables, InterMap,
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
      durables = _$source[_DURABLES] || GetDurables(_$source)
      if (!_$target[_DURABLES]) { _$target[_DURABLES] = durables }

      next = durables.length
      while (next--) {
        selector = durables[next]
        if (selector === exceptSelector_) { continue }

        value = _$source[selector]
        if (selector[0] !== "_") {  // public selector
          $target[selector] = (value === source) ? (value = target) : value
        }                           // private selector
        else { value = _CopyProperty(value, asImmutable, visited, context) }

        _$target[selector] = value
      }
    }

    const _postInit    = _$target._postInit
    const immutability = (asImmutable !== undefined) ?
      asImmutable : _$source[IMMUTABLE] || false

    if (_postInit) {
      const result = _postInit.call(_target)
      if (result !== _target && result !== undefined) {
        return immutability ? result.beImmutable : result
      }
    }

    if (immutability) { $target[IMMUTABLE] = _$target[IMMUTABLE] = true }

    return _$target
  }


  function NormalizeCopyArgs(args) {
    // args --> asImmutable_, visited_, context_
    var next, a, imm, map, ctx
    next = 0
    a = args[next]
    if (a.constructor === Object) {
      return [args.asImmutable, args.visited, args.context]
    }
    if (a == null || typeof a === "boolean")    { imm = a; a = args[++next] }
    if (a == null || a.constructor === WeakMap) { map = a; a = args[++next] }
    ctx = a
    return [imm, map, ctx]
  }


  const GenericCopyHandler = function copy(asImmutable_, visited_, context_) {
    var traversed, context
    const optionals = NormalizeCopyArgs(asImmutable_, visited_, context_)
    const visited   = optionals[1]

    if (visited && (traversed = visited.get(this))) { return traversed }
    if (this[IMMUTABLE] && optionals[0] !== false) {
      // When the value has an id, we always want the same value
      if (this.id != null)                               { return this }
      context = optionals[2]
      if (!context || this.context === context)          { return this }
    }

    return _CopyObject(this, ...optionals)
  }


  // Note: The _CopyObject is only called AFTER confirming that the source
  //       is NOT a fact!!! ***
  function _CopyObject(source, asImmutable, visited, context) {
    var target, next, value, selector, durables
    const immutability = (asImmutable !== undefined) ?
      asImmutable : source[IMMUTABLE] ? true : false

    visited = visited || new WeakMap()

    switch (source.constructor) {
      case WeakMap : return source
      case WeakSet : return source

      default : // Custom Object
        if ((target = source.copy)) {
          if (target !== GenericCopyHandler) {
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

        durables = source[_DURABLES] || GetDurables(source)
        if (immutability && !target[_DURABLES]) { target[_DURABLES] = durables }

        next = durables.length
        while (next--) {
          selector         = durables[next]
          value            = source[selector]
          target[selector] = _CopyProperty(value, asImmutable, visited, context)
        }
      break

      case Array :
        visited.set(source, (target = [])) // Handles cyclic objects
        next = source.length

        while (next--) {
          value        = source[next]
          target[next] = _CopyProperty(value, asImmutable, visited, context)
        }
      break

      case Map :
        visited.set(source, (target = new Map())) // Handles cyclic objects

        source.forEach((value, key) => {
          const nextKey   = _CopyProperty(key  , asImmutable, visited, context)
          const nextValue = _CopyProperty(value, asImmutable, visited, context)
          target.set(nextKey, nextValue)
        })
      break

      case Set :
        visited.set(source, (target = new Set())) // Handles cyclic objects

        source.forEach((value) => {
          const nextValue = _CopyProperty(value, asImmutable, visited, context)
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
    var keys, key, values, value, next, nextKey, nextValue, selector, durables

    visited = visited || new WeakMap()
    visited.set(target, target)

    switch (target.constructor) {
      case WeakMap : return target
      case WeakSet : return target

      default :
        durables = target[_DURABLES] ||
          (target[_DURABLES] = GetDurables(target))

        next = durables.length
        while (next--) {
          selector         = durables[next]
          value            = target[selector]
          target[selector] = ValueAsFact(value, inPlace, visited)
        }
      break

      case Array :
        next = target.length

        while (next--) {
          value            = target[next]
          target[selector] = ValueAsFact(value, inPlace, visited)
        }
      break

      case Map :
        keys = target.keys()

        for (key of keys) {
          value     = target.get(key)
          nextKey   = ValueAsFact(key  , inPlace, visited)
          nextValue = ValueAsFact(value, inPlace, visited)

          if (nextKey !== key) { target.delete(key) }
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
      _$Copy(   _$value, true, visited__)[$RIND] :
      _CopyObject(value, true, visited__)
  }



  function CopyProperty(value, asImmutable_, visited_, context_) {
    const optionals = NormalizeCopyArgs(asImmutable_, visited_, context_)
    return _CopyProperty(value, ...optionals)
  }

  function _CopyProperty(value, asImmutable, visited, context) {
    var traversed, _$value, _value

    switch(typeof value) {
      case "function" :
           // Answer value if it's an ordinary function
        if ((_$value = InterMap.get(value)) === undefined)    { return value }
        if ((traversed = visited.get(value)))             { return traversed }
        _value = _$value[$PULP]
           // When the value has an id, we always want the same value
        if (_value.id != null)                                { return value }
        if (_$value[IMMUTABLE]) {
          if (!context || _value.context === context)         { return value }
          // When the context is different, it's properties may need to be
          // created from the corresponding types in the new context.
          // But if it used _BasicSetImmutable (e.g. Definitions), then it
          // only refs primitive values, so no need to make a new copy.
          if (_$value._setImmutable === _BasicSetImmutable)   { return value }
        }
        return _$Copy(_$value, asImmutable, visited, context)[$RIND]

      case "object" :
        if (value === null)                                   { return value }
        if ((traversed = visited.get(value)))             { return traversed }
        if (value.id != null)                                 { return value }
        if (value[IMMUTABLE]) {
          if (context === undefined)                          { return value }
          if ((_$value = InterMap.get(value))) {
            if (_$value[$PULP].context === context)           { return value }
            if (_$value._setImmutable === _BasicSetImmutable) { return value }
          }
        }
        else { _$value = InterMap.get(value) }

        return (_$value) ?
          _$Copy(   _$value, asImmutable, visited, context)[$RIND] :
          _CopyObject(value, asImmutable, visited, context)

      default : return value
    }
  }


  // asImmutable
  // true       make immutable copy
  // false      make mutable copy
  // undefined  make copy of same mutability as the receiver

  function CopyValue(value, asImmutable_, visited_, context_) {
    const optionals = NormalizeCopyArgs(asImmutable_, visited_, context_)
    return _CopyValue(value, ...optionals)
  }

  function ValueAsCopy(value) { return _CopyValue(value) }


  function _CopyValue(value, asImmutable, visited, context) {
    var traversed, _$value, _value

    switch (typeof value) {
      case "function" :
           // Answer value if it's an ordinary function
        if ((_$value = InterMap.get(value)) === undefined)    { return value }
        if (visited && (traversed = visited.get(value)))  { return traversed }
        if (_$value[IMMUTABLE] && asImmutable !== false) {
          _value = _$value[$PULP]
          // When the value has an id, we always want the same value
          if (_value.id != null)                              { return value }
          if (!context || _value.context === context)         { return value }
          // When the context is different, it's properties may need to be
          // created from the corresponding types in the new context.
          // But if it used _BasicSetImmutable (e.g. Definitions), then it
          // only refs primitive values, so no need to make a new copy.
          if (_$value._setImmutable === _BasicSetImmutable)   { return value }
        }
        return _$Copy(_$value, asImmutable, visited, context)[$RIND]

      case "object"   :
        if (value === null)                                   { return value }
        if (visited && (traversed = visited.get(value)))  { return traversed }
        if (value[IMMUTABLE] && asImmutable !== false) {
          // When the value has an id, we always want the same value
          if (value.id != null)                               { return value }
          if (context === undefined)                          { return value }
          if ((_$value = InterMap.get(value))) {
            if (_$value[$PULP].context === context)           { return value }
            if (_$value._setImmutable === _BasicSetImmutable) { return value }
          }
        }
        else { _$value = InterMap.get(value) }

        return (_$value) ?
          _$Copy(   _$value, asImmutable, visited, context)[$RIND] :
          _CopyObject(value, asImmutable, visited, context)

        default : return value
    }
  }

  function ValueAsImmutable(value) {
    switch (typeof value) {
      case "function" :
        return value[IMMUTABLE] ? value :
          value.asImmutable || InvertedFuncCopyError(value)

      case "object"   :
        return (value === null) ? null : value.asImmutable ||
          (value[IMMUTABLE] ? value : _CopyObject(value, true))

      default : return value
    }
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
  _Shared._CopyObject             = _CopyObject
  _Shared._CopyProperty           = _CopyProperty
  _Shared._CopyValue              = _CopyValue
  _Shared.NormalizeCopyArgs       = NormalizeCopyArgs

  Shared.genericCopyHandler       = KnowFunc(GenericCopyHandler)
  Shared.valueAsCopy              = KnowFunc(ValueAsCopy)
  Shared.valueAsFact              = KnowFunc(ValueAsFact)
  Shared.copyProperty             = KnowFunc(CopyProperty)
  Shared.copyValue                = KnowFunc(CopyValue)
  Shared.valueAsImmutable         = KnowFunc(ValueAsImmutable)
  Shared.valueBeImmutable         = KnowFunc(ValueBeImmutable)

})



/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

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
