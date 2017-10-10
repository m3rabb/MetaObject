HandAxe(function (
  $INNER, $IS_INNER, $IS_NOTHING, $IS_THING, $OUTER, $PULP, $RIND,
  IMMUTABLE, PROOF, SYMBOL_1ST_CHAR, _DURABLES,
  DefineProperty, DescriptorsOf, FreezeSurface, GlazeError,
  ImplementationSelectors, InterMap, InvisibleConfig, IsSurfaceFrozen,
  KnowFunc, KnownFuncs, RootOf, SpawnFrom, TheEmptyArray, ValueAsName,
  Shared, _Shared
) {
  "use strict"


  // This method should only be called on a mutable object|func!!!
  function DeclareImmutable(object) {
    if (object[$IS_INNER] === PROOF) { return GlazeError(object) }
    object[IMMUTABLE] = true
    return FreezeSurface(object)
  }

  // This method should only be called on an object|func!!!
  function DeclareAsImmutable(object) {
    if (object[IMMUTABLE]) { return object }
    if (object[$IS_INNER] === PROOF) { return GlazeError(object) }
    object[IMMUTABLE] = true
    return FreezeSurface(object)
  }



  const _HasOwnHandler     = Object.prototype.hasOwnProperty // ._hasOwn
  const _OwnVisibleNamesOf = Object.keys
  const _OwnNamesOf        = Object.getOwnPropertyNames
  const _OwnSymbolsOf      = Object.getOwnPropertySymbols
  const _OwnKeysOf         = Reflect.ownKeys

  function _OwnSelectorsOf(value) {
    return _OwnKeysOf(value).filter(sel => !ImplementationSelectors[sel])
  }

  function _OwnNonImpSymbolsOf(value) {
    return _OwnSymbolsOf(value).filter(sel => !ImplementationSelectors[sel])
  }

  function _OwnNonImpNamesOf(value) {
    return _OwnNamesOf(value).filter(sel => !ImplementationSelectors[sel])
  }

  function _OwnVisiblesOf(value) {
    const descriptors = DescriptorsOf(value)
    const keys        = _OwnKeysOf(descriptors)
    const selectors   = []
    var   index       = 0

    keys.forEach(selector => {
      const descriptor = descriptors[selector]
      if (descriptor.enumerable && !ImplementationSelectors[selector]) {
        selectors[index++] = selector
      }
    })
    return selectors
  }

  function _OwnPublicsOf(value) {
    return _OwnSelectorsOf(value).filter(IsPublicSelector)
  }



  function SortedOwnSelectorsUsing(value, picker, sorter_) {
    return (value == null) ? TheEmptyArray :
      DeclareImmutable(picker(Object(value)).sort(sorter_))
      // Note: proxy forces _OwnSelectorsOf to be called
  }


  function OwnVisibleNamesOf(value) {
    return SortedOwnSelectorsUsing(value, _OwnVisibleNamesOf)
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

  function OwnVisiblesOf(value) {
    return SortedOwnSelectorsUsing(value, _OwnVisiblesOf, CompareSelectors)
  }

  function OwnPublicsOf(value) {
    return SortedOwnSelectorsUsing(value, _OwnPublicsOf, CompareSelectors)
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

    return DeclareImmutable(allSelectors.sort(sorter_))
  }


  function _KnownVisibleNamesOf(value) {
    var index, name
    const visibles = []
    index = 0
    for (name in value) { visibles[index++] = name }
    return DeclareImmutable(visibles.sort())
  }

  function _KnownVisiblesOf(value) {
    return SortedSelectorsUsing(value, _OwnVisiblesOf, CompareSelectors)
  }

  function _KnownPublicsOf(value) {
    return SortedSelectorsUsing(value, _OwnPublicsOf, CompareSelectors)
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

  function SelectorsOfUsing(value, pick) {
    var _$value
    if (value == null) { return TheEmptyArray }
    if (value[$IS_INNER] === PROOF)      { return pick.inner(  value[$INNER]) }
    if ((_$value = InterMap.get(value))) { return pick.outer(_$value[$OUTER]) }
    return pick.value(Object(value))
  }


  function KnownVisibleNamesOf(value) {
    return SelectorsOfUsing(value, {
      inner: _KnownVisibleNamesOf,
      outer: _KnownVisibleNamesOf,
      value: _KnownVisibleNamesOf,
    })
  }

  function KnownVisiblesOf(value) {
    return SelectorsOfUsing(value, {
      inner: _KnownVisiblesOf, outer: _KnownVisiblesOf, value: _KnownVisiblesOf,
    })
  }

  function KnownPublicsOf(value) {
    return SelectorsOfUsing(value, {
      inner: _KnownPublicsOf, outer: _KnownPublicsOf, value: _KnownPublicsOf,
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

  function DiffAndSort(left, right, sorter_) {
    const remainder = left.filter(item => !right.includes(item))
    return DeclareImmutable(remainder.sort(sorter_))
  }

  function MergeAndSort(longer, shorter, sorter_) {
    var combined = []
    var index    = 0
    shorter.forEach(item => {
      if (!longer.includes(item)) { combined[index++] = item }
    })
    combined = combined.concat(longer)
    return DeclareImmutable(combined.sort(sorter_))
  }

  function _PrimarySelectorsOf(_target) {
    const inherited = _target.type.allDefinedVisibles
    const owned     = _OwnSelectorsOf(_target[$INNER])
    return MergeAndSort(inherited, owned, CompareSelectors)
  }

  function _PrimaryPublicSelectorsOf(_target) {
    const inherited = _target.type.allDefinedVisiblePublics
    const owned     = _OwnNamesOf(_target[$OUTER])
    return MergeAndSort(inherited, owned, CompareSelectors)
  }



  function PrimarySelectorsOf(value) {
    if (value == null) { return TheEmptyArray }
    if (value[$IS_INNER] === PROOF) { return _PrimarySelectorsOf(value) }
    const _$value = InterMap.get(value)
    if (_$value)     { return _PrimaryPublicSelectorsOf(_$value[$PULP]) }
    return SortedSelectorsUsing(
      Object(value), _OwnNamesOf, undefined, Object.prototype)
  }



  function ValueHasOwn(value, selector) {
    return (value != null) && _HasOwnHandler.call(value, selector)
  }

  function ValueHas(value, selector) {
    return (value != null) && (selector in Object(value))
  }


  const PRIVATE_SYMBOL_MATCHER = /^[_$]/i

  function IsPublicSelector(selector) {
    var firstChar
    switch (selector[0]) {
      default        : return true
      case "_"       : return false
      case undefined :
        firstChar = selector.toString()[SYMBOL_1ST_CHAR]
        return !PRIVATE_SYMBOL_MATCHER.test(firstChar)
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
    return (InterMap.get(value) !== undefined)
  }

  function ValueIsSomething(value) {
    switch (typeof value) {
      default         : return false
      case "function" : break
      case "object"   : if (value === null) { return false } else { break }
    }
    return (value[$IS_INNER] === PROOF || InterMap.get(value) !== undefined)
  }

  function ValueIsThing(value) {
    switch (typeof value) {
      default         : return false
      case "function" : break
      case "object"   : if (value === null) { return false } else { break }
    }
    if (value[$IS_THING] === PROOF) { return true }
    const _$value = InterMap.get(value)
    return (_$value !== undefined && _$value[$IS_THING] === PROOF)
  }

  function ValueIsNothing(value) {
    if (typeof value !== "object")    { return false }
    if (value === null)               { return true  }
    if (value[$IS_NOTHING] === PROOF) { return true  }
    const _$value = InterMap.get(value)
    return (_$value !== undefined && _$value[$IS_NOTHING] === PROOF)
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
    return OwnVisibleNamesOf(target)
  }

  function FindAndSetDurables(target) {
    return (target[_DURABLES] = OwnVisibleNamesOf(target))
  }


  function BasicSetInvisibly(target, selector, value, setOuterToo_) {
    DefineProperty(target, selector, InvisibleConfig)
    if (setOuterToo_) {
      const $target = target[$OUTER]
      DefineProperty($target, selector, InvisibleConfig)
      $target[selector] = value
    }
    return (target[selector] = value)
  }


  // This method should only be called on a mutable object!!!
  // eslint-disable-next-line
  function _basicSetImmutable(inPlace_, visited__) {
    const _$target = this[$INNER]
    const  $target = _$target[$OUTER]

    delete _$target._retarget
    $target[IMMUTABLE] = _$target[IMMUTABLE] = true
    return this
  }


  function KnowAndSetFuncImmutable(func, marker) {
    if (func == null || KnownFuncs.get(func)) { return func }
    func[IMMUTABLE] = true
    KnownFuncs.set(func, marker)
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

    var suffixes      = _OwnKeysOf(families).sort()
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


  Shared.declareImmutable         = KnowFunc(DeclareImmutable)
  Shared.declareAsImmutable       = KnowFunc(DeclareAsImmutable)

  Shared._ownVisibleNamesOf       = KnowFunc(_OwnVisibleNamesOf)
  Shared._ownVisiblesOf           = KnowFunc(_OwnVisiblesOf)
  Shared._ownPublicsOf            = KnowFunc(_OwnPublicsOf)
  Shared._ownNamesOf              = KnowFunc(_OwnNamesOf)
  Shared._ownSymbolsOf            = KnowFunc(_OwnSymbolsOf)
  Shared._ownSelectorsOf          = KnowFunc(_OwnSelectorsOf)
  Shared._ownKeysOf               = KnowFunc(_OwnKeysOf)

  Shared.ownVisibleNamesOf        = KnowFunc(OwnVisibleNamesOf)
  Shared.ownVisiblesOf            = KnowFunc(OwnVisiblesOf)
  Shared.ownPublicsOf             = KnowFunc(OwnPublicsOf)
  Shared.ownNamesOf               = KnowFunc(OwnNamesOf)
  Shared.ownSymbolsOf             = KnowFunc(OwnSymbolsOf)
  Shared.ownSelectorsOf           = KnowFunc(OwnSelectorsOf)
  Shared.ownKeysOf                = KnowFunc(OwnKeysOf)

  Shared.knownVisibleNamesOf      = KnowFunc(KnownVisibleNamesOf)
  Shared.knownVisiblesOf          = KnowFunc(KnownVisiblesOf)
  Shared.knownPublicsOf           = KnowFunc(KnownPublicsOf)
  Shared.knownNamesOf             = KnowFunc(KnownNamesOf)
  Shared.knownSymbolsOf           = KnowFunc(KnownSymbolsOf)
  Shared.knownSelectorsOf         = KnowFunc(KnownSelectorsOf)
  Shared.knownKeysOf              = KnowFunc(KnownKeysOf)

  Shared.primarySelectorsOf       = KnowFunc(PrimarySelectorsOf)

  Shared.valueHasOwn              = KnowFunc(ValueHasOwn)
  Shared.valueHas                 = KnowFunc(ValueHas)

  Shared.valueIsInner             = KnowFunc(ValueIsInner)
  Shared.valueIsOuter             = KnowFunc(ValueIsOuter)
  Shared.valueIsSomething         = KnowFunc(ValueIsSomething)
  Shared.valueIsThing             = KnowFunc(ValueIsThing)
  Shared.valueIsNothing           = KnowFunc(ValueIsNothing)

  Shared.valueIsFact              = KnowFunc(ValueIsFact)
  Shared.valueIsImmutable         = KnowFunc(ValueIsImmutable)
  Shared.valueIsSurfaceImmutable  = KnowFunc(ValueIsSurfaceImmutable)
  Shared.isSurfaceImmutable       = ValueIsSurfaceImmutable

  Shared.isPublicSelector         = KnowFunc(IsPublicSelector)
  Shared.compareSelectors         = KnowFunc(CompareSelectors)
  Shared.sortParameters           = KnowFunc(SortParameters)

  Shared.DiffAndSort              = KnowFunc(DiffAndSort)
  Shared.MergeAndSort             = KnowFunc(MergeAndSort)

  Shared.findDurables             = KnowFunc(FindDurables)


  _Shared._HasOwnHandler            = _HasOwnHandler // ._hasOwn
  _Shared._KnownVisibleNamesOf      = _KnownVisibleNamesOf
  _Shared._KnownNamesOf             = _KnownNamesOf
  _Shared._KnownSelectorsOf         = _KnownSelectorsOf
  _Shared._PrimarySelectorsOf       = _PrimarySelectorsOf
  _Shared._PrimaryPublicSelectorsOf = _PrimaryPublicSelectorsOf
  _Shared.BasicSetInvisibly         = BasicSetInvisibly
  _Shared._BasicSetImmutable        = _basicSetImmutable
  _Shared.KnowAndSetFuncImmutable   = KnowAndSetFuncImmutable
  _Shared.SetFuncImmutable          = SetFuncImmutable
  _Shared.FindAndSetDurables        = FindAndSetDurables

})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
