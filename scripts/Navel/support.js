HandAxe(function (
  $ASSIGNERS, $BARRIER, $BLANKER, $DISGUISE, $IMMEDIATES, $INNER,
  $IS_DEFINITION, $OUTER, $OUTER_WRAPPER, $PULP, $RIND, $ROOT, $SUPERS,
  INVISIBLE, VISIBLE, SYMBOL_1ST_CHAR,
  ASSIGNER_FUNC, BLANKER_FUNC, DISGUISE_PULP, DISGUISE_RIND,
  AsCapitalized, AsDecapitalized, BasicSetInvisibly, CompareSelectors,
  DefineProperty, FreezeSurface, Impermeable, IsArray, KnowFunc, KnownFuncs,
  NewUniqueId, OwnSelectorsOf, SpawnFrom, ValueAsName,
  DisguisedBarrier, InnerBarrier,
  InvisibleConfig, VisibleConfig,
  AssignmentOfUndefinedError, DisallowedAssignmentError,
  ImproperDisguiseNameError, SignalError,
  InterMap, PropertyToSymbolMap,
  Shared, _Shared
) {
  "use strict"





  function AsPropertySymbol(selector) {
    return PropertyToSymbolMap[selector] ||
      (PropertyToSymbolMap[selector] = Symbol(`<$${ValueAsName(selector)}$>`))
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
    return KnowFunc($assignmentError, ASSIGNER_FUNC)
  }


  function NewNamelessVacuousFunc() {
    return function () {}
  }


  function NewVacuousConstructor(name) {
    const funcBody = `
      return function ${name || ""}() {
        const message = "This constructor is only used for naming in the debugger!!"
        return HandAxe.signalError(${name}, message)
      }
    `
    const func = Function(funcBody)()
    FreezeSurface(func.prototype)
    return DefineProperty(func, "name", VisibleConfig)
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



  function NewBlanker(rootBlanker, disguiser_) {
    const root$root$inner = rootBlanker.$root$inner
    const root$root$outer = rootBlanker.$root$outer
    const blankerMaker    = disguiser_ ?
      NewDisguisedInner : rootBlanker.innerMaker
    const _$root          = SpawnFrom(root$root$inner)
    const  $root          = SpawnFrom(root$root$outer)
    // Note: The blanker function must be unnamed in order for the debugger to
    // display the type of instances using type name determined by the name of
    // its constructor function property.
    const outerMaker      = NewNamelessVacuousFunc()
    const blanker         = blankerMaker(outerMaker, disguiser_)
                           // Should this simply inherit from null!!!???

    outerMaker.prototype =  $root
    blanker.$root$outer  =  $root
    blanker.prototype    = _$root
    blanker.$root$inner  = _$root
    blanker.innerMaker   = blankerMaker

    _$root[$ROOT]     = _$root
    _$root[$INNER]    = _$root
    _$root[$OUTER]    =  $root
    _$root[$BLANKER]  = blanker

    MakeDefinitionsInfrastructure(_$root, root$root$inner)

    KnowFunc(blanker, BLANKER_FUNC)
    return FreezeSurface(blanker)
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
      InterMap.set($rind, $inner)
    }
  }



  function NewDisguisedInner(CompanionOuterMaker, Disguiser) {
    // Note: The blanker function must be unnamed in order for the debugger to
    // display the type of instances using type name determined by the name of
    // its constructor function property.
    return function (name_obj_spec_args) {
      var name, uid
      const $inner = this
      const $outer = new CompanionOuterMaker()
      const arg    = IsArray(name_obj_spec_args) ?
        name_obj_spec_args[0] : name_obj_spec_args

      name = arg && arg.name || arg

      if (!name) {
        uid  = NewUniqueId()
        name = `${AsDecapitalized($inner.type.name)}__${uid}`
      }

      const innerBarrier = new InnerBarrier($inner)
      const outerBarrier = new DisguisedBarrier($outer)
      const disguise     = Disguiser(name, innerBarrier)
      const $pulp        = new Proxy(disguise, innerBarrier)
      const $rind        = new Proxy(disguise, outerBarrier)

      $inner[$DISGUISE]  = disguise
      $inner[$BARRIER]   = innerBarrier
      $inner[$INNER]     = $inner
      $inner[$OUTER]     = $outer
      $inner[$PULP]      = $pulp
      $inner[$RIND]      = $rind

      if (uid) { BasicSetInvisibly($inner, "uid", uid, "SET OUTER TOO") }

      FreezeSurface(disguise.prototype)
      DefineProperty(disguise, "name", VisibleConfig)
      KnowFunc($pulp, DISGUISE_PULP)
      KnowFunc($rind, DISGUISE_RIND)
      InterMap.set($rind, $inner)
    }
  }



  function AsContextDisguise(contextName, Barrier) {
    return ({
      [contextName] : (...args) => Barrier._$target[$PULP]._exec(args[0], false)
    })[contextName]
  }

  function AsTypeDisguise(typeName, Barrier) {
    return ({
      [typeName] : function (...args) {
        // Same as => return Barrier._$target[$PULP].newFact(...args)
        const   instance = Barrier._$target[$PULP].new(...args) // <<----------
        const _$instance = InterMap.get(instance)
        const  _instance = _$instance[$PULP]
        if (_instance.id == null) {
          _$instance._setImmutable.call(_instance)
        }
        return instance
      }
    })[typeName]
  }


  function DeleteSelectorsIn(targets) {
    var selectors, selectorIndex, selector, targetIndex

    selectors     = OwnSelectorsOf(targets[0])
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



  // function SetDisplayNames(_type, outerName, innerName_) {
  //   const innerName = innerName_ || ("_" + outerName)
  //   const _name     = NewVacuousConstructor(innerName)
  //   const $name     = NewVacuousConstructor(outerName)
  //
  //   SetAsymmetricProperty(_type, "constructor", _name, $name)
  //   _type[$DISGUISE].name = outerName
  // }


  function SetAsymmetricProperty(_type, property, _value, $value, visibility_) {
    const blanker    = _type._blanker
    const  $root     = blanker.$root$outer
    const _$root     = blanker.$root$inner

    if (!visibility_ || visibility_ === INVISIBLE) {
      DefineProperty( $root, property, InvisibleConfig)
      DefineProperty(_$root, property, InvisibleConfig)
    }

     $root[property] = $value
    _$root[property] = _value
    // _type._properties[property] = ASYMMETRIC_PROPERTY
  }



  function PropertyAt(_$target, selector) {
    const _$method_inner = _$target[$IMMEDIATES][selector]
    if (_$method_inner) { return _$method_inner.method /* || null */ }

    const value = _$target[selector]
    return (value == null) ? null :
      ((value[$OUTER_WRAPPER] && KnownFuncs.get(value)) ? value.method : value)
  }


  function AsDefinitionFrom(args, context) {
    var def, tag, _$def
    const Def = context.atOrInRootAt("Definition")

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

  function ExtractFuncArgs(func_selector, func_, invisible__) {
    const args = (typeof func_selector === "function") ?
      [func_selector.name, func_selector, func_      ] :
      [func_selector     , func_        , invisible__]
    args[2] = (args[2] !== undefined) ? INVISIBLE : VISIBLE
    return args
  }


  _Shared.AsPropertySymbol                = AsPropertySymbol
  _Shared.AsMembershipSelector            = AsMembershipSelector
  _Shared.AsPropertyFromSetter            = AsPropertyFromSetter
  _Shared.AsSetterFromProperty            = AsSetterFromProperty
  _Shared.NewAssignmentErrorHandler       = NewAssignmentErrorHandler
  _Shared.NewVacuousConstructor           = NewVacuousConstructor
  _Shared.MakeDefinitionsInfrastructure   = MakeDefinitionsInfrastructure
  _Shared.NewBlanker                      = NewBlanker
  _Shared.NewInner                        = NewInner
  _Shared.AsContextDisguise               = AsContextDisguise
  _Shared.AsTypeDisguise                  = AsTypeDisguise
  _Shared.DeleteSelectorsIn               = DeleteSelectorsIn
  _Shared.CompletelyDeleteProperty        = CompletelyDeleteProperty
  _Shared.SetAsymmetricProperty           = SetAsymmetricProperty
  _Shared.PropertyAt                      = PropertyAt
  _Shared.AsDefinitionFrom                = AsDefinitionFrom
  _Shared.ExtractFuncArgs                 = ExtractFuncArgs

})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
