
function _setId(newId_) {
  const newId = (arguments.length) ? newId_ : NewUniqueId(this.basicId() + "-")

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
  else { this[IS_FACT] = FACT }

  this[EXPLICIT_ID] = newId
  return this
},

EXPLICIT_ID = Symbol("EXPLICIT_ID")
ALL_IDS     = Symbol("ALL_IDS")
IS_FACT     = Symbol("IS_FACT")
MUTABLE     = null
FACT        = Symbol("FACT")
IMMUTABLE   = Symbol("IMMUTABLE")

AddGetter(Thing_root, function isFact() {
  return (this[IS_FACT])
})

AddGetter(Thing_root, function isImmutable() {
  return (this[IS_FACT] === IMMUTABLE)
})


function mutableCopy(visited_) {
  return this[COPY](false, visited_)
}

function copy(visited_) {
  return (this[IS_FACT] === IMMUTABLE) ? this : this[COPY](false, visited_)
}

function nonCopy() {
  return (this[IS_FACT] === IMMUTABLE) ? this._newBlank() : this
}


AddGetter(Thing_root, function asCopy() {
  return (this[IS_FACT] === IMMUTABLE) ? this : this[COPY](false)
}

AddGetter(Thing_root, function asMutableCopy() {
  return this[COPY](false)
}

AddGetter(Thing_root, function asMutable() {
  return (this[IS_FACT] === IMMUTABLE) ? this[COPY](false) : this
}

AddGetter(Thing_root, function asImmutable() {
  return (this[IS_FACT] === IMMUTABLE) ? this : this[COPY](true)
})

AddGetter(Thing_root, function beImmutable() {
  return (this[IS_FACT] === IMMUTABLE) ? this :
    this[COPY](true, undefined, this)
})




function CopyFunc(Source, visited = new Map(), asFixedFacts) {
  const target = function (...args) {
    return Source.apply(this, ...args)
  }
  DefineProperty(target, "name", VisibleConfiguration)
  target[ORIGINAL] = Source[ORIGINAL] || (Source[ORIGINAL] = Source)

  visited.set(source, target)
  return _initFrom_.call(target, Source, visited, asFixedFacts, false)
}

function CopyObject(source, visited = new Map(), asFixedFacts) {
  let isArray, target

  switch (source.constructor) {
    case Array  : isArray = true ; target = []; break
    case Object : isArray = false; target = {}; break
    default     : isArray = false; target = SpawnFrom(RootOf(source)); break
  }

  visited.set(source, target) // Prevents infinite recursion on cyclic objects
  return _initFrom_.call(target, source, visited, asFixedFacts, isArray)
}


Thing.add("_initFrom_", _initFrom_)

function _InitFrom_(source, visited, asFixedFacts_, isArray_) {
  let props, next, prop, value, isFunc, traversed, inner, func, copy

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
      case "object"   :
        if (value === null) { this[prop] = value; continue }
        isFunc = false; break
      case "function" :
        isFunc = true; break
    }

    if (value[IS_FACT] <= FACT) {
      this[prop] = value
    }
    else if ((traversed = visited.get(value))) {
      this[prop] = traversed
    }
    else if ((inner = InterMap.get(value))) {
      this[prop] = inner[COPY](asFixedFacts_, visited)
    }
    else if (value.id !== undefined) {
      this[prop] = value
    }
    else if (value.constructor !== Object && (func = value.copy)) {
      copy = (func.constructor === Function) ? value.copy(visited) : func

      this[prop] = (asFixedFacts_) ? BeFixedFacts(copy) : copy
      visited.set(value, copy)
    }
    else if (isFunc) {                               // is function
      this[prop] = CopyFunc(value, asFixedFacts_, visited)
    }
    else {
      this[prop] = CopyObject(value, asFixedFacts_, visited)
    }
  }

  if (source !== this && this.id !== undefined) { this[SET_ID] }

  if (asFixedFacts_) {
    this[IS_FACT] = IMMUTABLE
    BeImmutable(this)
  }

  return this
}


function BeFixedFacts(_target, visited = new Set()) {
  let isArray, props, next, prop, value, traversed, inner

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

    if (value[IS_FACT])                { continue }
    if (visited.has(value))            { continue }
    if (value.id !== undefined)        { continue }
    if ((inner = InterMap.get(value))) { BeFixedFacts(inner, visited) }
    else                               { BeFixedFacts(value, visited) }
  }

  _target[IS_FACT] = IMMUTABLE
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


function AsMethod(first, ...remaining) {
  return (first.isMethod) ?
    (argument.length === 1) ?
      first : Method(first.selector, first.handler, ...remaining) :
    Method(first, ...remaining)
}

PutMethod(Method_root, function _init(namedFunc_name, func_, mode__) {
  const [name, handler, mode] = (arguments.length > 1) ?
    [namedFunc_name, func_, mode__] :
    [namedFunc_name.name, namedFunc_name, func_]

  this.selector = name
  this.handler  = handler
  this.mode     = mode || STANDARD_METHOD
})

PutMethod(Type_root, function addSMethod(method_func__name, func__, mode___) {
  const method   = AsMethod(method_func__name, func__, mode___)
  const selector = method.selector
  const handler  = method.handler

  switch (method.mode) {
    case STANDARD :
      this._instanceRoot[selector] = handler
      break

    case GETTER :
      _AddGetter(this._instanceRoot, selector, handler, true)
      break

    case LAZY_INSTALLER :
      _AddGetter(target, Name, function _loader() {
        DefineProperty(this, Name, InvisibleConfiguration)
        return (this[Name] = Installer.call(this))
      })
      break
  }

  this._methods[selector] = method
  ReseedSubtypesMethodHandler(this, method)
  return this
})

Thing.addSMethod(function addSGetter(...args) {
  return this.addSMethod(...args, GETTER)
})

Thing.addSMethod(function addSLazyInstaller(...args) {
  return this.addSMethod(...args, LAZY_INSTALLER)
})

Thing.addSMethod(function addSAlias(aliasName, name_method) {
  const oldMethod = (typeof name_method === "string") ?
    this._methods[name_method] : name_method

  const newMethod = Method(aliasName, oldMethod.handler, oldMethod.mode)
  return this.addSMethod(newMethod)
})

Thing.addSAlias("add", "addSMethod")

class MethodLoader {
  constructor (type) {
    this.type    = type
    this.aliases = SpawnFrom(null)
  }

  load (methods) {
    this.addAll(methods, STANDARD)
    this.resolveAlises()
  }

  addAll (value, mode) {
    let items = (value.constructor === Array) ? value : [value]
    let index   = 0
    let count   = items.length

    while (index < count) {
      let next = items[index++]
      let [itemMode, item] = (item.constructor === String) ?
        [next, items[index++]] : [mode, next]

      this.add(item, itemMode)
    }
  }

  add (item, mode) {
    switch (item) {
      case "STANDARD" :
        return this.type.addSMethod(item)

      case "GETTER"  :
      case "GETTERS" :
        return this.addAll(item, GETTER)

      case "ALIAS"   :
      case "ALIASES" :
        return this.addAliases(item)

      case "JIT"             :
      case "JIT PROP"        :
      case "JIT PROPERTY"    :
      case "JIT PROPERTIES"  :
      case "LAZY"            :
      case "LAZY PROP"       :
      case "LAZY PROPERTY"   :
      case "LAZY PROPERTIES" :
        return this.addAll(item, LAZY_INSTALLER)
    }
  }

  addAliases (aliases) {
    const aliasNames = LocalProperties(aliases)
    const next       = aliasNames.length
    const saved      = this.aliases

    while (next--) {
      aliasName        = aliasNames[next]
      originalName     = aliases[aliasName]
      saved[aliasName] = originalName
    }
  }

  resolveAlises () {
    let aliases = this.aliases

    for (let aliasName in aliases) {
      let originalName = aliases[aliasName]
      this.type.addSAlias(aliasName, originalName)
    }
  }
}

Thing.add(function addAll(items) {
  const loader = new MethodLoader(this)
  loader.load(items)
  return this
})


// Type.add(function copy(visited) {
//   const newType = Type({ name: type.name, supertypes: type.supertypes })
//   newType.methods = this.methods.copy(visited)
//   return newType
// })

Type.add(function _initFrom_(_type, visited) {
  this._init(_type)
  this._method = _type._methods.copy(visited)
})


is(thing)

isA(type)





// else if (value.constructor !== Object) {
//   if (func = value.copy) ) {
//     copy = (func.constructor === Function) ? value.copy(visited) : func
//   }
//   else if (func = value._copy) ) {
//     copy = value._copy(visited)
//   }
//   if (copy) {
//     this[prop] = (asFixedFacts_) ? BeFixedFacts(copy) : copy
//     visited.set(value, copy)
//     continue
//   }
// }
// this[prop] = (isFunc) ?
//   CopyFunc(value, asFixedFacts_, visited) :
//   CopyObject(value, asFixedFacts_, visited)
// }
