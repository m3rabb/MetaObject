Tranya(function (
  $ASSIGNERS, $BARRIER, $BLANKER, $DISGUISE, $IMMEDIATES, $INNER,
  $IS_DEFINITION, $OUTER, $OUTER_WRAPPER, $PULP, $RIND, $ROOT, $SUPERS,
  DISGUISE_PULP, INVISIBLE, IS_IMMUTABLE,
  ASSIGNER_FUNC, BLANKER_FUNC, TRUSTED_VALUE_METHOD,
  AsCapitalized, AsDecapitalized, AsName, CrudeBeImmutable, DefineProperty,
  Frost, Impermeable, InvisibleConfig, IsArray, MarkFunc, NewUniqueId,
  OwnSymbols, RootOf, SetInvisibly, SpawnFrom,
  DisguisedInnerBarrier, DisguisedOuterBarrier, InnerBarrier,
  AssignmentOfUndefinedError, DisallowedAssignmentError,
  ImproperDisguiseNameError, SignalError,
  InterMap, PropertyToSymbolMap,
  OwnNames, OwnVisibleNames,
  Shared, _Shared
) {
  "use strict"


  function AsPropertySymbol(selector) {
    return PropertyToSymbolMap[selector] ||
      (PropertyToSymbolMap[selector] = Symbol(`<$${AsName(selector)}$>`))
  }



  function AsMembershipSelector(name) {
    return `is${AsCapitalized(name)}`
  }

  function AsPropertyFromSetter(setterName) {
    const match = setterName.match(/^([_$]*)set([A-Z])(.*$)/)
    return match && `${match[1]}${match[2].toLowerCase()}${match[3]}`
  }


  function AsSetterFromProperty(propertyName) {
    const match = propertyName.match(/^([_$]*)([a-z])(.*$)/)
    return match && `${match[1]}set${match[2].toUpperCase()}${match[3]}`
  }


  // Consider caching these!!!
  function NewAssignmentErrorHandler(Property, Setter) {
    function $assignmentError(value) { // eslint-disable-line
      DisallowedAssignmentError(this, Property, Setter)
    }
    return MarkFunc($assignmentError, ASSIGNER_FUNC)
  }


  function NewNamelessVacuousFunc() {
    return function () {}
  }


  function NewVacuousConstructor(name) {
    const funcBody = `
      return function ${name || ""}() {
        const message = "This constructor is only used for naming!!"
        return Tranya.signalError(${name}, message)
      }
    `
    const func = Function(funcBody)()
    Frost(func.prototype)
    return DefineProperty(func, "name", InvisibleConfig)
  }

  // const DefaultDisguiseFunc = NewVacuousConstructor("$disguise$")


  function MakeDefinitionsInfrastructure(_$target, _$root) {
    const $root        = _$root[$OUTER]
    const $target      = _$target[$OUTER]
    const supers       = SpawnFrom(_$root[$SUPERS])

    supers[$IMMEDIATES] = SpawnFrom(supers[$IMMEDIATES])

    _$target[$SUPERS]       = supers
    _$target[$ASSIGNERS]    = SpawnFrom(_$root[$ASSIGNERS])
    _$target[$IMMEDIATES]   = SpawnFrom(_$root[$IMMEDIATES])
     $target[$IMMEDIATES]   = SpawnFrom( $root[$IMMEDIATES])
  }



  function NewBlanker(rootBlanker, applyHandler_) {
    const root$root$inner = rootBlanker.$root$inner
    const root$root$outer = rootBlanker.$root$outer
    const blankerMaker    = applyHandler_ ?
      NewDisguisedInner : rootBlanker.innerMaker
    const _$root          = SpawnFrom(root$root$inner)
    const  $root          = SpawnFrom(root$root$outer)
    // Note: The blanker function must be unnamed in order for the debugger to
    // display the type of instances using type name determined by the name of
    // its constructor function property.
    const OuterMaker      = NewNamelessVacuousFunc()
    const Blanker         = blankerMaker(OuterMaker, applyHandler_)
                           // Should this simply inherit from null!!!???

    OuterMaker.prototype = $root
    Blanker.$root$outer  = $root
    Blanker.prototype    = _$root
    Blanker.$root$inner  = _$root
    Blanker.innerMaker   = blankerMaker

    _$root[$ROOT]     = _$root
    _$root[$OUTER]    = $root
    _$root[$BLANKER]  = Blanker

    MakeDefinitionsInfrastructure(_$root, root$root$inner)

    InterMap.set(Blanker, BLANKER_FUNC)
    return Frost(Blanker)
  }




  function NewInner(CompanionOuterMaker) {
    // Note: The blanker function must be unnamed in order for the debugger to
    // display the type of instances using type name determined by the name of
    // its constructor function property.
    return function () {
      const $inner  = this
      const $outer  = new CompanionOuterMaker()
      const $rind   = new Proxy($outer, Impermeable)
      const barrier = new InnerBarrier($inner)

      $inner[$BARRIER] = barrier
      $inner[$INNER]   = $inner
      $inner[$OUTER]   = $outer
      $inner[$PULP]    = new Proxy($inner, barrier)
      $inner[$RIND]    = $rind
      $outer[$RIND]    = $rind
      InterMap.set($rind, $inner)
    }
  }



  function NewDisguisedInner(CompanionOuterMaker, applyHandler) {
    // Note: The blanker function must be unnamed in order for the debugger to
    // display the type of instances using type name determined by the name of
    // its constructor function property.
    return function (name_obj_spec_args) {
      var $inner, $outer, name, uid
      const arg  = IsArray(name_obj_spec_args) ?
        name_obj_spec_args[0] : name_obj_spec_args

      $inner = this
      $outer = new CompanionOuterMaker()
      name = arg && arg.name || arg

      if (!name) {
        uid  = NewUniqueId()
        name = `${AsDecapitalized($inner.type.name)}__${uid}`
      }

      const func       = NewVacuousConstructor(name)
      const mutability = new DisguisedInnerBarrier($inner, applyHandler)
      const $pulp      = new Proxy(func, mutability)
      const porosity   = new DisguisedOuterBarrier($outer, applyHandler)
      const $rind      = new Proxy(func, porosity)

      mutability._self = $pulp
      porosity._self   = $pulp

      $inner[$DISGUISE]  = func
      $inner[$BARRIER]   = mutability // barrier
      $inner[$INNER]     = $inner
      $inner[$OUTER]     = $outer
      $inner[$PULP]      = $pulp
      $inner[$RIND]      = $rind
      $outer[$RIND]      = $rind

      if (uid) { SetInvisibly($inner, "uid", uid, "SET BOTH INNER & OUTER") }

      InterMap.set($pulp, DISGUISE_PULP)
      InterMap.set($rind, $inner)
      // this[$PULP]  = new Proxy(NewAsFact, mutability)
    }
  }



  function Context_apply(disguiseFunc, receiver, args) {
    return this._self._exec(args[0], false).beImmutable
  }


  function Type_apply(disguiseFunc, receiver, args) {
    // return this._self.newImmutable(...args)

    const   instance = this._self.new(...args)
    const _$instance = InterMap.get(instance)

    return _$instance._setImmutable.call(_$instance[$PULP], true)[$RIND]
  }



  function OwnSelectors(target, ignoreDeclarations_) {
    var index, next, symbol
    const selectors = ignoreDeclarations_ ?
      OwnVisibleNames(target) : OwnNames(target)
    const symbols   = OwnSymbols(target)

    index = selectors.length
    next  = symbols.length
    while (next--) {
      symbol = symbols[next]
      // Consider using a stash of forbidden selectors, instead!!!
      if (symbol.toString()[7] !== "$") { selectors[index++] = symbol }
    }
    return selectors
  }

  function DeleteSelectorsIn(targets) {
    var selectors, selectorIndex, selector, targetIndex

    selectors     = OwnSelectors(targets[0])
    selectorIndex = selectors.length

    while (selectorIndex--) {
      selector = selectors[selectorIndex]
      targetIndex = targets.length

      while (targetIndex--) {
        delete targets[targetIndex][selector]
      }
    }
  }


  function CompletelyDeleteProperty(_$target, selector) {
    delete _$target[selector]
    const $target = _$target[$OUTER]
    const supers  = _$target[$SUPERS]
    delete _$target[$IMMEDIATES][selector]
    delete  $target[$IMMEDIATES][selector]
    delete supers[selector]
    delete supers[$IMMEDIATES][selector]
  }


  function SetAsymmetricProperty(_type, property, _value, $value, visibility) {
    const blanker = _type._blanker
    const  $root  = blanker.$root$outer
    const _$root  = blanker.$root$inner

    if (visibility === INVISIBLE) {
      DefineProperty( $root, property, InvisibleConfig)
      DefineProperty(_$root, property, InvisibleConfig)
    }

     $root[property] = $value
    _$root[property] = _value
    // _type._properties[property] = ASYMMETRIC_PROPERTY
  }


  function OwnSelectorsSorted(target) {
    const selectors = OwnSelectors(target, true) // Do ignore declarations
    selectors.sort((a, b) => AsName(a).localeCompare(AsName(b)))
    return CrudeBeImmutable(selectors)
  }


  function KnownSelectorsSorted(target, selectorPicker) {
    var targetSelectors, selector, index, next
    const knowns         = SpawnFrom(null)
    const selectors      = []

    index = 0
    while (target) {
      targetSelectors = selectorPicker(target)
      next            = targetSelectors.length
      while (next--) {
        selector = targetSelectors[next]
        if (!knowns[selector]) {
          knowns[selector] = true
          selectors[index++] = selector
        }
      }
      target = RootOf(target)
    }
    selectors.sort((a, b) => AsName(a).localeCompare(AsName(b)))
    return CrudeBeImmutable(selectors)
  }

  function PropertyAt(_$target, selector) {
    const _$method_inner = _$target[$IMMEDIATES][selector]
    if (_$method_inner) { return _$method_inner.method /* || null */ }

    const value = _$target[selector]
    return (value == null) ? null :
      ((value[$OUTER_WRAPPER] && InterMap.get(value)) ? value.method : value)
  }


  function ExtractDefinitionFrom(args, context) {
    var def, tag, _$def
    const Def = context.entryAt("Definition", true)

    switch (args.length) {
      case 1 :
          def = args[0]
        _$def = InterMap.get(def)
        if (_$def && _$def[$IS_DEFINITION]) { return def } else { break }

      case 2 :
        [tag, def] = args
        _$def      = InterMap.get(def)
        if (_$def && _$def[$IS_DEFINITION]) {
          return (tag === def.tag) ? def : Def(tag, def.handler, def.mode)
        }
        // break omitted
      case 3 : return Def(...args) // selector, value, mode
    }
    return SignalError("Improper arguments to make a Definition!!")
  }



  Shared.ownSelectors = MarkFunc(OwnSelectors)

  _Shared.AsPropertySymbol                = AsPropertySymbol
  _Shared.AsMembershipSelector            = AsMembershipSelector
  _Shared.AsPropertyFromSetter            = AsPropertyFromSetter
  _Shared.AsSetterFromProperty            = AsSetterFromProperty
  _Shared.NewAssignmentErrorHandler       = NewAssignmentErrorHandler
  _Shared.NewVacuousConstructor           = NewVacuousConstructor
  _Shared.MakeDefinitionsInfrastructure   = MakeDefinitionsInfrastructure
  _Shared.NewBlanker                      = NewBlanker
  _Shared.NewInner                        = NewInner
  _Shared.Context_apply                   = Context_apply
  _Shared.Type_apply                      = Type_apply
  _Shared.DeleteSelectorsIn               = DeleteSelectorsIn
  _Shared.CompletelyDeleteProperty        = CompletelyDeleteProperty
  _Shared.SetAsymmetricProperty           = SetAsymmetricProperty
  _Shared.OwnSelectorsSorted              = OwnSelectorsSorted
  _Shared.KnownSelectorsSorted            = KnownSelectorsSorted
  _Shared.PropertyAt                      = PropertyAt
  _Shared.ExtractDefinitionFrom           = ExtractDefinitionFrom

})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
