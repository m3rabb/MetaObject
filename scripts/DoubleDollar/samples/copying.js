
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
  return (this.id != null)
})

// set isImmutable = false in Core_root


function copy(visited_) {
  return this.isImmutable ? this : this[COPY](false, visited_)
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
  return this.isImmutable ? this : this[COPY](false)
}

AddGetter(Thing_root, function asMutableCopy() {
  return this[COPY](false)
}

AddGetter(Thing_root, function asMutable() {
  return this.isImmutable ? this[COPY](false) : this
}

AddGetter(Thing_root, function asFact() {
  return (this.id != null) ? this : this[COPY](true)
}

AddGetter(Thing_root, function asImmutable() {
  return this.isImmutable ? this : this[COPY](true)
})

AddGetter(Thing_root, function beImmutable() {
  return this.isImmutable ? this : this[COPY](true, undefined, this)
})



Thing.add("_initFrom_", _InitFrom_)

function _InitFrom_(_source, visited, exceptSelector, asImmutable) {
  let props, next, prop, value, traversed, inner

  if ((props = this[KNOWN_PROPERTIES])) {
    next   = props.length

    while (next--) {
      prop  = props[next]
      if (prop === exceptSelector) { continue }
      value = _source[prop]

      if (typeof value !== "object" || value === null || value.id != null) {}
      else if ((traversed = visited.pair(value))) { value = traversed }
      else if ((valueCore = InterMap.get(value))) {
        value = valueCore[COPY](asImmutable, visited).$
      }
      else { value = CopyObject(value, asImmutable, visited) }

      this[prop] = value
    }
  }
  else {
    targetOuter = this[OUTER]
    count = 1
    propsKind = PROPS

    do {
      sourceProps = _source[propsKind]
      targetProps = this[propsKind]

      for (prop in sourceProps) {
        if (prop !== exceptSelector) {
          value = _source[prop]

          if (typeof value !== "object" || value === null || value.id != null) {}
          else if ((traversed = visited.pair(value))) { value = traversed }
          else if ((valueCore = InterMap.get(value))) {
            value = valueCore[COPY](asImmutable, visited).$
          }
          else { value = CopyObject(value, asImmutable, visited) }

          targetProps[prop] = true
          this[prop] = value
          if (count) { targetOuter[prop] = value }
        }
      }
      propsKind = _PROPS
    } while (count--)
  }

  if (asImmutable) {
    if (_source.id != null) {
      if (_source !== this) { this._setId() }
    }
    else { DefineProperty(target, "id", EmptyIdConfiguration) } // NON_UNIQUE_IMMUTABLE

    DefineProperty(object, "isImmutable", IsImmutableConfiguration)
    SetImmutable(this)
  }

  return this
}



function _GeneralPurposeObjectCopy(visited = CopyLog()) {
  let target, props, prop, next, value, traversed, inner,

  if (this.id != null) { return this }

  target = SpawnFrom(RootOf(this))
  props  = this[KNOWN_PROPERTIES] || VisibleLocalNames(this)
  next   = props.length

  visited.pairing(this, target) // Handles cyclic objects

  while (next--) {
    prop  = props[next]
    value = this[prop]

    if (typeof value !== "object" || value === null || value.id != null) {}
    else if ((traversed = visited.pair(value))) { value = traversed }
    else if ((valueCore = InterMap.get(value))) {
      value = valueCore[COPY](false, visited).$
    }
    else { value = CopyObject(value, false, visited) }

    target[prop] = value
  }

  return target
}



// NOTE: The CopyObject is only called AFTER confirming that the source
//       is NOT a fact!!!

function CopyObject(source, asImmutable, visited = CopyLog()) {
  let target, next, value, traversed, inner, props, prop

  switch (source.constructor) {
    default : // Custom Object
      if ((target = source.copy)) {
        if (target === _GeneralPurposeObjectCopy) {
          target = _GeneralPurposeObjectCopy.call(source, visited)
        }
        else {
          if (typeof target === "function") { target = source.copy(visited) }
          visited.pairing(source, target) // ensure logging, just in case
        }
        returns (asImmutable && target !== source) ?
          ThenBeImmutable(target) : target
      }

      if (!(props = source[KNOWN_PROPERTIES]) && source.id === undefined) {
        return source   // Never copy ordinary object without an
                        // expressed intention from their creators
      }                 // e.g. setting copy|KNOWN_PROPERTIES|id = null
      // source.id === null

      target = SpawnFrom(RootOf(source))
      // break omitted

    case Object :
      props  = props || VisibleLocalNames(source)
      next   = props.length

      visited.pairing(source, (target = {})) // Handles cyclic objects

      while (next--) {
        prop  = props[next]
        value = source[prop]

        if (typeof value !== "object" || value === null || value.id != null) {}
        else if ((traversed = visited.pair(value))) { value = traversed }
        else if ((valueCore = InterMap.get(value)) {
          value = valueCore[COPY](asImmutable, visited).$
        }
        else { value = CopyObject(value, asImmutable, visited) }

        target[prop] = value
      }
      break

    case Array :
      next = source.length

      visited.pairing(source, (target = [])) // Handles cyclic objects

      while (next--) {
        value = source[next]

        if (typeof value !== "object" || value === null || value.id != null) {}
        else if ((traversed = visited.pair(value))) { value = traversed }
        else if ((valueCore = InterMap.get(value)) {
          value = valueCore[COPY](asImmutable, visited).$
        }
        else { value = CopyObject(value, asImmutable, visited) }

        target[prop] = value
      }
      break
  }

  if (asImmutable) {
    if (target.id == null) { // NON_UNIQUE_IMMUTABLE
      DefineProperty(target, "id", EmptyIdConfiguration) // ""
    }
    if (!target.isImmutable) { // Ensures we don't overwrite existing isImmutable
      DefineProperty(target, "isImmutable", IsImmutableConfiguration)
    }
    SetImmutable(this)
  }

  return target
}



function ThenBeImmutable(target, visited = new Set()) {
  let next, value, inner, props, prop

  visited.add(target)

  switch (target.constructor) {
    default : // Custom Object
      if ((props = target[KNOWN_PROPERTIES])) { }
      else if (target[SECRET] === CORE) {
        targetOuter = target[OUTER]
        count = 1
        propsKind = PROPS

        do {
          targetProps = target[propsKind]

          for (prop in targetProps) {
            value = _source[prop]

            if (typeof value !== "object" || value === null) {}
            else if (value.id != null || visited.has(value)) {}
            else if ((valueCore = InterMap.get(value))) {
              ThenBeImmutable(valueCore, visited)
            }
            else { ThenBeImmutable(value, visited }
          }
          propsKind = _PROPS
        } while (count--)
        break
      } // LOOK: check this below!!!
      else if (target.id === null || ("copy" in target)) { }
      else { return target }

    case Object :
      props = props || VisibleLocalNames(target)
      next  = props.length

      while (next--) {
        prop  = props[next]
        value = source[prop]

        if (typeof value !== "object" || value === null) {}
        else if (value.id != null || visited.has(value)) {}
        else if ((valueCore = InterMap.get(value))) {
          ThenBeImmutable(valueCore, visited)
        }
        else { ThenBeImmutable(value, visited }
      }
      break

    case Array :
      next = target.length

      while (next--) {
        value = target[next]

        if (typeof value !== "object" || value === null) {}
        else if (value.id != null || visited.has(value)) {}
        else if ((valueCore = InterMap.get(value))) {
          ThenBeImmutable(valueCore, visited)
        }
        else { ThenBeImmutable(value, visited }
      }
      break
  }

  if (target.id == null) { // NON_UNIQUE_IMMUTABLE
    DefineProperty(target, "id", EmptyIdConfiguration) // ""
  }
  if (!target.isImmutable) { // Ensures we don't overwrite existing isImmutable
    DefineProperty(target, "isImmutable", IsImmutableConfiguration)
  }
  return SetImmutable(target)
}









function BeImmutableSpan(span) {
  InterMap.set(span, ConfirmedFact)
  return SetImmutable(span)
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
      _AddGetter(this._instanceRoot, selector, handler, true)
      break

    case LAZY_INSTALLER :
      _AddGetter(this._instanceRoot, selector, function _loader() {
        DefineProperty(this, selector, InvisibleConfiguration)
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
    const aliasNames = VisibleLocalNames(aliases)
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


instanceMethods
instanceProperties
methods
properties
supertypes
