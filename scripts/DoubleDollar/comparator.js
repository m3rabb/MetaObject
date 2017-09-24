VisibleLocalNames    = Object.keys

AllLocalSelectors      = Reflect.ownKeys

function VisibleProperties(target) {
  let props = []
  let next = 0

  if (target == null) { return props }
  if (target.constructor !== Object || RootOf(target) === Object_prototype) {
    return VisibleLocalNames(target)
  }

  for (let name in target) {
    let value = target[name]
    if (value !== Object_prototype[name] || InHasSelector.call(target,name)) {
      props[next++] = value
    }
  }
  return props
}


Thing.add(function is(that) {
  return (this.$ === that)
})

Thing.add(function isIdentical(that, comparator_) {
  if (this.$ === that) { return true }
  const _that = InterMap.get(that)

  if (_that          === undefined)       { return false }
  if (this[IS_FACT]  !== IMMUTABLE)       { return false }
  if (_that[IS_FACT] !== IMMUTABLE)       { return false }
  if (this.type      !== _that.type)      { return false }

  ComparePropertiesUsing(this, _that, comparator_ || IsIdentical())
})

Thing.add(function isExactly(that, comparator_) {
  if (this.$ === that) { return true }
  const _that = InterMap.get(that)

  if (_that          === undefined)       { return false }
  if (this[IS_FACT]  !== _that[IS_FACT])  { return false }
  if (this.type      !== _that.type)      { return false }

  ComparePropertiesUsing(this, _that, comparator_ || IsExactly())
})

Thing.add(function isInterchangeable(that, comparator_) {
  if (this.$ === that) { return true }
  const _that = InterMap.get(that)

  if (_that          === undefined)       { return false }
  if (this[IS_FACT]  !== _that[IS_FACT])  { return false }
  if (this.type      !== _that.type)      { return false }

  ComparePropertiesUsing(this, _that, comparator_ || IsInterchangeable())
})

Thing.add(function isEqual(that, comparator_) {
  if (this.$ === that) { return true }
  const _that = InterMap.get(that)

  if (_that          === undefined)       { return false }
  if (this.type      !== _that.type)      { return false }

  ComparePropertiesUsing(this, _that, comparator_ || IsEqual())
})

Thing.add(function isEquivEqual(that, comparator_) {
  if (this.$ === that) { return true }
  const _that = InterMap.get(that) || that

  ComparePropertiesUsing(this, _that, comparator_ || IsEqual())
})

Thing.add(function isEquivalent(that, comparator_) {
  if (this.$ === that) { return true }
  const _that = InterMap.get(that) || that

  ComparePropertiesUsing(this, _that, comparator_ || IsEquivalent())
})


PurpleCarrot.add(function are(a, b) {
  return a === b
})

PurpleCarrot.add(function areIdentical(a, b) {
  return IsIdentical().compare(a, b)
})

PurpleCarrot.add(function areExactly(a, b) {
  return IsExactly().compare(a, b)
})

PurpleCarrot.add(function areInterchangeable(a, b) {
  return IsInterchangeable().compare(a, b)
})

PurpleCarrot.add(function areEqual(a, b) {
  return IsEqual().compare(a, b)
})

PurpleCarrot.add(function areEquivEqual(a, b) {
  return IsEquivEqual().compare(a, b)
})

PurpleCarrot.add(function areEquivalent(a, b) {
  return IsEquivalent().compare(a, b)
})


// NOTE: need to add isIdentical for JSObjects
IsIdentical      .add("compare"              , CompareEquality)
IsIdentical      .add("_compareObjects"      , CompareObjectsEquality)
IsIdentical      .add("_compareObjects_2nd"  , AreObjectsExactly_2nd)
IsIdentical      .add("_compareJSObjects"    , AreJSObjectsStrictlyEqual)
IsIdentical      .addInstanceProperty("_equalitySelector", "isIdentical")

IsExactly        .add("compare"              , CompareEquality)
IsExactly        .add("_compareObjects"      , CompareObjectsEquality)
IsExactly        .add("_compareObjects_2nd"  , AreObjectsExactly_2nd)
IsExactly        .add("_compareJSObjects"    , AreJSObjectsStrictlyEqual)
IsIdentical      .addInstanceProperty("_equalitySelector", "isIdentical")

IsInterchangeable.add("compare"              , CompareEquality)
IsInterchangeable.add("_compareObjects"      , CompareObjectsEquality)
IsInterchangeable.add("_compareObjects_2nd"  , AreObjectsInterchangeable_2nd)
IsInterchangeable.add("_compareJSObjects"    , AreJSObjectsStrictlyEqual)
IsIdentical      .addInstanceProperty("_equalitySelector", "isIdentical")

IsEqual          .add("compare"              , CompareEquality)
IsEqual          .add("_compareObjects"      , CompareObjectsEquality)
IsEqual          .add("_compareObjects_2nd"  , CompareObjectsEquality_2nd)
IsEqual          .add("_compareObjects_nth"  , AreObjectsEqual_nth)
IsEqual          .add("_compareJSObjects"    , AreJSObjectsEqual)
IsEqual          .add("_compareJSObjects_nth", AreJSObjectsEqual)
IsIdentical      .addInstanceProperty("_equalitySelector", "isIdentical")

IsEquivalent     .add("compare"              , CompareEquivalence)
IsEquivalent     .add("_compareObjects"      , CompareObjectsEquivalence)
IsEquivalent     .add("_compareObjects_2nd"  , CompareObjectsEquality_2nd)
IsEquivalent     .add("_compareObjects_nth"  , AreObjectsEquivalent_nth)
IsEquivalent     .add("_compareJSObjects"    , AreJSObjectsEquivalent)
IsEquivalent     .add("_compareJSObjects_nth", AreJSObjectsEquivalent)
IsIdentical      .addInstanceProperty("_equalitySelector", "isIdentical")

IsEquivEqual     .add("compare"              , CompareEquivalence)
IsEquivEqual     .add("_compareObjects"      , CompareObjectsEquivalence)
IsEquivEqual     .add("_compareObjects_2nd"  , CompareObjectsEquality_2nd)
IsEquivEqual     .add("_compareObjects_nth"  , AreObjectsEqual_nth)
IsEquivEqual     .add("_compareJSObjects"    , AreJSObjectsEquivalent)
IsEquivEqual     .add("_compareJSObjects_nth", AreJSObjectsEqual)
IsIdentical      .addInstanceProperty("_equalitySelector", "isIdentical")


// Add CompareIdentity  --->>>   { return a !== 0 || 1 / a === 1 / b } // check 0 vs -0


function CompareExactly(a, b) {
  switch (typeof a) {
    default :
      return (a === b) // Easy out

    case "object"   :
      if (a === null || b === null) { return false }
      // break omitted
    case "function" :
      if (a !== b)   { break } else { return true  }

    case "number"   :
      return (a === b) ?
        (a !== 0 || 1 / a === 1 / b) :  // Check for 0 vs -0
        (a !== a) && (b !== b)          // Check for NaN
  }

  return this._compareObjects(a, b)
}

function CompareEquality(a, b) {
  if (a === b) { return true }
  // Weed out undefined and null to avoid primitives that can't has properties.
  if (a == null || b == null) { return false }

  switch (typeof a) {
    case "boolean": case "symbol": case "string": return false  // Easy out
    case "number": return (a !== a) && (b !== b) // Check for NaN
  }

  return this._compareObjects(a, b)
}

function CompareEquivalence(a, b) {
  if (a === b) { return true }
  if (a == null) { return (a == b) }

  switch (typeof a) {
    case "symbol":
      strA = a.slice(7, a.length - 1)
      switch (typeof b) {
        case "symbol" : return (strA === b.slice(7, a.length - 1))
        case "string" : return (strA === b)
        case "number" :
          m = +strA; n = b
          return (m === n) || (m !== m) && (n !== n)
        default     : return false
      }
    case "string":
      switch (typeof b) {
        case "symbol" : return (a === b.slice(7, a.length - 1))
        case "string" : return (a === b)
        case "number" :
          m = +a; n = b
          return (m === n) || (m !== m) && (n !== n)
        default     : return false
      }
    case "number":  // Check for NaN
      m = a
      switch (typeof b) {
        case "symbol" : n = +(b.slice(7, a.length - 1)); break
        case "string" : n = +b; break
        case "number" : n = b; break
        default     : return false
      }
      return (m === n) || (m !== m) && (n !== n)
    case "object":
      return this._compareObjects(a, b)
    default :
      return false
  }
}



function CompareObjectsEquality(a, b) {
  this._rootA          = a
  this._rootB          = b
  this._compareObjects = this._compareObjects_2nd

  const selector = this._equalitySelector

  return (a[selector] && a.constructor !== Object) ?
    a[selector](b, this.$) : this._compareJSObjects(a, b)
}

function CompareObjectsEquivalence(a, b) {
  this._rootA          = a
  this._rootB          = b
  this._compareObjects = this._compareObjects_2nd

  return (a.isEquivalent && a.constructor !== Object) ?
    a.isEquivalent(b, this.$) :
    (b.isEquivalent && b.constructor !== Object) ?
      b.isEquivalent(a, this.$) : this._compareJSObjects(a, b)
}


function AreObjectsExactly_2nd(a, b) {
  const ids = new Map()
  const cohort = [0, 1]
  ids.set(this._rootA, 0)
  ids.set(this._rootB, 1)

  this._ids            = ids
  this._nextId         = 2
  this._cohorts        = [cohort, cohort]

  this._pathA          = [-1,  ]
  this._pathB          = [  ,-1]
  this._pathCount      = 1
  this._compareObjects = AreObjectsExactly_nth

  return this._compareObjects(a, b)
}

function CompareObjectsExactly_nth(a, b) {
  const ids      = this.ids
  const idA      = ids.get(a) || ids.set(a, (idA = this._nextId++))
  const idB      = ids.get(b) || ids.set(b, (idB = this._nextId++))
  const selector = this._equalitySelector

  if (!this._haveEqualPaths(idA, idB)) { return false }
  if (this._alreadyCompared(idA, idB)) { return true }

  return (a[selector] && a.constructor !== Object) ?
    a[selector](b, this.$) : this._compareJSObjects(a, b)
}

function AreObjectsInterchangeable_2nd(a, b) {
  const ids    = new Map()
  const cohort = [0, 1]
  const rootA  = this._rootA

  ids.set(rootA, 0)
  ids.set(this._rootB, 1)

  this._ids            = ids
  this._nextId         = 2
  this._cohorts        = [cohort, cohort]

  this._compareObjects = AreObjectsInterchangeable_nth
  // NOTE: should this be checking for isFact vs IsImmutable???
  [this._pathA, this._pathB, this._pathCount] = IsImmutable(rootA) ?
    [[], [], 0] : [[-1,  ], [  ,-1], 1]

  return this._compareObjects(a, b)
}

function AreObjectsInterchangeable_nth(a, b) {
  const ids      = this.ids
  const idA      = ids.get(a) || ids.set(a, (idA = this._nextId++))
  const idB      = ids.get(b) || ids.set(b, (idB = this._nextId++))

  // NOTE: should this be checking for isFact vs IsImmutable???
  if ((!IsImmutable(a) && !this._haveEqualPaths(idA, idB)) { return false }
  if (this._alreadyCompared(idA, idB)) { return true }

  return (a.isInterchangeable && a.constructor !== Object) ?
    a.isInterchangeable(b, this.$) : this._compareJSObjects(a, b)
}

function CompareObjectsEquality_2nd(a, b) {
  const ids = new Map()
  const cohort = [0, 1]
  ids.set(this._rootA, 0)
  ids.set(this._rootB, 1)

  this._ids              = ids
  this._nextId           = 2
  this._cohorts          = [cohort, cohort]

  this._compareObjects   = this._compareObjects_nth
  this._compareJSObjects = this._compareJSObjects_nth

  return this._compareObjects(a, b)
}

function AreObjectsEqual_nth(a, b) {
  const ids      = this.ids
  const idA      = ids.get(a) || ids.set(a, (idA = this._nextId++))
  const idB      = ids.get(b) || ids.set(b, (idB = this._nextId++))

  if (this._alreadyCompared(idA, idB)) { return true }

  return (a.isEqual && a.constructor !== Object) ?
    a.isEqual(b, this.$) : this._compareJSObjects(a, b)
}

function AreObjectsEquivalent_nth(a, b) {
  const ids      = this.ids
  const idA      = ids.get(a) || ids.set(a, (idA = this._nextId++))
  const idB      = ids.get(b) || ids.set(b, (idB = this._nextId++))

  if (this._alreadyCompared(idA, idB)) { return true }

  return (a.isEquivalent && a.constructor !== Object) ?
    a.isEquivalent(b, this.$) :
    (b.isEquivalent && b.constructor !== Object) ?
      b.isEquivalent(a, this.$) : this._compareJSObjects(a, b)
}


function AreJSObjectsStrictlyEqual(a, b) {
  if (IsImmutable(a) !== IsImmutable(b)) { return false }

  const = a.constructor
  if (constructorA === b.constructor) { return false }

  return (constructorA === Array) ?
    CompareSequencesUsing(a, b, this) : ComparePropertiesUsing(a, b, this)
})

function AreJSObjectsEqual(a, b) {
  const = a.constructor
  if (constructorA === b.constructor) { return false }

  return (constructorA === Array) ?
    CompareSequencesUsing(a, b, this) : ComparePropertiesUsing(a, b, this)
}

function AreJSObjectsEquivalent(a, b) {
  return (a.constructor === Array || a.isOrdered &&
    b.constructor === Array || b.isOrdered) ?
      CompareSequencesUsing(a, b, this) : ComparePropertiesUsing(a, b, this)
}


function ComparePropertiesUsing(_a, _b, _comparator) {
  // _a is an obj|fun and _b is an obj|func|num|str

  propsA = _a[KNOWN_PROPERTIES] || VisibleProperties(_a)
  propsB = _b[KNOWN_PROPERTIES] || VisibleProperties(_b)
  next   = propsA.length

  if (propsA !== propsB && next !== propsB.length) { return false }

  while (next--) {
    prop = propsA[next]
    a = _a[prop]
    if (a === undefined && !(prop in _b)) { return false }

    b = _b[prop]
    if (!_comparator.compare(a, b)) { return false }
  }

  return true
}


function CompareSequencesUsing(_a, _b, _comparator) {
  let next = _a.length

  if (next !== _b.length) { return false }

  while (next--) {
    if (!_comparator.compare(_a[next], _b[next])) { return false }
  }

  return true
}



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

//
// IsExactly.add(function reverseCompare(a, b) {
//   const pathA, pathB, result
//
//   this._pathB = (originalA = this._pathA)
//   this._pathA = (originalB = this._pathB)
//   result      = b.isExactly(a, this)
//   this._pathA = originalA
//   this._pathB = originalB
//   return result
// }
//
//

                           mutable                       immutable
is(Same)                          the exact same object
isExactly                         same structure/mutablility
isIdentical (forever)      same object                   same values
isInterchangeable (W|R)    same structure/submutability  same values
isEqual  -   (for R)       same values (ignore mutability)
isAlike  -   (for R)       same values (ignore mutability, type)
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

isIdentical is about behavior!!! So, consider making isIdentical use
value vs structure for immutables.


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
