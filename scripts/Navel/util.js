ObjectSauce(function (
  $IS_INNER, $RIND, IS_IMMUTABLE, PROOF,
  InterMap, OwnKeys, SpawnFrom,
  OSauce
) {
  "use strict"

  const PARAM_FAMILY_MATCHER = /^(\w+(_[a-zA-Z]+))|([a-zA-Z]*[a-z]([A-Z][a-z]+))$/

  function _SortParams(params) {
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

  _ObjectSauce.sortParams = function (paramsListing) {
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
    constants = _SortParams(constants)
    standards = _SortParams(standards)
    osauces   = osauces.join(", ")
    return constants.concat(standards, osauces).join(", \n")
  }

})
