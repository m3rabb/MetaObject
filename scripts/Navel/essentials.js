ObjectSauce(function (
  $ASSIGNERS, $DISGUISE, $IMMEDIATES, $INNER, $IS_DEFINITION, $OUTER,
  $OUTER_WRAPPER, $PULP, $RIND,
  ASSIGNER, DECLARATION, INHERIT, INVISIBLE, IS_IMMUTABLE, REINHERIT, VISIBLE,
  ASSIGNER_FUNC, HANDLER_FUNC, INNER_FUNC, OUTER_FUNC,
  IMMEDIATE_METHOD, MANDATORY_SETTER_METHOD, SETTER_METHOD, STANDARD_METHOD,
  AsName, AsPropertySymbol, ExtractParamListing, Frost, InterMap, MarkFunc,
  SetInvisibly, SpawnFrom, MarkAndSetFuncImmutable, NewAssignmentErrorHandler,
  _BasicSetImmutable,
  CompletelyDeleteProperty, InSetProperty,
  DefineProperty, InvisibleConfig,
  _OSauce
) {
  "use strict"


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

    SetInvisibly($instance, "this", _$instance[$PULP])
    return instance
  }



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
      InSetProperty(_$root, selector, value)
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
    this.name          = name    || this[$DISGUISE].name
    this.supercontext  = context || null
    this._knownEntries =
      SpawnFrom(context ? InterMap.get(context)._knownEntries : null)
  }


  const Context_atPut = function _atPut(selector, entry) {
    this[selector] = entry
    this._knownEntries[selector] = this[selector]
  }



  const AddMethod = function addMethod(func_selector, func_, mode__, property___) {
    const definition =
      this.context.Definition(func_selector, func_, mode__, property___)
    return this._setDefinitionAt(definition.tag, definition)
  }



  _OSauce._BasicNew          = _BasicNew
  _OSauce.SetDefinition      = SetDefinition
  _OSauce._SetDefinitionAt   = _SetDefinitionAt

  _OSauce.Definition_init    = Definition_init
  _OSauce.Context_init       = Context_init
  _OSauce.Context_atPut      = Context_atPut
  _OSauce.AddMethod          = AddMethod

})
