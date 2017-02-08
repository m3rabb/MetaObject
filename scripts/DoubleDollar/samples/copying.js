function CopyObject(source, asFact, visited, target = this._new(), isThing) {
  let name, value, Copy, traversed, inner, copy
  let names = isThing && inner[KNOWN_PROPERTIES] || LocalProperties(source)
  let next  = names.length

  visited.set(source, target)

  while (next--) {
    name  = names[next]
    value = source[name]

    switch (typeof value) {
      case "undefined" :       target[next] = value; continue
      case "boolean"   :       target[next] = value; continue
      case "number"    :       target[next] = value; continue
      case "symbol"    :       target[next] = value; continue
      case "string"    :       target[next] = value; continue
      case "object"    :       target[next] = value; continue
        if (result === null) { target[next] = value; continue }
        Copy = CopyObject; break
      case "function"  :
        Copy = CopyFunc  ; break
    }

    if (value[IS_FACT]) {
      target[next] = value
    }
    else if ((traversed = visited.get(value))) {
      target[next] = traversed
    }
    else if ((inner = InterMap.get(value))) {
      target[next] = Copy(inner, asFact, visited, true)
    }
    else if (value.constructor !== Object_constructor && (copy = value.copy)) {
      if (typeof copy === "function") { copy = value.copy(asFact) }

      target[next] = copy
      visited.set(value, copy)
    }
    else {
      target[next] = (Copy === CopyFunc) ?
        CopyFunc(value, asFact, visited) :
        IsArray(value) ?
          CopyArray(value, asFact, visited) :
          CopyObject(value, asFact, visited)
    }
  }

  if (isThing) {
    if (source.id !== undefined) { target.setId() }
    else if (asFact) { }
    if (asFact) { target[IS_IMMUTABLE] = true }
  }
  target[IS_FACT] = true

  return BeImmutable(target)
