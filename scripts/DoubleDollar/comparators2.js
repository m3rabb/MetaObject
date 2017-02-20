/// 444444444444

Krust.add(function areIdentical(a, b) {
  // Identical references. Easy out
  if (a === b) { return true }
  // Weed out undefined and null to avoid primitives that can't has properties.
  if (a == null || b == null) { return false }

  switch (a.constructor) {
    case Boolean: case Symbol: case String: return false  // Easy out
    case Number: return (a !== a) && (b !== b) // Check for NaN
    case Function:   // Ensure function execution is the same
      if (a[ORIGINAL] !== b[ORIGINAL]) { return false }
  }

  // From this point "a" is an obj|fun and "b" is an obj|func|num|str
  return IsIdentical().compareObjects(a, b)
})

Krust.add(function areExactly(a, b) {
  // Identical references. Easy out
  if (a === b) { return true }
  // Weed out undefined and null to avoid primitives that can't has properties.
  if (a == null || b == null) { return false }

  switch (a.constructor) {
    case Boolean: case Symbol: case String: return false  // Easy out
    case Number: return (a !== a) && (b !== b) // Check for NaN
    case Function:   // Ensure function execution is the same
      if (a[ORIGINAL] !== b[ORIGINAL]) { return false }
  }

  // From this point "a" is an obj|fun and "b" is an obj|func|num|str
  return IsExactly().compareObjects(a, b)
})

Krust.add(function areInterchangeable(a, b) {
  // Identical references. Easy out
  if (a === b) { return true }
  // Weed out undefined and null to avoid primitives that can't has properties.
  if (a == null || b == null) { return false }

  switch (a.constructor) {
    case Boolean: case Symbol: case String: return false  // Easy out
    case Number: return (a !== a) && (b !== b) // Check for NaN
    case Function:   // Ensure function execution is the same
      if (a[ORIGINAL] !== b[ORIGINAL]) { return false }
  }

  // From this point "a" is an obj|fun and "b" is an obj|func|num|str
  return IsInterchangeable().compareObjects(a, b)
})

Krust.add(function areEqual(a, b) {
  // Identical references. Easy out
  if (a === b) { return true }
  // Weed out undefined and null to avoid primitives that can't has properties.
  if (a == null || b == null) { return false }

  switch (a.constructor) {
    case Boolean: case Symbol: case String: return false  // Easy out
    case Number: return (a !== a) && (b !== b) // Check for NaN
    case Function:   // Ensure function execution is the same
      if (a[ORIGINAL] !== b[ORIGINAL]) { return false }
  }

  // From this point "a" is an obj|fun and "b" is an obj|func|num|str
  return IsEqual().compareObjects(a, b)
})

Krust.add(function areEquivEqual(a, b) {
  // Identical references. Easy out
  if (a === b) { return true }
  // Weed out undefined and null to avoid primitives that can't has properties.
  if (a == null) { return (a == b) }

  switch (a.constructor) {
    case Boolean  : return comparator_type.compareBoolean(a, b)
    case Symbol   : return comparator_type.compareSymbol(a, b)
    case String   : return comparator_type.compareString(a, b)
    case Number   : return comparator_type.compareNumber(a, b)
    case Function :   // Ensure function execution is the same
      if (a[ORIGINAL] !== b[ORIGINAL]) { return false }
  }

  // From this point "a" is an obj|fun and "b" is an obj|func|num|str
  return IsEquivEqual().compareObjects(a, b)
})

Krust.add(function areEquivalent(a, b) {
  // Identical references. Easy out
  if (a === b) { return true }
  // Weed out undefined and null to avoid primitives that can't has properties.
  if (a == null) { return (a == b) }

  switch (a.constructor) {
    case Boolean  : return comparator_type.compareBoolean(a, b)
    case Symbol   : return comparator_type.compareSymbol(a, b)
    case String   : return comparator_type.compareString(a, b)
    case Number   : return comparator_type.compareNumber(a, b)
    case Function :   // Ensure function execution is the same
      if (a[ORIGINAL] !== b[ORIGINAL]) { return false }
  }

  // From this point "a" is an obj|fun and "b" is an obj|func|num|str
  return IsEquivalent().compareObjects(a, b)
})



Thing.add(function isIdentical(other) {
  if (this === other) { return true }
  if (other == null) { return false }
  return this._isIdentical(other, IsIdentical)
})

Thing.add(function isExactly(other) {
  if (this === other) { return true }
  if (other == null) { return false }
  return this._isExactly(other, IsExactly)
})

Thing.add(function isInterchangeable(other) {
  if (this === other) { return true }
  if (other == null) { return false }
  return this._isInterchangeable(other, IsInterchangeable)
})

Thing.add(function isEqual(other) {
  if (this === other) { return true }
  if (other == null) { return false }
  return this._isEqual(other, IsEqual)
})

Thing.add(function isEquivEqual(other) {
  if (this === other) { return true }
  if (other == null) { return false }
  return this._isEquivEqual(other, IsEquaivalent)
})

Thing.add(function isEquivalent(other) {
  if (this === other) { return true }
  if (other == null) { return false }
  return this._isEquivalent(other, IsEquaivalent)
})



Thing.add(function _isIdentical(other, comparator_type) {
  // other is !== this and isn't null|undefined
  const _other = InterMap.get(other)

  if (_other          === undefined)        { return false }
  if (this[IS_FACT]   !== IMMUTABLE)        { return false }
  if (_other[IS_FACT] !== IMMUTABLE)        { return false }
  if (this.type       !== _other.type)      { return false }
  if (this[ORIGINAL]  !== _other[ORIGINAL]) { return false }

  ComparePropertiesFullyUsing(this, _other, comparator_type)
})

Thing.add("_isExactly"        , CompareFullyUsing)
Thing.add("_isInterchangeable", CompareFullyUsing)
Thing.add("_isEqual"          , CompareValuesUsing)
Thing.add("_isEquivEqual"     , CompareValuesUsing)
Thing.add("_isEquivalent"     , CompareValuesUsing)


function CompareFullyUsing(other, comparator_type) {
  // other is !== this and isn't null|undefined
  const _other = InterMap.get(other)

  if (_other         === undefined)        { return false }
  if (this[IS_FACT]  !== _other[IS_FACT])  { return false }
  if (this.type      !== _other.type)      { return false }
  if (this[ORIGINAL] !== _other[ORIGINAL]) { return false }

  ComparePropertiesFullyUsing(this, _other, comparator_type)
}

function CompareValuesUsing(other, comparator_type) {
  // other is !== this and isn't null|undefined
  let _other = InterMap.get(other) || other

  if (this[ORIGINAL] !== _other[ORIGINAL]) { return false }

  ComparePropertiesValuesUsing(this, _other, comparator_type)
}


function ComparePropertiesUsing(_objA, _objB, comparator_type) {
  // objA is an obj|fun and objB is an obj|func|num|str

  propsA       = objA[KNOWN_PROPERTIES] || LocalProperties(objA)
  propsB       = objB[KNOWN_PROPERTIES] || LocalProperties(objB)
  next         = propsA.length
  compareNulls = comparator_type.compareNulls

  if (propsA !== propsB && next !== propsB.length) { return false }

  while (next--) {
    prop = propsA[next]
    a = objA[prop]
    if (a === undefined && !(prop in objB)) { return false }
    b = objB[prop]

    // Identical references. Easy out
    if (a === b) { continue }
    // Weed out undefined and null to avoid primitives that can't has properties.
    if (a == null || b == null) { return false }

    switch (a.constructor) {
      case Boolean: case Symbol: case String: return false  // Easy out
      case Number:  // Check for NaN
        if (a !== a) && (b !== b) { continue } else { return false }
    }

    comparator = (comparator_.isComparator) ? comparator_ :
      comparator_.new(objA.$ || objA, objB.$ || objA)

    if (comparator.compareObjects(a, b)) { break } else { return false }
  }

  while (next--) {
    prop = propsA[next]
    a = objA[prop]
    if (a === undefined && !(prop in objB)) { return false }
    b = objB[prop]

    // Identical references. Easy out
    if (a === b) { continue }
    // Weed out undefined and null to avoid primitives that can't has properties.
    if (a == null || b == null) { return false }

    switch (a.constructor) {
      case Boolean: case Symbol: case String: return false  // Easy out
      case Number:  // Check for NaN
        if (a !== a) && (b !== b) { continue } else { return false }
    }

    if (!comparator.compareObjects(a, b)) { return false }
  }

  return true
}


IsIdentical      .add("compareObjects", CompareObjectsStructure)
IsExactly        .add("compareObjects", CompareObjectsStructure)
IsInterchangeable.add("compareObjects", CompareObjectsInterchangeability)
IsEqual          .add("compareObjects", CompareObjectsValues)
IsEquivEqual     .add("compareObjects", CompareObjectsValues)
IsEquivalent     .add("compareObjects", CompareObjectsValues)

function CompareObjectsStructure(a, b) {
  // "a" is an obj|fun and "b" is an obj|func|num|str and aren't ===
  const ids, idA, idB, _test, innerA

  ids = this.ids
  idA = ids.get(a)
  idB = ids.get(b)

  if (!this._haveEqualPaths(idA, idB)) { return false }
  if (this._alreadyCompared(idA, idB)) { return true }

  _test = this._test

  if ((innerA = InterMap.get(a))) { return innerA[_test](b, this) }
  if (a[_test] && a.constructor !== Object) { return a[_test](b, this }
  if (IsImmutable(a) !== IsImmutable(b)) { return false }
  if (RootOf(a) !== RootOf(b)) { return false }

  return ComparePropertiesFullyUsing(a, b, this)
}

function CompareObjectsInterchangeability(a, b) {
  // "a" is an obj|fun and "b" is an obj|func|num|str and aren't ===
  const ids, idA, idB, _test, innerA, isImmutable

  ids = this.ids
  idA = ids.get(a)
  idB = ids.get(b)
  _test = this._test

  if ((innerA = InterMap.get(a))) {
    isImmutableA = (innerA[IS_FACT] !== IMMUTABLE)
    if (!isImmutableA && !this._haveEqualPaths(idA, idB)) { return false }
    if (this._alreadyCompared(idA, idB)) { return true }
    return inner[_test](b, this)
  }

  isImmutableA = IsImmutable(a)

  if (a[_test] && a.constructor !== Object) {
    if (!isImmutableA && !this._haveEqualPaths(idA, idB)) { return false }
    if (this._alreadyCompared(idA, idB)) { return true }
    return a[_test](b, this)
  }

  // Ensure same mutability
  if (isImmutableA !== IsImmutable(b)) { return false }
  // Ensure same ancestry
  if (RootOf(a) !== RootOf(b)) { return false }

  return ComparePropertiesFullyUsing(a, b, this)
}

function CompareObjectsValues(a, b) {
  // "a" is an obj|fun and "b" is an obj|func|num|str and aren't ===
  const ids, idA, idB, _test, innerA, innerB

  ids = this.ids

  if (this._alreadyCompared(ids.get(a), ids.get(b))) { return true }

  _test = this._test

  if ((innerA = InterMap.get(a))) { return innerA[_test](b, this) }
  if ((innerB = InterMap.get(b))) { return innerB[_test](a, this) }
  if (a[_test] && a.constructor !== Object) { return a[_test](b, this) }
  if (b[_test] && b.constructor !== Object) { return b[_test](a, this) }

  return ComparePropertiesValuesUsing(a, b, this)
}
