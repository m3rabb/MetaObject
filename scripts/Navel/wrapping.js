
// const FuncGlobals = {
//   $SECRET                : $SECRET,
//   $RIND                  : $RIND,
//   $PULP                  : $PULP,
//   $INNER                 : $INNER,
//   $BARRIER               : $BARRIER,
//   IS_IMMUTABLE           : IS_IMMUTABLE,
//   InterMap               : InterMap,
//   ImmutableInner         : ImmutableInner,
//   Copy                   : Copy,
//   CopyObject             : CopyObject,
//   DefineProperty         : DefineProperty,
//   InSetProperty          : InSetProperty,
//   InvisibleConfiguration : InvisibleConfiguration,
// }
//
// const FunctionNamer = new NamedFunctionMaker(FuncGlobals)




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
//   return SetImmutableFunc(func)
// }



function AsTameFunc(Func) {
  const name = `${Func.name}_$tamed`
  const func = {
    [name] : function (...args) {
      const receiver =
        (this != null && this[$SECRET] === $INNER) ? this[$RIND] : this
      return Func.apply(receiver, args)
    }
  }[name]
  return SetImmutableFunc(func, TAMED_FUNC)
}


function AsBasicSetter(PropertyName, setterName) {
  const name = `${AsName(setterName)}_$setterBasic`
  return {
    [name] : function (value) {
      return InSetProperty(this[$INNER], PropertyName, value, this)
    }
  }[name]
}

function AsLoaderSetter(PropertyName, Loader) {
  const name = `${Loader.name}_$setterLoader`
  return {
    [name] : function (value) {
      const newValue = Loader.call(this, value)
      return (newValue === undefined) ? this :
        InSetProperty(this[$INNER], PropertyName, newValue, this)
    }
  }[name]
}



// Method       outer                     inner          super
//              AsOuterFact               AsInnerFact    AsSuperFact
// Fact         self|immCopy|fact         _self|fact     _self|fact  ()
//
//              AsOuterValue              AsInnerValue   AsGenericSuper
// Value        self|immCopy|value        _self|value    _self|value ()
//
//              AsOuterBasicValue         PassThru       AsGenericSuper
// Basic        value                     value          value       ()
//
//              AsOuterBasicSelf          PassThru       AsGenericSuper
// Basic        self                      _self          _self       ()
//
//
// Lazy         AsOuterLazyLoader    AsInnerLazyLoader   AsSuperLazyLoader
//
//
// Method
//   public  Fact
//   private Value



function AsOuterFact(selector, Handler) {
  const name = `${AsName(selector)}_$outer$fact`
  return {
    [name] : function (...args) {
      const $inner = InterMap.get(this)
      var   $pulp, barrier, result, $target, $result

      if ((barrier = $inner[$MAIN_BARRIER])) { // means $inner[IS_IMMUTABLE]
        if (barrier.$target) {
          barrier = new ImmutableInner()
          $pulp = new Proxy($inner, barrier)
        } else {
          $pulp = $inner[$PULP]
        }
        barrier.$target = $inner
        result = Handler.apply($pulp, args) // <<----------
        $target = barrier.$target
        barrier.$target = null

        if (result === undefined || result === $pulp) {
          if ($target !== $inner) { $target[$PULP].beImmutable }
          return $target[$RIND]
        }
      }
      else {
        $pulp  = $inner[$PULP]
        result = Handler.apply($pulp, args) // <<----------
        if (result === undefined || result === $pulp) { return $inner[$RIND] }
      }

      // if (result === $inner[$RIND])                   { return result }
      if (typeof result !== "object" || result === null) { return result }
      if (result[IS_IMMUTABLE] || result.id != null)     { return result }
      return (($result = InterMap.get(result))) ?
        $Copy($result, true)[$RIND] : CopyObject(result, true)
    }
  }[name]
}

function AsOuterValue(selector, Handler) {
  const name = `${AsName(selector)}_$outer$value`
  return {
    [name] : function (...args) {
      const $inner = InterMap.get(this)
      var   $pulp, barrier, result, $target

      if ((barrier = $inner[$MAIN_BARRIER])) { // means $inner[IS_IMMUTABLE]
        if (barrier.$target) {
          barrier = new ImmutableInner()
          $pulp = new Proxy($inner, barrier)
        } else {
          $pulp = $inner[$PULP]
        }
        barrier.$target = $inner
        result = Handler.apply($pulp, args) // <<----------
        $target = barrier.$target
        barrier.$target = null

        if (result === undefined || result === $pulp) {
          if ($target !== $inner) { $target[$PULP].beImmutable }
          return $target[$RIND]
        }
      }
      else {
        $pulp  = $inner[$PULP]
        result = Handler.apply($pulp, args) // <<----------
        if (result === undefined || result === $pulp) { return $inner[$RIND] }
      }

      return result
    }
  }[name]
}

function AsOuterBasicValue(selector, Handler) {
  const name = `${AsName(selector)}_$outer$basicValue`
  return {
    [name] : function (...args) {
      return Handler.apply(InterMap.get(this)[$PULP], args) // <<----------
    }
  }[name]
}

function AsOuterBasicSelf(selector, Handler) {
  const name = `${AsName(selector)}_$outer$basicSelf`
  return {
    [name] : function (...args) {
      const $inner = InterMap.get(this)
      Handler.apply($inner[$PULP], args) // <<----------
      return $inner[$RIND]
    }
  }[name]
}

function AsOuterLazyLoader(Selector, Handler) {
  const name = `${AsName(Selector)}_$outer$lazy`
  return {
    [name] : function () {
      const $inner = InterMap.get(this)
      var   $pulp, barrier, result, $target, $result

      if ((barrier = $inner[$MAIN_BARRIER])) { // means $inner[IS_IMMUTABLE]
        if (barrier.$target) {
          barrier = new ImmutableInner()
          $pulp = new Proxy($inner, barrier)
        } else {
          $pulp = $inner[$PULP]
        }
        barrier.$target = $inner
        result = Handler.apply($pulp, args) // <<----------
        $target = barrier.$target
        barrier.$target = null

        if (result === undefined || result === $pulp) {
          if ($target !== $inner) { $target[$PULP].beImmutable }
          return $target[$RIND]
        }

        // if (result === $inner[$RIND])                   { return result }
        if (typeof result !== "object" || result === null) { return result }
        if (result[IS_IMMUTABLE] || result.id != null)     { return result }
        return (($result = InterMap.get(result))) ?
          Copy($result, true)[$RIND] : CopyObject(result, true)
      }

      $pulp = $inner[$PULP]
      DefineProperty($inner, Selector, InvisibleConfiguration)
      return ($pulp[Selector] = Handler.call($pulp)) // <<----------
    }
  }[name]
}


function AsInnerFact(selector, Handler) {
  const name = `${AsName(selector)}_$inner$fact`
  return {
    [name] : function (...args) {
      // this is $pulp
      const result = Handler.apply(this, args) // <<----------
      var   $result

      if (result === undefined || result === this)       { return result }
      // if (result === $inner[$RIND])                   { return result }
      if (typeof result !== "object" || result === null) { return result }
      if (result[IS_IMMUTABLE] || result.id != null)     { return result }
      return (($result = InterMap.get(result))) ?
        Copy($result, true) : CopyObject(result, true)
    }
  }[name]
}

function AsInnerValue(selector, Handler) {
  const name = `${AsName(selector)}_$inner$value`
  return {
    [name] : function (...args) {
      // this is $pulp
      const result = Handler.apply(this, args) // <<----------
      return (result === undefined) ? this : result
    }
  }[name]
}


function AsInnerLazyLoader(Selector, Handler) {
  const name = `${AsName(Selector)}_$inner$lazy`
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
//   const name = `${AsName(Selector)}_$outer$lazy`
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
  const name = `${AsName(selector)}_$super$fact`
  return {
    [name] : function (...args) {
      // this is $super. Need to use $pulp instead
      const $pulp  = this[$PULP]
      const result = Handler.apply($pulp, args) // <<----------
      var   $result

      if (result === undefined || result === $pulp)      { return result }
      // if (result === $inner[$RIND])                   { return result }
      if (typeof result !== "object" || result === null) { return result }
      if (result[IS_IMMUTABLE] || result.id != null)     { return result }
      return (($result = InterMap.get(result))) ?
        Copy($result, true) : CopyObject(result, true)
    }
  }[name]
}

function AsGenericSuper(selector, Handler) {
  const name = `${AsName(selector)}_$super$generic`
  return {
    [name] : function (...args) {
      // this is $super. Need to use $pulp instead
      return Handler.apply(this[$PULP], args) // <<----------
    }
  }[name]
}


function AsSuperLazyLoader(Selector, Handler) {
  const name = `${AsName(Selector)}_$super$lazy`
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
    AsInnerFact(selector, handler) : AsInnerValue(selector, handler)
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

const VALUE_METHOD = {
  id          : "VALUE_METHOD",
  isImmediate : false,
  outer       : AsOuterValue,
  inner       : AsInnerValue,
  super       : AsGenericSuper,
}

const BASIC_VALUE_METHOD = {
  id          : "BASIC_VALUE_METHOD",
  isImmediate : false,
  outer       : AsOuterBasicValue,
  inner       : PassThru,
  super       : AsGenericSuper,
}

const BASIC_SELF_METHOD = {
  id          : "BASIC_SELF_METHOD",
  isImmediate : false,
  outer       : AsOuterBasicSelf,
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

const VALUE_IMMEDIATE = {
  id          : "VALUE_IMMEDIATE",
  isImmediate : true,
  outer       : AsOuterValue,
  inner       : AsInnerValue,
  super       : AsInnerValue,
}

const BASIC_VALUE_IMMEDIATE = {
  id          : "BASIC_VALUE_IMMEDIATE",
  isImmediate : true,
  outer       : AsOuterBasicValue,
  inner       : PassThru,
  super       : PassThru,
}

const BASIC_SELF_IMMEDIATE = {
  id          : "BASIC_SELF_IMMEDIATE",
  isImmediate : true,
  outer       : AsOuterBasicSelf,
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
  outer       : AsOuterStandard,
  inner       : AsInnerStandard,
  super       : AsInnerStandard,
}

const SET_LOADER = {
  id          : "SET_LOADER",
  isImmediate : false,
}
