Tranya(function (
  $INNER, $IS_INNER, $OUTER, $RIND, IS_IMMUTABLE, PROOF, _DURABLES,
  DefineProperty, Frost, InterMap, InvisibleConfig, MarkFunc, OwnKeys,
  OwnNames, SpawnFrom,
  Shared, _Shared
) {
  "use strict"


  function AsName(string_symbol) {
    if (string_symbol.charAt) { return string_symbol }
    const name = string_symbol.toString()
    return name.slice(7, name.length - 1)
  }

  function ValueIsTranya(value) {
    switch (typeof value) {
      default         : return false
      case "function" : break
      case "object"   : if (value === null) { return false } else { break }
    }
    const value$ = value[$RIND]
    if (value$ === undefined) { return false }
    return (InterMap.get(value$)[$IS_INNER] === PROOF)
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
    return (_$value[$RIND] === value)
  }

  function ValueIsImmutable(value) {
    switch (typeof value) {
      case "function" : break
      case "object"   : break
      default         : return true
    }
    return value[IS_IMMUTABLE] ? true : false
  }

  function ValueIsFact(value) {
    if (typeof value !== "object") { return true }
    if (value === null)            { return true }
    if (value[IS_IMMUTABLE])       { return true }
    if (value.id != null)          { return true }
    return false
  }


  function FindAndSetDurables(_$target) {
    const durables = OwnNames(_$target)
    durables[IS_IMMUTABLE] = true
    return (_$target[_DURABLES] = Frost(durables))
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
    $target[IS_IMMUTABLE] = _$target[IS_IMMUTABLE] = true
    Frost($target)
    return this
  } // IDEMPOT_SELF_METHOD


  function MarkAndSetFuncImmutable(func, marker) {
    if (InterMap.get(func)) { return func }
    func[IS_IMMUTABLE] = true
    InterMap.set(func, marker)
    Frost(func.prototype)
    return Frost(func)
  }

  function SetFuncImmutable(func) {
    func[IS_IMMUTABLE] = true
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

    var suffixes      = OwnKeys(families).sort()
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

    var osauces   = ["Shared", "_Shared"].filter(name => {
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
    osauces   = osauces.join(", ")
    return constants.concat(standards, osauces).join(", \n")
  }

  Shared.asName                   = MarkFunc(AsName)
  Shared.valueIsTranya            = MarkFunc(ValueIsTranya)
  Shared.valueIsInner             = MarkFunc(ValueIsInner)
  Shared.valueIsOuter             = MarkFunc(ValueIsOuter)
  Shared.valueIsImmutable         = MarkFunc(ValueIsImmutable)
  Shared.valueIsFact              = MarkFunc(ValueIsFact)
  Shared.sortParameters           = MarkFunc(SortParameters)

  _Shared.FindAndSetDurables      = FindAndSetDurables
  _Shared.SetInvisibly            = SetInvisibly
  _Shared._BasicSetImmutable      = _basicSetImmutable
  _Shared.MarkAndSetFuncImmutable = MarkAndSetFuncImmutable
  _Shared.SetFuncImmutable        = SetFuncImmutable

})
