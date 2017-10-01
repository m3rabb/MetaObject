Tranya(function (
  $INNER, $IS_INNER, $OUTER, $RIND, IMMUTABLE, PROOF, SYMBOL_1ST_CHAR,
  _DURABLES,
  CrudeBeImmutable, DefineProperty, Frost, ImplementationSymbols, InterMap,
  InvisibleConfig, MarkFunc, RootOf, SpawnFrom, TheEmptyArray,
  Shared, _Shared
) {
  "use strict"


  function _OwnSortedSelectorsOf(value, picker) {
    if (value == null) { return TheEmptyArray }
    var selectors = picker(value)
    selectors = selectors.filter(selector => !ImplementationSymbols[selector])
    return CrudeBeImmutable(selectors.sort(CompareSelectors))
  }

  function _SortedSelectorsOf(value, picker, sorter_) {
    var target, selectors, selector, index, next
    if (value == null) { return TheEmptyArray }

    const known        = SpawnFrom(null)
    const allSelectors = []
    target = Object(value)
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

    return CrudeBeImmutable(allSelectors.sort(sorter_))
  }


  const _HasOwn        = Object.prototype.hasOwnProperty // ._hasOwn
  const _OwnVisiblesOf = Object.keys
  const _OwnNamesOf    = Object.getOwnPropertyNames
  const _OwnSymbolsOf  = Object.getOwnPropertySymbols
  const _OwnKeysOf     = Reflect.ownKeys


  function OwnVisiblesOf(value) {
    return CrudeBeImmutable(_OwnVisiblesOf(value).sort())
  }

  function OwnNamesOf(value) {
    return CrudeBeImmutable(_OwnNamesOf(value).sort())
  }

  function OwnSymbolsOf(value) {
    return _OwnSortedSelectorsOf(value, _OwnSymbolsOf)
  }

  function OwnSelectorsOf(value) {
    return _OwnSortedSelectorsOf(value, _OwnKeysOf)
  }

  function OwnKeysOf(value) {
    return CrudeBeImmutable(_OwnKeysOf(value).sort(CompareSelectors))
  }


  function VisiblesOf(target) {
    var index, name
    const visibles = []
    index = 0
    for (name in target) { visibles[index++] = name }
    return CrudeBeImmutable(visibles.sort())
  }

  function NamesOf(target) {
    return _SortedSelectorsOf(target, _OwnNamesOf)
  }

  function SymbolsOf(target) {
    return _SortedSelectorsOf(target, OwnSymbolsOf, CompareSelectors)
  }

  function SelectorsOf(target) {
    return _SortedSelectorsOf(target, OwnSelectorsOf, CompareSelectors)
  }

  function KeysOf(target) {
    return _SortedSelectorsOf(target, _OwnKeysOf, CompareSelectors)
  }



  function ValueHasOwn(value, selector) {
    return (value != null) && _HasOwn.call(value, selector)
  }

  function ValueHas(value, selector) {
    return (value != null) && (selector in Object(value))
  }



  function ValueAsName(value) {
    var name
    switch (typeof value) {
      case "symbol" :
        name = value.toString()
        return name.slice(7, name.length - 1)

      case "function" :
      case "object"   :
        return value.name
    }
    return value
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



  // function CompareSelectors(a, b) {
  //   return ValueAsName(a).localeCompare(ValueAsName(b))
  // }

  function CompareSelectors(a, b) {
    const nameA = ValueAsName(a)
    const nameB = ValueAsName(b)
    return (nameA === nameB) ? 0 : (nameA < nameB ? -1 : 1)
  }



  function FindDurables(target) {
    const durables = _OwnNamesOf(target)
    durables[IMMUTABLE] = true
    return Frost(durables)
  }

  function FindAndSetDurables(target) {
    const durables = OwnNamesOf(target)
    return (target[_DURABLES] = Frost(durables))
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
    Frost($target)
    return this
  }


  function MarkAndSetFuncImmutable(func, marker) {
    if (func == null || InterMap.get(func)) { return func }
    func[IMMUTABLE] = true
    InterMap.set(func, marker)
    Frost(func.prototype)
    return Frost(func)
  }

  function SetFuncImmutable(func) {
    func[IMMUTABLE] = true
    Frost(func.prototype)
    return Frost(func)
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

  Shared._ownSymbolsOf            = MarkFunc(_OwnSymbolsOf)
  Shared._ownKeysOf               = MarkFunc(_OwnKeysOf)
  Shared._ownVisiblesOf           = MarkFunc(_OwnVisiblesOf)
  Shared._ownNamesOf              = MarkFunc(_OwnNamesOf)

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

  Shared.valueAsName              = MarkFunc(ValueAsName)
  Shared.compareSelectors         = MarkFunc(CompareSelectors)
  Shared.sortParameters           = MarkFunc(SortParameters)
  Shared.findDurables             = MarkFunc(FindDurables)

  _Shared._HasOwn                 = _HasOwn // ._hasOwn
  _Shared.FindAndSetDurables      = FindAndSetDurables
  _Shared.SetInvisibly            = SetInvisibly
  _Shared._BasicSetImmutable      = _basicSetImmutable
  _Shared.MarkAndSetFuncImmutable = MarkAndSetFuncImmutable
  _Shared.SetFuncImmutable        = SetFuncImmutable

})
