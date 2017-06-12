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
  const name = `${AsName(setterName)}_$set$${PropertyName}`
  return {
    [name] : function (value) { this[PropertyName] = value }
  }[name]
}





// Method       outer                     inner          super
//              AsOuterFact               AsInnerFact    AsSuperFact
// Fact         self|immCopy|fact         _self|fact     _self|fact  ()
//
//              AsOuterValue              AsInnerValue   AsSuperValue
// Value        self|immCopy|value        _self|value    _self|value ()
//
//              AsOuterBasicValue         PassThru       AsSuperBasic
// Basic        value                     value          value       ()
//
//              AsOuterBasicSelf          PassThru       AsSuperBasic
// Basic        self                      _self          _self       ()
//
//
// Lazy         AsOuterLazyLoader    AsInnerLazyLoader   AsSuperLazyLoader
//
//
// Method
//   public  Fact
//   private Value



function AsOuterFact(property, Handler) {
  const name = `${AsName(property)}_$outer$fact`
  return {
    [name] : function (...args) {
      const $inner = InterMap.get(this)
      var   $pulp, barrier, result, $target, $result

      if ((barrier = $inner[$MAIN_BARRIER])) { // means $inner[IS_IMMUTABLE]
        if (barrier.$target) {
          barrier = new ImmutableInner()
          $pulp   = new Proxy($inner, barrier)
        } else {
          $pulp = $inner[$PULP]
        }
        barrier.$target = $inner
        result          = Handler.apply($pulp, args) // <<----------
        $target         = barrier.$target
        barrier.$target = null

        if (result === undefined || result === $pulp) {
          if ($target !== $inner) { $target[$PULP]._setImmutable() }
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

function AsOuterValue(property, Handler) {
  const name = `${AsName(property)}_$outer$value`
  return {
    [name] : function (...args) {
      const $inner = InterMap.get(this)
      var   $pulp, barrier, result, $target

      if ((barrier = $inner[$MAIN_BARRIER])) { // means $inner[IS_IMMUTABLE]
        if (barrier.$target) {
          barrier = new ImmutableInner()
          $pulp   = new Proxy($inner, barrier)
        } else {
          $pulp = $inner[$PULP]
        }
        barrier.$target = $inner
        result          = Handler.apply($pulp, args) // <<----------
        $target         = barrier.$target
        barrier.$target = null

        if (result === undefined || result === $pulp) {
          if ($target !== $inner) { $target[$PULP]._setImmutable() }
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

function AsOuterBasicValue(property, Handler) {
  const name = `${AsName(property)}_$outer$basicValue`
  return {
    [name] : function (...args) {
      return Handler.apply(InterMap.get(this)[$PULP], args) // <<----------
    }
  }[name]
}

function AsOuterBasicSelf(property, Handler) {
  const name = `${AsName(property)}_$outer$basicSelf`
  return {
    [name] : function (...args) {
      const $inner = InterMap.get(this)
      Handler.apply($inner[$PULP], args) // <<----------
      return $inner[$RIND]
    }
  }[name]
}

function AsOuterLazyLoader(Property, Handler) {
  const name = `${AsName(Property)}_$outer$lazy`
  return {
    [name] : function () {
      const $inner = InterMap.get(this)
      var   $pulp, barrier, result, $target, $result

      if ((barrier = $inner[$MAIN_BARRIER])) { // means $inner[IS_IMMUTABLE]
        if (barrier.$target) {
          barrier = new ImmutableInner()
          $pulp   = new Proxy($inner, barrier)
        } else {
          $pulp = $inner[$PULP]
        }
        barrier.$target = $inner
        result          = Handler.apply($pulp, args) // <<----------
        $target         = barrier.$target
        barrier.$target = null

        if (result === undefined || result === $pulp) {
          if ($target !== $inner) { $target[$PULP]._setImmutable() }
          return $target[$RIND]
        }

        // if (result === $inner[$RIND])                   { return result }
        if (typeof result !== "object" || result === null) { return result }
        if (result[IS_IMMUTABLE] || result.id != null)     { return result }
        return (($result = InterMap.get(result))) ?
          Copy($result, true)[$RIND] : CopyObject(result, true)
      }

      $pulp = $inner[$PULP]
      DefineProperty($inner, Property, InvisibleConfiguration)
      return ($pulp[Property] = Handler.call($pulp)) // <<----------
    }
  }[name]
}


function AsInnerFact(property, Handler) {
  const name = `${AsName(property)}_$inner$fact`
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

function AsInnerValue(property, Handler) {
  const name = `${AsName(property)}_$inner$value`
  return {
    [name] : function (...args) {
      // this is $pulp
      const result = Handler.apply(this, args) // <<----------
      return (result === undefined) ? this : result
    }
  }[name]
}


function AsInnerLazyLoader(Property, Handler) {
  const name = `${AsName(Property)}_$inner$lazy`
  return {
    [name] : function () {
      // this is $pulp
      DefineProperty(this[$INNER], Property, InvisibleConfiguration)
      return (this[Property] = Handler.call(this)) // <<----------
    }
  }[name]
}



function AsSuperFact(property, Handler) {
  const name = `${AsName(property)}_$super$fact`
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

function AsSuperValue(property, Handler) {
  const name = `${AsName(property)}_$inner$value`
  return {
    [name] : function (...args) {
      // this is $super. Need to use $pulp instead
      const $pulp  = this[$PULP]
      const result = Handler.apply($pulp, args) // <<----------
      return (result === undefined) ? $pulp : result
    }
  }[name]
}

function AsSuperBasic(property, Handler) {
  const name = `${AsName(property)}_$super$basic`
  return {
    [name] : function (...args) {
      // this is $super. Need to use $pulp instead
      return Handler.apply(this[$PULP], args) // <<----------
    }
  }[name]
}


function AsSuperLazyLoader(Property, Handler) {
  const name = `${AsName(Property)}_$super$lazy`
  return {
    [name] : function () {
      // this is $super. Need to use $pulp instead
      const $inner = this[$INNER]
      const $pulp  = $inner[$PULP]

      DefineProperty($inner, Property, InvisibleConfiguration)
      return ($pulp[Property] = Handler.call($pulp)) // <<----------
    }
  }[name]
}


function PassThru(property, handler) {
  return handler
}

function AsOuterStandard(property, handler, isPublic) {
  return isPublic ?
    AsOuterFact(property, handler) : AsOuterValue(property, handler)
}

function AsInnerStandard(property, handler, isPublic) {
  return isPublic ?
    AsInnerFact(property, handler) : AsInnerValue(property, handler)
}

function AsSuperStandard(property, handler, isPublic) {
  return isPublic ?
    AsSuperFact(property, handler) : AsSuperBasic(property, handler)
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
  super       : AsSuperValue,
}

const BASIC_VALUE_METHOD = {
  id          : "BASIC_VALUE_METHOD",
  isImmediate : false,
  outer       : AsOuterBasicValue,
  inner       : PassThru,
  super       : AsSuperBasic,
}

const BASIC_SELF_METHOD = {
  id          : "BASIC_SELF_METHOD",
  isImmediate : false,
  outer       : AsOuterBasicSelf,
  inner       : PassThru,
  super       : AsSuperBasic,
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
