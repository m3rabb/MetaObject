// Enable comparator to compare their strictness with each other
// undefined for comparing isIdentical with isExact


//                               mutable                       immutable
// is(Same)                             the exact same object
// isExactly                        same type/structure/mutablility
// isIdentical (forever)      same object                   same type/values/id
// isEqual (W|R)       same type/structure/mutability/id    same type/values/id
// isEquivalent (for R)                  same ordering/values/id
// isAlike      (for R)                  same ordering/values
// isSimilar    (for R)               similar values ignore case


// hasEqualProperties (for R)
// isEquivEqual (for R)       equivalent root, equal children
// isAlikeEqual (for R)       alike root     , equal children



HandAxe._(function Equality(
  $INNER, $INSTANCE_BLANKER, $PULP, $RIND, IMMUTABLE, _DURABLES,
  GetDurables, InterMap, KnowFunc, OwnVisibleNamesOf, SpawnFrom,
  ValueAsName, _RootContext, nil,
  $Intrinsic, Definition, Type, _Comparator
) {
  "use strict"


  HandAxe.add(this)


  _Comparator.setContext(this)

  _Comparator.addValueMethods([

    function _compareProperties(a, b, konstructor) {
      var _$a, _$b, _a, _b, isFunc, handler, result

      switch (konstructor) {
        case WeakMap  : return undefined
        case WeakSet  : return undefined
        case Object   : return this.compareObjects_(a, b)
        case Array    : return this.compareIndexed_(a, b)
        case String   : return this.compareIndexed_(a, b)
        case Map      : return this.compareMaps_(a, b)
        case Set      : return this.compareSets_(a, b)
        case Function : isFunc = true ; break
      }

      _$a = InterMap.get(a)
      if (_$a === undefined) {
        handler = a._compareProperties
        if (handler) {
          result = handler.call(a, b, this)
          if (result !== undefined) { return result }
        }
        else if (isFunc) { return this.compareFuncs_(a, b) }

        return this.compareObjects_(a, b)
      }

      handler = _$a._compareProperties
      _a      = _$a[$PULP]
      if (handler) {
        result = handler.call(_a, b, this)
        if (result !== undefined) { return result }
      }

      _$b = InterMap.get(b)
       _b = (_$b !== undefined) ? _$b[$PULP] : b

      return this.compareObjects_(_a, _b)
    },


    function compareFuncs_(_a, _b) {  // eslint-disable-line
      return false
    },


    function compareObjects_(_a, _b) {
      var next, selector
      const durablesA = _a[_DURABLES] || GetDurables(_a)
      const durablesB = _b[_DURABLES] || GetDurables(_b)
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
        if (!this.compare(_a[selector], _b[selector]))   { return false }
      }
      return true
    },


    function compareIndexed_(_a, _b) {
      var countA, countB, elementsA, elementsB, next
      countA = _a.length
      countB = _b.length

      if (countA !== undefined) {
        if (countB !== undefined) {
          next = countA
          while (next--) {
            if (!this.compare(_a[next], _b[next])) { return false }
          }
          return true
        }
        countB    = _b.size
        elementsA = _a
      }
      else {
        countA = _a.size
        if (countB !== undefined) { elementsB = _b } else { countB = _b.size }
      }

      if (countA !== countB) { return false }

      if (elementsA === undefined) { elementsA = _a.elements }
      if (elementsB === undefined) { elementsB = _b.elements }

      next = countA
      while (next--) {
        if (!this.compare(elementsA[next], elementsB[next])) { return false }
      }
      return true
    },


    // Note: This isn't entirely correct. When the equality measure is relaxed,
    // the only way to ensure equality inspect is to recursively comapre
    // key-value pairs.
    function compareMaps(_a, _b) {
      const size = _a.size
      if (size !== _b.size) { return false }

      const keys   = []
      const values = []
      var   next   = 0

      _b.forEach((valueB, keyB) => {
        values[next] = valueB
        keys[next++] = keyB
      })

      for (let [keyA, valueA] of _a) {
        if (!this._pairIsWithin(valueA, keyA, values, keys)) { return false }
      }
      return true
    },


    function compareSets(_a, _b) {
      const size = _a.size
      if (size !== _b.size) { return false }

      const values = []
      var   next   = 0

      _b.forEach((valueB) => {
        values[next++] = valueB
      })

      for (let [valueA] of _a) {
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


    function _haveDivergentPaths([idA, idB]) {
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


    function _alreadyCompared([idA, idB]) {
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

    function _retroactivelyInit() {
      const ids    = new Map()
      const cohort = [0, 1]
      ids.set(this._rootA, 0)
      ids.set(this._rootB, 1)

      this._ids     = ids
      this._nextId  = 2
      this._cohorts = [cohort, cohort]

      this._compareObjects = this._compareObjectsN

      return this
    },

    function _getIds(a, b) {
      var idA, idB
      const ids = this.ids
      if (!(idA = ids.get(a))) { ids.set(a, (idA = this._nextId++)) }
      if (!(idB = ids.get(b))) { ids.set(b, (idB = this._nextId++)) }
      return [idA, idB]
    },


    function meetsRigorOf(comparator) {
      const nameA = this.name
      const nameB = comparator.name
      const rankA = ComparatorRank[nameA]
      const rankB = ComparatorRank[nameB]

      return (rankA !== rankB) ? (rankA <= rankB) : (nameA === nameB || undefined)
    },

    function meetsLeniencyOf(comparator) {
      const nameA = this.name
      const nameB = comparator.name
      const rankA = ComparatorRank[nameA]
      const rankB = ComparatorRank[nameB]

      return (rankA !== rankB) ? (rankA >= rankB) : (nameA === nameB || undefined)
    },

  ])



  function same(a, b) {
    if (a === b)               { return true  }
    if (typeof a !== "number") { return false }
    return (a === b) ?
      ((a !== 0) || (1 / a) === (1 / b)) : // Check for 0 and -0
      ((a !== a) && (b !== b))             // Check for NaN
  }

  function exact(a, b) {
    if (a === b) { return true }

    switch (typeof a) {
      default         : return false

      case "number"   :
        return (a === b) ?
          ((a !== 0) || (1 / a) === (1 / b)) : // Check for 0 and -0
          ((a !== a) && (b !== b))             // Check for NaN

      case "object"   : if (a === null || b === null) { return false }
      // break omitted
      case "function" : return this.compareObjects(a, b)
    }
  }

  function similar(a, b) {
    var strA, strB, m, n
    if (a === b) { return true }

    switch (typeof a) {
      case "boolean"   : return false
      case "undefined" : return (b === null)

      case "object"    :
        if (a === null) { return (b === undefined || b === nil) }
        if (a === nil)  { return (b === null) }
        return this.compareObjects(a, b)

      case "symbol" :
        strA = ValueAsName(a)

        switch (typeof b) {
          default       : return false
          case "object" : return this.compareObjects(strA, b)
          case "symbol" : return (strA === ValueAsName(b))
          case "string" : return (strA === b)
          case "number" :
            m = +strA, n = b
            return (m === n) || (strA === "NaN" && m !== m && n !== n)
        }

      case "string" :
        switch (typeof b) {
          default       : return false
          case "object" : return this.compareObjects(a, b)
          case "symbol" : return (a === ValueAsName(b))
          case "string" : return (a.toLowerCase() === b.toLowerCase())
          case "number" :
            m = +a, n = b
            return (m === n) || (a === "NaN" && m !== m && n !== n)
        }

      case "number" :
        m = a
        switch (typeof b) {
          default       : return false
          case "symbol" : n =  +(strB = ValueAsName(b)) ; break
          case "string" : n =  +(strB = b)              ; break
          case "number" : n = b, strB = "NaN"           ; break
        }
        return (m === n) || (strB === "NaN" && m !== m && n !== n)

      case "function" :
        switch (typeof b) {
          default         : return false
          case "object"   : return this.compareObjects(a, b)
          case "function" : return this.compareObjects(a, b)
        }
    }
  }

  function equ(a, b) {
    if (a === b) { return true }

    switch (typeof a) {
      default          : return false        // Check for NaN.  0 equals -0
      case "number"    : return (a === b) || ((a !== a) && (b !== b))
      case "object"    : if (a === null || b === null) { return false }
      // break omitted
      case "function"  : return this.compareObjects(a, b)
    }
  }


  function sameObjects(a, b) {
    return (a === b)
  }

  function identicalObjects(a, b) {
    if (!a[IMMUTABLE] || !b[IMMUTABLE]) { return false }
    if ( a.id         !== b.id        ) { return false }

    const konstructor = a.constructor
    if (konstructor !== b.constructor)  { return false }

    return this._compareObjects(a, b, konstructor)
  }

  function strictObjects(a, b) {
    if (a[IMMUTABLE] !== b[IMMUTABLE]) { return false }
    if (a.id         !== b.id        ) { return false }

    const konstructor = a.constructor
    if (konstructor !== b.constructor) { return false }

    return this._compareObjects(a, b, konstructor)
  }

  function equivObjects(a, b) {
    if (a.id !== b.id) { return false }
    return this._compareObjects(a, b, a.constructor)
  }

  function relaxedObjects(a, b) {
    return this._compareObjects(a, b, a.constructor)
  }


  function _compareObjects1(a, b, konstructor) {
    const _$comparator = new this[$INSTANCE_BLANKER]()
    const  _comparator = _$comparator[$PULP]

    _$comparator._rootA = a
    _$comparator._rootB = b

    return _comparator._compareProperties(a, b, konstructor)
  }


  function _compareObjectsValues2(a, b, konstructor) {
    return this._retroactivelyInit._compareProperties(a, b, konstructor)
  }

  function _compareObjectStructure2(a, b, konstructor) {
    this._pathA     = [-1, undefined]
    this._pathB     = [undefined, -1]
    this._pathCount = 1

    return this._retroactivelyInit._compareProperties(a, b, konstructor)
  }


  function _compareObjectsValuesN(a, b, konstructor) {
    const ids = this._getIds(a, b)
    if (this._alreadyCompared(ids)) { return true }
    return this._compareProperties(a, b, konstructor)
  }

  function _compareObjectsMixedN(a, b, konstructor) {
    const ids = this._getIds(a, b)
    if (!a[IMMUTABLE] && this._haveDivergentPaths(ids)) { return false }
    if (this._alreadyCompared(ids))                     { return true  }
    return this._compareProperties(a, b, konstructor)
  }

  function _compareObjectsStructureN(a, b, konstructor) {
    const ids = this._getIds(a, b)
    if (this._haveDivergentPaths(ids)) { return false }
    if (this._alreadyCompared(ids))    { return true  }
    return this._compareProperties(a, b, konstructor)
  }



  const Def        = Definition

  const Same       = Def("compare", same   , "VALUE")
  const Exact      = Def("compare", exact  , "VALUE")
  const Simlr      = Def("compare", similar, "VALUE")
  const Equ        = Def("compare", equ    , "VALUE")

  const SameObj    = Def("compareObjects" , sameObjects     , "VALUE")
  const IdentObj   = Def("compareObjects" , identicalObjects, "VALUE")
  const StrictObj  = Def("compareObjects" , strictObjects   , "VALUE")
  const EquivObj   = Def("compareObjects" , equivObjects    , "VALUE")
  const RelaxedObj = Def("compareObjects" , relaxedObjects  , "VALUE")

  const _CompObj1 = Def("_compareObjects", _compareObjects1, "VALUE")

  const _Value2  = Def("_compareObjects", _compareObjectsValues2    , "VALUE")
  const _Struct2 = Def("_compareObjects", _compareObjectStructure2  , "VALUE")
  const _ValueN  = Def("_compareObjects", _compareObjectsValuesN    , "VALUE")
  const _MixedN  = Def("_compareObjects", _compareObjectsMixedN     , "VALUE")
  const _StructN = Def("_compareObjects", _compareObjectsStructureN , "VALUE")

  const ComparatorRank = SpawnFrom(null)

  const Make = (rank, name, comp, compObj, _compObj2, _compObjN) => {
    const type = _Comparator.newSubtype(name, this)
    ComparatorRank[name] = rank
    type.addSharedProperty("name", name)
    type.addOwnDefinition(_CompObj1)
    type.addOwnDefinition(comp)
    type.addOwnDefinition(compObj)
    type.addDefinition(comp)
    type.addDefinition(compObj)
    _compObj2 && type.addDefinition(_compObj2)
    _compObjN && type.addDefinition(_compObjN)
    this.add(type)
    return type
  }

  var IsSame, IsIdentical, IsExactly, IsEqual, IsEquivalent, IsAlike, IsSimilar

  IsSame       = Make(1, "IsSame"      , Same , SameObj   ,  null   ,  null   )
  IsIdentical  = Make(2, "IsIdentical" , Equ  , IdentObj  , _Value2 , _ValueN )
  IsExactly    = Make(2, "IsExactly"   , Exact, StrictObj , _Struct2, _StructN)
  IsEqual      = Make(3, "IsEqual"     , Equ  , StrictObj , _Struct2, _MixedN )
  IsEquivalent = Make(4, "IsEquivalent", Equ  , EquivObj  , _Value2 , _ValueN )
  IsAlike      = Make(5, "IsAlike"     , Equ  , RelaxedObj, _Value2 , _ValueN )
  IsSimilar    = Make(6, "IsSimilar"   , Simlr, RelaxedObj, _Value2 , _ValueN )


  IsExactly.addValueMethod(function compareMaps_(a, b) {
    if (a.size !== b.size) { return false }

    a.forEach((valueA, key) => {
      const valueB = b.get(key)
      if (!this.compare(valueA, valueB))       { return false }
      if (valueA === undefined && !b.has(key)) { return false }
    })
    return true
  })


  IsSimilar.addValueMethod(function compareFuncs_(a, b) {
    if (a.name !== b.name)           { return false }
    if (a.toString() !== b.toString) { return false }
    return this.compareObjects_(a, b)
  })



  $Intrinsic.addValueMethods([
    function isSame(value) {
      return (this === value || this[$RIND] === value)
    },

    function isIdentical(value) {
      return IsIdentical.compareObjects(this[$RIND], value)
    },

    function isExactly(value) {
      return IsExactly.compareObjects(this[$RIND], value)
    },

    function isEqual(value) {
      return IsEqual.compareObjects(this[$RIND], value)
    },

    function isEquivalent(value) {
      return IsEquivalent.compareObjects(this[$RIND], value)
    },

    function isAlike(value) {
      return IsAlike.compareObjects(this[$RIND], value)
    },

    function isSimilar(value) {
      return IsSimilar.compareObjects(this[$RIND], value)
    },
  ])



  _RootContext.add(KnowFunc(function areSame(a, b) {
    return IsSame.compare(a, b)
  }))

  _RootContext.add(KnowFunc(function areIdentical(a, b) {
    return IsIdentical.compare(a, b)
  }))

  _RootContext.add(KnowFunc(function areExactly(a, b) {
    return IsExactly.compare(a, b)
  }))

  _RootContext.add(KnowFunc(function areEqual(a, b) {
    return IsEqual.compare(a, b)
  }))

  _RootContext.add(KnowFunc(function areEquivalent(a, b) {
    return IsEquivalent.compare(a, b)
  }))

  _RootContext.add(KnowFunc(function areAlike(a, b) {
    return IsAlike.compare(a, b)
  }))

  _RootContext.add(KnowFunc(function areSimilar(a, b) {
    return IsSimilar.compare(a, b)
  }))


})

/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
