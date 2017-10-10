// Enable comparator to compare their strictness with each other
// undefined for comparing isIdentical with isExact


//                               mutable                       immutable
// is(Same)                             the exact same object
// isExactly                        same type/structure/mutablility
// isIdentical (forever)      same object                   same type/values
// isEqual (W|R)       same type/structure/mutability       same type/values
// isEquivalent (for R)                  same ordering/values
// isSimilar    (for R)               similar values ignore case


// hasEqualProperties (for R)
// isEquivEqual (for R)       equivalent root, equal children
// isAlikeEqual (for R)       alike root     , equal children




HandAxe._(function Equality(
  $INNER, $PULP, $RIND, IMMUTABLE, VALUE_METHOD, _DURABLES,
  FindAndSetDurables, FindDurables, InterMap, TheEmptyArray, ValueAsName,
  $Intrinsic, Definition, Type, _Comparator, nil
) {
  "use strict"

  var IsSame, IsEqual, IsExactly, IsEquivalent, IsSimilar, IsIdentical

  HandAxe.add(this)

  $Intrinsic.addValueMethod(function isSame(value) {
    return (this === value || this[$RIND] === value)
  })

  $Intrinsic.addAlias("is", "isSame")

  $Intrinsic.addValueMethod(function isEqual(value, comparator_) {
    if (this === value)                           { return true  }
    const _$self = this[$INNER]
    const   self = _$self[$RIND]
    if (self === value)                           { return true  }

    const _$value = InterMap.get(value)
    if (_$value === undefined)                    { return false }
    if (_$self[IMMUTABLE] !== _$value[IMMUTABLE]) { return false }

    const konstructor = _$self.constructor
    if (konstructor !== _$value.constructor)      { return false }

    const comparator = comparator_ || IsEqual
    return comparator[COMPARE](self, value, konstructor)
  })

  $Intrinsic.addValueMethod(function isExactly(value, comparator_) {
    if (this === value)                           { return true  }
    const _$self = this[$INNER]
    const   self = _$self[$RIND]
    if (self === value)                           { return true  }

    const _$value = InterMap.get(value)
    if (_$value === undefined)                    { return false }
    if (_$self[IMMUTABLE] !== _$value[IMMUTABLE]) { return false }

    const konstructor = _$self.constructor
    if (konstructor !== _$value.constructor)      { return false }

    const comparator = comparator_ || IsExactly
    return comparator[COMPARE](self, value, konstructor)
  })

  $Intrinsic.addValueMethod(function isEquivalent(value, comparator_) {
    if (this === value) { return true }
    const _$self = this[$INNER]
    const   self = _$self[$RIND]
    if (self === value) { return true }
    const comparator = comparator_ || IsEquivalent
    return comparator[COMPARE](self, value, _$self.constructor)
  })

  $Intrinsic.addValueMethod(function isSimilar(value, comparator_) {
    if (this === value) { return true }
    const _$self = this[$INNER]
    const   self = _$self[$RIND]
    if (self === value) { return true }
    const comparator = comparator_ || IsSimilar
    return comparator[COMPARE](self, value, _$self.constructor)
  })

  $Intrinsic.addValueMethod(function isIdentical(value, comparator_) {
    if (this === value)                            { return true  }
    const _$self = this[$INNER]
    const   self = _$self[$RIND]
    if (self === value)                            { return true  }

    const _$value = InterMap.get(value)
    if (_$value === undefined)                     { return false }
    if (!_$self[IMMUTABLE] || !_$value[IMMUTABLE]) { return false }

    const konstructor = _$self.constructor
    if (konstructor !== _$value.constructor)       { return false }

    const comparator = comparator_ || IsIdentical
    return comparator[COMPARE](self, value, _$self.constructor)
  })


  function areSame(a, b) {
    return (a === b)
  }


  function areExactly(a, b) {
    if (a === b) { return true }

    switch (typeof a) {
      default          : return false

      case "number"    :
        return (a === b) ?
          ((a !== 0) || (1 / a) === (1 / b)) : // Check for 0 and -0
          ((a !== a) && (b !== b))             // Check for NaN

      case "object"    : if (a === null || b === null) { return false }
      // break omitted
      case "function"  : break
    }

    if (a[IMMUTABLE] !== b[IMMUTABLE]) { return false }

    const konstructor = a.constructor
    if (konstructor !== b.constructor) { return false }

    const comparator = this || IsExactly
    return comparator[COMPARE](a, b, konstructor)
  }

  function areIdentical(a, b) {
    if (a === b)                        { return true  }
    if (!a[IMMUTABLE] || !b[IMMUTABLE]) { return false }

    switch (typeof a) {
      default          : return false        // Check for NaN.  0 equals -0
      case "number"    : return (a === b) || ((a !== a) && (b !== b))
      case "object"    : if (a === null || b === null) { return false }
      // break omitted
      case "function"  : break
    }

    const konstructor = a.constructor
    if (konstructor !== b.constructor) { return false }

    const comparator = this || IsIdentical
    return comparator[COMPARE](a, b, konstructor)
  }

  function areEqual(a, b) {
    if (a === b) { return true }

    switch (typeof a) {
      default          : return false        // Check for NaN.  0 equals -0
      case "number"    : return (a === b) || ((a !== a) && (b !== b))
      case "object"    : if (a === null || b === null) { return false }
      // break omitted
      case "function"  : break
    }

    if (a[IMMUTABLE] !== b[IMMUTABLE]) { return false }

    const konstructor = a.constructor
    if (konstructor !== b.constructor) { return false }

    const comparator = this || IsEqual
    return comparator[COMPARE](a, b, konstructor)
  }

  function areEquivalent(a, b) {
    if (a === b) { return true }

    switch (typeof a) {
      default          : return false        // Check for NaN.  0 equals -0
      case "number"    : return (a === b) || ((a !== a) && (b !== b))
      case "object"    : if (a === null || b === null) { return false }
      // break omitted
      case "function"  : break
    }

    const comparator = this || IsEquivalent
    return comparator[COMPARE](a, b, a.constructor)
  }

  function areSimilar(a, b) {
    var strA, m, n
    if (a === b) { return true }

    switch (typeof a) {
      case "boolean"   : return false
      case "undefined" : return (b === null)

      case "object"    :
        if (a === null) { return (b === undefined) || (b === nil) }
        if (a === nil)  { return (b === null) }
        break

      case "symbol" :
        strA = ValueAsName(a)

        switch (typeof b) {
          default       : return false
          case "symbol" : return (strA === ValueAsName(b))
          case "string" : return (strA === b)
          case "number" :
            m = +strA; n = b
            return (m === m) && (m === n) // Check for NaN
        }

      case "string" :
        switch (typeof b) {
          default       : return false
          case "symbol" : return (a === ValueAsName(b))
          case "string" : return (a.toLowerCase() === b.toLowerCase())
          case "number" :
            m = +a; n = b
            return (m === m) && (m === n) // Check for NaN
        }

      case "number" :
        m = a
        switch (typeof b) {
          default       : return false
          case "symbol" : n = +ValueAsName(b) ; break
          case "string" : n = +b              ; break
          case "number" : n = b ; return (m !== m && n !== n) // Check for NaN
        }
        return (n === n) && (m === n) // Check for NaN

      case "function" :
        if (typeof b !== "function")  { return false }
        break

    }

    const comparator = this || IsSimilar
    return comparator[COMPARE](a, b, a.constructor)
  }

  HandAxe.add(areSame)
  HandAxe.add(areIdentical)
  HandAxe.add(areExactly)
  HandAxe.add(areEqual)
  HandAxe.add(areEquivalent)
  HandAxe.add(areSimilar)


  const COMPARE = Symbol("COMPARE")

  const _CompareDef = Definition(
    COMPARE,
    function _compare1(a, b, konstructor) {
      const _$comparator = new this._blanker()
      const  _comparator = _$comparator[$PULP]

      _$comparator._rootA = a
      _$comparator._rootB = b

      return _comparator._compareProperties(a, b, konstructor)
    },
    undefined, VALUE_METHOD)


  IsSame = _Comparator.newSubtype("IsSame", this)
    .addOwnDefinition(_CompareDef)
    .addValueMethod("compare", areSame)

  IsEqual = _Comparator.newSubtype("IsEqual", this)
    .addOwnDefinition(_CompareDef)
    .addSharedProperty("_propertiesSelector", "_isEqualProperties")
    .addValueMethod("compare", areEqual)

  IsExactly = _Comparator.newSubtype("IsExactly", this)
    .addOwnDefinition(_CompareDef)
    .addSharedProperty("_propertiesSelector", "_isExactlyProperties")
    .addValueMethod("compare", areExactly)

    .addValueMethod(function _compareN(a, b, konstructor) {
      var idA, idB
      const ids = this.ids
      if (!(idA = ids.get(a))) { ids.set(a, (idA = this._nextId++)) }
      if (!(idB = ids.get(b))) { ids.set(b, (idB = this._nextId++)) }

      if (this._haveDivergentPaths(idA, idB)) { return false }
      if (this._alreadyCompared(idA, idB))    { return true  }

      return this._compareProperties(a, b, konstructor)
    })

    .addValueMethod(function _compareMapProperties(a, b) {
      if (a.size !== b.size) { return false }

      a.forEach((valueA, key) => {
        const valueB = b.get(key)
        if (!this.compare(valueA, valueB))       { return false }
        if (valueA === undefined && !b.has(key)) { return false }
      })
      return true
    })

  IsEquivalent = _Comparator.newSubtype("IsEquivalent", this)
    .addOwnDefinition(_CompareDef)
    .addSharedProperty("_propertiesSelector", "_isEquivalentProperties")
    .addValueMethod("compare", areEquivalent)

    .addValueMethod(function _compare2(a, b, konstructor) {
      const ids    = new Map()
      const cohort = [0, 1]
      ids.set(this._rootA, 0)
      ids.set(this._rootB, 1)

      this._ids     = ids
      this._nextId  = 2
      this._cohorts = [cohort, cohort]

      this[COMPARE] = this._compareN

      return this._compareProperties(a, b, konstructor)
    })

    .addValueMethod(function _compareN(a, b, konstructor) {
      var idA, idB
      const ids = this.ids
      if (!(idA = ids.get(a))) { ids.set(a, (idA = this._nextId++)) }
      if (!(idB = ids.get(b))) { ids.set(b, (idB = this._nextId++)) }

      if (this._alreadyCompared(idA, idB))    { return true  }

      return this._compareProperties(a, b, konstructor)
    })

  IsSimilar = _Comparator.newSubtype("IsSimilar", this)
    .addOwnDefinition(_CompareDef)
    .addSharedProperty("_propertiesSelector", "_isSimilarProperties_")
    .addValueMethod("compare", areSimilar)
    .addDefinition(IsEquivalent.definitionAt("_compare2"))
    .addDefinition(IsEquivalent.definitionAt("_compareN"))

    .addValueMethod(function _compareFuncProperties_(a, b) {
      if (a.name !== b.name)           { return false }
      if (a.toString() !== b.toString) { return false }

      const durablesA = a[_DURABLES] || FindDurables(a)
      const durablesB = b[_DURABLES] || FindDurables(b)
      return this._compareObjectProperties_(a, b, durablesA, durablesB)
    })

  IsIdentical = _Comparator.newSubtype("IsIdentical", this)
    .addOwnDefinition(_CompareDef)
    .addSharedProperty("_propertiesSelector", "_isIdenticalProperties")
    .addValueMethod("compare", areIdentical)
    .addDefinition(IsEquivalent.definitionAt("_compare2"))
    .addDefinition(IsEquivalent.definitionAt("_compareN"))

  this.add(IsSame)
  this.add(IsIdentical)
  this.add(IsExactly)
  this.add(IsEqual)
  this.add(IsEquivalent)
  this.add(IsSimilar)



  _Comparator.setContext(this)

  _Comparator.addSharedProperty("_compare", "_compare1")

  _Comparator.addMethods([
    "VALUE",

    function _compare2(a, b, konstructor) {
      const ids    = new Map()
      const cohort = [0, 1]
      ids.set(this._rootA, 0)
      ids.set(this._rootB, 1)

      this._ids     = ids
      this._nextId  = 2
      this._cohorts = [cohort, cohort]

      this._pathA     = [-1, undefined]
      this._pathB     = [undefined, -1]
      this._pathCount = 1

      this[COMPARE] = this._compareN

      return this._compareProperties(a, b, konstructor)
    },

    function _compareN(a, b, konstructor) {
      var idA, idB
      const ids = this.ids
      if (!(idA = ids.get(a))) { ids.set(a, (idA = this._nextId++)) }
      if (!(idB = ids.get(b))) { ids.set(b, (idB = this._nextId++)) }

      // Note: should this be checking for isFact vs IsImmutable???
      if (!a[IMMUTABLE] && this._haveDivergentPaths(idA, idB)) { return false }
      if (this._alreadyCompared(idA, idB))                     { return true  }

      return this._compareProperties(a, b, konstructor)
    },


    function _compareProperties(a, b, konstructor) {
      var _$a, _$b, _a, _b, isFunc, handler, count, durablesA, durablesB

      switch (konstructor) {
        case WeakMap  : return undefined
        case WeakSet  : return undefined
        case Object   :
          durablesA = FindDurables(a)
          durablesB = FindDurables(b)
          return this._compareObjectProperties_(a, b, durablesA, durablesB)

        case Array    :
          count = a.length
          return (count !== b.length) ? false :
            this._compareSequenceProperties_(a, b, count)

        case Map      : return this._compareMapProperties(a, b)
        case Set      : return this._compareSetProperties(a, b)
        case Function : isFunc = true ; break
      }

      const comparePropertiesSelector = this._propertiesSelector

      _$a = InterMap.get(a)
      if (_$a === undefined) {
        handler = a[comparePropertiesSelector]
        if (handler) { return handler.call(a, b, this) }
        if (isFunc)  { return this._compareFuncProperties_(a, b) }

        durablesA = a[_DURABLES] || FindDurables(a)
        if (durablesA === TheEmptyArray) {
          count = a.length
          return (count !== b.length) ? false :
            this._compareSequenceProperties_(a, b, count)
        }

        durablesB = b[_DURABLES] || FindDurables(b)
        return this._compareObjectProperties_(a, b, durablesA, durablesB)
      }

      handler = _$a[comparePropertiesSelector]
      _a      = _$a[$PULP]
      if (handler) { return handler.call(_a, b, this) }

      _$b = InterMap.get(b)
       _b = (_$b !== undefined) ? _$b[$PULP] : (_$b = b)

      durablesA = _$a[_DURABLES] || FindAndSetDurables(_$a)
      if (durablesA === TheEmptyArray) {
        count = _a.size
        return (count !== _b.size) ? false :
          this._compareSequenceProperties_(_a, _b, count)
      }

      durablesB = _$b[_DURABLES] || FindAndSetDurables(_$b)
      return this._compareObjectProperties_(_a, _b, durablesA, durablesB)

    },

    function _compareFuncProperties_(a, b) {  // eslint-disable-line
      return false
    },

    function _compareObjectProperties_(_a, _b, durablesA, durablesB) {
      var next, selector
      next = durablesA.length

      if (durablesA !== durablesB) {
        if (next !== durablesB.length)                   { return false }

        while (next--) {
          selector = durablesA[next]
          if (selector !== durablesB[next])              { return false }
          if (!this.compare(_a[selector], _b[selector])) { return false }
        }
      }
      else while (next--) {
        selector = durablesA[next]
        if (!this.compare(_a[selector], _b[selector]))  { return false }
      }
      return true
    },


    function _compareSequenceProperties_(_a, _b, count) {
      var next = count
      while (next--) {
        if (!this.compare(_a[next], _b[next])) { return false }
      }
      return true
    },


    // Note: This isn't entirely correct. When the equality measure is relaxed,
    // the only way to ensure equality inspect is to recursively comapre
    // key-value pairs.
    function _compareMapProperties(a, b) {
      const size = a.size
      if (size !== b.size) { return false }

      const keys   = []
      const values = []
      var   next   = 0

      b.forEach((valueB, keyB) => {
        values[next] = valueB
        keys[next++] = keyB
      })

      for (let [keyA, valueA] of a) {
        if (!this._pairIsWithin(valueA, keyA, values, keys)) { return false }
      }
      return true
    },


    function _compareSetProperties(a, b) {
      const size = a.size
      if (size !== b.size) { return false }

      const values = []
      var   next   = 0

      b.forEach((valueB) => {
        values[next++] = valueB
      })

      for (let [valueA] of a) {
        if (!this._isWithin(valueA, values)) { return false }
      }
      return true
    },


    function _pairIsWithin(valueA, keyA, values, keys) {
      var next, keyB, valueB
      next = values.length

      while (next--) {
        keyB   = keys[next]
        valueB = values[next]
        if (this.compare(keyA, keyB)) {
          if (this.compare(valueA, valueB)) {
            values.splice(next, 1)
            keys.splice(next, 1)
            return true
          }
        }
      }
      return false
    },


    function _isWithin(valueA, values) {
      var next, valueB
      next = values.length

      while (next--) {
        valueB = values[next]
        if (this.compare(valueA, valueB)) {
          values.splice(next, 1)
          return true
        }
      }
      return false
    },


    function _haveDivergentPaths(idA, idB) {
      const pathA  = this._pathA
      const pathB  = this._pathB
      const crumbA = pathA[idA]
      const crumbB = pathB[idB]

      if (crumbA !== crumbB) { return true }
      if (crumbA === undefined) {
        pathA[idA] = pathB[idB] = -(++this._pathCount)
      }
      return false
    },


    function _alreadyCompared(idA, idB) {
      var cohortA, cohortB, newCohort
      const cohorts = this._cohorts

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
          cohortB      = cohorts[idB]
          cohortB[idA] = idA
          cohorts[idA] = cohortB
        }
        else {      // Only A visited before
          newCohort      = []
          newCohort[idA] = idA
          newCohort[idB] = idB
          cohorts[idA]   = newCohort
          cohorts[idB]   = newCohort
        }
      }

      return false
    },


    function _mergeCohorts(cohortA, cohortB) {
      var id
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
    },
  ])

})
