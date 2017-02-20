

Comparator.add(function _init() {
  this._ids = new Map()
  this._groupings = []
  this._pathA = new map()
  this._pathB = new map()
  this._pathCount = 0
})

Comparator.add(function _compareThings_(_a, _b) {
  const

  if (_a.type !== _b.type) { return false }
  if (this._considerMutability) {
    if (_a.isImmutable !== _b.isImmutable) { return false }
  }

  ids    = this._ids
  propsA = _a[KNOWN_PROPERTIES] || LocalProperties(_target)
  propsB = _b[KNOWN_PROPERTIES] || LocalProperties(_target)
  next   = propsA.length

  if (propsA !== propsB && next !== propsB.length) { return false }

  while (next--) {
    prop = propsA[next]
    valueA = _a[prop]
    if (valueA === undefined) {
      if (!(prop in _b)) { return false }
    }
    valueB = _b[prop]

    if (valueA === valueB) { continue }

    switch (typeof valueA) {
      default         : return false
      case "object"   :
        if (valueA === null) { return false }
        isFunc = false; break
      case "function" :
        isFunc = true; break
    }

    const idA = ids.get(_a)
    const idB = ids.get(_b)

    if (this._alreadyCompared(idA, idB))              { continue }
    if (!this._haveEqualPaths(oidA, oidB))            { return false }
    if (valueA === valueB)                            { continue }

    if ((innerA = InterMap.get(valueA))) {
      if (inner.equals) {
        if (!inner.equals(valueB, this))              { return false }
      }
      else if (!(innerB = InterMap.get(value)))       { return false }
      else if (!this._compareThings_(innerA, innerB)) { return false }
    }
    else if (valueA.constructor !== Object &&
        ((func = valueA.equals)) && (func.constructor === Function)) {
      if (!valueA.equals(visited, this))              { return false }

      this[prop] = (asFixedFacts_) ? BeFixedFacts(copy) : copy
      visited.set(value, copy)
    }
    else {
      if (!this.compareObjectTo(valueA, valueB))      { return false }
    }
  }

  return true
})


Comparator.add(function _alreadyCompared(idA, idB) {
  const cohorts = this._cohorts
  const cohortA = cohorts[idA]
  const cohortB = cohorts[idB]

  if (idA) {
    cohortA = cohorts[idA]

    if (idB) {  // Both A & B visited before
      cohortB = cohorts[idB]
      if (cohortA === cohortB) { return true }
      this._mergeCohorts(idA, idB, cohortA, cohortB)
    }
    else {      // Only A visited before
      cohortA[idB] = idB
      cohorts[idB] = cohortA
    }
  }
  else {
    if (idB) {  // Only B visited before
      cohortB = cohorts[idB]
      cohortB[idA] = idA
      cohorts[idA] = cohortB
    }
    else {      // Only A visited before
      newCohort      = []
      newCohort[idA] = idA
      newCohort[idB] = idB
      cohorts[idA]   = cohorts[idB] = newCohort
    }
  }

  return false
})

Comparator.add(function _mergeCohorts(cohortA, cohortB) {
  const cohorts = this._cohorts
  const countA  = cohortA.length
  const countB  = cohortB.length

  let [next, source, target] = (countA >= countB) ?
    [countB, cohortB, cohortA] : [countA, cohortA, cohortB]

  while (next--) {
    id = source[next]
    if (id) {
      target[id] = id
      cohorts[id] = target
    }
  }
})


Comparator.add(function _haveEqualPaths(idA, idB) {
  const pathA, pathB, stoneA, stoneB, count

  pathA  = this._pathA
  pathB  = this._pathB
  stoneA = pathA[idA]
  stoneB = pathB[idB]

  if (stoneA !== stoneB) { return false }
  if (stoneA === undefined) {
    stone = -(++this._pathCount)
    pathA[idA] = pathB[idB] = stone
  }

  return true
})


IsExactly.add(function reverseCompare(a, b) {
  const pathA, pathB, result

  this._pathB = (originalA = this._pathA)
  this._pathA = (originalB = this._pathB)
  result      = b.isExactly(a, this)
  this._pathA = originalA
  this._pathB = originalB
  return result
}



                         mutable                       immutable
is                               the exact same object
isIdentical (forever)      same object                   exact same structure
isExactly                  same structure/mutablility
isInterchangeable (W|R)    same structure/submutability  same values
isEqual  -   (for R)       same values (ignore mutability, type)
isEquivEqual (for R)       equivalent root, equal children
isEquivalent (for R)       same values (ignore mutability, type, case)
  und <=> null
  string <=> asNumber
  string <=> string asLowercase
isEqu
isEqv
isEquiv

function isA(type) {
  const tester = (type.constructor === String) ?
     `is${type[0].toUpperCase()}${type.slice(1)}` : type.tester
  }
  return this[tester] || false
}



same - ??? for mutable same identity (only) for immutbale value equality
alike  - ??? same in value, and structure(right now) no ignore mutabilty






is     - the same identity
identical - same in all aspects (forever)   structure and immutability
alike  - same in value, and structure(right now) no ignore mutabilty
equal  - same in value (right now) ignore structure and mutabilty
equivalent - the same in the ways that matter
alike -
similar

equal in value, amount,

identical same obj
same  equal in every regard
equal
equivalent
	similar, (much) the same, indistinguishable, identical, uniform, interchangeable


  http://english.stackexchange.com/questions/317782/equal-vs-equivalent-finer-differences-in-meaning-and-usage-in-4-distinct-scena

 equivalent means 'is a satisfactory substitute for'



 "Equal" and "equivalent" are equivalent, but theyre not equal. :-)

They have similar, but not identical meanings. Equal means the same thing,
 but equivalent means that one can frequently be substituted for the other.


http://pediaa.com/difference-between-equal-and-equivalent/
equal refers to things that are similar in all aspects, whereas the term
equivalent refers to things that are similar in a particular aspect



https://answers.yahoo.com/question/index?qid=20090427025003AA8MzU9

Being alike and being equal is similar but they differ in a manner

Being alike is Having resemblance or similitude; similar; without difference; In the same manner, form, or degree; in common; equally: MEANING it denotes with similar characteristics or traits.

Being equal is an equal manner or degree in equal shares or proportion; with equal and impartial justice; without difference; alike; evenly; justly; as ..MEANING it denotes in the same quantity, value or measurement.


http://math.stackexchange.com/questions/1058596/in-plain-language-whats-the-difference-between-two-things-that-are-equivalent
