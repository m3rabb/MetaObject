
const FuncGlobals = {
  $SECRET                : $SECRET,
  $RIND                  : $RIND,
  $PULP                  : $PULP,
  $INNER                 : $INNER,
  $BARRIER               : $BARRIER,
  $COPY                  : $COPY,
  IS_IMMUTABLE           : IS_IMMUTABLE,
  InterMap               : InterMap,
  ImmutableInner         : ImmutableInner,
  CopyObject             : "COPY_OBJECT",  // CopyObject
  DefineProperty         : DefineProperty,
  InSetProperty          : InSetProperty,
  InvisibleConfiguration : InvisibleConfiguration,
}

const FunctionNamer = new NamedFunctionMaker(FuncGlobals)




// UNTESTED
// function TameFunc(Func) {
//   const func = function $$$$$$safe(...args) {
//     const receiver =
//       (this != null && this[$SECRET] === $INNER) ? this[$RIND] : this
//     return Func.apply(receiver, args)
//   }
//
//   const vars  = {$$$$$: Func.name, Func: Func}
//   const named = FunctionNamer.make(vars, func)
//   return BeFrozenFunc(func)
// }



function AsTameFunc(Func) {
  const name = `${Func.name}_$safe`
  const func = {
    [name] : function (...args) {
      const receiver =
        (this != null && this[$SECRET] === $INNER) ? this[$RIND] : this
      return Func.apply(receiver, args)
    }
  }[name]
  return BeFrozenFunc(func, TAMED_FUNC)
}


function AsBasicSetter(PropertyName, setterName) {
  const name = `${AsFunctionName(setterName)}_$setter`
  return {
    [name] : function (value) {
      return InSetProperty(this[$INNER], PropertyName, value, this)
    }
  }[name]
}

function AsLoaderSetter(PropertyName, Loader) {
  const name = `${Loader.name}_$loader`
  return {
    [name] : function (value) {
      const newValue = Loader.call(this, value)
      return InSetProperty(this[$INNER], PropertyName, newValue, this)
    }
  }[name]
}



// Method       outer                     inner          super
//              AsOuterFact               AsInnerFact    AsSuperFact
// Fact         self$rind|immCopy|fact    this|fact      this|fact ()
// _Fact                                  this|fact      this|fact ()
//              AsOuterState              AsInnerState   AsSuperState
// State        self$rind|immCopy         this           this      ()
// _State                                 this           this      ()
//              AsOuterValue              PassThru       AsGenericSuper
// Value        self$rind|immCopy|result  result         result    ()
// _Value                                 result         result    ()
//              AsOuterBasic              PassThru       AsGenericSuper
// Basic        self$rind|result          result         result    ()
// _Basic                                 result         result    ()
//
// Immediate    outer                     inner          super
//              AsOuterFact               AsInnerFact    AsInnerFact
// Fact         self$rind|immCopy|fact    this|fact      this|fact
// _Fact                                  this|fact      this|fact
//              AsOuterState              AsInnerState   AsInnerState
// State        self$rind|immCopy         this           this
// _State                                 this           this
//              AsOuterValue              PassThru       PassThru
// Value        self$rind|immCopy|result  result         result
// _Value                                 result         result
//              AsOuterBasic              PassThru       PassThru
// Basic        self$rind|result          result         result
// _Basic                                 result         result
//
//
// Lazy         AsOuterLazyLoader    AsInnerLazyLoader   AsSuperLazyLoader
// _Lazy                             AsInnerLazyLoader   AsSuperLazyLoader
//
// Method
//   public  Fact
//   private _Value



function AsOuterFact(selector, Handler) {
  const name = `${AsFunctionName(selector)}_$outerFact`
  return {
    [name] : function (...args) {
      let result, result$inner, barrier, $pulp
      let $inner = InterMap.get(this)

      if ((barrier = $inner[$BARRIER])) { // means $inner[IS_IMMUTABLE]
        if (barrier.inUse) { barrier = new ImmutableInner($inner) }
        barrier.inUse = true
        $pulp  = barrier.target[$PULP]
        result = Handler.apply($pulp, args) // <<----------

        if (result === $pulp) {
          result = barrier.target
          if (result !== $inner) {
            barrier.target = $inner
            result[$PULP].beImmutable
          }
          barrier.inUse = false
          return result[$RIND]
        }
        barrier.inUse = false
      }
      else {
        $pulp = $inner[$PULP]
        result = Handler.apply($pulp, args) // <<----------
        if (result === $pulp) { return $inner[$RIND] }
      }

      // if (result === $inner[$RIND])                   { return result }
      if (typeof result !== "object" || result === null) { return result }
      if (result[IS_IMMUTABLE] || result.id != null)     { return result }
      return ((result$inner = InterMap.get(result))) ?
        result$inner[$COPY](true)[$RIND] : CopyObject(result, true)
    }
  }[name]
}

// This might not be a good idea???
function AsOuterState(selector, Handler) {
  const name = `${AsFunctionName(selector)}_$outerState`
  return {
    [name] : function (...args) {
      let result, barrier, $pulp
      let $inner = InterMap.get(this)

      if ((barrier = $inner[$BARRIER])) { // means $inner[IS_IMMUTABLE]
        if (barrier.inUse) { barrier = new ImmutableInner($inner) }
        barrier.inUse = true
        $pulp  = barrier.target[$PULP]
        Handler.apply($pulp, args) // <<----------
        result = barrier.target

        if (result !== $inner) {
          barrier.target = $inner
          result.beImmutable
        }
        barrier.inUse = false
        return result[$RIND]
      }
      else {
        $pulp = $inner[$PULP]
        Handler.apply($pulp, args) // <<----------
        return $inner[$RIND]
      }
    }
  }[name]
}

function AsOuterValue(selector, Handler) {
  const name = `${AsFunctionName(selector)}_$outerValue`
  return {
    [name] : function (...args) {
      let result, result$inner, $pulp
      let $inner = InterMap.get(this)

      if ((barrier = $inner[$BARRIER])) { // means $inner[IS_IMMUTABLE]
        if (barrier.inUse) { barrier = new ImmutableInner($inner) }
        barrier.inUse = true
        $pulp  = barrier.target[$PULP]
        result = Handler.apply($pulp, args) // <<----------

        if (result === $pulp) {
          result = barrier.target
          if (result !== $inner) {
            barrier.target = $inner
            result[$PULP].beImmutable
          }
          barrier.inUse = false
          return result[$RIND]
        }
        barrier.inUse = false
      }
      else {
        $pulp = $inner[$PULP]
        result = Handler.apply($pulp, args) // <<----------
        if (result === $pulp) { return $inner[$RIND] }
      }

      return result
    }
  }[name]
}

function AsOuterBasic(selector, Handler) {
  const name = `${AsFunctionName(selector)}_$outerBasic`
  return {
    [name] : function (...args) {
      return Handler.apply(InterMap.get(this)[$PULP], args) // <<----------
    }
  }[name]
}

function AsOuterLazyLoader(Selector, Handler) {
  const name = `${AsFunctionName(Selector)}_$outerLazy`
  return {
    [name] : function () {
      let result, result$inner, $pulp
      let $inner = InterMap.get(this)

      if ((barrier = $inner[$BARRIER])) { // means $inner[IS_IMMUTABLE]
        if (barrier.inUse) { barrier = new ImmutableInner($inner) }
        barrier.inUse = true
        $pulp  = barrier.target[$PULP]
        result = Handler.call($pulp) // <<----------

        if (result === $pulp) {
          result = barrier.target
          if (result !== $inner) {
            barrier.target = $inner
            result[$PULP].beImmutable
          }
          barrier.inUse = false
          return result[$RIND]
        }
        barrier.inUse = false

        // if (result === $inner[$RIND])                   { return result }
        if (typeof result !== "object" || result === null) { return result }
        if (result[IS_IMMUTABLE] || result.id != null)     { return result }
        return ((result$inner = InterMap.get(result))) ?
          result$inner[$COPY](true).$ : CopyObject(result, true)
      }

      $pulp = $inner[$PULP]
      DefineProperty($inner, Selector, InvisibleConfiguration)
      return ($pulp[Selector] = Handler.call($pulp)) // <<----------
    }
  }[name]
}


function AsInnerFact(selector, Handler) {
  const name = `${AsFunctionName(selector)}_$innerFact`
  return {
    [name] : function (...args) {
      // this is $pulp
      const result = Handler.apply(this, args) // <<----------

      if (result === this)                               { return result }
      if (typeof result !== "object" || result === null) { return result }
      if (result[IS_IMMUTABLE] || result.id != null)     { return result }
      return ((result$inner = InterMap.get(result))) ?
        result$inner[$COPY](true).$ : CopyObject(result, true)
    }
  }[name]
}

// This might not be a good idea???
function AsInnerState(selector, Handler) {
  const name = `${AsFunctionName(selector)}_$innerState`
  return {
    [name] : function (...args) {
      // this is $pulp
      Handler.apply(this, args) // <<----------
      return this
    }
  }[name]
}

function AsInnerLazyLoader(Selector, Handler) {
  const name = `${AsFunctionName(Selector)}_$innerLazy`
  return {
    [name] : function () {
      // this is $pulp
      DefineProperty(this[$INNER], Selector, InvisibleConfiguration)
      return (this[Selector] = Handler.call(this)) // <<----------
    }
  }[name]
}


// function AsOuterBasicLazyLoader(Selector, Handler) {
//   // FIGURE A WAY TO MAKE THIS WORK WITH selector as a Symbol AS WELL!!!
//   const name = `${AsFunctionName(Selector)}_$outerLazy`
//   return {
//     [name] : function () {
//       let $inner = InterMap.get(this)
//       let $pulp = $inner[$PULP]
//       DefineProperty($inner, Selector, InvisibleConfiguration)
//       return ($pulp[Selector] = Handler.call($pulp)) // <<----------
//     }
//   }[name]
// }



function AsSuperFact(selector, Handler) {
  const name = `${AsFunctionName(selector)}_$superFact`
  return {
    [name] : function (...args) {
      // this is $super. Need to use $pulp instead
      const $pulp  = this[$PULP]
      const result = Handler.apply($pulp, args) // <<----------

      if (result === $pulp)                              { return result }
      if (typeof result !== "object" || result === null) { return result }
      if (result[IS_IMMUTABLE] || result.id != null)     { return result }
      return ((result$inner = InterMap.get(result))) ?
        result$inner[$COPY](true).$ : CopyObject(result, true)
    }
  }[name]
}

// This might not be a good idea???
function AsSuperState(selector, Handler) {
  const name = `${AsFunctionName(selector)}_$superState`
  return {
    [name] : function (...args) {
    // this is $super. Need to use $pulp instead
      Handler.apply(this[$PULP], args) // <<----------
      return this
    }
  }[name]
}

function AsGenericSuper(selector, Handler) {
  const name = `${AsFunctionName(selector)}_$superGeneric`
  return {
    [name] : function (...args) {
      // this is $super. Need to use $pulp instead
      return Handler.apply(this[$PULP], args) // <<----------
    }
  }[name]
}


function AsSuperLazyLoader(Selector, Handler) {
  const name = `${AsFunctionName(Selector)}_$superLazy`
  return {
    [name] : function () {
      // this is $super. Need to use $pulp instead
      const $inner = this[$INNER]
      const $pulp  = $inner[$PULP]

      DefineProperty($inner, Selector, InvisibleConfiguration)
      return ($pulp[Selector] = Handler.call($pulp)) // <<----------
    }
  }[name]
}


function PassThru(selector, handler) {
  return handler
}

function AsOuterStandard(selector, handler, isPublic) {
  return isPublic ?
    AsOuterFact(selector, handler) : AsOuterValue(selector, handler)
}

function AsInnerStandard(selector, handler, isPublic) {
  return isPublic ?
    AsInnerFact(selector, handler) : PassThru(selector, handler)
}

function AsSuperStandard(selector, handler, isPublic) {
  return isPublic ?
    AsSuperFact(selector, handler) : AsGenericSuper(selector, handler)
}


const FACT_METHOD = {
  id          : "FACT_METHOD",
  isImmediate : false,
  outer       : AsOuterFact,
  inner       : AsInnerFact,
  super       : AsSuperFact,
}

const STATE_METHOD = {
  id          : "STATE_METHOD",
  isImmediate : false,
  outer       : AsOuterState,
  inner       : AsInnerState,
  super       : AsSuperState,
}

const VALUE_METHOD = {
  id          : "VALUE_METHOD",
  isImmediate : false,
  outer       : AsOuterValue,
  inner       : PassThru,
  super       : AsGenericSuper,
}

const BASIC_METHOD = {
  id          : "BASIC_METHOD",
  isImmediate : false,
  outer       : AsOuterBasic,
  inner       : PassThru,
  super       : AsGenericSuper,
}


const FACT_IMMEDIATE = {
  id          : "FACT_IMMEDIATE",
  isImmediate : true,
  outer       : AsOuterFact,
  inner       : AsInnerFact,
  super       : AsInnerFact,
}

const STATE_IMMEDIATE = {
  id          : "STATE_IMMEDIATE",
  isImmediate : true,
  outer       : AsOuterState,
  inner       : AsInnerState,
  super       : AsInnerState,
}

const VALUE_IMMEDIATE = {
  id          : "VALUE_IMMEDIATE",
  isImmediate : true,
  outer       : AsOuterValue,
  inner       : PassThru,
  super       : PassThru,
}

const BASIC_IMMEDIATE = {
  id          : "BASIC_IMMEDIATE",
  isImmediate : true,
  outer       : AsOuterBasic,
  inner       : PassThru,
  super       : PassThru,
}


const LAZY_INSTALLER = {
  id          : "LAZY_INSTALLER",
  isImmediate : true,
  outer       : AsOuterLazyLoader,
  inner       : AsInnerLazyLoader,
  super       : AsSuperLazyLoader,
}

// const BASIC_LAZY_INSTALLER = {
//   id          : "BASIC_LAZY_INSTALLER",
//   isImmediate : true,
//   outer       : AsOuterBasicLazyLoader,
//   inner       : {true: AsInnerLazyLoader, false: AsInnerLazyLoader},
//   super       : {true: AsSuperLazyLoader, false: AsSuperLazyLoader},
// }



const STANDARD_METHOD = {
  id          : "STANDARD_METHOD",
  isImmediate : false,
  outer       : AsOuterStandard,
  inner       : AsInnerStandard,
  super       : AsSuperStandard,
}

const STANDARD_IMMEDIATE = {
  id          : "STANDARD_IMMEDIATE",
  isImmediate : true,
  isLoader    : false,
  outer       : AsOuterStandard,
  inner       : AsInnerStandard,
  super       : AsInnerStandard,
}

const SET_LOADER = {
  id          : "SET_LOADER",
  isImmediate : false,
}
