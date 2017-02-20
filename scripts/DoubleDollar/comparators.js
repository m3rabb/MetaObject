/// 3333333333









is                               the exact same object
isEquivEqual (for R)       equivalent root, equal children
isEquivalent (for R)       same values (ignore type & mutability, case)

und <=> null
string <=> asNumber
string <=> string asLowercase


case String: case Symbol: case Number: return EquivalentPrimatives(a, b)



Krust.add(function areEquivalent(a, b) {
  // Identical references. Easy out
  if (a === b) { return true }
  // Weed out undefined and null to avoid primitives that can't has properties.
  if (a == null) { return (a == b) }

  switch (a.constructor) {
    case Boolean: return false  // Easy out
    case String: case Symbol: case Number: return EquivalentPrimatives(a, b)
    case Function:   // Ensure function execution is the same
      if (a[ORIGINAL] !== b[ORIGINAL]) { return false }
  }

  // From this point "a" is an obj|fun and "b" is an obj|func|num|str
  return IsEquivalent().compareObjects(a, b)
})



switch (a.constructor) {
  case Boolean: return comparator_type.compareBoolean(a, b)
  case Symbol:  return comparator_type.compareSymbol(a, b)
  case String:  return comparator_type.compareString(a, b)
  case Number:  return comparator_type.compareNumber(a, b)
}

if (a !== a) && (b !== b) { continue } else { return false }

if (a == null || b == null) { return false }
if (a == null) { return (a == b) }


make equals be equal kind (less demanding type) aka it creates the same
immutable facts

LocalProperties
check object chain upto Object_prototype




// function CompareObjectsStructure(a, b) {
//   // "a" is an obj|fun and "b" is an obj|func|num|str and aren't ===
//   const ids, idA, idB, _test, innerA
//
//   ids = this.ids
//   idA = ids.get(a)
//   idB = ids.get(b)
//
//   if (!this._haveEqualPaths(idA, idB)) { return false }
//   if (this._alreadyCompared(idA, idB)) { return true }
//
//   _test = this._test
//
//   if ((innerA = InterMap.get(a))) { return innerA[_test](b, this) }
//   if ((innerB = InterMap.get(b))) {
//     this._pathB = (originalA = this._pathA)
//     this._pathA = (originalB = this._pathB)
//     result      = innerB[_test](a, this)
//     this._pathA = originalA
//     this._pathB = originalB
//     return result
//   }
//   if (a[_test] && a.constructor !== Object) { return a[_test](b, this }
//   if (b[_test] && b.constructor !== Object) {
//     this._pathB = (originalA = this._pathA)
//     this._pathA = (originalB = this._pathB)
//     result      = b[_test](a, this)
//     this._pathA = originalA
//     this._pathB = originalB
//     return result
//   }
//
//   // Ensure same mutability
//   if (IsImmutable(a) !== IsImmutable(b)) { return false }
//   // Ensure same ancestry
//   if (RootOf(a) !== RootOf(b)) { return false }
//
//   return ComparePropertiesUsing(a, b, this)
// }
