function InAtPut(source, property, value) {
  var isImmutable = source[IS_IMMUTABLE]
  var target = isImmutable ? CopyObject(source) : source

  switch (source.constructor) {
    case WeakSet :
    case Set :
      return InvalidCopyType(source)

    case WeakMap :
      if (isImmutable) { return InvalidCopyType(source) }
      // break omitted

    case Map :
      target.set(property, value)
      break

    default :
      target[property] = value
      break
  }

  if (source[IS_IMMUTABLE]) {
    target[IS_IMMUTABLE] = true
    Frost(target)
  }
  return target
}

function CopyAtPut(source, property, value) {
  var target = CopyObject(source)

  switch (source.constructor) {
    case WeakMap :
    case WeakSet :
    case Set :
      return InvalidCopyType(source)

    case Map :
      target.set(property, value)
      break

    default :
      target[property] = value
      break
  }

  if (source[IS_IMMUTABLE]) {
    target[IS_IMMUTABLE] = true
    Frost(target)
  }
  return target
}

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
      else if (source.id === null || source[_DURABLES]) {
        // Only copy ordinary custom object with expressed intention
      }
      else { return source } // Never copy ordinary custom objects

      target = SpawnFrom(RootOf(source))
    // break omitted

    case Object :
      visited.set(source, (target = target || {})) // Handles cyclic objects

      properties = source[_DURABLES] || SetDurableProperties(source)
      if (!target[_DURABLES]) { target[_DURABLES] = properties }
      next = properties.length

      while (next--) {
        property = properties[next]
        value    = source[property]
        target[property] =
          NextValue(value, asImmutable, visited, source, target)
      }
    break

    case Array :
      visited.set(source, (target = [])) // Handles cyclic objects
      next = source.length

      while (next--) {
        value = source[next]
        target[next] = NextValue(value, asImmutable, visited, source, target)
      }
    break

    case Map :
      visited.set(source, (target = new Map())) // Handles cyclic objects

      source.forEach((value, key) => {
        var nextKey = NextValue(key, asImmutable, visited, source, target)
        var nextValue = NextValue(value, asImmutable, visited)
        target.set(nextKey, nextValue)
      })
    break

    case Set :
      visited.set(source, (target = new Set())) // Handles cyclic objects

      source.forEach((value) => {
        var nextValue = NextValue(value, asImmutable, visited, source, target)
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


function NextValue(value, asImmutable, visited, source, target) {
  if (typeof value !== "object")        { return value     }
  if (value === null)                   { return value     }
  if (value === source)                 { return target    }
  if (value[IS_IMMUTABLE])              { return value     }
  if (value.id != null)                 { return value     }
  if ((traversed = visited.get(value))) { return traversed }

  const _$value = InterMap.get(value)

  return (_$value) ?
    _$Copy(_$value, asImmutable, visited)[$RIND] :
    CopyObject(value, asImmutable, visited)
}


function Copy(value, asImmutable_) {
  if (typeof value !== "object") { return value }
  if (value === null)            { return value }
  if (value[IS_IMMUTABLE])       { return value }
  if (value.id != null)          { return value }

  const _$value = InterMap.get(value)

  return (_$value) ?
    _$Copy(_$value, asImmutable_)[$RIND] :
    CopyObject(value, asImmutable_)
}




function SetImmutableObject(target, inPlace, visited = new WeakMap()) {
  var keys, key, values, value, nextKey, nextValue, properties, property

  visited.set(target, target)

  switch (target.constructor) {
    case WeakMap : return target
    case WeakSet : return target

    default :
      properties = target[_DURABLES] || SetDurableProperties(target)
      next       = properties.length

      while (next--) {
        property  = properties[next]
        value     = target[property]
        nextValue = SetImmutableValue(value, inPlace, visited, target)
        if (nextValue === value) { continue }
        target[property] = nextValue
      }
    break

    case Array :
      next = target.length

      while (next--) {
        value     = target[next]
        nextValue = SetImmutableValue(value, inPlace, visited, target)
        if (nextValue === value) { continue }
        target[next] = nextValue
      }
    break

    case Map :
      keys = target.keys()

      for (key of keys) {
        value     = target.get(key)
        nextKey   = SetImmutableValue(key  , inPlace, visited, target)
        nextValue = SetImmutableValue(value, inPlace, visited, target)

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
        nextValue = SetImmutableValue(value, inPlace, visited, target)

        if (nextValue === value) { continue }
        target.delete(value)
        target.add(nextValue)
      }
    break
  }

  target[IS_IMMUTABLE] = true
  return Frost(target)
}



function SetImmutableValue(value, inPlace, visited, target) {
  if (typeof value !== "object") { return value }
  if (value === null)            { return value }
  if (value === target)          { return value }
  if (value[IS_IMMUTABLE])       { return value }
  if (value.id != null)          { return value }
  if (visited.get(value))        { return value }

  const _$value = InterMap.get(value)
  if (inPlace) {
    if (_$value) {
      _$value._setImmutable.call(_$value[$PULP], true, visited)
      return _$value[$RIND]
    }
    return SetImmutableObject(value, true, visited)
  }
  return (_$value) ?
    _$Copy(_$value, true, visited)[$RIND] :
    CopyObject(value, true, visited)
}
