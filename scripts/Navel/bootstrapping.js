ObjectSauce(function (
  $ASSIGNERS, $BARRIER, $DELETE_ALL_PROPERTIES, $DELETE_IMMUTABILITY,
  $DISGUISE, $IMMEDIATES, $INNER, $IS_CONTEXT, $IS_DEFINITION, $IS_INNER,
  $IS_TYPE, $OUTER, $OUTER_WRAPPER, $PULP, $RIND, $ROOT, $SUPERS,
  ALWAYS_SELF, ASSIGNER, DECLARATION, EMPTY_ARRAY, EMPTY_OBJECT, IMPLEMENTATION,
  INHERIT, INVISIBLE, IS_IMMUTABLE, PROOF, REINHERIT, VISIBLE, _DURABLES,
  ASSIGNER_FUNC, HANDLER_FUNC, INNER_FUNC, OUTER_FUNC,
  IDEMPOT_SELF_METHOD, IDEMPOT_VALUE_METHOD, IMMEDIATE_METHOD,
  MANDATORY_SETTER_METHOD, SETTER_METHOD, STANDARD_METHOD, TRUSTED_VALUE_METHOD,
  AsCapitalized, AsImmutable, AsMembershipSelector, AsName, AsPropertySymbol,
  DeleteSelectorsIn, ExtractParamListing, Frost, InvisibleConfig, IsArray,
  MarkFunc, NewAssignmentErrorHandler, NewBlanker, NewInner,
  NewVacuousConstructor, SpawnFrom, _HasOwn,
  AttemptedChangeOfAncestryOfPermeableTypeError, DuplicateSupertypeError,
  ImproperChangeToAncestryError, SignalError, UnnamedFuncError,
  BasicSetObjectImmutable, MarkAndSetFuncImmutable,
  InterMap, PropertyToSymbolMap,
  BuildAncestryOf, RootOf,
  AsRetroactiveProperty, AsSetterFromProperty, CompletelyDeleteProperty,
  DefineProperty, InSetProperty, SetAsymmetricProperty,
  AsAssignmentSetter, AsBasicSetter, AsPropertyFromSetter,
  Context_apply, Type_apply,
  OSauce, _OSauce
) {
  // "use strict"



  const _BasicNew = function _basicNew(...args) {
    const _$instance = new this._blanker(args)
    const  _instance = _$instance[$PULP]
    const  _postInit = _$instance[$IMMEDIATES]._postInit

    _$instance._init.apply(_instance, args) // <<----------
    if (_postInit) {
      const result = _postInit.call(_instance)
      if (result !== undefined && result !== _instance) { return result }
    }
    return _$instance[$RIND]
  }

  // Once Context is complete delete this method!!!
  const _BasicNew_ = function new_(...args) {
    const $inner     = this[$INNER]
    const newHandler = $inner.new
    const instance   = (newHandler === _BasicNew || newHandler === _BasicNew_) ?
      this._basicNew(...args) : this.new(...args)
    const _$instance = InterMap.get(instance)
    const $instance  = _$instance[$OUTER]

    DefineProperty($instance, "this", InvisibleConfig)
    $instance.this = _$instance[$PULP]

    return instance
  }


  // This method should only be called on a mutable object!!!
  // eslint-disable-next-line
  const _BasicSetImmutable = function _basicSetImmutable(inPlace_, visited__) {
    const _$target = this[$INNER] //
    const  $target = _$target[$OUTER]

    delete _$target._retarget
    $target[IS_IMMUTABLE] = _$target[IS_IMMUTABLE] = true
    Frost($target)
    return this
  } // IDEMPOT_SELF_METHOD


  function SetDefinition(_$target, definition) {
    const  $target     = _$target[$OUTER]
    const _$definition = InterMap.get(definition)
    const selector     = _$definition.selector
    const property     = _$definition.property
    const isPublic     = _$definition.isPublic

    switch (_$definition.mode) {
      case IMMEDIATE_METHOD :
        // Formerly used delete, but deleting uncovered inherited value from
        // _$Intrinsic & _Something, so setting it undefined covers inherited
        // value. Doing this specifically to deal with inherited null id value
        // which breaks defining immediate/lazy id values by the type instances.
        CompletelyDeleteProperty(_$target, selector)
         _$target[selector] = undefined
        _$target[$IMMEDIATES][selector] = _$definition.inner
        if (isPublic) {
          $target[selector] = undefined
          $target[$IMMEDIATES][selector] = _$definition.outer
        }
        return

      case ASSIGNER :
        _$target[$ASSIGNERS][selector] = _$definition.handler
        // break omitted

      case DECLARATION :
        if (_$target[selector] === undefined) {
          _$target[selector] = undefined
          if (isPublic) { $target[selector] = undefined }
        }
        return

      case MANDATORY_SETTER_METHOD :
        _$target[$ASSIGNERS][_$definition.mappedSymbol] = property
        _$target[$ASSIGNERS][property] = _$definition.assignmentError
        // break omitted

      case SETTER_METHOD :
        if (_$target[property] === undefined) {
          _$target[property] = undefined
          if (isPublic) { $target[property] = undefined }
        }
        // break omitted

      default :
        // Store the inner (and outer) wrapper in the property chain.
        CompletelyDeleteProperty(_$target, selector)
        _$target[selector] = _$definition.inner
        if (isPublic) { $target[selector] = _$definition.outer }
    }
  }


  const _SetDefinitionAt = function _setDefinitionAt(tag, value, mode = VISIBLE) {
    const _$root      = this._blanker.$root$inner
    const definitions = this._definitions

    if (definitions[tag] === value) { return this }
    if (mode === VISIBLE || mode === INVISIBLE) { this._retarget }
    // Set retroactively if INHERIT or REINHERIT!!!

    const _$value = InterMap.get(value)

    if (_$value && _$value[$IS_DEFINITION]) {
      SetDefinition(_$root, value)
    }
    else {
      const selector = tag
      CompletelyDeleteProperty(_$root, selector)
      if (mode === INVISIBLE) {
        DefineProperty(_$root, selector, InvisibleConfig)
      }
      InSetProperty(_$root, selector, value, this)
    }

    switch (mode) {
      case REINHERIT :
        return
      case INHERIT :
        break
      case INVISIBLE :
        DefineProperty(definitions, tag, InvisibleConfig)
        // break omitted
      case VISIBLE   :
        definitions[tag] = value
        break
    }
    return this._propagateDefinition(tag)
  }

  const Definition_init = function _init(func_selector, func_, mode__, property___) {
    const [selector, handler, mode = STANDARD_METHOD, property] =
      (typeof func_selector === "function") ?
        [func_selector.name, func_selector, func_ , mode__     ] :
        [func_selector     , func_        , mode__, property___]
    const isPublic = (AsName(selector)[0] !== "_")
    const $inner   = InterMap.get(this[$RIND])
    const $outer   = $inner[$OUTER]

    if (!selector) { return this._invalidSelectorError(selector) }

    this.selector      = selector
    this.mode          = mode
    this.isPublic      = isPublic
    // Move the following to shared properties!!!
    this.isImmediate   = false
    // this.super --> is a lazy property

    switch(mode) {
      case DECLARATION :
        this.isDeclaration = true
        this.tag           = `$declaration@${AsName(selector)}`
        return

      case ASSIGNER :
        this.isAssigner = true
        this.tag        = `$assigner@${AsName(selector)}`
        $outer.handler = $inner.handler = MarkFunc(handler, ASSIGNER_FUNC)
        return

      case MANDATORY_SETTER_METHOD :
        $outer.assignmentError = $inner.assignmentError =
          NewAssignmentErrorHandler(property, selector)
        this.mappedSymbol = AsPropertySymbol(property)
        // break omitted

      case SETTER_METHOD :
        this.property = property
        break

      default :
        if (!(handler.length || ExtractParamListing(handler))) {
          this.isImmediate = true
          this.mode        = IMMEDIATE_METHOD
        }
        break
    }

    this.isMethod = true
    this.tag      = AsName(selector)

    const outer = mode.outer(selector, handler, isPublic)
    const inner = mode.inner(selector, handler, isPublic)

    if (!inner[$OUTER_WRAPPER]) {
      inner[$OUTER_WRAPPER] = outer // Also used as a reliable method marker!!!
      inner.method          = this[$RIND]
    }
    // Else this is an aliased definition to a basic method and the
    // inner === handler, and has already had $OUTER_WRAPPER and method set.
    outer.method = inner.method // this[$RIND]

    // Need to subvert function assignment to enable raw functions to be stored.
    $outer.outer   = $inner.outer   = MarkAndSetFuncImmutable(outer, OUTER_FUNC)
    $outer.inner   = $inner.inner   = MarkAndSetFuncImmutable(inner, INNER_FUNC)
    $outer.handler = $inner.handler = MarkFunc           (handler, HANDLER_FUNC)
  }


  const Context_init = function _init(supercontext_name_, supercontext_) {
    const [name, context] = (supercontext_name_ === undefined) ?
      [null, supercontext_] :
      (supercontext_name_.isContext ?
        [null, supercontext_name_] : [supercontext_name_, supercontext_])
    this.name          = name
    this.supercontext  = context || null
    this._knownEntries =
      SpawnFrom(context ? InterMap.get(context)._knownEntries : null)
  }


  const Context_atPut = function _atPut(selector, entry) {
    this[selector] = this._knownEntries[selector] = entry
  }



  const AddMethod = function addMethod(func_selector, func_, mode__, property___) {
    const definition =
      this.context.Definition(func_selector, func_, mode__, property___)
    return this._setDefinitionAt(definition.tag, definition)
  }



  const $BaseBlanker = {
    innerMaker        : NewInner,
    $root$outer : {
      __proto__       : null,
      constructor     : NewVacuousConstructor("$Something$outer"), // ???
      [$IMMEDIATES]   : null, // EMPTY_OBJECT,
    },
    $root$inner : {
      __proto__       : null,
      constructor     : NewVacuousConstructor("$Something$inner"), // ???
      [$IMMEDIATES]   : null, // EMPTY_OBJECT,
      [$ASSIGNERS]    : null, // EMPTY_OBJECT,
      [$SUPERS]       : {
        __proto__        : null,
        [$IMMEDIATES]    : null, // EMPTY_OBJECT,
        [$PULP]          : IMPLEMENTATION,
      },
    },
  }

  $BaseBlanker.$root$inner[$OUTER] = $BaseBlanker.$root$outer
  DefineProperty($BaseBlanker.$root$outer, "constructor", InvisibleConfig)
  DefineProperty($BaseBlanker.$root$inner, "constructor", InvisibleConfig)

  const $SomethingBlanker   = NewBlanker($BaseBlanker)
  const $NothingBlanker     = NewBlanker($SomethingBlanker)
  const   $IntrinsicBlanker = NewBlanker($SomethingBlanker)
  const     TypeBlanker     = NewBlanker($IntrinsicBlanker, Type_apply)
  const     ContextBlanker  = NewBlanker($IntrinsicBlanker, Context_apply)

  const ThingAncestry       = []


  function BootstrapType(iid, name, blanker_) {
    const _$type           = new TypeBlanker([name])
    const isImplementation = (name[0] === "$")

    DefineProperty(_$type, "iid", InvisibleConfig)
    _$type.iid               = (_$type[$OUTER].iid = iid)
    _$type._definitions      = SpawnFrom(null)
    _$type._blanker          = blanker_ || NewBlanker($IntrinsicBlanker)
    _$type._subordinateTypes = new Set()
    _$type._supertypes       = EMPTY_ARRAY
    _$type._ancestry         = isImplementation ? EMPTY_ARRAY : ThingAncestry
    return _$type[$PULP]
  }


  const _$Something = BootstrapType(-100, "$Something", $SomethingBlanker)
  const _$Intrinsic = BootstrapType( -11, "$Intrinsic", $IntrinsicBlanker)
  const _Nothing    = BootstrapType(   0, "Nothing"   , $NothingBlanker  )
  const _Thing      = BootstrapType(   1, "Thing"     , null             )
  const _Type       = BootstrapType(   2, "Type"      , TypeBlanker      )
  const _Context    = BootstrapType(   3, "Type"      , ContextBlanker   )
  const _Definition = BootstrapType(   4, "Definition", null             )

  const Thing      = _Thing     [$RIND]
  const Type       = _Type      [$RIND]
  const Definition = _Definition[$RIND]

  ThingAncestry[0] = Thing

  const $Something$root$inner = $SomethingBlanker.$root$inner
  const $Something$root$outer = $SomethingBlanker.$root$outer
  const $Intrinsic$root$inner = $IntrinsicBlanker.$root$inner
  const Context$root$inner    = _Context._blanker.$root$inner
  const Definition$root$inner = _Definition._blanker.$root$inner
  const Type$root$inner       = TypeBlanker.$root$inner


  // Stubs for known properties

  // This secret is only known by inner objects
  $Something$root$inner[$IS_INNER]       = PROOF
  $Something$root$outer[$IS_INNER]       = null

  $Something$root$outer.type             = null

  $Intrinsic$root$inner._retarget        = null

  Type$root$inner.new                    = _BasicNew
  Type$root$inner._setDefinitionAt       = _SetDefinitionAt
  Type$root$inner._propagateDefinition   = ALWAYS_SELF

  Definition$root$inner._setImmutable    = _BasicSetImmutable
  Definition$root$inner._init            = Definition_init

  Context$root$inner._init               = Context_init
  Context$root$inner._atPut              = Context_atPut


  const _$RootContext    = new ContextBlanker("ObjectSauce")
  const  _RootContext    = _$RootContext[$PULP]
  const  $RootContext    = _$RootContext[$OUTER]
  const   RootContext    = _$RootContext[$RIND]
  const _$DefaultContext = new ContextBlanker("Default")
  const  _DefaultContext = _$DefaultContext[$PULP]
  const   DefaultContext = _$DefaultContext[$RIND]

  _RootContext._init("ObjectSauce")
  _DefaultContext._init("Default", RootContext)

  _RootContext._atPut("ObjectSauce", RootContext   )
  _RootContext._atPut("Default"    , DefaultContext)

  $RootContext.Definition = Definition
  $RootContext.Thing      = Thing







  _SetDefinitionAt.call(_$Something, IS_IMMUTABLE  , false      , VISIBLE  )
  _SetDefinitionAt.call(_$Something, "isSomething" , true       , VISIBLE  )

  // Could have defined the follow properties later, after addDeclaration has
  // been defined, however it is fast execution within each objects' barrier#get
  // if implemented this way.  These properties are read very frequently.
  _SetDefinitionAt.call(_$Something, "id"          , null       , INVISIBLE)
  _SetDefinitionAt.call(_$Something, _DURABLES     , null       , INVISIBLE)


  _SetDefinitionAt.call(_Type      , "context"     , RootContext, VISIBLE  )

  _SetDefinitionAt.call(_Type      , $IS_TYPE      , true       , VISIBLE  )
  _SetDefinitionAt.call(_Context   , $IS_CONTEXT   , true       , VISIBLE  )
  _SetDefinitionAt.call(_Definition, $IS_DEFINITION, true       , VISIBLE  )




  AddMethod.call(_Type, AddMethod)


  _$Something.addMethod(function _unknownProperty(selector) {
    return SignalError(this, `Receiver ${this.id} doesn't have a property: ${AsName(selector)}!!`)
  })


  _$Something.addMethod(function isPermeable() {
    return (this[$INNER].this) ? true : false
  }, IDEMPOT_VALUE_METHOD)



  _$Intrinsic.addMethod(function _basicSet(property, value) {
    const selector = PropertyToSymbolMap[property] || property
    this[selector] = value
  }, TRUSTED_VALUE_METHOD)


  // Note: This method might need to be moved to _$Something!!!
  //
  // It's not enough to simple make this method access the receiver's barrier.
  // Th receiver only references its original barrier, and there may be more than
  // one proxy/barrier associated with the receiver, so we need to invoke the
  // proxy to force the proper change to occur thru it.
  _$Intrinsic.addMethod(function _retarget() {
    const $inner = this[$INNER]

    if ($inner[IS_IMMUTABLE]) {
      delete this[$DELETE_IMMUTABILITY]
      return this
    }

    DefineProperty($inner, "_retarget", InvisibleConfig)
    return ($inner._retarget = this)  // InSetProperty($inner, "_retarget", this, this)
  }, IDEMPOT_SELF_METHOD)


  _$Intrinsic.addMethod("_basicSetImmutable", _BasicSetImmutable, IDEMPOT_SELF_METHOD)

  _Definition.addMethod(Definition_init, TRUSTED_VALUE_METHOD)
  _Definition.addMethod("_setImmutable", _BasicSetImmutable, IDEMPOT_SELF_METHOD)

  _Type.addMethod("new", _BasicNew, IDEMPOT_VALUE_METHOD)
  _Type.addMethod(_SetDefinitionAt, TRUSTED_VALUE_METHOD)

  _Context.addMethod(Context_init , TRUSTED_VALUE_METHOD)
  _Context.addMethod(Context_atPut, TRUSTED_VALUE_METHOD)



  _Context.addMethod(function atPut(selector, entry) {
    const self = this[$RIND]
    if (self === DefaultContext || this[$INNER][selector] === entry) { return }
    this._atPut(selector, entry)

    const _$entry = InterMap.get(entry)
    if (_$entry && _$entry[$IS_TYPE] && _$entry.context === DefaultContext) {
      _$entry[$PULP]._setContext(this[$RIND])
    }
  }, TRUSTED_VALUE_METHOD)





  _Type.addMethod(function _propagateDefinition(tag) {
    this._subordinateTypes.forEach(subtype => {
      var _$subtype = InterMap.get(subtype)
      _$subtype._inheritDefinitionAt.call(_$subtype[$PULP], tag)
    })
  })



  // addAssigner(function property() {})
  // addAssigner("property", function () {})
  // forAddAssigner(function property() {})
  // forAddAssigner("property", function () {})

  _Type.addMethod(function addAssigner(property_assigner, assigner_) {
    const [selector, assigner] = (assigner_) ?
      [property_assigner     , assigner_        ] :
      [property_assigner.name, property_assigner]

    if (!selector) { return UnnamedFuncError(this, assigner) }

    const definition = this.context.Definition(selector, assigner, ASSIGNER)
    this._setDefinitionAt(definition.tag, definition)
  })


  _Type.addMethod(function addDeclaration(selector) {
    const definition = this.context.Definition(selector, null, DECLARATION)
    this._setDefinitionAt(definition.tag, definition)
  })


  _Type.addMethod(function addSharedProperty(selector, value) {
    this._setDefinitionAt(selector, value)
  })



  _Type.addMethod(function _deleteDefinitionAt(tag) {
    var   selectors, nextSelector, next
    const blanker          = this._blanker
    const $root$inner      = blanker.$root$inner
    const $root$outer      = blanker.$root$outer
    const defs             = this._definitions
    const value            = defs[tag]
    const _$value          = InterMap.get(value)
    const [selector, mode] = (_$value && _$value[$IS_DEFINITION]) ?
      [_$value.selector, _$value.mode] : [tag, null]

    switch (mode) {
      case IMMEDIATE_METHOD :
        delete $root$inner[$IMMEDIATES][selector]
        delete $root$outer[$IMMEDIATES][selector]
        delete $root$inner[$SUPERS][$IMMEDIATES][selector]
        selectors = [selector]
        break

      case ASSIGNER :
        delete $root$inner[$ASSIGNERS][selector]
        // break omitted

      case DECLARATION :
        selectors = EMPTY_ARRAY
        if ($root$inner[selector] !== undefined)      { break } // Has value
        if (defs[selector])                           { break } // Has immediate
        if (defs[`$assigner@${AsName(selector)}`])    { break } // Has assigner
        if (defs[AsSetterFromProperty(selector)])     { break } // Has setter
        selectors = [selector]
        break

      case MANDATORY_SETTER_METHOD :
        delete $root$inner[$ASSIGNERS][value.mappedSymbol]
        delete $root$inner[$ASSIGNERS][value.property]
        // break omitted

      case SETTER_METHOD :
        selectors = [selector]
        var property = value.property
        if ($root$inner[property] !== undefined)      { break } // Has value
        if (defs[property])                           { break } // Has immediate
        if (defs[`$declaration@${AsName(property)}`]) { break } // Has def
        selectors[1] = property
        // break omitted

      default :
        selectors = [selector]
        break
    }

    next = selectors.length
    while (next--) {
      nextSelector = selectors[next]
      delete $root$inner[nextSelector]
      delete $root$outer[nextSelector]
      delete $root$inner[$SUPERS][nextSelector]
      delete defs[tag]
    }
    this._inheritDefinitionAt(tag)
  })


  _Type.addMethod(function _inheritDefinitionAt(tag) {
    const definitions = this._definitions
    if (definitions[tag] !== undefined) { return }

    var ancestry, next, _$nextType, value

    ancestry = this.ancestry
    next     = ancestry.length - 1
    while (next--) {
      _$nextType = InterMap.get(ancestry[next])
      value      = _$nextType._definitions[tag]

      if (value !== undefined) {
        return this._setDefinitionAt(tag, value, INHERIT)
      }
    }
  })



  _Type.addMethod(function _addSetter(name_setter, property_setter_, mode) {
    var propertyName, assigner, setterName, setter

    ;[setterName, setter] = (typeof name_setter === "function") ?
      [name_setter.name, name_setter] : [name_setter, null]

    switch (typeof property_setter_) {
      case "string"   :
        propertyName = property_setter_
        break

      case "function" :
        if ((propertyName = property_setter_.name)) {
          assigner = property_setter_
          if (mode === MANDATORY_SETTER_METHOD) {
            setter = AsAssignmentSetter(propertyName, setterName, assigner)
          }
          else {
            setter = AsBasicSetter(propertyName, setterName, mode)
            this.addMethod(propertyName, assigner, ASSIGNER)
          }
        }
        else { setter = property_setter_ }
        break
    }

    if (!setterName)   { return UnnamedFuncError(this, assigner) }
    if (!propertyName) {
      propertyName = AsPropertyFromSetter(setterName) ||
        this._signalError(`Improper setter '${setterName}'!!`)
    }
    if (!setter) { setter = AsBasicSetter(propertyName, setterName, mode) }

    this.addMethod(setterName, setter, mode, propertyName)
  })


  // addSetter("setterName")
  // addSetter(function setterName() {})
  // addSetter("setterName", "property")
  // addSetter("setterName", function () {})
  // addSetter("setterName", function propertyAssigner() {})

  _Type.addMethod(function addSetter(name_setter, property_setter_) {
    this._addSetter(name_setter, property_setter_, SETTER_METHOD)
  })


  // forAddSetter("propertyName")
  // forAddSetter("propertyName", "setterName")

  _Type.addMethod(function forAddSetter(propertyName, setterName_) {
    const setterName = setterName_ || AsSetterFromProperty(propertyName) ||
      this._signalError(`Improper property name: ${propertyName}!!`)
    this._addSetter(setterName, propertyName, SETTER_METHOD)
  })


  // addMandatorySetter("setterName")
  // addMandatorySetter(function setterName() {}) // within must call _basicSet
  // addMandatorySetter("setterName", "property")
  // addMandatorySetter("setterName", function () {}) // within must call _basicSet
  // addMandatorySetter("setterName", function propertyAssigner() {})
  //
  _Type.addMethod(function addMandatorySetter(name_setter, property_setter_) {
    this._addSetter(name_setter, property_setter_, MANDATORY_SETTER_METHOD)
  })

  // forAddMandatorySetter("property")
  // forAddMandatorySetter("property", "setterName")
  // forAddMandatorySetter("property", function setterName() {}) // within must call _basicSet

  _Type.addMethod(function forAddMandatorySetter(propertyName, setter_) {
    const setter = setter_ || AsSetterFromProperty(propertyName) ||
      this._signalError(`Improper property name: ${propertyName}!!`)
    this._addSetter(setter, propertyName, MANDATORY_SETTER_METHOD)
  })



  _Type.addMethod(function addRetroactiveProperty(assigner_selector, assigner_, mode__) {
    // Will set the $inner selector even on an immutable object!!!
    const [selector, assigner, mode] = (typeof assigner_selector === "function") ?
        [assigner_selector.name, assigner_selector, assigner_] :
        [assigner_selector     , assigner_        , mode__   ]

    this.addMethod(selector, AsRetroactiveProperty(selector, assigner), mode)
  })





  _Type.addMethod(function _reinheritDefinitions(_) { // eslint-disable-line
    if (this.name) {
      // Not a virgin type
      const blanker     = this._blanker
      const $root$inner = blanker.$root$inner
      const $root$outer = blanker.$root$outer
      const supers      = $root$inner[$SUPERS]

      DeleteSelectorsIn([$root$inner, $root$outer, supers])
      DeleteSelectorsIn(
        [$root$inner[$IMMEDIATES], $root$outer[$IMMEDIATES], supers[$IMMEDIATES]])
      DeleteSelectorsIn([$root$inner[$ASSIGNERS]])
    }

    const ancestry = this.ancestry
    const knowns   = SpawnFrom(null)
    var   next, _$nextType, nextDefinitions, tag, value

    next = ancestry.length
    while (next--) {
      _$nextType      = InterMap.get(ancestry[next])
      nextDefinitions = _$nextType._definitions

      for (tag in nextDefinitions) {
        if (!knowns[tag]) {
          knowns[tag] = true
          value       = nextDefinitions[tag]
          this._setDefinitionAt(tag, value, REINHERIT)
        }
      }
    }

    this._propagateReinheritance
  })


  _Type.addMethod(function _propagateReinheritance() {
    this._subordinateTypes.forEach(subtype => {
      var _$subtype = InterMap.get(subtype)
      _$subtype._reinheritDefinitions.call(_$subtype[$PULP])
    })
  })


  _Type.addMethod(function _setAsSubordinateOfSupertypes(supertypes) {
    // LOOK: add logic to invalidate connected types if supertypes changes!!!
    var next, _$supertype
    const subtype = this[$RIND]

    next = supertypes.length
    while (next--) {
      _$supertype = InterMap.get(supertypes[next])
      if (!_$supertype[IS_IMMUTABLE]) {
        _$supertype._subordinateTypes.add(subtype)
      }
    }
  })



  function IsSubtypeOfThing(_type) {
    // return (_type._basicSet !== undefined)
    // The following fails when testing _$Something
    return (RootOf(_type._blanker.$root$inner) === $Intrinsic$root$inner)
  }

  function AncestryIncludesThing(ancestry) {
    for (var index = 0, count = ancestry.length - 1; index < count; index++) {
      var _$type = InterMap.get(ancestry[index])
      if (IsSubtypeOfThing(_$type)) { return true }
    }
    return false
  }

  function AddIntrinsicDeclaration(selector) {
    _SetDefinitionAt.call(_$Intrinsic, selector, null, INVISIBLE)
  }


  _Type.addMethod(function ancestry() { return this._ancestry })

  _Type.addMethod(function supertypes() { return this._supertypes })



  _Type.addMandatorySetter("_setContext", function context(context) {
    if (_HasOwn.call(this, "context")) {
      return this._attemptToReassignContextError
    }
    this.addSharedProperty("context", context)
    return context
  })

  _Type.addMethod(function setContext(context) {
    this._setContext(context)
    context.atPut(this.name, this[$RIND])
  }, TRUSTED_VALUE_METHOD)



  _Type.addMethod(function setSupertypes(nextSupertypes) {
    this._setSupertypes(nextSupertypes, true)
  })

  _Type.addMandatorySetter("_setSupertypes", function _supertypes(
    nextSupertypes, reinherit_
  ) {
    if (this._supertypes === nextSupertypes) { return nextSupertypes }

    if (nextSupertypes.length !== new Set(nextSupertypes).size) {
      return DuplicateSupertypeError(this)
    }
    const nextAncestry = BuildAncestryOf(this[$RIND], nextSupertypes)
    const beThing      = AncestryIncludesThing(nextAncestry)

    if (this._blanker) {
      if (this.isPermeable) {
        // This is a security measure. Keep someone from merge a protect type
        // into a programmer controller type in order to access aspects of the
        // merged type.
        return AttemptedChangeOfAncestryOfPermeableTypeError(this)
      }
      const isThing = IsSubtypeOfThing(this)
      if (beThing !== isThing) { return ImproperChangeToAncestryError(this) }
      // Perhaps not. Might be able to redirect the _blanker of an existing type???
    }
    else {
      const parentBlanker    = beThing ? $IntrinsicBlanker : $SomethingBlanker
      this._blanker          = new NewBlanker(parentBlanker)
      this._definitions      = SpawnFrom(null)
      this._subordinateTypes = new Set()
    }

    this._ancestry = nextAncestry
    this._setAsSubordinateOfSupertypes(nextSupertypes)
    if (reinherit_) { this._reinheritDefinitions() }
    return AsImmutable(nextSupertypes)
  })


  _Type.addMethod(function _setDisplayNames(outerName, innerName_) {
    const innerName     = innerName_ || ("_" + outerName)
    const _name = NewVacuousConstructor(innerName)
    const $name = NewVacuousConstructor(outerName)

    SetAsymmetricProperty(this, "constructor", _name, $name, INVISIBLE)
  })


  _Type.addMandatorySetter("setName", function name(newName) {
    const properName = AsCapitalized(newName)
    const priorName = this.name
    if (properName === priorName) { return priorName }

    if (properName[0] !== "$") {
      if (priorName != null) {
        this.removeSharedProperty(AsMembershipSelector(priorName))
      }
      const selector = AsMembershipSelector(properName)
      this.addSharedProperty(selector, true)
      AddIntrinsicDeclaration(selector)
    }

    this._setDisplayNames(properName)
    this[$DISGUISE].name = properName
    return properName
  })



  //  spec
  //    name
  //    supertype|supertypes
  //    shared|sharedProperties
  //    methods|instanceMethods

  _Type.addMethod(function _extractArgs(spec_name, supertypes_context_, context__) {
    var name, supertypes, context, _$arg2
    name       = spec_name.name || spec_name
    context    = context__      || spec_name.context || null

    supertypes = supertypes_context_
    if (supertypes === undefined)  { supertypes = spec_name.supertypes }
    if (supertypes === undefined)  { supertypes = spec_name.supertype  }
    if (supertypes === undefined)  { supertypes = [this.context.Thing] }
    else if (supertypes === null)  { supertypes = EMPTY_ARRAY          }
    else if (!IsArray(supertypes)) {
      _$arg2 = InterMap.get(supertypes)
      if      (_$arg2  ==  null)   { supertypes = [this.context.Thing] }
      else if (_$arg2[$IS_TYPE])   { supertypes = [supertypes]         }
      else if (_$arg2.isNothing)   { supertypes = EMPTY_ARRAY          }
      else                         { supertypes = [this.context.Thing] }
    }

    if (!context) {
      _$arg2  = _$arg2 || InterMap.get(supertypes_context_) || EMPTY_OBJECT
      context = _$arg2[$IS_CONTEXT] ? supertypes_context_ : null
    }

    return [name, supertypes, context]
  })

  _Type.addMethod(function _init(spec_name, supertypes_context_, context__) {
    const [name, supertypes, context] =
      this._extractArgs(spec_name, supertypes_context_, context__)
    const declared    = spec_name.declare || spec_name.declared
    const durables    = spec_name.durable || spec_name.durables
    const shared      = spec_name.shared  || spec_name.sharedProperties
    const methods     = spec_name.methods || spec_name.instanceMethods
    const definitions = spec_name.define  || spec_name.defines

    this._iidCount = 0

    // The ordering of the following is critical to avoid breaking the bootstrapping!!!
    this.setSupertypes(supertypes)
    this.addSharedProperty("type", this[$RIND])
    this.setName(name)

    context     && this.setContext(context)
    declared    && this.addDeclarations(declared)
    durables    && this.addDurables(durables) // This needs to be for the root!!!
    shared      && this.addSharedProperties(shared)
    methods     && this.addMethods(methods)
    definitions && this.define(definitions)
  })


  _Type.addDeclaration("_blanker")
  _Type.addDeclaration($OUTER_WRAPPER)    // Ensures method wrappers work!!!
  _Context.addDeclaration($OUTER_WRAPPER) // Ensures method wrappers work!!!


  // _Type.addSharedProperty("context", DefaultContext)

  _Type      ._init("Type"      , Thing, DefaultContext)
  _$Something._init("$Something", []   )
  _$Intrinsic._init("$Intrinsic", []   )
  _Nothing   ._init("Nothing"   , []   , RootContext)
  _Thing     ._init("Thing"     , null , RootContext)
  _Definition._init("Definition", Thing, RootContext)
  _Context   ._init("Context"   , Thing, RootContext)

  _Type._iidCount = 4
  _Type._basicSet("context", RootContext)

  // Helps with debugging!!!
  _$Something._setDisplayNames("$Intrinsic$Outer", "$Intrinsic$Inner")
  _$Intrinsic._setDisplayNames("$Outer"          , "$Inner"          )

  SetAsymmetricProperty(_$Intrinsic, "isOuter", false, true , VISIBLE)
  SetAsymmetricProperty(_$Intrinsic, "isInner", true , false, VISIBLE)


  // Note: If this was called before the previous declarations,
  // $IMMEDIATES, $ASSIGNERS, constructor, etc, would not be overridable
  // in the descendent $roots.
  Frost($BaseBlanker.$root$outer)
  Frost($BaseBlanker.$root$inner)


// Once Context is complete delete this method!!!
// eslint-disable-next-line
  const PermeableNewErrorMethod = Definition(function new_(...args) {
    this._signalError("Method 'new_' cannot be called on immutable type objects!!")
  })
  // Once Context is complete delete this method!!!
  // eslint-disable-next-line
  const PermeableNewAsFactErrorMethod = Definition(function newAsFact_(...args) {
    this._signalError("Method 'newAsFact_' cannot be called on immutable type objects!!")
  })


  _Type.addMethod(function _setImmutable(inPlace_, visited__) { // eslint-disable-line
    // $inner._subordinateTypes = BasicSetObjectImmutable([])
    // delete $inner._subordinateTypes

    this.addOwnDefinition(PermeableNewErrorMethod)
    this.addOwnDefinition(PermeableNewAsFactErrorMethod)

    // Frost($root$outer[$IMMEDIATES])
    // Frost($root$supers[$IMMEDIATES])
    // Frost($root$inner[$IMMEDIATES])
    // Frost($root$inner[$ASSIGNERS])
    // Frost($root$outer)
    // Frost($root$supers)
    // Frost($root$inner)

    this._basicSetImmutable()
  }, TRUSTED_VALUE_METHOD)


  OSauce.Thing       = Thing
  OSauce.Type        = Type
  OSauce.Definition  = Definition

  _OSauce._Type       = _Type
  _OSauce._$Something = _$Something
  _OSauce._$Intrinsic = _$Intrinsic
  _OSauce._Nothing    = _Nothing
  _OSauce._Thing      = _Thing
  _OSauce._Definition = _Definition
  _OSauce._Context    = _Context

  _OSauce.RootContext    = RootContext
  _OSauce.DefaultContext = DefaultContext

  _OSauce.AddIntrinsicDeclaration = AddIntrinsicDeclaration
  _OSauce.SetDefinition           = SetDefinition
  _OSauce.$Intrinsic$root$inner   = $Intrinsic$root$inner
  _OSauce._BasicSetImmutable      = _BasicSetImmutable
  _OSauce._BasicNew               = _BasicNew
  _OSauce._BasicNew_              = _BasicNew_
  _OSauce.Definition_init         = Definition_init
})



/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
