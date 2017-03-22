AddGetter(Thing_root, function isFact() {
  return this[IS_IMMUTABLE] || (this.id != null)
})

AddGetter(Thing_root, function isImmutable() {
  return this[IS_IMMUTABLE]
})

function copy(visited_) {
  return this[IS_IMMUTABLE] ? this : this[COPY](false, visited_)
}

function mutableCopy(visited_) {
  return this[COPY](false, visited_)
}

function mutableCopyExcept(selector) {
  return this[COPY](false, undefined, undefined, selector)
}


// Thing.add(function _nonCopy() {
//   return (this[IS_FACT] === IMMUTABLE) ? this._newBlank() : this
// })



AddGetter(Thing_root, function asCopy() {
  return this[IS_IMMUTABLE] ? this : this[COPY](false)
}

// Liberate the following two methods from the rule that all methods
// must answer immutables (or facts) from immutable receivers
AddGetter(Thing_root, function asMutableCopy() {
  return this[COPY](false)
}

AddGetter(Thing_root, function asMutable() {
  return this[IS_IMMUTABLE] ? this[COPY](false) : this
}

AddGetter(Thing_root, function asFact() {
  return this[IS_IMMUTABLE] || (this.id != null) ? this : this[COPY](true)
}

AddGetter(Thing_root, function asImmutable() {
  return this[IS_IMMUTABLE] ? this : this[COPY](true)
})

AddGetter(Thing_root, function beImmutable() {
  return (this[IS_IMMUTABLE]) ? this : this[BE_IMMUTABLE](false)
})



function _GeneralPurposeObjectCopy(visited = CopyLog()) {
  let target, selectors, selector, next, value, traversed, inner,

  if (this.id != null) { return this }

  target = SpawnFrom(RootOf(this))
  selectors = this[KNOWN_SELECTORS] ||
    (this[KNOWN_SELECTORS] = KnownNames(this))
  next   = selectors.length

  visited.pairing(this, target) // Handles cyclic objects

  while (next--) {
    selector  = selectors[next]
    value = this[selector]

    if (typeof value !== "object" || value === null)  {/* NOP */}
    else if (value[IS_IMMUTABLE] || value.id != null) {/* NOP */}
    else if ((traversed = visited.pair(value)) { value = traversed }
    else if ((valueCore = InterMap.get(value))) {
      value = valueCore[COPY](asImmutable, visited).$
    }
    else { value = CopyObject(value, asImmutable, visited) }

    target[selector] = value
  }

  return target
}



// NOTE: The CopyObject is only called AFTER confirming that the source
//       doesn't have an id and is therefore not a fact

function CopyObject(source, asImmutable, visited = CopyLog()) {
  let target, next, value, traversed, inner, selectors, selector

  switch (source.constructor) {
    default : // Custom Object
      if ((target = source.copy)) {
        if (target === _GeneralPurposeObjectCopy) {
          target = source.copy(visited)
        }
        else {
          if (typeof target === "function") { target = source.copy(visited) }
          visited.pairing(source, target) // ensure logging, just in case
        }
        returns (asImmutable && target !== source) ? // Is this check necessary???
          BeImmutableObject(target, true) : target
      }

      if (!(selectors = source[KNOWN_SELECTORS]) && source.id === undefined) {
        return source   // Never copy ordinary custom objects without an
                        // expressed intention from their creators
      }                 // e.g. setting copy|KNOWN_SELECTORS|id = null
      // source.id === null

      target = SpawnFrom(RootOf(source))
      // break omitted

    case Object :
      selectors    = selectors || source[KNOWN_SELECTORS] || KnownNames(source)
      next         = selectors.length
      isFromObject = true
      // break omitted

    case Array :
      next = isFromObject ? next : source.length

      visited.pairing(source, (target = [])) // Handles cyclic objects

      while (next--) {
        selector = isFromObject ? selectors[next] : next
        value = source[selector]

        if (typeof value !== "object" || value === null)  {/* NOP */}
        else if (value[IS_IMMUTABLE] || value.id != null) {/* NOP */}
        else if ((traversed = visited.pair(value)) { value = traversed }
        else if ((valueCore = InterMap.get(value))) {
          value = valueCore[COPY](asImmutable, visited).$
        }
        else { value = CopyObject(value, asImmutable, visited) }

        target[selector] = value
      }
      break
  }

  if (asImmutable) {
    if (source.id != null) {
      if (target._setImmutableCopyId) { target._setImmutableCopyId() }
      else { delete target.id }
    }
    target[KNOWN_SELECTORS] = selectors
    target[IS_IMMUTABLE] = true
    SetImmutable(this)
  }

  return target
}



function BeImmutableObject(target, modifySelfDeeply, visited = new CopyLog()) {
  let next, value, inner, selectors, selector

  visited.add(target)

  switch (target.constructor) {
    default : // Object or Custom Object
      selectors    = target[KNOWN_SELECTORS] ||
        (target[KNOWN_SELECTORS] = KnownNames(target))
      next         = selectors.length
      isFromObject = true
      break

    case Array :
      next = target.length
      break
  }

  while (next--) {
    selector = isFromObject ? selectors[next] : next
    value = target[selector]

    if (typeof value !== "object" || value === null)  {/* NOP */}
    else if (value[IS_IMMUTABLE] || value.id != null) {/* NOP */}
    else if (visited.pair(value))                     {/* NOP */}
    else if ((valueCore = InterMap.get(value))) {
      if (modifySelfDeeply) { valueCore[BE_IMMUTABLE](true, visited) }
      else { target[selector] = valueCore[COPY](true, visited).$ }
    }
    else if (modifySelfDeeply) { BeImmutableObject(value, true, visited) }
    else { target[selector] = CopyObject(value, true, visited) }
  }

  target[IS_IMMUTABLE] = true
  return SetImmutable(target)
}







Parameters
  nonObject               is always a factory
  obj.isFact              is (unconfimed) fact
  object

    known  JSObject

  Outer         --->  IS_WRAPPED

  External      --->  IS_WRAPPED
    JSObj
    Thing

  Inner

  KnownObjData

  JSObject -->
  JSObj

  ConfirmedObject        (isfact or not)

  isFact      ---> is (unconfimed) fact
  IS_EXTERNAL ---> is passed in an my be referenced by other objs
  IS_FACT     ---> immutable or has id
  IS_KNOWN    ---> created or copied by krust


passed in jsObject
- wrap as param so it is marked as needing to be copied
  AND to ensure it doesnt capture private part


passed in safeCopy
- wrap as param so it is marked as needing to be copied

passed in melon object
- wrap as param so it is marked as needing to be copied
  AND to ensure it doesnt capture private part

passed in person object (with id)
- wrap to ensure it doesnt capture private part

passed in inner immutable object
- use outer instead

passed in inner mutable object
- wrap as param so it is marked as needing to be copied
- use outer instead

passed in immutable List
- nothing do to


passed in mutable List
- wrap as param so it is marked as needing to be copied




const ConfirmedFact = {
  __proto__ : null,
  [IS_FACT] = FACT,
}

const ConfirmedObject = {
  __proto__ : null,
  [IS_FACT] = null,
}

// const ConfirmedImmutable = {
//   __proto__ : null,
//   [IS_FACT] = IMMUTABLE,
//   [IS_OBJECT] = true,
// }






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
  this.mode     = mode || STANDARD_METHOD_MODE
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
      _AddGetter(this._instanceRoot, selector, true, handler)
      break

    case LAZY_INSTALLER :
      _AddGetter(this._instanceRoot, selector, false, function _loader() {
        DefineProperty(this, selector, VisibleConfiguration)
        return (this[selector] = handler.call(this))
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
    switch (mode) {
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
    const aliasNames = KnownNames(aliases)
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
//     this[selector] = (asFixedFacts_) ? BeFixedFacts(copy) : copy
//     visited.set(value, copy)
//     continue
//   }
// }
// this[selector] = (isFunc) ?
//   CopyFunc(value, asFixedFacts_, visited) :
//   CopyObject(value, asFixedFacts_, visited)
// }


instanceMethods
instanceProperties
methods
properties
supertypes
