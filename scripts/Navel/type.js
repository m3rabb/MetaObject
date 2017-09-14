ObjectSauce(function (
  $ASSIGNERS, $BARRIER, $BLANKER, $DISGUISE, $IMMEDIATES, $INNER, $IS_CONTEXT,
  $IS_DEFINITION, $IS_TYPE, $LOCKED, $OUTER, $OWN_DEFINITIONS,
  $PULP, $RIND, $SUPERS,
  ASSIGNER, DECLARATION, INHERIT, INVISIBLE, IS_IMMUTABLE, REINHERIT, VISIBLE,
   _DURABLES,
  ASSIGNER_FUNC, HANDLER_FUNC, INNER_FUNC, OUTER_FUNC,
  IDEMPOT_SELF_METHOD, IDEMPOT_VALUE_METHOD, IMMEDIATE_METHOD,
  MANDATORY_SETTER_METHOD, SETTER_METHOD, STANDARD_METHOD, TRUSTED_VALUE_METHOD,
  AddIntrinsicDeclaration, AddPermeableNewDefinitionTo, AsCapitalized,
  AsMembershipSelector, AsName, AsNextValue, AsPropertySymbol, BuildAncestryOf,
  CopyValue, DefaultContext, DeleteSelectorsIn, ExtractDefinitionFrom,
  ExtractParamListing, Frost, InterMap, IsArray, IsSubtypeOfThing,
  NewAssignmentErrorHandler, NewVacuousConstructor, OwnKeys, OwnSelectors,
  PropertyAt, RootContext, SetDefinition, SetInvisibly, SpawnFrom,
  TheEmptyArray, TheEmptyObject, Type_apply, _HasOwn, _Type,
  $IntrinsicBlanker, $SomethingBlanker, NewBlanker,
  AttemptedChangeOfAncestryOfPermeableTypeError, DuplicateSupertypeError,
  ImproperChangeToAncestryError, UnnamedFuncError,
  AsImmutableValue, BasicSetObjectImmutable,
  AsLazyProperty, AsRetroactiveProperty, AsSetterFromProperty,
  CompletelyDeleteProperty, InSetProperty,
  SetAsymmetricProperty,
  AsAssignmentSetter, AsBasicSetter, AsPropertyFromSetter,
  KnownSelectorsSorted, OwnSelectorsSorted
) {
  "use strict"


  _Type.addMethod(function newAsFact(...args) {
    const   instance = this.new(...args)
    const _$instance = InterMap.get(instance)
    const  _instance = _$instance[$PULP]
    if (_instance.id == null) { _$instance._setImmutable.call(_instance) }
    return instance
  }, IDEMPOT_VALUE_METHOD)


  _Type.addMethod(function newImmutable(...args) {
    // Note: same as implementation in TypeOuter and TypeInner
    return this.new(...args)._setImmutable(true)
  }, IDEMPOT_VALUE_METHOD)


  _Type.addMethod(function _newBlank() {
    const  $inner    = this[$INNER]
    const _$instance = new $inner[$BLANKER]("")
    const  $instance = new _$instance[$OUTER]

    if ($inner[$OUTER].this) {
      SetInvisibly($instance, "this", AddPermeableNewDefinitionTo(_$instance))
    }
    return _$instance[$RIND]
  }, IDEMPOT_VALUE_METHOD)





    // _Type.addMethod(_BasicNew_, IDEMPOT_VALUE_METHOD)  // Remove later!!!
    //
    // // _basicNew_
    // _Type.addOwnMethod(function new_(...args) {
    //   const instance = this._super.new_(...args)
    //   instance.addOwnAlias("new"      , "new_"      )
    //   instance.addOwnAlias("newAsFact", "newAsFact_")
    //   return instance
    // })
    //
    // _Type.addMethod(function newAsFact_(...args) {
    //   // Note: same as implementation in TypeOuter and TypeInner
    //   const instance_  = this.new_(...args)
    //   const _$instance = InterMap.get(instance_)
    //   const _instance  = _$instance[$PULP]
    //   if (_instance.id == null) { _$instance._setImmutable.call(_instance) }
    //   return instance_
    // }, IDEMPOT_VALUE_METHOD)
    //
    //
    // Once Context is complete delete this method!!!
    // eslint-disable-next-line
      // const PermeableNewErrorMethod = Definition(function new_(...args) {
      //   this._signalError("Method 'new_' cannot be called on immutable type objects!!")
      // })
      // // Once Context is complete delete this method!!!
      // // eslint-disable-next-line
      // const PermeableNewAsFactErrorMethod = Definition(function newAsFact_(...args) {
      //   this._signalError("Method 'newAsFact_' cannot be called on immutable type objects!!")
      // })




  // _Type.addMethod(function addCertainFactMethod(...namedFunc_name__handler) {
  //   this.addMethod(...namedFunc_name__handler, VALUE_METHOD)
  // })
  //
  // _Type.addMethod(function addSelfMethod(...namedFunc_name__handler) {
  //   this.addMethod(...namedFunc_name__handler, VALUE_METHOD)
  // })
  //
  // _Type.addMethod(function addMutableValueMethod(...namedFunc_name__handler) {
  //   this.addMethod(...namedFunc_name__handler, VALUE_METHOD)
  // })
  //
  //


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



  _Type.addMethod(function removeAssigner(selector) {
    const tag = `$assigner@${AsName(selector)}`
    if (this._definitions[tag] !== undefined) {
      this._deleteDefinitionAt(tag)
    }
  })

  _Type.addMethod(function removeDeclaration(selector) {
    const tag = `$declaration@${AsName(selector)}`
  if (this._definitions[tag] !== undefined) {
      this._deleteDefinitionAt(tag)
    }
  })

  _Type.addMethod(function removeSharedProperty(selector) {
    if (this._definitions[selector] !== undefined) {
      this._deleteDefinitionAt(selector)
    }
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
        selectors = []
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


  _Type.addMethod(function _propagateDefinition(tag) {
    this._subordinateTypes.forEach(subtype => {
      var _$subtype = InterMap.get(subtype)
      _$subtype._inheritDefinitionAt.call(_$subtype[$PULP], tag)
    })
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



  _Type.addMethod(function addLazyProperty(assigner_selector, assigner_) {
    // Will set the $inner AsName( even on) an immutable object!!!
    const [selector, assigner] = (typeof assigner_selector === "function") ?
      [assigner_selector.name, assigner_selector] :
      [assigner_selector     , assigner_        ]

    this.addMethod(selector, AsLazyProperty(selector, assigner))
  })

  // MAKE THIS use a Definition!!!
  _Type.addMethod(function addDurable(selector) {
    const $root$inner = this._blanker.$root$inner
    const durables    = $root$inner[_DURABLES] || []
    if (!durables.includes(selector)) {
      $root$inner[_DURABLES] = BasicSetObjectImmutable([...durables, selector])
      this.addDeclaration(selector)
    }
  })



  // addDefinition(definition)
  // addDefinition(tag, definition)
  // addDefinition(namedFunc, mode_)
  // addDefinition(selector, func, mode_)

  _Type.addMethod(function addDefinition(...params) {
    var definition = ExtractDefinitionFrom(params, this.context)
    this._setDefinitionAt(definition.tag, definition)
  }, TRUSTED_VALUE_METHOD)


  _Type.addMethod(function addAlias(aliasName, selector_definition) {
    const definition = (typeof selector_definition !== "string") ?
      selector_definition :
      (this.methodAt(selector_definition) ||
        this._unknownMethodToAliasError(selector_definition))

    this.addDefinition(aliasName, definition)
  }, TRUSTED_VALUE_METHOD)





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
    var   next, _$nextType, nextDefinitions, tags, value

    next = ancestry.length
    while (next--) {
      _$nextType      = InterMap.get(ancestry[next])
      nextDefinitions = _$nextType._definitions
      tags            = OwnKeys(nextDefinitions)

      tags.forEach(tag => {
        if (!knowns[tag]) {
          knowns[tag] = true
          value       = nextDefinitions[tag]
          this._setDefinitionAt(tag, value, REINHERIT)
        }
      })
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



  function AncestryIncludesThing(ancestry) {
    for (var index = 0, count = ancestry.length - 1; index < count; index++) {
      var _$type = InterMap.get(ancestry[index])
      if (IsSubtypeOfThing(_$type)) { return true }
    }
    return false
  }

  _Type.addMethod(function setSupertypes(nextSupertypes) {
    this._setSupertypes(nextSupertypes, true)
  })


  _Type.addMandatorySetter("_setSupertypes", function _supertypes(
    nextSupertypes, reinherit_, blanker__
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
      this._blanker          = blanker__ || new NewBlanker(parentBlanker)
      this._definitions      = SpawnFrom(null)
      this._subordinateTypes = new Set()
    }

    this._ancestry = nextAncestry
    this._setAsSubordinateOfSupertypes(nextSupertypes)
    if (reinherit_) { this._reinheritDefinitions() }
    return AsImmutableValue(nextSupertypes)
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
    else if (supertypes === null)  { supertypes = TheEmptyArray        }
    else if (!IsArray(supertypes)) {
      _$arg2 = InterMap.get(supertypes)
      if      (_$arg2  ==  null)   { supertypes = [this.context.Thing] }
      else if (_$arg2[$IS_TYPE])   { supertypes = [supertypes]         }
      else if (_$arg2.isNothing)   { supertypes = TheEmptyArray        }
      else                         { supertypes = [this.context.Thing] }
    }

    if (!context) {
      _$arg2  = _$arg2 || InterMap.get(supertypes_context_) || TheEmptyObject
      context = _$arg2[$IS_CONTEXT] ? supertypes_context_ : null
    }

    return [name, supertypes, context]
  })

  _Type.addMethod(function _init(
    spec_name, supertypes_context_, context__, blanker___
  ) {
    const [name, supertypes, context] =
      this._extractArgs(spec_name, supertypes_context_, context__)
    const declared    = spec_name.declare || spec_name.declared
    const durables    = spec_name.durable || spec_name.durables
    const shared      = spec_name.shared  || spec_name.sharedProperties
    const methods     = spec_name.methods || spec_name.instanceMethods
    const definitions = spec_name.define  || spec_name.defines

    this._iidCount = 0

    // The ordering of the following is critical to avoid breaking the bootstrapping!!!
    this._setSupertypes(supertypes, REINHERIT, blanker___)
    this.addSharedProperty("type", this[$RIND])
    this.setName(name)

    context     && this.setContext(context)
    declared    && this.addDeclarations(declared)
    durables    && this.addDurables(durables) // This needs to be for the root!!!
    shared      && this.addSharedProperties(shared)
    methods     && this.addMethods(methods)
    definitions && this.define(definitions)
  })



  _Type.addMethod(function _initFrom_(_type, asImmutable, visited, context) {
    if (_type[$OUTER].this) { AddPermeableNewDefinitionTo(this) }

    const beThing       = IsSubtypeOfThing(_type)
    const parentBlanker = beThing ? $IntrinsicBlanker : $SomethingBlanker
    const applyHandler = (_type._blanker.length) ? _type[$BARRIER].apply : null
    const blanker       = NewBlanker(parentBlanker, applyHandler)

    this._init(_type.name, _type.supertypes, null, blanker)
    this._initDefinitionsFrom_(_type, visited, context)
  }, TRUSTED_VALUE_METHOD)


  _Type.addMethod(function _initDefinitionsFrom_(_type, visited, context) {
    var definitions, tags, value, newValue

    definitions = _type._definitions
    tags        = OwnKeys(definitions)

    tags.forEach(tag => {
      if (tag !== "type") {
        value    = definitions[tag]
        newValue = AsNextValue(value, false, visited, context)
        this._setDefinitionAt(tag, newValue)
      }
    })

    if ((definitions = _type[$INNER][$OWN_DEFINITIONS])) {
      tags = OwnKeys(definitions)
      tags.forEach(tag => {
        value    = definitions[tag]
        newValue = CopyValue(value, undefined, visited, context)
        this.addOwnDefinition(tag, newValue)
      })
    }
  }, TRUSTED_VALUE_METHOD)


  // This method should only be called on a mutable object!!!
  _Type.addMethod(function _setImmutable(inPlace, visited) { // eslint-disable-line
    this.id // Lazyily sets the id (& uid) befoe it's too late.
    return this._basicSetImmutable()
  }, IDEMPOT_SELF_METHOD)




  _Type.addMethod(function define(spec) {
    const PropertyLoader = this.context.entryAt("PropertyLoader", true)
    PropertyLoader.new(this.$).load(spec, "STANDARD")
  })

  _Type.addMethod(function addSharedProperties(spec) {
    const PropertyLoader = this.context.entryAt("PropertyLoader", true)
    PropertyLoader.new(this.$).load(spec, "SHARED")
  })

  _Type.addMethod(function addMethods(items) {
    const PropertyLoader = this.context.entryAt("PropertyLoader", true)
    PropertyLoader.new(this.$).load(items, "METHOD")
  })

  _Type.addMethod(function addDeclarations(items) {
    const PropertyLoader = this.context.entryAt("PropertyLoader", true)
    PropertyLoader.new(this.$).load(items, "DECLARATION")
  })

  _Type.addMethod(function addDurables(items) {
    const PropertyLoader = this.context.entryAt("PropertyLoader", true)
    PropertyLoader.new(this.$).load(items, "DURABLES")
  })



  _Type.addMethod(function _nextIID() {
    // This works on an immutable type without creating a new copy.
    return ++this[$INNER]._iidCount
  }, IDEMPOT_VALUE_METHOD)

  _Type.addMethod(function id() { // Conditionally lazy property
    const newId = `${this.formalName},${this.basicId}`
    if (this.context === DefaultContext) { return newId }
    return SetInvisibly(this[$INNER], "id", newId, $OUTER)
  }, TRUSTED_VALUE_METHOD)


  _Type.addMethod(function formalName() {
    const context = this.context
    const prefix = (context === DefaultContext) ? "" : context.formalName + "@"
    return `${prefix}${this.name}`
  }, TRUSTED_VALUE_METHOD)

  _Type.addMethod(function toString(_) { // eslint-disable-line
    return this.formalName
  }, TRUSTED_VALUE_METHOD)



  _Type.addMethod(function addSupertype(type) {
    this.setSupertypes([...this.supertypes, type])
  }, TRUSTED_VALUE_METHOD)

  _Type.addMethod(function inheritsFrom(type) {
    var self, ancestry, next
    self     = this[$RIND]
    ancestry = type.ancestry
    next     = ancestry.length - 1
    while (next--) { if (ancestry[next] === self) { return true } }
    return false
  }, IDEMPOT_VALUE_METHOD)



  _Type.addMethod(function hasDefinedMethod(selector) {
    const value = this._definitions[selector]
    return (value) ? value.isMethod : false
  }, IDEMPOT_VALUE_METHOD)


  _Type.addMethod(function methodAt(selector) {
    const property = PropertyAt(this._blanker.$root$inner, selector)
    return property.isMethod ? property : null
  }, IDEMPOT_VALUE_METHOD)

  _Type.addMethod(function definitionAt(selector) {
    return this._definitions[selector] || null
  }, IDEMPOT_VALUE_METHOD)


  _Type.addMethod(function methodAncestry(selector) {
    return BasicSetObjectImmutable(
      this.ancestry.filter(type => type.hasDefinedMethod(selector)))
  }, TRUSTED_VALUE_METHOD)

  _Type.addMethod(function methodAncestryListing(selector) {
    const ancestry = this.methodAncestry(selector)
    return ancestry.map(type => type.name).join(" ")
  }, TRUSTED_VALUE_METHOD)



  _Type.addMethod(function allKnownSelectors() {
    return KnownSelectorsSorted(this._blanker.$root$inner, OwnSelectors)
  }, IDEMPOT_VALUE_METHOD)

  _Type.addMethod(function allPublicSelectors() {
    // All visible public selectors
    return OwnSelectorsSorted(this._blanker.$root$outer)
  }, IDEMPOT_VALUE_METHOD)

  _Type.addMethod(function allDefinedSelectors() {
    // All but intrinsic selectors
    return OwnSelectorsSorted(this._blanker.$root$inner)
  }, IDEMPOT_VALUE_METHOD)

  _Type.addMethod(function definedSelectors() {
    return OwnSelectorsSorted(this._definitions)
  }, IDEMPOT_VALUE_METHOD)

  _Type.addMethod(function publicSelectors() {
    return this.definedSelectors.filter(sel => AsName(sel)[0] !== "_")
  }, TRUSTED_VALUE_METHOD)



  _Type.addMethod(function lock() {
    this._blanker.$root$inner[$LOCKED] = this[$INNER][$LOCKED] = true
    return this
  }, IDEMPOT_SELF_METHOD)


  _Type.addMethod(function _reconcileFrom(sourceType, asMutable, visited, context) {
    const _sourceType = InterMap.get(sourceType)[$PULP]
    const supertypes  = _sourceType._reconciledSupertypes(visited)

    this._setSupertypes(supertypes)
    this._initDefinitionsFrom_(_sourceType, visited, context)

    if (!asMutable && sourceType.isImmutable) { this.beImmutable }
  })

  _Type.addMethod(function _reconciledSupertypes(visited) {
    return this._supertypes.map(supertype =>
      visited.get(supertype) || supertype)
  })



  _Type.addMethod(function _unknownMethodToAliasError(selector) {
    this._signalError(`Can't find method '${AsName(selector)}' to alias!!`)
  })

  _Type.addMethod(function _attemptToReassignContextError(context) {
    this._signalError(`Can't reassign context of ${this} from ${this.context} to ${context}!!`)
  })



  _Type.addAlias("_basicNew"        , "new"                  )
  _Type.addAlias("declare"          , "addDeclaration"       )
  _Type.addAlias("removeMethod"     , "removeSharedProperty" )
  _Type.addAlias("defines"          , "define"               )
  _Type.addAlias("forAddAssigner"   , "addAssigner"          )
  _Type.addAlias("forRemoveAssigner", "removeAssigner"       )

})




// //===
// _Type.addMethod(function _initFrom_(_type) {
//   this$                  = this[$RIND]
//   this.context           = null
//   this._iidCount         = 0
//   this._subordinateTypes = new Set()
//
//   this.ancestry = _type.ancestry
//   this._basicSet("supertypes", supertypes)
//   this._basicSet("name", name)
//
//   const isThing       = IsSubtypeOfThing(_type)
//   const parentBlanker = isThing ? $IntrinsicBlanker : $SomethingBlanker
//   const blanker       = new NewBlanker(parentBlanker)
//
//   this._definitions   = CopyInto(SpawnFrom(null), _type._definitions, "COPY")
//
//   const sourceBlanker = _type._blanker
//   const _$source      = sourceBlanker.$root$inner
//   const  $source      = sourceBlanker.$root$outer
//   const _$root        = this.blanker.$root$inner
//   const  $root        = this.blanker.$root$outer
//
//   AssignInto(_$root, _$source, "AVOID$SELECTORS")
//   AssignInto( $root,  $source) // Warning, copies $RIND (and $IMMEDIATES) too!
//   $root = this$
//   AssignInto(_$root[$IMMEDIATES]         , _$source[$IMMEDIATES])
//   AssignInto( $root[$IMMEDIATES]         ,  $source[$IMMEDIATES])
//   AssignInto(_$root[$ASSIGNERS]          , _$source[$ASSIGNERS])
//   AssignInto(_$root[$SUPERS]             , _$source[$SUPERS])
//   AssignInto(_$root[$SUPERS][$IMMEDIATES], _$source[$SUPERS][$IMMEDIATES])
//
//   this.addSharedProperty("type", this$)
//   this._setAsSubordinateOfSupertypes(supertypes)
// }
//
// function AssignInto(target, source, mode_) {
//   var next, selector, selectors
//   selectorPicker = (mode_ === "AVOID$SELECTORS") ? OwnSelectors : OwnKeys
//   selectors      = selectorPicker(source)
//   next           = selectors.length
//   if (mode_ === "COPY") {
//     while (next--) { target[selector] = CopyValue(source[selector]) }
//   }
//   else {
//     while (next--) { target[selector] = source[selector] }
//   }
//   return target
// }
// //===


// Type.addMethod(INSTANCEOF, (instance) => instance[this.membershipSelector])

// Type.moveMethodTo("", target)

////=====



// _Type.addMethod(function _getDefinedMethods(onlyPublic) {
//   const definitions = this._definitions
//   const methods     = []
//   var   tag, value
//
//   for (tag in definitions) {
//     value = definitions[tag]
//     if (value && value.isMethod) {
//       if (!onlyPublic || value.isPublic) { methods.push(value) }
//     }
//   }
//   methods.sort((methodA, methodB) => methodA.tag.localeCompare(methodB.tag))
//   return methods
// })
//
//
// _Type.addMethod(function _getImmediateMethods(onlyPublic) {
//   var methods, selector
//   const immediates = onlyPublic ?
//     this._blanker.$root$outer[$IMMEDIATES] :
//     this._blanker.$root$inner[$IMMEDIATES]
//
//   methods = []
//   for (selector in immediates) { methods.push(immediates[selector].method) }
//   methods.sort((methodA, methodB) => methodA.tag.localeCompare(methodB.tag))
//   return methods
// })
//
// _Type.addMethod(function _getMethods(onlyPublic) {
//   var methods, selector, selectors, next, value, method
//   const selectorPicker   = onlyPublic ? KnownSelectors : OwnVisibleNames
//   const root             = onlyPublic ?
//     this._blanker.$root$outer : this._blanker.$root$inner
//   const immediateMethods = this._getImmediateMethods(onlyPublic)
//   const somethingMethods = _$Something._getDefinedMethods(onlyPublic)
//   const intrinsicMethods = IsSubtypeOfThing(this) ?
//     _$Intrinsic._getDefinedMethods(onlyPublic) : TheEmptyArray
//
//   methods   = [].concat(immediateMethods, somethingMethods, intrinsicMethods)
//   selectors = selectorPicker(root)
//   next      = selectors.length
//   while (next--) {
//     selector = selectors[next]
//     value    = root[selector]
//     if (typeof value === "function" && InterMap.get(value) === marker) {
//       if ((method = value.method)) { methods.push(method) }
//     }
//   }
//   methods.sort((methodA, methodB) => methodA.tag.localeCompare(methodB.tag))
//   return methods
// })
//
//
