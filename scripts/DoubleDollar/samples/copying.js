
function _setId(newId_) {
  if (newId_ === undefined) { return this }

  const existingId = this[EXPLICIT_ID]

  if (existingId !== undefined) {
    let ids

    if (newId_ === existingId) { return this }
    if (!(ids = this[ALL_IDS])) {
      this[ALL_IDS] = ids = SpawnFrom(null)
      ids[existingId] = existingId
    }
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

function isFact() {
  return (this[MUTABILITY] >= FACT)
},

function isImmutable() {
  return (this[MUTABILITY] === IMMUTABLE)
},

function asFact() {
  if (this[MUTABILITY] <= FACT) { return this }
  return this._copy(AS_FACT)
},


// [REF_COUNT] of 0 or 1 no copy needed on beImmutable
// [REF_COUNT] is -Infinity for FACT and NaN for IMMUTABLE

function beImmutable() {
  if (this[MUTABILITY] === IMMUTABLE) { return this }
  return this._copy(true, undefined, this)
},

function asImmutable() {
  if (this[MUTABILITY] === IMMUTABLE) { return this }
  return this._copy(true, undefined, this._new())
},

function copy() {
  if (this[MUTABILITY] === IMMUTABLE) { return this }
  return this._copy(false, undefined, this._new())
},

function nonCopy() {
  return (this[MUTABILITY] === IMMUTABLE) ? this._new() : this
},

AtPutMethod(Thing_root, "_copy", _Copy)

//  This method must never be called initially on a JS object|func|array!!!
function _Copy(harden = false, visited = new Map(), target_) {
  let isArray, target, names, value, isFunc, traversed, inner
  let next     = names.length
  let isArray  = (target_ === null)

  if (isArray) {
    target = []
  }
  else {
    target = target_ ||
      (this.constructor === Object) ? {} : SpawnFrom(RootOf(this))
    names = this[KNOWN_PROPERTIES] || LocalProperties(this)
  }

  visited.set(this, target)

  while (next--) {
    value = isArray ? this[next] : this[ names[next] ]

    switch (typeof value) {
      case "undefined" :       target[next] = value; continue
      case "boolean"   :       target[next] = value; continue
      case "number"    :       target[next] = value; continue
      case "symbol"    :       target[next] = value; continue
      case "string"    :       target[next] = value; continue
      case "function"  :       isFunc = true       ; break
      case "object"    :
        if (result === null) { target[next] = value; continue }
    }

    if (value[MUTABILITY] <= FACT) {
      target[next] = value
    }
    else if ((traversed = visited.get(value))) {
      target[next] = traversed
    }
    else if ((inner = InterMap.get(value))) {
      target[next] = inner._copy(harden, visited, inner._new())
    }
    else if (value.id !== undefined) {
      target[next] = value
    }
    // else if (value.krustyCopy) {
    //   target[next] = copy = value.krustyCopy(harden)
    //   visited.set(value, copy)
    // }
    // else if (value.constructor !== Object && (copy = value.copy)) {
    //   if (typeof copy === "function") { copy = value.copy(harden) }
    //
    //   target[next] = copy
    //   visited.set(value, copy)
    // }
    else if (isFunc) {                               // is function
      target[next] = CopyFunc(value, harden, visited)
    }
    else if (IsArray(value)) {  // is array
      target[next] = _Copy.call(value, harden, visited, null)
    }
    else {
      target[next] = _Copy.call(value, harden, visited)
    }
  }
      // _setId will adjust the target thing's mutability as necessary
      // Note: a JS object with an id shouldn't make it to this point
  if (this.id !== undefined) { target._setId() } // thing entity
  if (!harden) { return target }

  target[MUTABILITY] == IMMUTABLE  // Should invisibility be set here???
  return BeImmutable(target)
}

function CopyFunc(source, harden = false, visited = new Map()) {
  const target = function (...args) {
    return source.apply(this, ...args)
  }

  DefineProperty(target, "name", VisibleConfiguration)
  target[ORIGINAL] = source[ORIGINAL] || source
  return _Copy.call(source, harden, visited, target)
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
