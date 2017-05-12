function BuildAncestors(supertypes) {
  let next = supertypes.length
  let ancestors = []

  let supertypeIndex = _supertypes.length
  if (supertypeIndex === 0) { return [] }

  let supertype$inner = InterMap.get(supertypes[--supertypeIndex])
  let ancestry = supertype$inner[ANCESTRY]
  let ancestryIndex = ancestry.length
  let visited = new Set()

  while (ancestorIndex--) {
    visited.add((ancestors[ancestryIndex] = ancestry[ancestryIndex]))
  }
  if (next === 0) { return ancestors }

  do {
    supertype$inner = InterMap.get(supertypes[--supertypeIndex])
    if (!visited.has(supertype$inner)) {
      _supertype.ancestry.forEach(_type => {
        const oid = _type.oid
        if (!visited[oid]) { ancestors.push((visited[oid] = _type)) }
      })
    }
  } while (next)
  return ancestors
}


function BuildAncestors(_supertypes) {
  let next = _supertypes.length
  if (next === 0) { return [] }

  let _supertype = _supertypes[--next]
  const ancestors = _supertype.ancestry.slice()
  if (next === 0) { return ancestors }

  const visited = { __proto__ : null }
  ancestors.forEach(_type => (visited[_type.oid] = _type))

  do {
    _supertype = _supertypes[--next]
    let oid = _supertype.oid
    if (!visited[oid]) {
      _supertype.ancestry.forEach(_type => {
        const oid = _type.oid
        if (!visited[oid]) { ancestors.push((visited[oid] = _type)) }
      })
    }
  } while (next)
  return ancestors
}






Type$inner.addMethod(function _deleteInheritedProperties() {
  const ownProperties = this._properties
  const blanker = this._blanker
  const $root$inner = blanker.$root$inner
  const $root$pulp = blanker.$root$pulp

  for (let selector in $root$inner) {
    if (!ownProperties[selector]) {
      delete $root$pulp[selector]
    }
  }
  return this
}



Type$inner.addMethod(function _inheritPropertiesFrom(_supertypes) {
  const existing = this._properties

  for (let next = 0, count = _supertypes.length; next < count; next++) {
    let _supertype = _supertypes[next]
    let properties = _supertype._properties

    for (let selector in properties) {
      if (!existing[selector]) {
        let value = properties[selector]

        if (value !== PROPERTY) { InSetMethod(this, value) }
        else { InSetProperty(this, selector, _supertype[selector]) }
      }
    }
  }
})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
