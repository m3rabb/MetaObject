const CONTEXT_PARAM_MATCHER  = /^((\$)|(_))?([\w$]+)(_)?$/

function MakePermeableNewHandler(NewHandler) {
  return function permeableNew(...args) {
    const   instance = NewHandler.apply(this, args)
    const _$instance = InterMap.get(instance)
    const  $instance = _$instance[$OUTER]
    const  _instance = _$instance[$PULP]

    DefineProperty($instance, "this", InvisibleConfig)
    $instance.this = _instance
    return instance
  }
}

const BasicPermeableNewDef =
  Definition("new", MakePermeableNewHandler(_BasicNew), BASIC_VALUE_METHOD)

function MakePermeableNewDef(newHandler) {
  return (newHandler === _BasicNew) ?
    BasicPermeableNewDef : MakePermeableNewHandler(newHandler)
}


_Context.addMethod(function _unknownProperty(selector) {
  const supercontext = this.supercontext
  return (supercontext) ? supercontext[selector] : null
})

_Context.addMethod(function _init(supercontext_name_, supercontext_) {
  const [name, context] = (supercontext_name_ === undefined) ?
    [null, supercontext_ || null] :
    (supercontext_name_.isContext ?
      [null, supercontext_name_] :
      [supercontext_name_, supercontext_])
  this.name         = name
  this.supercontext = context
  this.ownTypes     = EMPTY_ARRAY
})


_Context.addRetroactiveProperty(function id() {
  return `${this.formalName},${this.basicId}`
})

_Context.addMethod(function formalName() {
  const context = this.supercontext
  const prefix  = context ? context.formalName + "@" : ""
  return `${prefix}${this.name}`
})

_Context.addMethod(function ancestry() {
  var nextContext = this[$RIND]
  const contexts = []
  do {
    contexts.unshift(nextContext)
  } while ((nextContext = nextContext.supercontext))
  return BasicSetObjectImmutable(contexts)
})

_Context.addMethod(function allTypes() {
  const found = SpawnFrom(null)
  this.ancestry.forEach(context => {
    context.ownTypes.forEach(type => found[type.name] = type)
  })
  const names = OwnKeys(found).sort()
  return BasicSetObjectImmutable(names.map(name => found[name]))
})

// _Context.addMethod(function allTypes() {
//   var nextContext = this, index = 0
//   const found = SpawnFrom(null)
//   const types = []
//
//   do {
//     nextContext.ownTypes.forEach(type => {
//       const name = type.name
//       if (!found[name]) {
//         found[name] = true
//         types[index++] = type
//       }
//     })
//   } while ((nextContext = nextContext.supercontext))
//
//   return BasicSetObjectImmutable(types)
// })




_Context.addMethod(function atPut(name, value) {
  if (value && value.isType && !value.context) {
    value.setContext(this.$)
    this.ownTypes = BasicSetObjectImmutable([...this.ownTypes, value])
  }
  this[name] = value
})

_Context.addMethod(function add(object) {
  this.atPut(object.name, object)
})


_Context.addMethod(function sub(execContext) {
  const supercontext   = this[$RIND]
  const newContextName = execContext.name || null
  const newContext     = _Context.new(newContextName, supercontext)

  const paramListing = ExtractParamListing(execContext)
  const isReadOnly   = (paramListing.indexOf("_") < 0)
  const params       = PARAMS_MATCHER.exec(paramListing)

  if (isReadOnly) {
    args = params.map(param => {
      const name = (param[0] === "$") ? param.slice(1) : param
      return this[name]
    })
    execContext.apply(newContext, args)
    return this
  }

  const defined       = SpawnFrom(null)
  const useOriginalAt = []
  const names         = []

  // Identify the mutable and permeable params
  params.forEach((param, index) => {
    const match       = CONTEXT_PARAM_MATCHER.exec(param)
    const name        = match[4]
    const isPermeable = match[5]
    const isMutable   = match[3] || isPermeable

    useOriginalAt[index] = !!match[2]
    names[index]         = name

    if (isMutable) { defined[name] = isPermeable ? PERMEABLE : true }
  })

  // Find all types that need to be added to the set of properties
  // to be mutably copied.
  const redefinedTypes = new Map()
  this.allTypes.forEach(type => {
    const ancestry = type.ancestry
    for (var index = 0, count = ancestor.length - 1; index < count; index++) {
      var ancestorName = ancestor[index].name
      if (defined[ancestorName] !== undefined) {
        defined[type.name] = false
        break
      }
    }
  })

  // Set mutable copies of necessary properties into working context
  for (var name in redefined) {
    const value       = this[name]
    const marker      = redefined[name]
    const asImmutable = !marker
    const isPermeable = (marker === PERMEABLE)
    const visited     = new Map()
    const newValue    = (value === undefined) ?
      (this.Type || ObjectSauce.Type).new(name) : Copy(value, false, visited)

    if (newValue) {
      if (value.isType) { newValue.setContext(this.$) }
      if (isPermeable)  { BePermeable(value) }
      if (asImmutable)  { value.beImmutable || SetImmutableObject(target) }
    }
    newContext.atPut(name, newValue)
  }

  // Reconcile new types' supertypes
  newContext.ownTypes.forEach(newType => {
    const supertypes = newType.supertypes.map(supertype => {
      const newSupertype = visited.get(supertype)
      return newSupertype || supertype
    })
    const _$newType = InterMap.get(newType)
    _$newType._supertypes = BasicSetObjectImmutable(supertypes)
  })

  // Build args
  args = names.map((name, index) =>
    (useOriginalAt[index]) ? this[name] : newContext[name])
  execContext.apply(newContext, args)
  return newContext
})



_Context.addMethod(function _setPropertiesImmutable(inPlace, visited) {
  const ownNames = OwnNames(this[$OUTER])
  ownNames.forEach(name => {
    const value = this[name]
    if (value && value.isType) { value.beImmutable }
    else { this[name] = ValueAsFact(value, inPlace, visited, this.$) }
  })
})


// isAbsolutelyImpermeable
