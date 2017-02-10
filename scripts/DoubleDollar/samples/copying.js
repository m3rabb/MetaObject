
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


function AsMethod(method_func__name, func__) {
  const selector, handler, method

  switch (typeof method_func__name) {
    case "object"   :
      return method
    case "function" :
      selector = method_func__name.name
      handler  = method_func__name
      break
    case "string"   :
      selector = method_func__name
      handler  = func__
      break
  }

  method = new MethodConstructor()
  method._init(selector, handler)
  return method
}

PutMethod(Type_root, function addSMethod(method_func__name, func__) {
  const method  = AsMethod(method_func__name, func__)
  const selector = method.selector
  const handler  = method.handler

  method.isGetter              = false
  this.methods[selector]       = method
  this._instanceRoot[selector] = handler
  ReseedSubtypesMethodHandler(this, method)
  return this
})

Thing.addSMethod(function addSGetter(method_func__name, func__) {
  const method  = AsMethod(method_func__name, func__)
  const selector = method.selector
  const handler  = method.handler

  method.isGetter        = true
  this.methods[selector] = method
  _AddGetter(this._instanceRoot, selector, handler, true)
  ReseedSubtypesMethodHandler(this, method)
  return this
})

Thing.addSMethod(function addSAlias(aliasName, name_method) {
  const method = (typeof name_method === "string") ?
    this._methods[name_method] : name_method

  return (method.isGetter) ?
    this.addSGetter(method) : this.addSMethod(method)
})

Thing.addSAlias("add", "addSMethod")

Thing.add(function addAll(items) {
  let savedAliases = SpawnFrom(null)
  let limit   = namedFuncs.length
  let next    = 0

  while (next < index) {
    item = items[next++]

    switch (typeof item) {
      default         : continue

      case "function" :

        this.addSMethod(item)
        break

      case "string"   :

        switch (item.toUpperCase()) {
          case "GETTER" :
          case "GETTERS" :
            item = items[next++]

            if (typeof item === "function") {
              this.addSGetter(item)
            }
            else {
              getters = item
              count   = getters.length
              while (count--) { this.addSGetter(item) }
            }
            break

          case "ALIAS"  :
          case "ALIASES" :
            aliases = items[next++]
            aliasNames = LocalProperties(aliases)
            count      = getters.length
            while (count--) {
              aliasName      = aliasNames[count]
              originalName   = aliases[aliasName]
              savedAliases[aliasName] = originalName
            }
            break
        }
    }
  }

  count = savedAliases.length

  while (count--) {
    aliasName      = savedAliases[count]
    originalName   = aliases[aliasName]
    this.addSAlias(aliasName, originalName)
  }

  return this
})

PutMethod(Thing_root, function _new(...args) {
  const newInstance = this._newBlank()
  newInstance._init(...args)
  return newInstance
})




  Type.add(function _copy(harden = false, visited = new Map(), target) {
    const spec = {
      name       : this.name
      supertypes : this.supertypes
    }
    target._init(spec)
    target.addAll(this.methods)
  })


  Type.add(function _copy(visited_) {
    const copy = this._new({ name: this.name, supertypes: this.supertypes })
    return copy.addAll(this.methods)
  })

  Person.add(function _copy(visited) {
    const copy = this._newBlank()
    return this._copyAtInto("friends", copy, visited)
  })

  Thing.add(function _initFrom(exactSameThing) {

  }

  Person.add(function _initFrom(person) {
    this._init(person.name, person.age)
    this.friends = person.friends.copy(visited)
  })
