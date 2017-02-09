
function _setId(newId_) {
  if (newId_ === undefined) { return this }

  const existingId = this[EXPLICIT_ID]

  if (existingId !== undefined) {
    if (newId_ === existingId) { return this }

    let ids = this[ALL_IDS] ||
          (this[ALL_IDS] = { __proto__ : null, [existingId] : existingId })
    ids[newId_] = newId_

  }
  else { this[MUTABILITY] = FACT }

  this[EXPLICIT_ID] = newId_
  return this
},

JS_OBJECT = undefined
VIRGIN    = null
MUTABLE   = 0
FACT      = -1
IMMUTABLE = -2


function asFact() {
  if (this[MUTABILITY] <= FACT) { return this }
  return this._copy(AS_FACT)
},

function beImmutable() {
  if (this[MUTABILITY] === IMMUTABLE) { return this }
  return this._copy(true, undefined, this)
},

// [REF_COUNT] of 0 or 1 no copy needed on beImmutable
// [REF_COUNT] is -Infinity for FACT and NaN for IMMUTABLE


function asImmutable() {
  if (this[MUTABILITY] === IMMUTABLE) { return this }
  return this._copy(true)
},

function copy() {
  if (this[MUTABILITY] === IMMUTABLE) { return this }
  return this._copy(false)
},

function nonCopy() {
  return (this[MUTABILITY] === IMMUTABLE) ? this._new() : this
},


function _copy(harden, visited = new Map(), target = this._new()) {
  let name, value, isFunc, traversed, inner, copy
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
        isFunc = true ; break
      case "function"  :
        isFunc = false; break
    }

    if (value[MUTABILITY] <= FACT) {
      target[next] = value
    }
    else if ((traversed = visited.get(value))) {
      target[next] = traversed
    }
    else if ((inner = InterMap.get(value))) {
      target[next] = inner._copy(harden, visited)
    }
    else if (value.id !== undefined) {
      target[next] = value
    }
    // else if (value.krustyCopy) {
    //   target[next] = copy = value.krustyCopy(harden)
    //   visited.set(value, copy)
    // }
    // else if (value.constructor !== Object_constructor && (copy = value.copy)) {
    //   if (typeof copy === "function") { copy = value.copy(harden) }
    //
    //   target[next] = copy
    //   visited.set(value, copy)
    // }
    else {
      target[next] = (isFunc) ? CopyFunc(value, harden, visited) :
        IsArray(value) ?
          CopyArray (value, harden, visited) :
          CopyObject(value, harden, visited)
    }
  }
                    // _setId will adjust the target's mutability as necessary
  if (this.id !== undefined) { target._setId() }  // entity
  if (!harden) { return target }

  target[MUTABILITY] == IMMUTABLE
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






// asFact
// MUTABLE    immutable copy  -- subs are asFacts
// FACT       self
// IMMUTABLE  self
//
// refCopy
// MUTABLE    copy  -- subs are refCopy
// FACT       self
// IMMUTABLE  self
//
// copy
// MUTABLE    copy  -- subs are refCopy
// FACT       copy
// IMMUTABLE  self
//
// asImmutable
// MUTABLE    immutable copy  -- subs are asFacts
// FACT       immutable copy  -- subs are asFacts
// IMMUTABLE  self
