
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
// function SafeFunc(Func) {
//   const func = function $$$$$$safe(...args) {
//     const receiver =
//       (this != null && this[$SECRET] === $INNER) ? this[$RIND] : this
//     return Func.apply(receiver, args)
//   }
//
//   // const named = FunctionNamer.make({$$$$$: Func.name, Func: Func}, func)
//   return BeFrozenFunc(func)
// }

function SafeFunc(Func) {
  const name = `${Func.name}_$safe`
  const func = {
    [name] : function (...args) {
      const receiver =
        (this != null && this[$SECRET] === $INNER) ? this[$RIND] : this
      return Func.apply(receiver, args)
    }
  }[name]

  return BeFrozenFunc(func)
}


function AsBasicSetter(PropertyName, setterName) {
  const func = function $$$$$_$setter(value) {
    InSetProperty(this[$INNER], PropertyName, value, this)
    return this
  }

  const vars  = {$$$$$: setterName, PropertyName: PropertyName}
  const named = FunctionNamer.make(vars, func)
  return BeFrozenFunc(named)
}

function AsLoaderSetter(PropertyName, setterName, Loader) {
  const name = `${Loader.name}_$loader`
  const func = {
    [name] : function (value) {
      const newValue = Loader.call(this, value)
      InSetProperty(this[$INNER], PropertyName, newValue, this)
      return this
    }
  }[name]

  //const vars  = {$$$$$: setterName, PropertyName: PropertyName, Loader: Loader}
  //const named = FunctionNamer.make(vars, func)
  return BeFrozenFunc(func)
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
//              AsOuterSpecial            PassThru       AsGenericSuper
// Special      self$rind|result          result         result    ()
// _Special                               result         result    ()
//
// Getter       outer                     inner          super
//              AsOuterFact               AsInnerFact    AsInnerFact
// Fact         self$rind|immCopy|fact    this|fact      this|fact
// _Fact                                  this|fact      this|fact
//              AsOuterState              AsInnerState   AsInnerState
// State        self$rind|immCopy         this           this
// _State                                 this           this
//              AsOuterValue              PassThru       PassThru
// Value        self$rind|immCopy|result  result         result
// _Value                                 result         result
//              AsOuterSpecial            PassThru       PassThru
// Special      self$rind|result          result         result
// _Special                               result         result
//
//
// Lazy         AsOuterLazyLoader    AsInnerLazyLoader   AsSuperLazyLoader
// _Lazy                             AsInnerLazyLoader   AsSuperLazyLoader
//
// Method
//   public  Fact
//   private _Value



function AsOuterFact(selector, Handler) {
  const func = function $$$$$_$outerFact(...args) {
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

  const named = FunctionNamer.make({$$$$$: selector, Handler: Handler}, func)
  return BeFrozenFunc(named)
}

// This might not be a good idea???
function AsOuterState(selector, Handler) {
  const func = function $$$$$__$outerState(...args) {
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

  const named = FunctionNamer.make({$$$$$: selector, Handler: Handler}, func)
  return BeFrozenFunc(named)
}

function AsOuterValue(selector, Handler) {
  const func = function $$$$$__$outerValue(...args) {
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

  const named = FunctionNamer.make({$$$$$: selector, Handler: Handler}, func)
  return BeFrozenFunc(named)
}

function AsOuterSpecial(selector, Handler) {
  const func = function $$$$$_$outerSpecial(...args) {
    let $inner = InterMap.get(this)
    let $pulp  = $inner[$PULP]
    let result = Handler.apply($pulp, args) // <<----------
    return (result === $pulp) ? $inner[$RIND] : result
  }

  const named = FunctionNamer.make({$$$$$: selector, Handler: Handler}, func)
  return BeFrozenFunc(named)
}

function AsOuterLazyLoader(selector, Handler) {
  // FIGURE A WAY TO MAKE THIS WORK WITH selector as a Symbol AS WELL!!!
  const func = function $$$$$_$outerLazy() {
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

      // if (result === $inner[$RIND])                   { return result }
      if (typeof result !== "object" || result === null) { return result }
      if (result[IS_IMMUTABLE] || result.id != null)     { return result }
      return ((result$inner = InterMap.get(result))) ?
        result$inner[$COPY](true).$ : CopyObject(result, true)
    }

    $pulp = $inner[$PULP]
    DefineProperty($inner, "$$$$$", InvisibleConfiguration)
    $pulp.$$$$$ = Handler.call($pulp) // <<----------
    return $inner.$$$$$
  }

  const named = FunctionNamer.make({$$$$$: selector, Handler: Handler}, func)
  return BeFrozenFunc(named)
}


function AsInnerFact(selector, Handler) {
  const name = `${selector}_$innerFact`
  const func = {
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

  return BeFrozenFunc(func)
}

// This might not be a good idea???
function AsInnerState(selector, Handler) {
  const func = function $$$$$_$innerState(...args) {
    // this is $pulp
    Handler.apply(this, args) // <<----------
    return this
  }

  const named = FunctionNamer.make({$$$$$: selector, Handler: Handler}, func)
  return BeFrozenFunc(named)
}

function AsInnerLazyLoader(selector, Handler) {
  // FIGURE A WAY TO MAKE THIS WORK WITH selector as a Symbol AS WELL!!!
  const func = function $$$$$_$innerLazy() {
    // this is $pulp
    const $inner = this[$INNER]

    DefineProperty($inner, "$$$$$", InvisibleConfiguration)
    this.$$$$$ = Handler.call(this) // <<----------
    return $inner.$$$$$
  }

  const named = FunctionNamer.make({$$$$$: selector, Handler: Handler}, func)
  return BeFrozenFunc(named)
}



function AsSuperFact(selector, Handler) {
  const func = function $$$$$_$superFact(...args) {
    // this is $super. Need to use $pulp instead
    const $pulp  = this[$PULP]
    const result = Handler.apply($pulp, args) // <<----------

    if (result === $pulp)                              { return result }
    if (typeof result !== "object" || result === null) { return result }
    if (result[IS_IMMUTABLE] || result.id != null)     { return result }
    return ((result$inner = InterMap.get(result))) ?
      result$inner[$COPY](true).$ : CopyObject(result, true)
  }

  // const named = FunctionNamer.make({$$$$$: selector, Handler: Handler}, func)
  return BeFrozenFunc(func)
}

// This might not be a good idea???
function AsSuperState(selector, Handler) {
  const func = function $$$$$_$superState(...args) {
    // this is $super. Need to use $pulp instead
    Handler.apply(this[$PULP], args) // <<----------
    return this
  }

  const named = FunctionNamer.make({$$$$$: selector, Handler: Handler}, func)
  return BeFrozenFunc(named)
}

function AsGenericSuper(selector, Handler) {
  const func = function $$$$$_$superGeneric(...args) {
    // this is $super. Need to use $pulp instead
    return Handler.apply(this[$PULP], args) // <<----------
  }

  // const named = FunctionNamer.make({$$$$$: selector, Handler: Handler}, func)
  return BeFrozenFunc(func)
}


function AsSuperLazyLoader(selector, Handler) {
  const func = function $$$$$_$superLazy() {
    // this is $super. Need to use $pulp instead
    const $inner = this[$INNER]
    const $pulp  = $inner[$PULP]

    DefineProperty($inner, $$$$$, InvisibleConfiguration)
    $pulp[$$$$$] = Handler.call($pulp) // <<----------
    return $inner[$$$$$]
  }

  // const named = FunctionNamer.make({$$$$$: selector, Handler: Handler}, func)
  return BeFrozenFunc(func)
}

function PassThru(selector, handler) {
  return handler
}





const FACT_METHOD = {
  id          : "FACT_METHOD",
  isImmediate : false,
  outer       : AsOuterFact,
  inner       : {true: AsInnerFact, false: AsInnerFact},
  super       : {true: AsSuperFact, false: AsSuperFact},
}

const STATE_METHOD = {
  id          : "STATE_METHOD",
  isImmediate : false,
  outer       : AsOuterState,
  inner       : {true: AsInnerState, false: AsInnerState},
  super       : {true: AsSuperState, false: AsSuperState},
}

const VALUE_METHOD = {
  id          : "VALUE_METHOD",
  isImmediate : false,
  outer       : AsOuterValue,
  inner       : {true: PassThru      , false: PassThru},
  super       : {true: AsGenericSuper, false: AsGenericSuper},
}

const SPECIAL_METHOD = {
  id          : "SPECIAL_METHOD",
  isImmediate : false,
  outer       : AsOuterSpecial,
  inner       : {true: PassThru      , false: PassThru},
  super       : {true: AsGenericSuper, false: AsGenericSuper},
}


const FACT_GETTER = {
  id          : "FACT_GETTER",
  isImmediate : true,
  outer       : AsOuterFact,
  inner       : {true: AsInnerFact, false: AsInnerFact},
  super       : {true: AsInnerFact, false: AsInnerFact},
}

const STATE_GETTER = {
  id          : "STATE_GETTER",
  isImmediate : true,
  outer       : AsOuterState,
  inner       : {true: AsInnerState, false: AsInnerState},
  super       : {true: AsInnerState, false: AsInnerState},
}

const VALUE_GETTER = {
  id          : "VALUE_GETTER",
  isImmediate : true,
  outer       : AsOuterValue,
  inner       : {true: PassThru, false: PassThru},
  super       : {true: PassThru, false: PassThru},
}

const SPECIAL_GETTER = {
  id          : "SPECIAL_GETTER",
  isImmediate : true,
  outer       : AsOuterSpecial,
  inner       : {true: PassThru, false: PassThru},
  super       : {true: PassThru, false: PassThru},
}


const LAZY_INSTALLER = {
  id          : "LAZY_INSTALLER",
  isImmediate : true ,
  outer       : AsOuterLazyLoader,
  inner       : {true: AsInnerLazyLoader, false: AsInnerLazyLoader},
  super       : {true: AsSuperLazyLoader, false: AsSuperLazyLoader},
}


const STANDARD_METHOD = {
  id          : "STANDARD_METHOD",
  isImmediate : false,
  outer       : AsOuterFact,
  inner       : {true: AsInnerFact, false: PassThru},
  super       : {true: AsSuperFact, false: AsGenericSuper},
}

const STANDARD_GETTER = {
  id          : "STANDARD_GETTER",
  isImmediate : true,
  outer       : AsOuterFact,
  inner       : {true: AsInnerFact, false: PassThru},
  super       : {true: AsInnerFact, false: PassThru},
}

const SET_LOADER = {
  id          : "SET_LOADER",
  isImmediate : false,
  outer       : ALWAYS_UNDEFINED,
  inner       : {true: ALWAYS_UNDEFINED, false: ALWAYS_UNDEFINED},
}
