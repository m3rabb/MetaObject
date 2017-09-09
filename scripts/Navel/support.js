ObjectSauce(function (
  $ASSIGNERS, $BARRIER, $BLANKER, $DISGUISE, $IMMEDIATES, $INNER, $OUTER,
  $OUTER_WRAPPER, $PULP, $RIND, $ROOT, $SUPERS,
  DISGUISE_PULP, EMPTY_THING_ANCESTRY, INVISIBLE, IS_IMMUTABLE,
  ASSIGNER_FUNC, BLANKER_FUNC, _DURABLES,
  AsCapitalized, AsName, BasicSetObjectImmutable, Frost, Impermeable,
  InvisibleConfig, MarkFunc, OwnSymbols, RootOf, SetDurables, SpawnFrom,
  DisguisedInnerBarrier, DisguisedOuterBarrier, InnerBarrier,
  AssignmentOfUndefinedError, DisallowedAssignmentError,
  InterMap, PropertyToSymbolMap,
  OwnNames, OwnVisibleNames,
  DefineProperty, InSetProperty,
  OSauce, _OSauce
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
      return function ${name}() {
        const message = "This constructor is only used for naming!!"
        return ObjectSauce.signalError(${name}, message)
      }
    `
    const func = Function(funcBody)()
    Frost(func.prototype)
    return DefineProperty(func, "name", InvisibleConfig)
  }

  const DefaultDisguiseFunc = NewVacuousConstructor("$disguise$")


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
      const barrier = new InnerBarrier()

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
    return function (arg_) {
      const name = arg_ && arg_.name || arg_[0].name || arg_[0]
      const func = name ? NewVacuousConstructor(name) : DefaultDisguiseFunc

      var $inner = this
      var $outer = new CompanionOuterMaker()

      const mutability = new DisguisedInnerBarrier($inner, applyHandler)
      // const barrier    = new InnerBarrier()
      const $pulp      = new Proxy(func, mutability)
      // mutability._target = $pulp
      const porosity   = new DisguisedOuterBarrier($pulp, $outer, applyHandler)
      const $rind      = new Proxy(func, porosity)
      // const $rind           = new Proxy(NewAsFact, privacyPorosity)

      $inner[$DISGUISE] = func
      $inner[$BARRIER]  = mutability // barrier
      $inner[$INNER]    = $inner
      $inner[$OUTER]    = $outer
      $inner[$PULP]     = $pulp
      $inner[$RIND]     = $rind
      $outer[$RIND]     = $rind

      InterMap.set($pulp, DISGUISE_PULP)
      InterMap.set($rind, $inner)
      // this[$PULP]  = new Proxy(NewAsFact, mutability)
    }
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


  function BuildAncestryOf(type, supertypes = type.supertypes) {
    if (supertypes === EMPTY_THING_ANCESTRY) { return supertypes }
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
    dupFreeAncestry.reverse().push(type)
    return BasicSetObjectImmutable(dupFreeAncestry)
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



  function Context_apply(disguiseFunc, receiver, args) {
    return this._target.sub(...args).beImmutable
  }

  function Type_apply(disguiseFunc, receiver, args) {
    // return this._target.newAsFact(...args)

    // This is the same code as in newAsFact(...args)
    const   instance = this._target.new(...args)
    const _$instance = InterMap.get(instance)
    const _instance  = _$instance[$PULP]
    if (_instance.id == null) { _$instance._setImmutable.call(_instance) }
    return instance
  }


  function OwnSelectorsSorted(target) {
    const selectors = OwnSelectors(target, true) // Do ignore declarations
    selectors.sort((a, b) => AsName(a).localeCompare(AsName(b)))
    return BasicSetObjectImmutable(selectors)
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
    return BasicSetObjectImmutable(selectors)
  }

  function PropertyAt(_$target, selector) {
    const _$method_inner = _$target[$IMMEDIATES][selector]
    if (_$method_inner) { return _$method_inner.method /* || null */ }

    const value = _$target[selector]
    return (value == null) ? null :
      (value[$OUTER_WRAPPER] ? value.method : value)
  }



  OSauce.ownSelectors = OwnSelectors

  _OSauce.AsPropertySymbol              = AsPropertySymbol
  _OSauce.AsMembershipSelector          = AsMembershipSelector
  _OSauce.AsPropertyFromSetter          = AsPropertyFromSetter
  _OSauce.AsSetterFromProperty          = AsSetterFromProperty
  _OSauce.NewAssignmentErrorHandler     = NewAssignmentErrorHandler
  _OSauce.NewVacuousConstructor         = NewVacuousConstructor
  _OSauce.MakeDefinitionsInfrastructure = MakeDefinitionsInfrastructure
  _OSauce.NewBlanker                    = NewBlanker
  _OSauce.NewInner                      = NewInner
  _OSauce.BuildAncestryOf               = BuildAncestryOf
  _OSauce.DeleteSelectorsIn             = DeleteSelectorsIn
  _OSauce.CompletelyDeleteProperty      = CompletelyDeleteProperty
  _OSauce.SetAsymmetricProperty         = SetAsymmetricProperty
  _OSauce.Context_apply                 = Context_apply
  _OSauce.Type_apply                    = Type_apply
  _OSauce.OwnSelectorsSorted            = OwnSelectorsSorted
  _OSauce.KnownSelectorsSorted          = KnownSelectorsSorted
  _OSauce.PropertyAt                    = PropertyAt

})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
