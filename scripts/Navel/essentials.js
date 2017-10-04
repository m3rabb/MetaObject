HandAxe(function (
  $ASSIGNERS, $DISGUISE, $IMMEDIATES, $INNER, $IS_DEFINITION, $OUTER,
  $OUTER_WRAPPER, $PULP, $RIND, ASSIGNER, DECLARATION, INHERIT, INVISIBLE,
  REINHERIT, SYMBOL_1ST_CHAR, VISIBLE,
  ASSIGNER_FUNC, HANDLER_FUNC, INNER_FUNC, OUTER_FUNC,
  FACT_METHOD, IMMEDIATE_METHOD, MANDATORY_SETTER_METHOD, SETTER_METHOD,
  AsPropertySymbol, ExtractParamListing, ImplementationSelectors, InterMap,
  IsPublicSelector, KnowFunc, KnowAndSetFuncImmutable,
  NewAssignmentErrorHandler, SpawnFrom, ValueAsName, CompletelyDeleteProperty,
  DefineProperty, InvisibleConfig, SetProperty, ValueAsFact,
  _Shared
) {
  "use strict"


  const _BasicNew = function _basicNew(...args) {
    const _$instance = new this._blanker(args)
    const  _instance = _$instance[$PULP]
    const  _postInit = _$instance[$IMMEDIATES]._postInit

    _$instance._init.apply(_instance, args) // <<----------
    if (_postInit) {
      const result = _postInit.call(_instance)
      if (result !== _instance && result !== undefined) { return result }
    }
    return _$instance[$RIND]
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


  const _SetDefinitionAt = function _setDefinitionAt(tag, value, mode_) {
    var selector, isPublic
    const mode        = mode_ || VISIBLE
    const _$root      = this._blanker.$root$inner
    const definitions = this._definitions

    if (definitions[tag] === value) { return this }
    if (mode === INVISIBLE || mode === VISIBLE) { this._retarget }
    // Set retroactively if INHERIT or REINHERIT!!!

    const _$value = InterMap.get(value)

    if (_$value && _$value[$IS_DEFINITION]) {
      SetDefinition(_$root, value)
      isPublic = value.isPublic
    }
    else {
      selector = tag
      isPublic = IsPublicSelector(selector)

      CompletelyDeleteProperty(_$root, selector)
      SetProperty(_$root, selector, value, isPublic)
    }

    if (mode === INVISIBLE) {
      if (isPublic) { DefineProperty(_$root[$OUTER], tag, InvisibleConfig) }
      DefineProperty(_$root, tag, InvisibleConfig)
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

  const Definition_init = function _init(selector, handler, mode, property_) {
    var tag
    const isPublic = IsPublicSelector(selector)
    const $inner   = this[$INNER]
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
        this.tag           = (tag = `$declaration@${ValueAsName(selector)}`)
        ImplementationSelectors[tag] = true
        return

      case ASSIGNER :
        this.isAssigner = true
        this.tag        = (tag = `$assigner@${ValueAsName(selector)}`)
        $outer.handler = $inner.handler = KnowFunc(handler, ASSIGNER_FUNC)
        ImplementationSelectors[tag] = true
        return

      case MANDATORY_SETTER_METHOD :
        $outer.assignmentError = $inner.assignmentError =
          NewAssignmentErrorHandler(property_, selector)
        this.mappedSymbol = AsPropertySymbol(property_)
        // break omitted

      case SETTER_METHOD :
        this.property = property_
        break

      default :
        if (!(handler.length || ExtractParamListing(handler))) {
          this.isImmediate = true
          this.mode        = IMMEDIATE_METHOD
        }
        break
    }

    this.isMethod = true
    this.tag      = selector

    const outer = mode.outer(selector, handler, isPublic)
    const inner = mode.inner(selector, handler, isPublic)

    if (!inner[$OUTER_WRAPPER]) {
      inner[$OUTER_WRAPPER] = outer // Also used as a reliable method marker!!!
      inner.method          = this[$RIND]
    }
    // Else this is an aliased definition to a basic method and the
    // inner === handler, and has already had $OUTER_WRAPPER and method set.
    outer && (outer.method = inner.method) // this[$RIND]

    // Need to subvert function assignment to enable raw functions to be stored.
    $outer.outer   = $inner.outer   = KnowAndSetFuncImmutable(outer, OUTER_FUNC)
    $outer.inner   = $inner.inner   = KnowAndSetFuncImmutable(inner, INNER_FUNC)
    $outer.handler = $inner.handler = KnowFunc           (handler, HANDLER_FUNC)
  }



  const Context_init = function _init(supercontext_name_, supercontext_) {
    const [name, context] = (supercontext_name_ === undefined) ?
      [null, supercontext_] :
      (supercontext_name_.isContext ?
        [null, supercontext_name_] : [supercontext_name_, supercontext_])
    const superEntries = context ? InterMap.get(context)._knownEntries : null
    this.name          = name    || this[$DISGUISE].name
    this.supercontext  = context || null
    this._knownEntries = SpawnFrom(superEntries)
  }


  const Context_atPut = function _atPut(selector, entry) {
    const firstChar = selector[0] || selector.toString()[SYMBOL_1ST_CHAR]
    const isPublic  = (firstChar !== "_")
    const value     = isPublic ? ValueAsFact(entry) : entry
    this._knownEntries[selector] = value // this[$OUTER][selector] = value
  }


  const Context_externalPrivateAccess = function _externalPrivateAccess(selector) {
    const entry = this._knownEntries[selector]
    return (entry !== undefined) ?
      entry : this._super._externalPrivateAccess(selector)
  }

  const Context_unknownProperty = function _unknownProperty(selector) {
    const entry = this._knownEntries[selector]
    return (entry !== undefined) ?
      entry : this._super._unknownProperty(selector)
  }



  const _AddMethod = function _addMethod(func_selector, ...remaining__) {
    const [selector, handler, mode = FACT_METHOD, visibility, property] =
      (typeof func_selector === "function") ?
        [func_selector.name, func_selector, ...remaining__] :
        [func_selector, ...remaining__]
    const def = this.context.Definition(selector, handler, mode, property)
    return this._setDefinitionAt(def.tag, def, visibility || INVISIBLE)
  }



  _Shared._BasicNew                     = _BasicNew
  _Shared.SetDefinition                 = SetDefinition
  _Shared._SetDefinitionAt              = _SetDefinitionAt
  _Shared.Definition_init               = Definition_init
  _Shared.Context_init                  = Context_init
  _Shared.Context_atPut                 = Context_atPut
  _Shared.Context_externalPrivateAccess = Context_externalPrivateAccess
  _Shared.Context_unknownProperty       = Context_unknownProperty
  _Shared._AddMethod                    = _AddMethod

})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
