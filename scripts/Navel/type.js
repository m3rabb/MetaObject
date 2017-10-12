HandAxe(function (
  $ASSIGNERS, $BARRIER, $BLANKER, $DISGUISE, $IMMEDIATES, $INNER, $IS_CONTEXT,
  $IS_DEFINITION, $IS_IMPENETRABLE, $IS_TYPE, $OUTER, $OWN_DEFINITIONS, $PULP,
  $RIND, $SUPERS, ASSIGNER, DECLARATION, IMMUTABLE, INHERIT, INVISIBLE,
  REINHERIT, VISIBLE, _DURABLES,
  ASSIGNER_FUNC, HANDLER_FUNC, INNER_FUNC, OUTER_FUNC,
  FACT_METHOD, IMMEDIATE_METHOD, MANDATORY_SETTER_METHOD, SETTER_METHOD,
  VALUE_METHOD,
  $Something$root$inner, AddIntrinsicDeclaration, AddPermeableNewDefinitionTo,
  AsCapitalized, AsPropertySymbol, AsTypeDisguise, BasicSetInvisibly,
  BePermeable, CompareSelectors, DeleteSelectorsIn, DiffAndSort, InterMap,
  IsSubtypeOfThing, NewVacuousConstructor, NormalizeFuncArgs, PropertyAt,
  SetDefinition, TheEmptyStash, ValueAsName, _HasOwnHandler, _Type,
  IsArray, TheEmptyArray,
  $IntrinsicBlanker, $SomethingBlanker, NewBlanker,
  DefaultContext, RootContext,
  AncestryOfPermeableTypeError, DuplicateSupertypeError,
  ImproperChangeToAncestryError, UnnamedFuncError,
  AsDefinitionFrom, SpawnFrom,
  DeclareAsImmutable, DeclareImmutable,
  OwnPublicsOf, OwnSelectorsOf, OwnVisiblesOf, OwnVisibleNamesOf, RootOf,
  _KnownSelectorsOf, _OwnKeysOf, _OwnSelectorsOf,
  AsLazyProperty, AsRetroactiveProperty, AsSetterFromProperty,
  SetAsymmetricProperty, _CopyProperty,
  AsMembershipSelector, IsPublicSelector,
  AsAssignmentSetter, AsBasicSetter, AsPropertyFromSetter
) {
  "use strict"


  //// ACCESSING ////

  _Type.addValueMethod(function id() { // Conditionally lazy property
    const newId = `${this.formalName},${this.oid}`
    if (this.context === DefaultContext) { return newId }
    return BasicSetInvisibly(this[$INNER], "id", newId, "SET OUTER TOO")
  })

  _Type.addValueMethod(function formalName() {
    const context = this.context
    const prefix = (context === DefaultContext) ? "" : context.formalName + "/"
    return `${prefix}${this.name}`
  })



  //// ACCESSING : Definitions

  _Type.addValueMethod(function definitionAt(selector) {
    return this._definitions[selector] || null
  })

  _Type.addValueMethod(function definitionTags() {
    return OwnSelectorsOf(this._definitions)
  })



  //// ACCESSING : Methods

  _Type.addValueMethod(function methodAt(selector) {
    const property = PropertyAt(this._blanker.$root$inner, selector)
    return property.isMethod ? property : null
  })

  _Type.addValueMethod(function methodAncestry(selector) {
    return DeclareImmutable(
      this._ancestry.filter(type => type.hasDefinedMethod(selector)))
  })

  _Type.addValueMethod(function methodAncestryListing(selector) {
    const ancestry = this.methodAncestry(selector)
    return ancestry.map(type => type.name).join(" ")
  })



  //// ACCESSING : Hierarchy

  _Type.addMethod(function supertypes() { return this._supertypes })

  _Type.addMethod(function ancestry() { return this._ancestry })


  _Type.addValueMethod(function ancestryNames() {
    return DeclareImmutable(this._ancestry.map(type => type.name))
  })

  _Type.addValueMethod(function supertypeNames() {
    return DeclareImmutable(this._supertypes.map(type => type.name))
  })



  //// ACCESSING : Selector introspection

  _Type.addValueMethod(function definedSelectors() {
    return this._definedSelectors(OwnSelectorsOf)
  })

  _Type.addValueMethod(function definedImmediates() {
    return this._definedSelectors(OwnSelectorsOf, true)
  })

  _Type.addValueMethod(function definedPublics() {
    return this._definedSelectors(OwnPublicsOf)
  })

  _Type.addValueMethod(function definedPrivates() {
    return DiffAndSort(
      this.definedSelectors, this.definedPublics, CompareSelectors)
  })

  _Type.addValueMethod(function definedVisibles() {
    return this._definedSelectors(OwnVisiblesOf)
  })

  _Type.addValueMethod(function definedInvisibles() {
    return DiffAndSort(
      this.definedSelectors, this.definedVisibles, CompareSelectors)
  })

  _Type.addValueMethod(function definedVisiblePublics() {
    return DeclareImmutable(this.definedVisibles.filter(IsPublicSelector))
  })


  _Type.addValueMethod(function allDefinedSelectors() {
    return OwnSelectorsOf(this._blanker.$root$inner)
  })

  _Type.addValueMethod(function allDefinedImmediates() {
    return _KnownSelectorsOf(this._blanker.$root$inner[$IMMEDIATES])
  })

  _Type.addValueMethod(function allDefinedPublics() {
    return OwnPublicsOf(this._blanker.$root$inner)
  })

  _Type.addValueMethod(function allDefinedPrivates() {
    return DiffAndSort(
      this.allDefinedSelectors, this.allDefinedPublics, CompareSelectors)
  })

  _Type.addValueMethod(function allDefinedVisibles() {
    return OwnVisiblesOf(this._blanker.$root$inner)
  })

  _Type.addValueMethod(function allDefinedInvisibles() {
    return DiffAndSort(
      this.allDefinedSelectors, this.allDefinedVisibles, CompareSelectors)
  })

  _Type.addValueMethod(function allDefinedVisiblePublics() {
    return DeclareImmutable(this.allDefinedVisibles.filter(IsPublicSelector))
  })


  _Type.addValueMethod(function allKnownSelectors() {
    return _KnownSelectorsOf(this._blanker.$root$inner)
  })



  //// ACCESSING : Support

  _Type.addValueMethod(function _nextIID() {
    // This works on an immutable type without creating a new copy.
    return ++this[$INNER]._iidCount
  }, "INVISIBLE")

  _Type.addValueMethod(function _definedSelectors(picker, immediates_) {
    const definitions = this._definitions
    const tags        = picker(definitions)
    const found       = SpawnFrom(null)
    const selectors   = []
    var   index       = 0

    tags.forEach(tag => {
      var value, selector
      value = definitions[tag]
      if (value && value.isDefinition) {
        //   if (value.isSetter) {
        //     selector           = value.selector
        //     found[selector]    = true
        //     selectors[index++] = selector
        //     selector           = value.property
        //   }
        //   else { selector = value.selector }
        selector = value.selector
        if (immediates_ && !value.isImmediate) { selector = null }
      }
      else { selector = tag }

      if (selector && !found[selector]) {
        found[selector]    = true
        selectors[index++] = selector
      }
    })
    return DeclareImmutable(selectors.sort(CompareSelectors))
  }, "INVISIBLE")




  //// ADDING ////

  //// ADDING : Properties

  _Type.addSelfMethod(function addSharedProperty(selector, value, visibility_) {
    const visibility = (visibility_ !== undefined) ? INVISIBLE : VISIBLE
    this._setDefinitionAt(selector, value, visibility)
  })

  _Type.addSelfMethod(
    function addRetroactiveValue(propertyName_, assigner_, visibility__) {
      const [propertyName, assigner, visibility] =
        NormalizeFuncArgs(propertyName_, assigner_, visibility__)
      const retroHandler = AsRetroactiveProperty(propertyName, assigner)
      this._addDefinition(propertyName, retroHandler, visibility, VALUE_METHOD)
    })

  _Type.addSelfMethod(
    function addRetroactiveFact(propertyName_, assigner_, visibility__) {
      const [propertyName, assigner, visibility] =
        NormalizeFuncArgs(propertyName_, assigner_, visibility__)
      const retroHandler = AsRetroactiveProperty(propertyName, assigner)
      this._addDefinition(propertyName, retroHandler, visibility, FACT_METHOD)
    })


  _Type.addSelfMethod(
    function addLazyValue(propertyName_, assigner_, visibility__) {
      const [propertyName, assigner, visibility] =
        NormalizeFuncArgs(propertyName_, assigner_, visibility__)
      const lazyHandler = AsLazyProperty(propertyName, assigner)
      this._addDefinition(propertyName, lazyHandler, visibility, VALUE_METHOD)
    })

  _Type.addSelfMethod(
    function addLazyFact(propertyName_, assigner_, visibility__) {
      const [propertyName, assigner, visibility] =
        NormalizeFuncArgs(propertyName_, assigner_, visibility__)
      const lazyHandler = AsLazyProperty(propertyName, assigner)
      this._addDefinition(propertyName, lazyHandler, visibility, FACT_METHOD)
    })



  //// ADDING : definitions

  // addDefinition(definition)
  // addDefinition(tag, definition)
  // addDefinition(namedFunc, mode_)
  // addDefinition(selector, func, mode_)

  _Type.addSelfMethod(function addDefinition(...args) {
    const definition = AsDefinitionFrom(args, this.context)
    this._setDefinitionAt(definition.tag, definition)
  })



  //// ADDING : Methods

  // addMethod
  // addSelfMethod
  // addValueMethod



  //// ADDING : Aliases

  _Type.addSelfMethod(function addAlias(aliasName, selector_definition) {
    const definition = (typeof selector_definition !== "string") ?
      selector_definition :
      (this.methodAt(selector_definition) ||
        this._unknownMethodToAliasError(selector_definition))

    this.addDefinition(aliasName, definition)
  })



  //// ADDING : Declarations

  _Type.addSelfMethod(function addDeclaration(selector, visibility_) {
    this._addDefinition(selector, undefined, visibility_, DECLARATION)
  })

  _Type.addAlias("declare", "addDeclaration")



  //// ADDING : Setters

  // addSetter("setterName")
  // addSetter(function setterName() {})
  // addSetter("setterName", "property")
  // addSetter("setterName", function () {})
  // addSetter("setterName", function propertyAssigner() {})

  _Type.addSelfMethod(
    function addSetter(name_setter, property_setter_, visibility__) {
      this._addSetter(
        name_setter, property_setter_, visibility__, SETTER_METHOD)
    })


  // forAddSetter("propertyName")
  // forAddSetter("propertyName", "setterName")

  _Type.addSelfMethod(
    function forAddSetter(propertyName, setterName_, visibility__) {
      const setterName = setterName_ || AsSetterFromProperty(propertyName) ||
        this._signalError(`Improper property name: ${propertyName}!!`)
      this._addSetter(setterName, propertyName, visibility__, SETTER_METHOD)
    })


  // addMandatorySetter("setterName")
  // addMandatorySetter(function setterName() {}) // within must call _basicSet
  // addMandatorySetter("setterName", "property")
  // addMandatorySetter("setterName", function () {}) // within must call _basicSet
  // addMandatorySetter("setterName", function propertyAssigner() {})
  //
  _Type.addSelfMethod(
    function addMandatorySetter(name_setter, property_setter_, visibility__) {
      this._addSetter(
        name_setter, property_setter_, visibility__, MANDATORY_SETTER_METHOD)
    })

  // forAddMandatorySetter("property")
  // forAddMandatorySetter("property", "setterName")
  // forAddMandatorySetter("property", function setterName() {}) // within must call _basicSet

  _Type.addSelfMethod(
    function forAddMandatorySetter(propertyName, setter_, visibility__) {
      const setter = setter_ || AsSetterFromProperty(propertyName) ||
        this._signalError(`Improper property name: ${propertyName}!!`)
      this._addSetter(
        setter, propertyName, visibility__, MANDATORY_SETTER_METHOD)
    })


  // addSetterAndAssigner("setterName", function propertyAssigner() {})

  _Type.addSelfMethod(
    function addSetterAndAssigner(setterName, assigner, visibility_) {
      const propertyName = assigner.name
      if (!propertyName) { return UnnamedFuncError(this, assigner) }
      this._addDefinition(propertyName, assigner, visibility_, ASSIGNER)

      const setter = AsBasicSetter(propertyName, setterName)
      this._addDefinition(
        setterName, setter, visibility_, SETTER_METHOD, propertyName)
    })



  //// ADDING : Assigners

  // addAssigner(function property() {})
  // addAssigner("property", function () {})
  // forAddAssigner(function property() {})
  // forAddAssigner("property", function () {})

  _Type.addSelfMethod(
    function addAssigner(propertyName_, assigner_, visibility__) {
      const [propertyName, assigner, visibility] =
        NormalizeFuncArgs(propertyName_, assigner_, visibility__)
      if (!propertyName) { return UnnamedFuncError(this, assigner) }
      this._addDefinition(propertyName, assigner, visibility, ASSIGNER)
    })

  _Type.addAlias("forAddAssigner", "addAssigner")



  //// ADDING : Multiples

  _Type.addSelfMethod(function define(items, mode = "STANDARD") {
    const PropertyLoader = this.context.atOrInRootAt("PropertyLoader")
    PropertyLoader.new(this.self).load(items, mode)
  })

  _Type.addSelfMethod(function addSharedProperties(items) {
    this.define(items, "SHARED")
  })

  _Type.addSelfMethod(function addMethods(items) {
    this.define(items, "METHOD")
  })

  _Type.addSelfMethod(function addValueMethods(items) {
    this.define(items, "VALUE_METHOD")
  })

  _Type.addSelfMethod(function addSelfMethods(items) {
    this.define(items, "SELF_METHOD")
  })

  _Type.addSelfMethod(function addAliases(items) {
    this.define(items, "ALIAS")
  })

  _Type.addSelfMethod(function addDeclarations(items) {
    this.define(items, "DECLARATION")
  })

  _Type.addSelfMethod(function addDurables(items) {
    this.define(items, "DURABLES")
  })


  _Type.addAlias("defines", "define")



  //// ADDING : Durables

  // MAKE THIS use a Definition!!!
  _Type.addSelfMethod(function addDurable(selector) {
    const $root$inner = this._blanker.$root$inner
    const durables    = $root$inner[_DURABLES] || []
    if (!durables.includes(selector)) {
      $root$inner[_DURABLES] = DeclareImmutable([...durables, selector])
      this.addDeclaration(selector)
    }
  })



  //// ADDING : supertypes

  _Type.addSelfMethod(function addSupertype(type) {
    this.setSupertypes([...this.supertypes, type])
  })



  //// ADDING : Support

  _Type.addValueMethod(
    function _addSetter(name_setter, property_setter_, visibility_, mode) {
      var propertyName, assigner, setterName, setter
      const isIndirect = (mode === MANDATORY_SETTER_METHOD)

      ;[setterName, setter] = (typeof name_setter === "function") ?
        [name_setter.name, name_setter] : [name_setter, null]
      if (!setterName) { return UnnamedFuncError(this, setter) }

      switch (typeof property_setter_) {
        case "string"   :
          propertyName = property_setter_
        break

        case "function" :
          if ((propertyName = property_setter_.name)) {
            assigner = property_setter_
            setter   =
              AsAssignmentSetter(propertyName, setterName, isIndirect, assigner)
          }
          else { setter = property_setter_ }
        break
      }

      if (!propertyName) {
        propertyName = AsPropertyFromSetter(setterName) ||
          this._signalError(`Improper setter '${setterName}'!!`)
      }
      if (!setter) { setter = AsBasicSetter(propertyName, setterName, isIndirect) }

      return this._addDefinition(
        setterName, setter, visibility_, mode, propertyName)
    },
    "INVISIBLE")




  //// INSTANTIATING ////

  // Add comments for new here
  // _basicNew

  _Type.addValueMethod(function newImmutable(...args) {
    const   instance = this.new(...args) // <<----------
    const _$instance = InterMap.get(instance)
    return _$instance._setImmutable.call(_$instance[$PULP])[$RIND]
  })

  _Type.addValueMethod(function newFact(...args) {
    // Note: this is effectively the same as generated by AsTypeDisguise
    const   instance = this.new(...args) // <<----------
    const _$instance = InterMap.get(instance)
    const  _instance = _$instance[$PULP]
    if (_instance.id == null) { _$instance._setImmutable.call(_instance) }
    return instance
  })


  _Type.addValueMethod(function newPermeable(...args) {
    return BePermeable(this.new(...args), false)// <<----------
  })

  _Type.addValueMethod(function newPermeableImmutable(...args) {
    return BePermeable(this.new(...args), true)// <<----------
  })

  _Type.addValueMethod(function newPermeableFact(...args) {
    const instance    = this.new(...args)// <<----------
    const asImmutable = (instance.id == null)
    return BePermeable(instance, asImmutable)
  })


  _Type.addAlias("new_"             , "newPermeable"         )
  _Type.addAlias("newImmutable_"    , "newPermeableImmutable")
  _Type.addAlias("newFact_"         , "newPermeableFact"     )


  _Type.addValueMethod(function newFrom(source) {
    const blanker   = this._blanker
    const _initFrom_ = blanker.$root$inner._initFrom_

    if (!_initFrom_) { return this.new(source) }

    const _$source   = InterMap.get(source)
    const  _source   = _$source ? _$source[$PULP] : source
    const _$instance = new blanker(_source)
    const  _instance = _$instance[$PULP]
    const _postInit  = _$instance[$IMMEDIATES]._postInit

    _initFrom_.call(_instance, _source, false, new WeakMap())
    if (_postInit) {
      const result = _postInit.call(_instance)
      if (result !== _instance && result !== undefined) { return result }
    }
    return _$instance[$RIND]
  })


  _Type.addValueMethod(function newSubtype(spec_name, context_) {
    const [name, , context, spec] = this._extractInitArgs(spec_name, context_)
    return this.context.Type.new(spec || name, this, context)
  })


  _Type.addAlias("_basicNew", "new")


  _Type.addValueMethod(function _newBlank() {
    const  $inner    = this[$INNER]
    const _$instance = new $inner[$BLANKER]("")
    const  $instance = new _$instance[$OUTER]

    if ($inner[$OUTER].this) {
      const _instance = AddPermeableNewDefinitionTo(_$instance)
      BasicSetInvisibly($instance, "this", _instance)
    }
    return _$instance[$RIND]
  })




  //// SETTING ////

  _Type.addSelfMethod(function setSupertypes(supertypes) {
    if (this._supertypes === supertypes) { return }
    const ancestry = this._buildAncestry(supertypes)
    this._validateNewSupertypes(supertypes, ancestry)
    this._setSupertypesAndAncestry(supertypes, ancestry, REINHERIT)
  })

  _Type.addSelfMethod(function setName(newName) {
    const properName = AsCapitalized(newName)
    const priorName = this.name
    if (properName === priorName) { return priorName }

    if (properName[0] !== "$") {
      if (priorName != null) {
        this.deleteSharedProperty(AsMembershipSelector(priorName))
      }
      const selector = AsMembershipSelector(properName)
      this.membershipSelector = selector
      this.addSharedProperty(selector, true, "INVISIBLE")
      AddIntrinsicDeclaration(selector)
    }

    this._setName(properName)
  })

  _Type.addSelfMethod(function setContext(context) {
    this._setContext(context)
    context.atPut(this.name, this[$RIND])
  })


  _Type.addMandatorySetter("_setName", function name(properName) {
    this._setDisplayNames(properName)
    return properName
  })

  _Type.addMandatorySetter("_setContext", function context(context) {
    if (_HasOwnHandler.call(this, "context")) {
      return this._attemptToReassignContextError
    }
    this.addSharedProperty("context", context, "INVISIBLE")
    return context
  })



  //// SETTING : Support

  _Type.addValueMethod(function _setSupertypesAndAncestry(
                                      supertypes, ancestry, inheritSpec_) {
    this._supertypes = DeclareAsImmutable(supertypes)
    this._ancestry   = DeclareImmutable(ancestry)
    if (inheritSpec_) { this._inheritAllDefinitions(inheritSpec_) }
    return this._setAsSubordinateOfSupertypes(supertypes)
  }, "INVISIBLE")

  _Type.addValueMethod(function _setDisplayNames(outerName, innerName_) {
    const innerName = innerName_ || ("_" + outerName)
    const _name     = NewVacuousConstructor(innerName)
    const $name     = NewVacuousConstructor(outerName)

    SetAsymmetricProperty(this, "constructor", _name, $name)
    this[$DISGUISE].name = outerName
    return this
  }, "INVISIBLE")

  _Type.addValueMethod(function _setAsSubordinateOfSupertypes(supertypes) {
    // LOOK: add logic to invalidate connected types if supertypes changes!!!
    var next, _$supertype
    const subtype = this[$RIND]

    next = supertypes.length
    while (next--) {
      _$supertype = InterMap.get(supertypes[next])
      if (!_$supertype[IMMUTABLE]) {
        _$supertype._subordinateTypes.add(subtype)
      }
    }
    return this
  }, "INVISIBLE")




  //// REMOVING ////

  _Type.addSelfMethod(function deleteSharedProperty(selector) {
    if (this._definitions[selector] !== undefined) {
      this._deleteDefinitionAt(selector)
    }
  })

  _Type.addSelfMethod(function deleteDeclaration(selector) {
    const tag = `_declaration@${ValueAsName(selector)}`
  if (this._definitions[tag] !== undefined) {
      this._deleteDefinitionAt(tag)
    }
  })

  _Type.addSelfMethod(function deleteAssigner(selector) {
    const tag = `_assigner@${ValueAsName(selector)}`
    if (this._definitions[tag] !== undefined) {
      this._deleteDefinitionAt(tag)
    }
  })


  _Type.addAlias("deleteMethod"     , "deleteSharedProperty")
  _Type.addAlias("forRemoveAssigner", "deleteAssigner"      )




  //// INTRINSIC ////

  _Type.addValueMethod(function beImpenetrable() {
    this[$INNER][$IS_IMPENETRABLE]              = true
    this._blanker.$root$inner[$IS_IMPENETRABLE] = true
    return this
  })



  // This method should only be called on a mutable object!!!
  _Type.addValueMethod(function _setImmutable(inPlace, visited) { // eslint-disable-line
    this.id // Lazyily sets the id (& uid) befoe it's too late.
    this._subordinateTypes = TheEmptyArray
    DeclareImmutable(this[$DISGUISE])
    // return this._super._setImmutable(inPlace, visited)
    return this._basicSetImmutable()
  })



  //// TESTING ////

  _Type.addValueMethod(function isRootType() {
    return (RootOf(this._blanker.$root$inner) === $Something$root$inner)
  })

  _Type.addValueMethod(function inheritsFrom(type) {
    var self, ancestry, next
    self     = this[$RIND]
    ancestry = type.ancestry
    next     = ancestry.length - 1
    while (next--) { if (ancestry[next] === self) { return true } }
    return false
  })

  _Type.addValueMethod(function hasDefinedMethod(selector) {
    const value = this._definitions[selector]
    return (value) ? value.isMethod : false
  })


  _Type.addValueMethod(Symbol.hasInstance, function (instance) {
    return instance[this.membershipSelector]
  })




  //// CONVERTING ////

  _Type.addValueMethod(function toString(_) { // eslint-disable-line
    return this.formalName
  })




  //// ERROR HANDLING ////

  _Type.addValueMethod(function _unknownMethodToAliasError(selector) {
    return this._signalError(
      `Can't find method '${ValueAsName(selector)}' to alias!!`)
  }, "INVISIBLE")

  _Type.addValueMethod(function _attemptToReassignContextError(context) {
    return this._signalError(`Can't reassign context of ${this} from ${this.context} to ${context}!!`)
  }, "INVISIBLE")




  //// INITIALIZING ////

  //  spec
  //    name
  //    supertype|supertypes
  //    shared|sharedProperties
  //    methods|instanceMethods

  _Type.addValueMethod(function _init(spec_name, supertypes_context_, context__) {
    const [name, supertypes, context, spec] =
      this._extractInitArgs(spec_name, supertypes_context_, context__)
    const ancestry   = this._buildAncestry(supertypes)
    const isRootType = this._validateNewSupertypes(supertypes, ancestry)

    // The order of the following is intentional.
    this._initCoreProperties(isRootType)
    this._setSupertypesAndAncestry(supertypes, ancestry, INHERIT)
    this.setName(name)
    this.addSharedProperty("type", this[$RIND], "INVISIBLE")

    context && this.setContext(context)
    spec    && this._initDefinitions(spec)
    return this
  })


  _Type.addValueMethod(function _initFrom_(_type, asImmutable, visited, context) {
    const inheritSpec = {asImmutable, visited, context}
    const isRootType  = _type.isRootType
    const disguiser   = (_type._blanker.length) ? AsTypeDisguise : null
    const supertypes  = _type._supertypes.map(type => visited.get(type) || type)
    const ancestry    = _type._ancestry.map(  type => visited.get(type) || type)

    // The order of the following is intentional.
    this._initCoreProperties(isRootType, disguiser)
    this._setSupertypesAndAncestry(supertypes, ancestry, inheritSpec)
    this.setName(_type.name)
    // this.addSharedProperty("type", this[$RIND])
    this._copyDefinitions(_type._definitions             , inheritSpec, false)
    this._copyDefinitions(_type[$INNER][$OWN_DEFINITIONS], inheritSpec, true )

    // Note: the context is used for building the new type, but in general
    // when instantiating a new object, it doesn't typically assign the new
    // object to a context. Such is the case here.
    //   this.setContext(context)

    if (_type[$OUTER].this) { AddPermeableNewDefinitionTo(this) }
    return this
  })



  //// INITIALIZING : Support

  _Type.addValueMethod(function _extractInitArgs(
                              spec_name, supertypes_context_, context__) {
    var spec, name, supertypes, context, _$arg2
    ;[name, spec] = (typeof spec_name === "string") ?
      [spec_name, null] : [spec_name.name, spec_name]

    context    = context__ || spec_name.context || null
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
      _$arg2  = _$arg2 || InterMap.get(supertypes_context_) || TheEmptyStash
      context = _$arg2[$IS_CONTEXT] ? supertypes_context_ : null
    }

    return [name, supertypes, context, spec]
  }, "INVISIBLE")

  _Type.addValueMethod(function _buildAncestry(supertypes = this.supertypes) {
    const roughAncestry   = BuildRoughAncestryOf(supertypes)
    const visited         = new Set()
    const dupFreeAncestry = []
    var next, nextType

    next = roughAncestry.length
    while (next--) {
      nextType = roughAncestry[next]
      if (!visited.has(nextType)) {
        dupFreeAncestry.push(nextType)
        visited.add(nextType)
      }
    }
    dupFreeAncestry.reverse().push(this[$RIND])
    return dupFreeAncestry
  }, "INVISIBLE")

  _Type.addValueMethod(function _validateNewSupertypes(supertypes, ancestry) {
    if (supertypes.length !== new Set(supertypes).size) {
      return DuplicateSupertypeError(this) || null
    }
    const beRootType = !AncestryIncludesThing(ancestry)
    if (this._blanker) {
      if (this.isPermeable) {
        // This is a security measure. Keep someone from merge a protect type
        // into a programmer controller type in order to access aspects of the
        // merged type.
        return AncestryOfPermeableTypeError(this) || null
      }

      const isRootType = this.isRootType
      if (beRootType !== isRootType) {
        return ImproperChangeToAncestryError(this) || null
      }
      // Perhaps not. Might be able to redirect the _blanker of an existing type???
    }
    return beRootType
  }, "INVISIBLE")

  _Type.addValueMethod(function _initCoreProperties(isRootType_, disguiser_) {
    const parentBlanker = isRootType_ ? $SomethingBlanker : $IntrinsicBlanker

    this._blanker          = NewBlanker(parentBlanker, disguiser_)
    this._iidCount         = 0
    this._definitions      = SpawnFrom(null)
    this._subordinateTypes = new Set()
    return this
  }, "INVISIBLE")

  _Type.addValueMethod(function _initDefinitions(spec) {
    const declared    = spec.declare || spec.declared
    const durables    = spec.durable || spec.durables
    const shared      = spec.shared  || spec.sharedProperties
    const methods     = spec.methods || spec.instanceMethods
    const aliases     = spec.alias   || spec.aliases
    const definitions = spec.define  || spec.defines

    declared    && this.addDeclarations(declared)
    durables    && this.addDurables(durables) // This needs to be for the root!!!
    shared      && this.addSharedProperties(shared)
    methods     && this.addMethods(methods)
    aliases     && this.addAliases(aliases)
    definitions && this.define(definitions)
    return this
  }, "INVISIBLE")

  _Type.addValueMethod(function _copyDefinitions(definitions, inheritSpec, isOwn) {
    if (!definitions) { return }
    const {asImmutable, visited, context} = inheritSpec
    const selector = isOwn ? "addOwnDefinition" : "addSharedProperty"
    const adder    = this[selector]
    const tags     = _OwnKeysOf(definitions)

    tags.forEach(tag => {
      const value       = definitions[tag]
      const nextValue   = _CopyProperty(value, asImmutable, visited, context)
      adder.call(this, tag, nextValue)
    })
    return this
  }, "INVISIBLE")


  function AncestryIncludesThing(ancestry) {
    for (var index = 0, count = ancestry.length - 1; index < count; index++) {
      var _$type = InterMap.get(ancestry[index])
      if (!_$type.isRootType) { return true }
    }
    return false
  }

  function BuildRoughAncestryOf(supertypes, originalTypes_) {
    const roughAncestry = []
    const originalTypes = originalTypes_ || new Set(supertypes)

    supertypes.forEach(nextType => {
      if (originalTypes_ && originalTypes_.has(nextType)) { /* continue */ }
      else {
        var nextAncestry =
          BuildRoughAncestryOf(nextType.supertypes, originalTypes)
        roughAncestry.push(...nextAncestry, nextType)
      }
    })
    return roughAncestry
  }




  //// SUPPORT ////

  _Type.addValueMethod(function _deleteDefinitionAt(tag) {
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
        if ($root$inner[selector] !== undefined)        { break } // Has value
        if (defs[selector])                             { break } // Has immediate
        if (defs[`_assigner@${ValueAsName(selector)}`]) { break } // Has assigner
        if (defs[AsSetterFromProperty(selector)])       { break } // Has setter
        selectors = [selector]
        break

      case MANDATORY_SETTER_METHOD :
        delete $root$inner[$ASSIGNERS][value.mappedSymbol]
        delete $root$inner[$ASSIGNERS][value.property]
        // break omitted

      case SETTER_METHOD :
        selectors = [selector]
        var property = value.property
        if ($root$inner[property] !== undefined)           { break } // Has value
        if (defs[property])                                { break } // Has immediate
        if (defs[`_declaration@${ValueAsName(property)}`]) { break } // Has def
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
    return this._inheritDefinitionAt(tag)
  }, "INVISIBLE")

  _Type.addValueMethod(function _inheritDefinitionAt(tag) {
    const definitions = this._definitions
    if (definitions[tag] !== undefined) { return }

    var ancestry, next, _$nextType, value

    ancestry = this._ancestry
    next     = ancestry.length - 1
    while (next--) {
      _$nextType = InterMap.get(ancestry[next])
      value      = _$nextType._definitions[tag]

      if (value !== undefined) {
        return this._setDefinitionAt(tag, value, INHERIT)
      }
    }
    return this
  }, "INVISIBLE")


  _Type.addValueMethod(function _propagateDefinition(tag) {
    this._subordinateTypes.forEach(subtype => {
      var _$subtype = InterMap.get(subtype)
      _$subtype._inheritDefinitionAt.call(_$subtype[$PULP], tag)
    })
    return this
  }, "INVISIBLE")

  _Type.addValueMethod(function _inheritAllDefinitions(inheritSpec) {
    var next, _$nextType, nextDefinitions, tags, value, nextValue
    var asImmutable, visited, context, noCopy

    if (inheritSpec === REINHERIT) {
      // Not a virgin type
      const blanker     = this._blanker
      const $root$inner = blanker.$root$inner
      const $root$outer = blanker.$root$outer
      const supers      = $root$inner[$SUPERS]

      DeleteSelectorsIn([$root$inner, $root$outer, supers])
      DeleteSelectorsIn(
        [$root$inner[$IMMEDIATES],$root$outer[$IMMEDIATES],supers[$IMMEDIATES]])
      DeleteSelectorsIn([$root$inner[$ASSIGNERS]])
      noCopy = true
    }
    else if (inheritSpec === INHERIT) { noCopy = true }
    else { ({asImmutable, visited, context} = inheritSpec) }

    const ancestry = this._ancestry
    const knowns   = SpawnFrom(null)

    next = ancestry.length
    while (next--) {
      _$nextType      = InterMap.get(ancestry[next])
      nextDefinitions = _$nextType._definitions
      tags            = _OwnKeysOf(nextDefinitions)

      tags.forEach(tag => {
        if (!knowns[tag]) {
          knowns[tag] = true
          value       = nextDefinitions[tag]
          nextValue   = noCopy ? value :
            _CopyProperty(value, asImmutable, visited, context)
          this._setDefinitionAt(tag, nextValue, REINHERIT)
        }
      })
    }

    return this._propagateReinheritance(inheritSpec)
  }, "INVISIBLE")

  _Type.addValueMethod(function _propagateReinheritance(inheritSpec) {
    this._subordinateTypes.forEach(subtype => {
      var _$subtype = InterMap.get(subtype)
      _$subtype._inheritAllDefinitions.call(_$subtype[$PULP], inheritSpec)
    })
    return this
  }, "INVISIBLE")


  _Type.addSelfMethod(function _reconcileFrom(sourceType, asMutable, visited, context) {
    const _sourceType = InterMap.get(sourceType)[$PULP]
    const supertypes  = _sourceType._reconciledSupertypes(visited)

    this._setSupertypes(supertypes)
    this._initDefinitionsFrom_(_sourceType, visited, context)

    if (!asMutable && sourceType.isImmutable) { this.beImmutable }
  }, "INVISIBLE")

  _Type.addSelfMethod(function _reconciledSupertypes(visited) {
    return this._supertypes.map(supertype =>
      visited.get(supertype) || supertype)
  }, "INVISIBLE")


})

/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
