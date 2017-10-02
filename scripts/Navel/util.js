Tranya(function (
  $INNER, $IS_INNER, $OUTER, $RIND, IMMUTABLE, PROOF, SYMBOL_1ST_CHAR,
  _DURABLES,
  DefineProperty, FreezeSurface, GlazeError, ImplementationSymbols,
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

  function IsSurfaceImmutable(value) {
    if (value[IMMUTABLE] === true) {
      if (value[$IS_INNER] === PROOF || InterMap.get(value)) { return true }
    }
    return IsSurfaceFrozen(value)
  }


  const _HasOwn        = Object.prototype.hasOwnProperty // ._hasOwn
  const _OwnVisiblesOf = Object.keys
  const _OwnNamesOf    = Object.getOwnPropertyNames
  const _OwnSymbolsOf  = Object.getOwnPropertySymbols
  const _OwnKeysOf     = Reflect.ownKeys

  function _OwnSelectorsOf(value) {
    return _OwnKeysOf(value).filter(sel => !ImplementationSymbols[sel])
  }

  function _OwnSafeSymbolsOf(value) {
    return _OwnSymbolsOf(value).filter(sel => !ImplementationSymbols[sel])
  }

  function OwnVisiblesOf(value) {
    return (value == null) ? TheEmptyArray :
      GlazeImmutable(_OwnVisiblesOf(value).sort())
    // Note: proxy forces _OwnSelectorsOf to be called by _OwnVisiblesOf.
  }

  function OwnNamesOf(value) {
    return (value == null) ? TheEmptyArray :
      GlazeImmutable(_OwnNamesOf(value).sort())
    // Note: proxy forces _OwnSelectorsOf to be called by _OwnNamesOf.
  }

  function OwnSymbolsOf(value) {
    return (value == null) ? TheEmptyArray :
      GlazeImmutable(_OwnSymbolsOf(value).sort(CompareSelectors))
    // Note: proxy forces _OwnSelectorsOf to be called by _OwnSymbolsOf.
  }

  function OwnSelectorsOf(value) {
    return (value == null) ? TheEmptyArray :
      GlazeImmutable(_OwnSelectorsOf(value).sort(CompareSelectors))
  }

  function OwnKeysOf(value) {
    return (value == null) ? TheEmptyArray :
      GlazeImmutable(_OwnKeysOf(value).sort(CompareSelectors))
  }


  function SortedSelectorsUsing(value, picker, sorter_) {
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
    } while ((target = RootOf(target)))

    return GlazeImmutable(allSelectors.sort(sorter_))
  }

  function AspectOf(value) {
    var _$value
    if (value[$IS_INNER] === PROOF) { return value[$INNER] }
    if ((_$value = InterMap.get(value))) {
      return (_$value[$IS_INNER] === PROOF) ? _$value[$OUTER] : value
    }
    return Object(value)
  }


  function VisiblesOf_(value) {
    var index, name
    const visibles = []
    index = 0
    for (name in value) { visibles[index++] = name }
    return GlazeImmutable(visibles.sort())
  }

  function NamesOf_(value) {
    return SortedSelectorsUsing(value, _OwnNamesOf)
  }

  function SymbolsOf_(value) {
    return SortedSelectorsUsing(value, _OwnSymbolsOf, CompareSelectors)
  }

  function SafeSymbolsOf_(value) {
    return SortedSelectorsUsing(value, _OwnSafeSymbolsOf, CompareSelectors)
  }

  function SelectorsOf_(value) {
    return SortedSelectorsUsing(value, _OwnSelectorsOf, CompareSelectors)
  }

  function KeysOf_(value) {
    return SortedSelectorsUsing(value, _OwnKeysOf, CompareSelectors)
  }


  function VisiblesOf(value) {
    return (value == null) ? TheEmptyArray : VisiblesOf_(AspectOf(value))
  }

  function NamesOf(value) {
    return (value == null) ? TheEmptyArray : NamesOf_(AspectOf(value))
  }

  function SymbolsOf(value) {
    var _$value
    if (value == null) { return TheEmptyArray }
    if (value[$IS_INNER] === PROOF) { return SafeSymbolsOf_(value[$INNER]) }
    if ((_$value = InterMap.get(value))) {
      return (_$value[$IS_INNER] === PROOF) ?
        SafeSymbolsOf_(_$value[$OUTER]) : SymbolsOf_(value)
    }
    return SymbolsOf_(Object(value))
  }

  function SelectorsOf(value) {
    var _$value
    if (value == null) { return TheEmptyArray }
    if (value[$IS_INNER] === PROOF) { return SelectorsOf_(value[$INNER]) }
    if ((_$value = InterMap.get(value))) {
      return (_$value[$IS_INNER] === PROOF) ?
        NamesOf_(_$value[$OUTER]) : KeysOf_(value)
    }
    return KeysOf_(Object(value))
  }

  function KeysOf(value) {
    var _$value
    if (value == null) { return TheEmptyArray }
    if (value[$IS_INNER] === PROOF) { return SelectorsOf_(value[$INNER]) }
    if ((_$value = InterMap.get(value))) {
      return (_$value[$IS_INNER] === PROOF) ?
        SelectorsOf_(_$value[$OUTER]) : KeysOf_(value)
    }
    return KeysOf_(Object(value))
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

  function ValueIsImmutable(value) {
    switch (typeof value) {
      case "function" : break
      case "object"   : break
      default         : return true
    }
    return value[IMMUTABLE] ? true : false
  }

  function ValueIsFact(value) {
    if (typeof value !== "object") { return true }
    if (value === null)            { return true }
    if (value[IMMUTABLE])          { return true }
    if (value.id != null)          { return true }
    return false
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
  Shared.isSurfaceImmutable       = MarkFunc(IsSurfaceImmutable)

  _Shared._HasOwn                 = _HasOwn // ._hasOwn

  _Shared.VisiblesOf_             = VisiblesOf_
  _Shared.NamesOf_                = NamesOf_
  // _Shared.SymbolsOf_           = SymbolsOf_
  _Shared.SelectorsOf_            = SelectorsOf_
  _Shared.KeysOf_                 = KeysOf_

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

  Shared.visiblesOf               = MarkFunc(VisiblesOf)
  Shared.namesOf                  = MarkFunc(NamesOf)
  Shared.symbolsOf                = MarkFunc(SymbolsOf)
  Shared.selectorsOf              = MarkFunc(SelectorsOf)
  Shared.keysOf                   = MarkFunc(KeysOf)

  Shared.valueHasOwn              = MarkFunc(ValueHasOwn)
  Shared.valueHas                 = MarkFunc(ValueHas)

  Shared.isPublicSelector         = MarkFunc(IsPublicSelector)
  Shared.valueIsInner             = MarkFunc(ValueIsInner)
  Shared.valueIsOuter             = MarkFunc(ValueIsOuter)
  Shared.valueIsTranyan           = MarkFunc(ValueIsTranyan)
  Shared.valueIsImmutable         = MarkFunc(ValueIsImmutable)
  Shared.valueIsFact              = MarkFunc(ValueIsFact)

  Shared.compareSelectors         = MarkFunc(CompareSelectors)
  Shared.sortParameters           = MarkFunc(SortParameters)

  Shared.findDurables             = MarkFunc(FindDurables)
  _Shared.FindAndSetDurables      = FindAndSetDurables

  _Shared.SetInvisibly            = SetInvisibly
  _Shared._BasicSetImmutable      = _basicSetImmutable
  _Shared.MarkAndSetFuncImmutable = MarkAndSetFuncImmutable
  _Shared.SetFuncImmutable        = SetFuncImmutable

})
