const ReliableObjectCopy = function copy(visited_asImmutable_, visited_) {
  const [asImmutable, visited] = (typeof visited_asImmutable_ === "boolean") ?
    [visited_asImmutable_, visited_] : [undefined, visited_asImmutable_]
  return (this[IS_IMMUTABLE] && asImmutable !== false) ?
    this : CopyObject(this, asImmutable, visited)
}

// Note: The CopyObject is only called AFTER confirming that the source
//       is NOT a fact!!! ***
function CopyObject(source, asImmutable, visited = new WeakMap()) {
  var target, next, value, property, properties

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

          return (asImmutable && target !== source) ?
            SetImmutableObject(target) : target
          // The 2nd check is somewhat paranoid, but we don't want to mess up
          // an outside object by making it immutable, if and when it returns
          // itself as a 'copy'.
        }
      }
      else if (source.id === null || source[KNOWN_PROPERTIES]) {
        // Only copy ordinary custom object with expressed intention
      }
      else { return source } // Never copy ordinary custom objects

      target = SpawnFrom(RootOf(source))
    // break omitted

    case Object :
      visited.set(source, (target = target || {})) // Handles cyclic objects

      properties = source[KNOWN_PROPERTIES] || SetKnownProperties(source)
      if (!target[KNOWN_PROPERTIES]) { target[KNOWN_PROPERTIES] = properties }
      next = properties.length

      while (next--) {
        property = properties[next]
        value    = source[property]
        target[property] = (value === source) ?
          target : NextValue(value, asImmutable, visited)
      }
    break

    case Array :
      visited.set(source, (target = [])) // Handles cyclic objects
      next = source.length

      while (next--) {
        value = source[next]
        target[next] = (value === source) ?
          target : NextValue(value, asImmutable, visited)
      }
    break

    case Map :
      visited.set(source, (target = new Map())) // Handles cyclic objects

      source.forEach((value, key) => {
        var nextKey = (key === source) ?
          target : NextValue(key, asImmutable, visited)
        var nextValue = (value === source) ?
          target : NextValue(value, asImmutable, visited)

        target.set(nextKey, nextValue)
      })
    break

    case Set :
      visited.set(source, (target = new Set())) // Handles cyclic objects

      source.forEach((value) => {
        var nextValue = (value === source) ?
          target : NextValue(value, asImmutable, visited)
        target.add(nextValue)
      })
    break
  }

  if (asImmutable) {
    target[IS_IMMUTABLE] = true
    Frost(target)
  }
  return target
}


function NextValue(value, asImmutable, visited) {
  if (typeof value !== "object")        { return value     }
  if (value === null)                   { return value     }
  if (value[IS_IMMUTABLE])              { return value     }
  if (value.id != null)                 { return value     }
  if ((traversed = visited.get(value))) { return traversed }

  const $value = InterMap.get(value)

  return ($value) ?
    $Copy($value, asImmutable, visited)[$RIND] :
    CopyObject(value, asImmutable, visited)
}




function SetImmutableObject(target, inPlace, visited = new WeakMap()) {
  var keys, key, values, value, nextKey, nextValue, properties, property

  visited.set(target, target)

  switch (target.constructor) {
    case WeakMap : return target
    case WeakSet : return target

    default :
      properties = target[KNOWN_PROPERTIES] || SetKnownProperties(target)
      next       = properties.length

      while (next--) {
        property  = properties[next]
        value     = target[property]
        nextValue = SetImmutableValue(value, inPlace, visited)
        if (nextValue === value) { continue }
        target[property] = nextValue
      }
    break

    case Array :
      next = target.length

      while (next--) {
        value     = target[next]
        nextValue = SetImmutableValue(value, inPlace, visited)
        if (nextValue === value) { continue }
        target[next] = nextValue
      }
    break

    case Map :
      keys = target.keys()

      for (key of keys) {
        value     = target.get(key)
        nextKey   = SetImmutableValue(key  , inPlace, visited)
        nextValue = SetImmutableValue(value, inPlace, visited)

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
        nextValue = SetImmutableValue(value, inPlace, visited)

        if (nextValue === value) { continue }
        target.delete(value)
        target.add(nextValue)
      }
    break
  }

  target[IS_IMMUTABLE] = true
  return Frost(target)
}



function SetImmutableValue(value, inPlace, visited) {
  if (typeof value !== "object") { return value }
  if (value === null)            { return value }
  if (value[IS_IMMUTABLE])       { return value }
  if (value.id != null)          { return value }
  if (visited.get(value))        { return value }

  const $value = InterMap.get(value)
  if (inPlace) {
    if ($value) {
      $value[$PULP]._setImmutable(true, visited)
      return $value[$RIND]
    }
    return SetImmutableObject(value, true, visited)
  }
  return ($value) ?
    $Copy($value, true, visited)[$RIND] :
    CopyObject(value, true, visited)
}
