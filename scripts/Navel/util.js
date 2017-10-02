Tranya(function (
  $INNER, $IS_INNER, $OUTER, $RIND, IMMUTABLE, PROOF, SYMBOL_1ST_CHAR,
  _DURABLES,
  DefineProperty, FreezeSurface, GlazeError, ImplementationSelectors,
  InterMap, InvisibleConfig, IsSurfaceFrozen, MarkFunc, RootOf, SpawnFrom,
  TheEmptyArray, ValueAsName,
  Shared, _Shared
) {
  "use strict"


  // This method should only be called on a mutable object!!!
  function GlazeImmutable(object) {
    if (object[$IS_INNER] === PROOF) { return GlazeError(object) }
    object[IMMUTABLE] = true
    return FreezeSurface(object)
  }

  function GlazeAsImmutable(object) {
    if (object[IMMUTABLE]) { return object }
    if (object[$IS_INNER] === PROOF) { return GlazeError(object) }
    object[IMMUTABLE] = true
    return FreezeSurface(object)
  }



  const _HasOwn        = Object.prototype.hasOwnProperty // ._hasOwn
  const _OwnVisiblesOf = Object.keys
  const _OwnNamesOf    = Object.getOwnPropertyNames
  const _OwnSymbolsOf  = Object.getOwnPropertySymbols
  const _OwnKeysOf     = Reflect.ownKeys

  function _OwnSelectorsOf(value) {
    return _OwnKeysOf(value).filter(sel => !ImplementationSelectors[sel])
  }

  function _OwnNonImpSymbolsOf(value) {
    return _OwnSymbolsOf(value).filter(sel => !ImplementationSelectors[sel])
  }

  function _OwnNonImpNamesOf(value) {
    return _OwnNamesOf(value).filter(sel => !ImplementationSelectors[sel])
  }



  function SortedOwnSelectorsUsing(value, picker, sorter_) {
    return (value == null) ? TheEmptyArray :
      GlazeImmutable(picker(Object(value)).sort(sorter_))
      // Note: proxy forces _OwnSelectorsOf to be called
  }


  function OwnVisiblesOf(value) {
    return SortedOwnSelectorsUsing(value, _OwnVisiblesOf)
  }

  function OwnNamesOf(value) {
    return SortedOwnSelectorsUsing(value, _OwnNamesOf)
  }

  function OwnSymbolsOf(value) {
    return SortedOwnSelectorsUsing(value, _OwnSymbolsOf, CompareSelectors)
  }

  function OwnSelectorsOf(value) {
    return SortedOwnSelectorsUsing(value, _OwnSelectorsOf, CompareSelectors)
  }

  function OwnKeysOf(value) {
    return SortedOwnSelectorsUsing(value, _OwnKeysOf, CompareSelectors)
  }



  function SortedSelectorsUsing(value, picker, sorter_, root = null) {
    var target, selectors, selector, index, next
    if (value == null) { return TheEmptyArray }

    const known        = SpawnFrom(null)
    const allSelectors = []
    target = value
    index  = 0

    do {
      selectors = picker(target)
      next      = selectors.length
      while (next--) {
        selector = selectors[next]
        if (!known[selector]) {
          known[selector]       = true
          allSelectors[index++] = selector
        }
      }
      target = RootOf(target)
    } while (target !== root)

    return GlazeImmutable(allSelectors.sort(sorter_))
  }


  function _KnownVisiblesOf(value) {
    var index, name
    const visibles = []
    index = 0
    for (name in value) { visibles[index++] = name }
    return GlazeImmutable(visibles.sort())
  }

  function _KnownNamesOf(value) {
    return SortedSelectorsUsing(value, _OwnNamesOf)
  }

  function _KnownSymbolsOf(value) {
    return SortedSelectorsUsing(value, _OwnSymbolsOf, CompareSelectors)
  }

  function _KnownNonImpSymbolsOf(value) {
    return SortedSelectorsUsing(value, _OwnNonImpSymbolsOf, CompareSelectors)
  }

  function _KnownSelectorsOf(value) {
    return SortedSelectorsUsing(value, _OwnSelectorsOf, CompareSelectors)
  }

  function _KnownKeysOf(value) {
    return SortedSelectorsUsing(value, _OwnKeysOf, CompareSelectors)
  }

  function _NonImpNamesOf(value) {
    return SortedSelectorsUsing(value, _OwnNonImpNamesOf, CompareSelectors)
  }

  function _NoneOf(value) { // eslint-disable-line
    return TheEmptyArray
  }

  function SelectorsOfUsing(value, pickerSpec) {
    var _$value
    if (value == null) { return TheEmptyArray }
    if (value[$IS_INNER] === PROOF) { return pickerSpec.inner(value[$INNER]) }
    if ((_$value = InterMap.get(value)) && _$value[$IS_INNER] === PROOF) {
      return pickerSpec.outer(_$value[$OUTER])
    }
    return pickerSpec.value(Object(value))
  }


  function KnownVisiblesOf(value) {
    return SelectorsOfUsing(value, {
      inner: _KnownVisiblesOf, outer: _KnownVisiblesOf, value: _KnownVisiblesOf,
    })
  }

  function KnownNamesOf(value) {
    return SelectorsOfUsing(value, {
      inner: _KnownNamesOf, outer: _KnownNamesOf, value: _NonImpNamesOf,
    })
  }

  function KnownSymbolsOf(value) {
    return SelectorsOfUsing(value, {
      inner: _KnownNonImpSymbolsOf, outer: _NoneOf, value: _KnownSymbolsOf,
    })
  }

  function KnownSelectorsOf(value) {
    return SelectorsOfUsing(value, {
      inner: _KnownSelectorsOf, outer: _KnownNamesOf, value: _KnownSelectorsOf,
    })
  }

  function KnownKeysOf(value) {
    return SelectorsOfUsing(value, {
      inner: _KnownSelectorsOf, outer: _KnownNamesOf, value: _KnownKeysOf,
    })
  }


  function PrimarySelectorsOf(value) {
    var _$value
    if (value == null) { return TheEmptyArray }
    if (value[$IS_INNER] === PROOF) { return value._primarySelectors }
    if ((_$value = InterMap.get(value)) && _$value[$IS_INNER] === PROOF) {
      return value.primarySelectors
    }
    return SortedSelectorsUsing(
      Object(value), _OwnNamesOf, undefined, Object.prototype)
  }



  function ValueHasOwn(value, selector) {
    return (value != null) && _HasOwn.call(value, selector)
  }

  function ValueHas(value, selector) {
    return (value != null) && (selector in Object(value))
  }



  const SYMBOL_PREFIX_MATCHER = /^[_$]/i

  function IsPublicSelector(selector) {
    var firstChar = selector[0]
    switch (selector[0]) {
      default        : return true
      case "_"       : return false
      case undefined :
        firstChar = selector.toString()[SYMBOL_1ST_CHAR]
        return !SYMBOL_PREFIX_MATCHER.test(firstChar)
    }
  }


  function ValueIsInner(value) {
    switch (typeof value) {
      default         : return false
      case "function" : break
      case "object"   : if (value === null) { return false } else { break }
    }
    return (value[$IS_INNER] === PROOF)
  }

  function ValueIsOuter(value) {
    switch (typeof value) {
      default         : return false
      case "function" : break
      case "object"   : if (value === null) { return false } else { break }
    }
    const _$value = InterMap.get(value)
    return (_$value !== undefined && _$value[$RIND] === value)
  }

  function ValueIsTranyan(value) {
    switch (typeof value) {
      default         : return false
      case "function" : break
      case "object"   : if (value === null) { return false } else { break }
    }
    const target = InterMap.get(value) || value
    return (target[$IS_INNER] === PROOF)
  }

  function ValueIsFact(value) {
    if (typeof value !== "object") { return true }
    if (value === null)            { return true }
    if (value[IMMUTABLE])          { return true }
    if (value.id != null)          { return true }
    return false
  }

  function ValueIsImmutable(value) {
    switch (typeof value) {
      case "function" : break
      case "object"   : break
      default         : return true
    }

    if (value[IMMUTABLE]) {
      if (value[$IS_INNER] === PROOF) { return true }
      if (InterMap.get(value))        { return true }
      if (IsSurfaceFrozen(value))     { return true }
    }
    return false
  }

  function ValueIsSurfaceImmutable(value) {
    switch (typeof value) {
      case "function" : break
      case "object"   : break
      default         : return true
    }
    if (value[IMMUTABLE]) {
      if (value[$IS_INNER] === PROOF || InterMap.get(value)) { return true }
    }
    return IsSurfaceFrozen(value)
  }



  function CompareSelectors(a, b) {
    const nameA = ValueAsName(a)
    const nameB = ValueAsName(b)
    return (nameA === nameB) ? 0 : (nameA < nameB ? -1 : 1)
  }

  // function CompareSelectors(a, b) {
  //   return ValueAsName(a).localeCompare(ValueAsName(b))
  // }



  function FindDurables(target) {
    const durables = _OwnVisiblesOf(target)
    durables[IMMUTABLE] = true
    return FreezeSurface(durables)
  }

  function FindAndSetDurables(target) {
    const durables = _OwnVisiblesOf(target)
    durables[IMMUTABLE] = true
    return (target[_DURABLES] = FreezeSurface(durables))
  }


  function SetInvisibly(target, selector, value, setOuterToo_) {
    DefineProperty(target, selector, InvisibleConfig)
    if (setOuterToo_) { target[$OUTER][selector] = value }
    return target[selector] = value
  }


  // This method should only be called on a mutable object!!!
  // eslint-disable-next-line
  function _basicSetImmutable(inPlace_, visited__) {
    const _$target = this[$INNER] //
    const  $target = _$target[$OUTER]

    delete _$target._retarget
    $target[IMMUTABLE] = _$target[IMMUTABLE] = true
    return this
  }


  function MarkAndSetFuncImmutable(func, marker) {
    if (func == null || InterMap.get(func)) { return func }
    func[IMMUTABLE] = true
    InterMap.set(func, marker)
    FreezeSurface(func.prototype)
    return FreezeSurface(func)
  }

  function SetFuncImmutable(func) {
    func[IMMUTABLE] = true
    FreezeSurface(func.prototype)
    return FreezeSurface(func)
  }



  const PARAM_FAMILY_MATCHER = /^(\w+(_[a-zA-Z]+))|([a-zA-Z]*[a-z]([A-Z][a-z]+))$/

  function SortParams(params) {
    var families   = SpawnFrom(null)
    var lines      = []
    var baseFamily = []

    families[""] = baseFamily

    params.forEach(param => {
      var match  = param.match(PARAM_FAMILY_MATCHER)
      var suffix = match && (match[2] || match[4]) || ""
      var family = families[suffix] || (families[suffix] = [])
      family.push(param)
    })

    var suffixes      = OwnKeysOf(families).sort()
    var finalSuffixes = []

    suffixes.forEach(suffix => {
      var family = families[suffix]
      if (suffix && family.length < 2) { baseFamily.push(...family) }
      else { finalSuffixes.push(suffix) }
    })

    finalSuffixes.forEach(suffix =>
      lines.push(families[suffix].sort().join(", ")))
    return lines
  }

  function SortParameters(paramsListing) {
    var params    = paramsListing.split(/\s*,\s*/)
    var constants = []
    var standards = []

    var contexts  = ["Shared", "_Shared"].filter(name => {
      var index = params.indexOf(name)
      var found = (index >= 0)
      if (found) { params.splice(index, 1) }
      return found
    })

    params.forEach(param => {
      ((param === param.toUpperCase()) ? constants : standards).push(param)
    })
    constants = SortParams(constants)
    standards = SortParams(standards)
    contexts   = contexts.join(", ")
    return constants.concat(standards, contexts).join(", \n")
  }


  Shared.glazeImmutable           = MarkFunc(GlazeImmutable)
  Shared.glazeAsImmutable         = MarkFunc(GlazeAsImmutable)

  Shared._ownVisiblesOf           = MarkFunc(_OwnVisiblesOf)
  Shared._ownNamesOf              = MarkFunc(_OwnNamesOf)
  Shared._ownSymbolsOf            = MarkFunc(_OwnSymbolsOf)
  Shared._ownSelectorsOf          = MarkFunc(_OwnSelectorsOf)
  Shared._ownKeysOf               = MarkFunc(_OwnKeysOf)

  Shared.ownVisiblesOf            = MarkFunc(OwnVisiblesOf)
  Shared.ownNamesOf               = MarkFunc(OwnNamesOf)
  Shared.ownSymbolsOf             = MarkFunc(OwnSymbolsOf)
  Shared.ownSelectorsOf           = MarkFunc(OwnSelectorsOf)
  Shared.ownKeysOf                = MarkFunc(OwnKeysOf)

  Shared.knownVisiblesOf          = MarkFunc(KnownVisiblesOf)
  Shared.knownNamesOf             = MarkFunc(KnownNamesOf)
  Shared.knownSymbolsOf           = MarkFunc(KnownSymbolsOf)
  Shared.knownSelectorsOf         = MarkFunc(KnownSelectorsOf)
  Shared.knownKeysOf              = MarkFunc(KnownKeysOf)

  Shared.primarySelectorsOf       = MarkFunc(PrimarySelectorsOf)

  Shared.valueHasOwn              = MarkFunc(ValueHasOwn)
  Shared.valueHas                 = MarkFunc(ValueHas)

  Shared.valueIsInner             = MarkFunc(ValueIsInner)
  Shared.valueIsOuter             = MarkFunc(ValueIsOuter)
  Shared.valueIsTranyan           = MarkFunc(ValueIsTranyan)
  Shared.valueIsFact              = MarkFunc(ValueIsFact)
  Shared.valueIsImmutable         = MarkFunc(ValueIsImmutable)
  Shared.valueIsSurfaceImmutable  = MarkFunc(ValueIsSurfaceImmutable)
  Shared.isSurfaceImmutable       = ValueIsSurfaceImmutable

  Shared.isPublicSelector         = MarkFunc(IsPublicSelector)
  Shared.compareSelectors         = MarkFunc(CompareSelectors)
  Shared.sortParameters           = MarkFunc(SortParameters)

  Shared.findDurables             = MarkFunc(FindDurables)


  _Shared._HasOwn                 = _HasOwn // ._hasOwn
  _Shared._KnownVisiblesOf        = _KnownVisiblesOf
  _Shared._KnownNamesOf           = _KnownNamesOf
  _Shared._KnownSelectorsOf       = _KnownSelectorsOf
  _Shared.SelectorsOfUsing        = SelectorsOfUsing
  _Shared.SetInvisibly            = SetInvisibly
  _Shared._BasicSetImmutable      = _basicSetImmutable
  _Shared.MarkAndSetFuncImmutable = MarkAndSetFuncImmutable
  _Shared.SetFuncImmutable        = SetFuncImmutable
  _Shared.FindAndSetDurables      = FindAndSetDurables


})
