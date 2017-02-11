
function _setId(newId_) {
  const newId = (arguments.length) ? newId_ : this.defaultId()

  const existingId = this[EXPLICIT_ID]

  if (existingId !== undefined) {
    let ids

    if (newId === existingId) { return this }
    if (!(ids = this[ALL_IDS])) {
      this[ALL_IDS] = ids = SpawnFrom(null)
      ids[existingId] = existingId
    }
    ids[newId] = newId
  }
  else { this[MUTABILITY] = FACT }

  this[EXPLICIT_ID] = newId
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


function beImmutable() {
  if (this[MUTABILITY] === IMMUTABLE) { return this }

  const outer     = this.$
  const traversal = new Map()

  traversal.set(outer, outer)  // Prevents infinite recursion on cyclic objects

  if (this._initFrom === _InitFrom)
    { this._initFrom(this, traversal, true) }
  else
    { AsFixedFacts(this._initFrom(this, traversal, false)) }
  return this
},

function asImmutable() {
  if (this[MUTABILITY] === IMMUTABLE) { return this }

  const  copy     = this._newBlank()
  const _copy     = InterMap.get(copy)
  const traversal = new Map()

  traversal.set(this.$, copy)  // Prevents infinite recursion on cyclic objects

  if (_copy._initFrom === _InitFrom)
    { _copy._initFrom(this, traversal, true) }
  else
    { AsFixedFacts(_copy._initFrom(this, traversal, false)) }
  return copy
},

GETTER asCopy same as copy()

function copy() {
  if (this[MUTABILITY] === IMMUTABLE) { return this }

  const  copy     = this._newBlank()
  const _copy     = InterMap.get(copy)
  const traversal = new Map()

  traversal.set(this.$, copy)  // Prevents infinite recursion on cyclic objects
  _copy._initFrom(this, traversal)
  return copy
}

function nonCopy() {
  return (this[MUTABILITY] === IMMUTABLE) ? this._newBlank() : this
},


function CopyFunc(Source, visited = new Map(), asFixedFacts) {
  const target = function (...args) {
    return Source.apply(this, ...args)
  }
  DefineProperty(target, "name", VisibleConfiguration)
  target[ORIGINAL] = Source[ORIGINAL] || Source

  visited.set(source, target)
  return _InitFrom.call(target, Source, visited, asFixedFacts, false)
}

function CopyObject(source, visited = new Map(), asFixedFacts) {
  let isArray, target

  switch (source.constructor) {
    case Object : isArray = false; target = {}; break
    case Array  : isArray = true ; target = []; break
    default     : isArray = false; target = SpawnFrom(RootOf(source)); break
  }

  visited.set(source, target) // Prevents infinite recursion on cyclic objects
  return _InitFrom.call(target, source, visited, asFixedFacts, isArray)
}


Thing.add("_initFrom", _InitFrom)

function _InitFrom(source, visited, asFixedFacts_, isArray_) {
  let props, next, prop, value, isFunc, traversed, inner, copy

  if (isArray_) {
    next = this.length = source.length
  }
  else {
    props = source[KNOWN_PROPERTIES] || LocalProperties(source)
    next  = props.length
  }

  while (next--) {
    prop  = isArray_ ? next : props[next]
    value = source[prop]

    switch (typeof value) {
      default         : this[prop] = value; continue
      case "object"   : if (value === null) { this[prop] = value; continue }
      case "function" : isFunc = true; break
    }

    if (value[MUTABILITY] <= FACT) {
      this[prop] = value
    }
    else if ((traversed = visited.get(value))) {
      this[prop] = traversed
    }
    else if ((inner = InterMap.get(value))) {
      copy       = inner.copy(visited)
      this[prop] = (asFixedFacts_) ? AsFixedFacts(copy) : copy
    }
    else if (value.id !== undefined) {
      this[prop] = value
    }
    else if (value.constructor !== Object && (copy = value.copy)) {
      if (typeof copy === "function") { copy = value.copy(visited) }

      this[prop] = (asFixedFacts_) ? AsFixedFacts(copy) : copy
      visited.set(value, copy)
    }
    else if (isFunc) {                               // is function
      this[prop] = CopyFunc(value, asFixedFacts_, visited)
    }
    else {
      this[prop] = CopyObject(value, asFixedFacts_, visited)
    }
  }

  if (asFixedFacts_) {
    this[MUTABILITY] = IMMUTABLE
    BeImmutable(this)
  }

  return this
}


function AsFixedFacts(_target, visited = new Set()) {
  let isArray, props, next, prop, value, isFunc, traversed, inner

  if ((isArray = (_target.constructor === Object))) {
    next = _target.length
  }
  else {
    props = _target[KNOWN_PROPERTIES] || LocalProperties(_target)
    next  = props.length
  }

  visited.add(_target)

  while (next--) {
    prop  = isArray_ ? next : props[next]
    value = source[prop]

    switch (typeof value) {
      default         : continue
      case "object"   : if (value === null) { continue }
      case "function" : break
    }

    if (value[MUTABILITY] <= FACT)     { continue }
    if (visited.has(value))            { continue }
    if (value.id !== undefined)        { continue }
    if ((inner = InterMap.get(value))) { AsFixedFacts(inner, visited) }
    else                               { AsFixedFacts(value, visited) }
  }

  _target[MUTABILITY] = IMMUTABLE
  return BeImmutable(_target)
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

          case "JIT" :
          case "JIT PROP" :
          case "JIT PROPERTY" :
          case "JIT PROPERTIES" :
          case "LAZY" :
          case "LAZY PROP" :
          case "LAZY PROPERTY" :
          case "LAZY PROPERTIES" :
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
