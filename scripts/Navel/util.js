ObjectSauce(function (
  $IS_INNER, $RIND, IS_IMMUTABLE, PROOF,
  InterMap, MarkFunc, OwnKeys, SpawnFrom,
  OSauce
) {
  "use strict"


  function AsName(string_symbol) {
    if (string_symbol.charAt) { return string_symbol }
    const name = string_symbol.toString()
    return name.slice(7, name.length - 1)
  }

  function IsValueTranya(value) {
    switch (typeof value) {
      default         : return false
      case "function" : break
      case "object"   : if (value === null) { return false } else { break }
    }
    const value$ = value[$RIND]
    if (value$ === undefined) { return false }
    return (InterMap.get(value$)[$IS_INNER] === PROOF)
  }

  function IsValueInner(value) {
    switch (typeof value) {
      default         : return false
      case "function" : break
      case "object"   : if (value === null) { return false } else { break }
    }
    return (value[$IS_INNER] === PROOF)
  }

  function IsValueOuter(value) {
    switch (typeof value) {
      default         : return false
      case "function" : break
      case "object"   : if (value === null) { return false } else { break }
    }
    const _$value = InterMap.get(value)
    return (_$value[$RIND] === value)
  }

  function IsValueImmutable(value) {
    switch (typeof value) {
      case "function" : break
      case "object"   : break
      default         : return true
    }
    return value[IS_IMMUTABLE] ? true : false
  }

  function IsValueFact(value) {
    if (typeof value !== "object") { return true }
    if (value === null)            { return true }
    if (value[IS_IMMUTABLE])       { return true }
    if (value.id != null)          { return true }
    return false
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

    var osauces   = ["OSauce", "_OSauce"].filter(name => {
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

  OSauce.asName           = MarkFunc(AsName)
  OSauce.isValueTranya    = MarkFunc(IsValueTranya)
  OSauce.isValueInner     = MarkFunc(IsValueInner)
  OSauce.isValueOuter     = MarkFunc(IsValueOuter)
  OSauce.isValueImmutable = MarkFunc(IsValueImmutable)
  OSauce.valueIsFact      = MarkFunc(IsValueFact)
  OSauce.sortParameters   = MarkFunc(SortParameters)

})
