Tranya(function (
  $INNER, $IS_TYPE, $PULP, $RIND,
  COUNT, INHERITED, IS_IMMUTABLE, MUTABLE, MUTABLE_PASS_FUNCS,
  PERMEABLE, VALUE_METHOD,
  AsDecapitalized, BePermeable, ValueAsNext,
  CompareSelectors, CrudeBeImmutable, BeImmutableValue, ValueCopy,
  DefaultContext, Definition, Definition_init, EmptyThingAncestry,
  ExtractParamNames, InterMap, IsSubtypeOfThing,
  RootContext, SetInvisibly, SpawnFrom, TheEmptyArray, Type, ValueAsFact,
  ValueBeImmutable, ValueIsTranyan, _HasOwn,
  OwnKeysOf, _OwnKeysOf,
  _BasicNew, _Context
) {
  "use strict"


  _Context.addSelfMethod(function atPut(selector, entry) {
    if (this[$RIND] === DefaultContext)         { return }
    if (this._knownEntries[selector] === entry) { return }

    if (selector in this[$INNER]) {
      return this._entryOvershadowsPropertyError(selector)
    }

    this._atPut(selector, entry)

    const _$entry = InterMap.get(entry)
    if (_$entry && _$entry[$IS_TYPE] && _$entry.context === DefaultContext) {
      _$entry[$PULP]._setContext(this[$RIND])
    }
  })


  _Context.addSelfMethod(function add(object) {
    this.atPut(object.name || object.tag, object)
  })



  _Context.addValueMethod(function _setPropertiesImmutable(inPlace, visited) {
    const entries   = this._knownEntries
    const selectors = _OwnKeysOf(entries)

    selectors.forEach(selector => {
      var entry, _$entry, fact
        entry = entries[selector]
      _$entry = InterMap.get(entry)
      if (_$entry && _$entry[$IS_TYPE]) { entry.setImmutable(inPlace, visited) }
      else {
        fact = ValueAsFact(entry, inPlace, visited)
        if (fact !== entry) { this[selector] = entries[selector] = fact }
      }
    })
    return this
  })



  _Context.addValueMethod(function beImpenetrable() {
    var selector, entry
    if (this.isImpenetrable) { return this }
    const entries = this._knownEntries
    for (selector in entries) {
      entry = entries[selector]
      if (ValueIsTranyan(entry)) { entry.beImpenetrable }
    }
    return this._super.beImpenetrable
  })



  _Context.addRetroactiveValue(function id() {
    return `${this.formalName},${this.oid}`
  })

  _Context.addValueMethod(function formalName() {
    const context = this.supercontext
    const prefix  = context ? context.formalName + "@" : ""
    return `${prefix}${this.name}`
  })


  _Context.addValueMethod(function ancestry() {
    var nextContext = this[$RIND]
    const contexts = []
    do {
      contexts.unshift(nextContext)
    } while ((nextContext = nextContext.supercontext))
    return CrudeBeImmutable(contexts)
  })



  _Context.addValueMethod(function at(selector) {
    return this._knownEntries[selector]
  })

  _Context.addValueMethod(function ownAt(selector) {
    const entries = this._knownEntries
    return _HasOwn.call(entries, selector) ? entries[selector] : undefined
  })


  _Context.addMethod(function knownEntries() {
    return this._knownEntries
  })

  _Context.addValueMethod(function ownEntries() {
    const known     = this._knownEntries
    const selectors = OwnKeysOf(known)
    const own       = SpawnFrom(null)

    selectors.forEach(selector => own[selector] = known[selector])
    return ValueBeImmutable(own)
  })

  _Context.addValueMethod(function knownTypes() {
    return CrudeBeImmutable(TypesFrom(this._knownEntries))
  })

  _Context.addValueMethod(function ownTypes() {
    return CrudeBeImmutable(TypesFrom(this.ownEntries))
  })


  _Context.addValueMethod(function knownKeys() {
    var selectors, selector, index
    const entries = this._knownEntries

    selectors = []
    index = 0
    for (selector in entries) {
      selectors[index++] = selector
    }
    return CrudeBeImmutable(selectors.sort(CompareSelectors))
  })

  _Context.addValueMethod(function ownKeys() {
    return OwnKeysOf(this._knownEntries)
  })

  _Context.addValueMethod(function knownTypeNames() {
    return CrudeBeImmutable(
      TypesFrom(this._knownEntries).map(type => type.name))
  })

  _Context.addValueMethod(function ownTypeNames() {
    return CrudeBeImmutable(TypesFrom(this.ownEntries).map(type => type.name))
  })


  function TypesFrom(entries) {
    var selector, entry, _$entry, index
    const types = []

    index = 0
    for (selector in entries) {
      entry   = entries[selector]
      _$entry = InterMap.get(entry)
      if (_$entry && _$entry[$IS_TYPE]) { types[index++] = entry }
    }
    return types.sort((a, b) => a.name.localeCompare(b.name))
  }



  _Context.addValueMethod(function _externalPrivateAccess(selector) {
    const entry = this._knownEntries[selector]
    return (entry !== undefined) ?
      entry : this._super._externalPrivateAccess(selector)
  })

  _Context.addValueMethod(function _unknownProperty(selector) {
    const entry = this._knownEntries[selector]
    return (entry !== undefined) ?
      entry : this._super._unknownProperty(selector)
  })


  _Context.addSelfMethod(function _entryOvershadowsPropertyError(selector) {
    return this._signalError(`Entry cannot overshadow existing property '${selector}'!!`)
  })



  _Context.addValueMethod(function newSub(execFunc) {
    return this._exec(execFunc, true)
  })

  _Context.addAlias("newSubcontext", "newSub")


  _Context.addValueMethod(function exec(execFunc) {
    return this._exec(execFunc, false)
  })


  // Work(function Xyz(Employee, Office, Job, Building) {
  //   this.
  // })
  //
  // Work(function (_Employee, Office, Job, Building) {
  //   this.
  // })

  _Context.addValueMethod(function _hasOverwritingParam(marked) {
    const mutability = marked[MUTABLE]
    return mutability ||
      this[IS_IMMUTABLE] && (mutability !== undefined) || false
  })

  _Context.addValueMethod(function _exec(execFunc, forceAsCopy_) {
    const sourceContext = this[$RIND]
    const sourceEntries = this._knownEntries

    const execName      = execFunc.name
    const paramNames    = ExtractParamNames(execFunc)
    const visited       = new WeakMap()
    const marked        = SpawnFrom(null)

    marked[COUNT]       = 0
    const paramSpecs    = ClassifyParams(paramNames, marked, sourceEntries)

    const useNewContext = marked[MUTABLE] =
      !!(forceAsCopy_ || execName || this._hasOverwritingParam(marked))
    const Context       = this.context.atOrInRootAt("Context")
    const execContext   = useNewContext ?
      Context.new(execName, sourceContext) : sourceContext

    if (useNewContext && marked[COUNT]) {
      MarkDependentTypes    (execContext, marked)
      InPutCopyForEachMarked(execContext, sourceEntries, marked, visited)
    }

    const args = ComposeArgs(execContext, paramSpecs, marked, visited)
    execFunc.apply(execContext, args)
    return execContext
  })



  const CONTEXT_PARAM_MATCHER    = /^((\$)|(_))?([\w$]*[a-z$])(_)?$/i
  const TYPE_NAME_MATCHER = /^[A-Z][a-z][\w$]*$/


  function ClassifyParams(paramNames, marked, knownEntries) {
    return paramNames.map(paramName =>
      ClassifyParam(paramName, marked, knownEntries))
  }

  function ClassifyParam(paramName, marked, knownEntries) {
    var value, _$value, paramSpec, name, isType
    value     = knownEntries[paramName]
    paramSpec = { paramName : paramName }

    if (value !== undefined) {
      name = paramName
      // paramSpec.asInherited = (paramName[0] === "_")
    }
    else {
      name  = AsDecapitalized(paramName)
      value = knownEntries[name]

      if (value === undefined) {
        const match       = CONTEXT_PARAM_MATCHER.exec(paramName)
        const asInherited = !!match[2]
        const asMutable   = !!match[3]
        const asPermeable = !!match[5]

        name    = match[4]
        value   = knownEntries[name]
        _$value = InterMap.get(value)
        isType  = !!(_$value && _$value[$IS_TYPE])

        if (asPermeable && (asInherited || asMutable)) { return null }

        if (asMutable) {
          marked[MUTABLE] = (value !== undefined)
          if (isType) {
            marked[name] = MUTABLE
            marked[COUNT]++
          }
        }

        paramSpec.asInherited = asInherited
        paramSpec.asMutable   = asMutable
        paramSpec.asPermeable = asPermeable
        paramSpec.isType      = isType
      }
    }

    paramSpec.selector       = name
    paramSpec.inheritedValue = value

    return paramSpec
  }

  function MarkDependentTypes(execContext, marked) {
    const knownTypes = execContext.knownTypes
    if (marked["Type"]) { MarkAllUnmarkedTypes(knownTypes, marked) }
    else { MarkDescendants(knownTypes, marked) }
  }

  function MarkAllUnmarkedTypes(knownTypes, marked) {
    knownTypes.forEach(type => {
      const name = type.name
      if (marked[name] === undefined) { marked[name] = false }
    })
  }

  function MarkDescendants(knownTypes, marked) {
    knownTypes.forEach(type => MarkIfDescendantOfAny(type, marked))
  }

  function MarkIfDescendantOfAny(type, marked) {
    var next, ancestorName
    const ancestry = type.ancestry
    next = ancestry.length - 1
    while (next--) {
      ancestorName = ancestry[next].name
      if (marked[ancestorName] !== undefined) {
        marked[type.name] = INHERITED
        return
      }
    }
  }


  function InPutCopyForEachMarked(execContext, sourceTypes, marked, visited) {
    var newTypes, Type, newType, name, sourceType, supertypesPlaceholder

    newTypes = []
    Type     = sourceTypes.Type || RootContext.Type

    if (marked["Type"]) {
      newType = Type.copy(visited)
      visited.set(Type, newType)
      execContext.atPut("Type", newType)
      newTypes.push(newType)
      Type = newType
      delete marked["Type"]
    }

    for (name in marked) {
      sourceType = sourceTypes[name]
      supertypesPlaceholder = sourceType.isRootType ?
        TheEmptyArray : EmptyThingAncestry
      newType = Type.new(sourceType.name, supertypesPlaceholder)
      visited.set(sourceType, newType)
      execContext.atPut(name, newType)
      newTypes.push(newType)
    }

    if ((sourceType = marked["Definition"])) {
      const newType   = visited.get(sourceType)
      const _$newType = InterMap.get(newType)
      _$newType._blanker.$root$inner._init = Definition_init
    }

    newTypes.sort((a, b) => a.ancestry.length - b.ancestry.length)

    newTypes.forEach(newType => {
      const _newType   = InterMap.get(newType)[$PULP]
      const name       = _newType.name
      const sourceType = sourceTypes[name]
      const asMutable  = (marked[name] === MUTABLE)
      _newType._reconcileFrom(sourceType, asMutable, visited, execContext)
    })
  }

  function ComposeArgs(execContext, paramSpecs, marked, visited) {
    const _$execContext = InterMap.get(execContext)
    return paramSpecs.map(paramSpec =>
      ComposeArg(_$execContext, paramSpec, marked, visited))
  }


  function ComposeArg(_$execContext, paramSpec, marked, visited) {
    var Type, arg, context
    const { selector : name, inheritedValue, asInherited,
            asMutable, asPermeable, isType } = paramSpec
    const entries     = _$execContext._knownEntries
    const value       = entries[name]
    const execContext = _$execContext[$RIND]

    if (asInherited)    { return inheritedValue }
    if (value === null) { return     null       }
    if (value === undefined) {
      if (!(asMutable && name.match(TYPE_NAME_MATCHER))) { return value }
      Type = entries.Type || RootContext.Type
      arg  = Type.new(name, execContext)
    }
    else {
      if (asPermeable) {
        context = (value === inheritedValue) ? null : execContext
        arg = ValueCopy(value, false, visited, context)
        return (arg === value) ? arg : BePermeable(arg, value[IS_IMMUTABLE])
      }
      if ( isType  ) { return value  }
      if (asMutable) {
        arg = ValueCopy(value, false, visited, execContext)
      }
      else {
        if (!marked[MUTABLE]) { return value }
        arg = ValueAsNext(value, value[IS_IMMUTABLE], visited, execContext)
      }
    }

    if (arg !== value) { execContext.atPut(name, arg) }
    return arg
  }

})

  // isAbsolutelyImpermeable isImpenetrable



  // _Context.addSelfMethod(function knownEntriesDo(action) {
  //   const entries = this._knownEntries
  //   for (var key in entries) { action(entries[key], key) }
  // })
  //
  // _Context.addSelfMethod(function ownEntriesDo(action) {
  //   const entries = this._knownEntries
  //   const keys    = _OwnKeysOf(this._knownEntries)
  //   keys.forEach(key => action(entries[key], key) }
  // })
  //
  // _Context.addSelfMethod(function entriesDo(scale, action) {
  //   (scale.toUpperCase() === "OWN") ?
  //     this.ownEntriesDo(action) : knownEntriesDo(action)
  // })
  //
  // _Context.addValueMethod(function ownTypes() {
  //   var   index = 0
  //   const types = []
  //
  //   this.entriesDo("OWN", entry => {
  //     const _$entry = InterMap.get(entry)
  //     if (_$entry && _$entry[$IS_TYPE]) { types[index++] = entry }
  //   })
  //   return CrudeBeImmutable(types)
  // })
