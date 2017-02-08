
function _setId(newId_) {
  if (newId_ === undefined) { return this }

  const existingId = this[EXPLICIT_ID]

  if (existingId !== undefined) {
    if (newId_ === existingId) { return this }

    let ids = this[ALL_IDS] ||
          (this[ALL_IDS] = { __proto__ : null, [existingId] : existingId })
    ids[newId_] = newId_

  }
  else { this[IS_FACT] = true }

  this[EXPLICIT_ID] = newId_
  return this
},


function asFact() {
  if (this[IS_FACT]) { return this }
  return this._copyInto(AS_FACT)
},

function beImmutable() {
  if (this[IS_IMMUTABLE]) { return this }
  return this._copyInto(IMMUTABLE, undefined, this)
},

function asImmutable() {
  if (this[IS_IMMUTABLE]) { return this }
  return this._copyInto(IMMUTABLE)
},

function copy() {
  return this._copyInto(this[IS_IMMUTABLE] ? IMMUTABLE : MUTABLE)
},

function nonCopy() {
  return (this[IS_IMMUTABLE]) ? this._new() : this
},


function _copyInto(mode, visited = new Map(), target = this._new()) {
  let name, value, Copy, traversed, inner
  let asFact   = !!mode
  let names    = this[KNOWN_PROPERTIES] || LocalProperties(this)
  let next     = names.length

  visited.set(this, target)

  while (next--) {
    name  = names[next]
    value = this[name]

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
      target[next] = inner._copyInto(asFact, visited)
    }
    else if (value.id !== undefined) {
      target[next] = value
    }
    // else if (value.constructor !== Object_constructor && (copy = value.copy)) {
    //   if (typeof copy === "function") { copy = value.copy(asFact) }
    //
    //   target[next] = copy
    //   visited.set(value, copy)
    // }
    else {
      target[next] = (Copy === CopyFunc) ?
        CopyFunc(value, asFact, visited) :
        IsArray(value) ?
          CopyArray (value, asFact, visited) :
          CopyObject(value, asFact, visited)
    }
  }

  if (this.id !== undefined) {   // entity
    target._setId()   // this also sets AS_FACT
    if (mode !== IMMUTABLE) { return target }
  }
  else if (asFact) {             // immutable value
    target[IS_FACT] = target[IS_IMMUTABLE] = true
  }
  else {
    return target
  }

  next               = names.length
  krustBehaviors     = target[KRUST_BEHAVIORS]
  krustBehaviors.get = ImmutableGet
  externals          = krustBehaviors.externals
  delete krustBehaviors.internals

  while (next--) {
    name           = names[next]
    external[name] = target[name]
  }

  return BeImmutable(target)
}

function _AsFact(target) {
  let isFunc

  switch (typeof target) {
    case "object"   : isFunc = false; break
    case "function" : isFunc = true ; break
    default : return target
  }

  const visited = new Map()
  const inner   = InterMap.get(target)
  return (inner) ? inner.asImmutable :
    (isFunc) ? _FuncAsFact(target, visited) : _ObjectAsFact(target, visited)
}


root = {}

Object.defineProperty(root, "size", {
  get () {
    return 12345
  }
})

bob = { __proto__ : root, name : "bob" }
