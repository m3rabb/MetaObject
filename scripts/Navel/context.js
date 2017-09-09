ObjectSauce(function (
  $LOCKED, $OUTER, $PULP, $RIND, EMPTY_ARRAY, EMPTY_THING_ANCESTRY,
  INHERITED, IS_IMMUTABLE, MUTABLE, PERMEABLE, TRUSTED_VALUE_METHOD,
  AsDecapitalized, BasicSetObjectImmutable, BeImmutable, Copy, DefineProperty,
  Definition_init, ExtractParamNames, InterMap,
  InvisibleConfig, IsSauced, IsSubtypeOfThing, OwnKeys,
  SignalError, _BasicNew,
  SetObjectImmutable, SpawnFrom, ValueAsFact,
  DefaultContext, Definition, Type, _Context,
  PrivateAccessFromOutsideError,
  _OSauce
) {
  "use strict"


  _Context.addMethod(function _init(supercontext_name_, supercontext_) {
    const [name, context] = (supercontext_name_ === undefined) ?
      [null, supercontext_ || null] :
      (supercontext_name_.isContext ?
        [null, supercontext_name_] :
        [supercontext_name_, supercontext_])
    this.name          = name
    this.supercontext  = context
    this._knownEntries = SpawnFrom(context && context._knownEntries)
  })


  _Context.addMethod(function _privateAccessFromOutside(selector) {
    const entry = this._knownEntries[selector]
    return (entry !== undefined) ? entry :
      PrivateAccessFromOutsideError(this, selector)
  })

  _Context.addMethod(function _unknownProperty(selector) {
    const entry = this._knownEntries[selector]
    return (entry !== undefined) ?
      entry : this._super._unknownProperty(selector)
  })


  _Context.addMethod(function _setPropertiesImmutable(inPlace, visited) {
    var selector, entry
    const entries = this._knownEntries
    for (selector in entries) {
      entry = entries[selector]
      if (entry && entry.isType) { entry.beImmutable }
      else {
        var fact = ValueAsFact(entry, inPlace, visited, this.$)
        this[selector] = entries[selector] = fact
      }
    }
  })

  _Context.addMethod(function lock() {
    var selector, entry
    if (this.isLocked) { return this }
    const entries = this._knownEntries
    for (selector in entries) {
      entry = entries[selector]
      if (IsSauced(entry)) { entry.lock }
    }
    this._super.lock
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

  _Context.addMethod(function _knownTypes() {
    var selector, entry, index
    const entries = this._knownEntries
    const types   = []

    index = 0
    for (selector in entries) {
      entry = entries[selector]
      if (entry && entry.isType) { types[index++] = entry }
    }
    return types
  })

  _Context.addMethod(function _ownEntries() {
    const known     = this._knownEntries
    const selectors = OwnKeys(known)
    const own       = SpawnFrom(null)

    selectors.forEach(selector => own[selector] = known[selector])
    return own
  })


  _Context.addMethod(function atPut(selector, entry) {
    if (entry && entry.isType && entry.context === DefaultContext) {
      entry.setContext(this.$)
    }
    this.ownTypes = BasicSetObjectImmutable([...this.ownTypes, entry])
    this[selector] = this.entries[selector] = entry
  })

  _Context.addMethod(function add(object) {
    this.atPut(object.name || object.tag, object)
  })




  _Context.addMethod(function sub(execContext) {
    const supercontext   = this[$RIND]
    const newContextName = execContext.name || null
    const contextType    = this.Context || _Context
    const newContext     = contextType.new(newContextName, supercontext)
    const paramNames     = ExtractParamNames(execContext)
    const superEntries   = this._knownEntries
    const markedTypes    = SpawnFrom(null)
    const visited        = new WeakMap()

    const paramSpecs = ClassifyParams(paramNames, superEntries, markedTypes)

    this._markDependentTypes(markedTypes)
    newContext._putCopyForEachMarked(markedTypes, superEntries, visited)

    const args = newContext._composedArguments(
      paramSpecs, markedTypes, visited)
    execContext.apply(newContext, args)
    return newContext
  })


  const CONTEXT_PARAM_MATCHER    = /^((\$)|(_))?([\w$]+)(_)?$/
  const TYPE_NAME_MATCHER = /^[A-Z][a-z][\w$]*$/


  function ClassifyParams(paramNames, knownEntries, markedTypes) {
    return paramNames.map(paramName =>
      ClassifyParam(paramName, knownEntries, markedTypes))
  }

  function ClassifyParam(paramName, knownEntries, markedTypes) {
    var value, paramSpec, name, isType
    value     = knownEntries[paramName]
    paramSpec = { paramName : paramName }

    if (value !== undefined) {
      name = paramName
      paramSpec.asInherited = (paramName[0] === "_")
    }
    else {
      name  = AsDecapitalized(paramName)
      value = knownEntries[name]

      if (value === undefined) {
        const match       = CONTEXT_PARAM_MATCHER.exec(paramName)
        const asInherited = !!match[2]
        const asMutable   = !!match[3]
        const asPermeable = !!match[5]

        name   =   match[4]
        value  = knownEntries[name]
        isType = !!(value && value.isType)

        if (asPermeable && (asInherited || asMutable)) { return null }
        if (isType && asMutable) { markedTypes[name] = MUTABLE }

        paramSpec.asInherited = asInherited
        paramSpec.asMutable   = asMutable
        paramSpec.asPermeable = asPermeable
        paramSpec.isType      = isType
      }
    }

    paramSpec.name   = name
    paramSpec.$value = value

    return paramSpec
  }

  _Context.addMethod(function _markDependentTypes(markedTypes) {
    const knowns = this._knownTypes
    MarkDescendants(knowns, markedTypes)
    if (markedTypes["Type"]) { MarkAllRemainingType(knowns, markedTypes) }
  })

  function MarkDescendants(knownTypes, markedTypes) {
    knownTypes.forEach(type => MarkIfDescendantOfAny(type, markedTypes))
  }

  function MarkIfDescendantOfAny(type, markedTypes) {
    var next, ancestorName
    const ancestry = type.ancestry
    next = ancestry.length - 1
    while (next--) {
      ancestorName = ancestry[next].name
      if (markedTypes[ancestorName] !== undefined) {
        markedTypes[type.name] = INHERITED
        return
      }
    }
  }

  function MarkAllRemainingType(knownTypes, markedTypes) {
    knownTypes.forEach(type => {
      const name = type.name
      if (markedTypes[name] === undefined) { markedTypes[name] = false }
    })
  }

  _Context.addMethod(function _putCopyForEachMarked(markedTypes, sourceTypes, visited) {
    var typeType, newType, name, sourceType, supertypesPlaceholder

    const newContext = this[$RIND]
    const newTypes   = []

    typeType = sourceTypes.Type || Type

    if (markedTypes["Type"]) {
      newType = typeType.copy(visited)
      visited.set(typeType, newType)
      newContext.atPut("Type", newType)
      newTypes.push(newType)
      typeType = newType
      delete markedTypes["Type"]
    }

    for (name in markedTypes) {
      sourceType = sourceTypes[name]
      supertypesPlaceholder = IsSubtypeOfThing(sourceType) ?
        EMPTY_THING_ANCESTRY : EMPTY_ARRAY
      newType = typeType.new(sourceType.name, supertypesPlaceholder)
      visited.set(sourceType, newType)
      newContext.atPut(name, newType)
      newTypes.push(newType)
    }

    if ((sourceType = markedTypes["Definition"])) {
      const newType   = visited.get(sourceType)
      const _$newType = InterMap.get(newType)
      _$newType._blanker.$root$inner._init = Definition_init
    }

    newTypes.sort((a, b) => a.ancestry.length - b.ancestry.length)

    newTypes.forEach(newType => {
      const _$newType   = InterMap.get(newType)
      const name        = _$newType.name
      const sourceType  = sourceTypes[name]
      const asMutable   = (markedTypes[name] === MUTABLE)
      _$newType[$PULP]._reconcileFrom(sourceType, asMutable, visited, this.$)
    })
  })

  _Context.addMethod(function _composeArgs(paramSpecs, markedTypes, visited) {
    return paramSpecs.map(paramSpec =>
      this._composeArg(paramSpec, this[paramSpec.name], markedTypes, visited))
  })


  _Context.addMethod(function _composeArg(paramSpec, value, markedTypes, visited) {
    var arg, { name, $value, asInherited,
               asMutable, asPermeable, isType } = paramSpec

    if (asInherited)         { return $value }
    if (value === null)      { return  null  }
    if (value === undefined) {
      if (!(asMutable && name.match(TYPE_NAME_MATCHER))) { return value }
      arg = this.Type.new(name)
    }
    else {
      if (asPermeable) {
        arg = Copy(value, false, visited, this.$)
        return (arg === value) ? arg : BePermeable(arg, value[IS_IMMUTABLE])
      }
      if (isType)      { return value }
      if (asMutable)   {
        arg = Copy(value, false, visited, this.$)
      }
      else {
        if (!markedTypes[value.typeName]) { return value }
        arg = Copy(value, false, visited, this.$)
        if (value[IS_IMMUTABLE]) { BeImmutable(value) }
      }
    }

    this.atPut(name, arg)
    return arg
  })



  function BePermeable(target, beImmutable) {
    const _$target = InterMap.get(target)
    if (!_$target) { return target }
    if (_$target[$LOCKED]) {
      return target._signalError("Can't make permeable copies of locked objects!!")
    }

    const _target = _$target[$PULP]
    const $target = _$target[$OUTER]
    DefineProperty($target, "this", InvisibleConfig)
    $target.this = _target

    if (_$target.isType) { AddPermeableNewDefinitionToType(_$target) }
    if (beImmutable) { _target._setImmutable() }
    return target
  }

  function AddPermeableNewDefinitionToType(_$type) {
    const newHandler    = _$type.new.handler
    const newDefinition = (newHandler === _BasicNew) ?
      BasicPermeableNewDef : MakePermeableNewDef(newHandler)
    return _$type[$PULP].addOwnDefinition(newDefinition)
  }

  function MakePermeableNewDef(NewHandler) {
    const handler = function permeableNew(...args) {
      const   instance = NewHandler.apply(this, args)
      const _$instance = InterMap.get(instance)
      const  $instance = _$instance[$OUTER]
      const  _instance = _$instance[$PULP]

      DefineProperty($instance, "this", InvisibleConfig)
      $instance.this = _instance
      return instance
    }
    return this.Definition("new", handler, TRUSTED_VALUE_METHOD)
  }

  const BasicPermeableNewDef = MakePermeableNewDef(_BasicNew)



  _OSauce.AddPermeableNewDefinitionToType = AddPermeableNewDefinitionToType

})

  // isAbsolutelyImpermeable
