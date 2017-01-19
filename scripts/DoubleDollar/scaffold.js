const ImplementationHandler = {
  __proto__ : null,
  get (_base_root, name, target) {
    return target._noSuchProperty(name)
  },
  // set (_base_root, selector, value, inner) {
  //   if (inner[_$isImmutable]) {
  //     return inner._innerImmutableWrite(inner, selector, value) || false
  //   }
  //   inner[selector] = value
  //   return true
  // }
}

const Base_root             = SpawnFrom(null)
const   Stash_root          = SpawnFrom(Base_root)

const   Implementation_root = new Proxy(Base_root, ImplementationHandler)
const     Inner_root        = SpawnFrom(Implementation_root)

const       Nothing_root    = SpawnFrom(Inner_root)
const       Thing_root      = SpawnFrom(Inner_root)
const       Type_root       = SpawnFrom(Inner_root)
const       Method_root     = SpawnFrom(Inner_root)
const       Context_root    = SpawnFrom(Inner_root)
const       Name_root       = SpawnFrom(Inner_root)

function ConstructorError(constructor) {
  SignalError(constructor.name,
    " is only for use with 'instanceof', it's not meant to be executed!")
}

function Implementation () { ConstructorError(Implementation) }
function Inner ()          { ConstructorError(Inner)          }

Implementation.prototype = Implementation_root
Inner.prototype          = Inner_root

ShallowFreeze(Base_root)
ShallowFreeze(Stash_root)
ShallowFreeze(Implementation_root)
ShallowFreeze(Inner_root)
ShallowFreeze(Implementation)
ShallowFreeze(Inner)


let HandleErrorsQuietly        = false
let HandleInheritancePoisoning = true

function _HandleErrorsQuietly(bool_) {
  return (arguments.length) ?
    (HandleErrorsQuietly = bool_) : HandleErrorsQuietly
}

function SignalError(target, message) {
  if (HandleErrorsQuietly) {
    console.warn(message)
  } else {
    console.error(message)
    const error = new Error(message)
    error.name = "TopError"
    error.target = target
    throw error
  }
  return null
}


function AtPutMethod(target, selector, func) {
  target[selector] = func
}

function PutMethod(target, namedFunc) {
  target[namedFunc.name] = namedFunc
}


// Change name into an instance of Name!!!
PutMethod(Thing_root, function _init(name_) {
  // this._super._Init(arguments);
  if (name_ !== undefined) { this.name = name_ }
})


function ConnectTypes(_type, supertypes) {
  const typeOID = _type.oid
  return supertypes.map(supertype => {
    const _supertype = GetInner(supertype)
    _supertype._subtypes[typeOID] = _type
    return _supertype
  })
}

// _supertypes each type to the left overrides types to the right
// ancestors each type to the right overrides types to the left
function BuildAncestors(_supertypes) {
  let next = _supertypes.length
  if (next === 0) { return [] }

  let _supertype = _supertypes[--next]
  const ancestors = _supertype.ancestry.slice()
  if (next === 0) { return ancestors }

  const visited = { __proto__ : null }
  ancestors.forEach(_type => (visited[_type.oid] = _type))

  do {
    _supertype = _supertypes[--next]
    let oid = _supertype.oid
    if (!visited[oid]) {
      _supertype.ancestry.forEach(_type => {
        const oid = _type.oid
        if (!visited[oid]) { ancestors.push((visited[oid] = _type)) }
      })
    }
  } while (next)
  return ancestors
}

function SeedInstanceRootMethodHandlers(_root, _ancestors) {
  const count = _ancestors.length
  let next = 0
  while (next < count) {
    const methods = _ancestors[next++].methods
    for (const selector in methods) {
      _root[selector] = methods[selector].handler
    }
  }
}

function ReseedSubtypesMethodHandler(type, selector, handler) {
  const subtypes = type.subtypes
  for (const oid in subtypes) {
    ReseedTypeMethodHandler(subtypes[oid], selector, handler)
  }
}

function ReseedTypeMethodHandler(type, selector, handler) {
  if (type.methods[selector] == undefined) {
    type._instanceRoot[selector] = handler
    ReseedSubtypesMethodHandler(type, selector, handler)
  }
}


// Type bootstrapping

PutMethod(Type_root, function _init(name, supertypes, _root_) {
  const _supertypes  = ConnectTypes(this, supertypes)
  const _ancestors   = BuildAncestors(_supertypes)
  const _root        = _root_ || { __proto__ : Inner_root }

  this.name          =  name // this._asExec(Thing, "_init", name)
  this._instanceRoot = _root
  this.supertypes    = _supertypes
  this.subtypes      = { __proto__ : null }
  this.methods       = { __proto__ : null }
  // this.context       = null

  _root.type     = this
  _root[ROOT]    = _root
  SeedInstanceRootMethodHandlers(_root, _ancestors)
  _root.ancestry = ShallowFreeze(_ancestors.push(this))
})

Type.addSGetter(function copy() {
  // Fix to make name a copy!!!
  const type = Type.new(this.name, this.supertypes)
})

PutMethod(Type_root, function new(...args) {
  var instance = SpawnFrom(this._instanceRoot)
  instance._init(...args)
  return instance
})


_Type_root._instanceRoot = _Type_root
const Thing   = _Type_root.new("Thing"  , []     , Thing_root)
const Type    = _Type_root.new("Type"   , [Thing], Type_root)
const Nothing =       Type.new("Nothing", []     , Nothing_root)
const Method  =       Type.new("Method" , [Thing], Method_root)
const Context =       Type.new("Context", [Thing], Context_root)
const Name    =       Type.new("Name"   , [Thing], Name_root)

PutMethod(Method_root, function _init(func_name, func_) {
  const isFuncArg = (typeof func_name === "function")
  const [name, func] = isFuncArg ?
    [func_name.name, func_name] : [func_name, func_]
  if (!name || !isFuncArg &&
      (typeof name !== "string" || typeof func !== "function")) {
    return this.error("Args must be named function, or name and function!")
  }
  if (!IsValidMethodSelector(name)) {
    return this.error("Method must have a valid selector name!")
  }
  this.selector = name
  this.handler = func
  // this.imp = WrapFunction(func)
})

PutMethod(Type_root, function addSMethod(method_func__name, func__) {
  const type = method_func__name.type
  const method = type && type.is(Method) ?
    method_func__name : Method.new(method_func__name, func__)
  const selector = method.selector
  const handler = method.handler
  this.methods[selector] = method
  this._instanceRoot[selector] = handler
  ReseedSubtypesMethodHandler(this, selector, handler)
  return this
})

// Method bootstrapping

Thing.addSMethod(INTER, Thing_root._instanceRoot[INTER])
Thing.addSMethod(       Thing_root._instanceRoot._init)
Thing.addSMethod(       Thing_root._instanceRoot.is)
Type.addSMethod(         Type_root._instanceRoot._init)
Type.addSMethod(         Type_root._instanceRoot.new)
Type.addSMethod(         Type_root._instanceRoot.addSMethod)
Method.addSMethod(     Method_root._instanceRoot._init)

Thing.addSMethod(function _noSuchProperty(name) {
  return this.error(`No such property: ${name}!`)
})

Nothing.addSMethod(Thing_root.is)
Nothing.addSMethod(Thing_root._noSuchProperty)


Thing.addSMethod(function addOMethod(method_func__name, func_) {
  const type = method_func__name.type
  const method = type && type.is(Method) ?
    method_func__name : Method.new(method_func__name, func__)
  const selector = method.selector
  const methods = (this[INSTANCE_METHODS] ||
    this[INSTANCE_METHODS] = { __proto__ : null })
  methods[selector] = method
  this[selector] = method.handler
  return this
})
