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
  const name = `${AsName(setterName)}_$set_${PropertyName}`
  return {
    [name] : function (value) { this[PropertyName] = value }
  }[name]
}

function AsRetroactiveProperty(Property, Assigner) {
  const name = `${AsName(Property)}_$retro`
  return {
    [name] : function () {
      const $inner     = this[$INNER]
      const value      = $inner[Property]
      const value$root = $inner[$ROOT][Property]

      if ($inner[IS_IMMUTABLE]) {
        // Object is already immutable
        if (value !== value$root) { return value }
        if (value === undefined)  { /* never been set */ }
        else if (HasOwnProperty.call($inner, Property)) {
          // Fortunately, this (expensive) case is unlikely.to persist.
          return value
        }
        // Below, because $outer is frosted, InSetProperty will onl set $inner
      }

      DefineProperty($inner, Property, InvisibleConfig)
      return InSetProperty($inner, Property, Assigner.call(this), this)
    }
  }[name]
}

function AsLazyProperty(Property, Assigner) {
  const name = `${AsName(Property)}_$lazy`
  return {
    [name] : function () {
      const $inner = this[$INNER]

      if ($inner[IS_IMMUTABLE]) {
        // Object is already immutable, so method defaults to being a
        // regular getter method.
        return Assigner.call(this)
      }

      DefineProperty($inner, Property, InvisibleConfig)
      return InSetProperty($inner, Property, Assigner.call(this), this)
    }
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
//
// Method
//   public  Fact
//   private Value



function AsOuterFact(property, Handler) {
  const name = `${AsName(property)}_$outer$fact`
  return {
    [name] : function (...args) {
      const $inner = InterMap.get(this)
      var   barrier, useNewBarrier, hasNewTarget, $pulp, result, $target
      var   outer, $result

      if ($inner[IS_IMMUTABLE]) {
        barrier = $inner[$BARRIER]

        if ((useNewBarrier = barrier.$target)) {
          // Existing barrier is already in use, must generate another barrier and
          // $pulp, and then discard them.
          barrier = new Inner()
          $pulp   = new Proxy($inner, barrier)
        }
        else {
          // Use the existing barrier, and then reset it.
          $pulp = $inner[$PULP]
        }

        barrier.$target = $inner
        result          = Handler.apply($pulp, args) // <<----------
        $target         = barrier.$target
        barrier.$target = null

        if ((hasNewTarget = ($target !== $inner)) && !useNewBarrier) {
          delete barrier.get
          delete barrier.set
          delete barrier.deleteProperty
        }

        if (result === undefined || result === $pulp) {
          if (hasNewTarget) { $target._setImmutable.call($target[$PULP]) }
          return $target[$RIND]
        }
      }
      else {
        $pulp = $inner[$PULP]
        result = Handler.apply($pulp, args) // <<----------
        if (result === undefined || result === $pulp) { return $inner[$RIND] }
      }

      switch (typeof result) {
        default         :                                  return result
        case "function" :
          outer = result[$OUTER_WRAPPER]
          return (outer && InterMap.get(outer) === WRAPPER_FUNC) ?
                                                          outer : result
        case "object"   : if (result === null)           { return result }
          // if (result === $inner[$RIND])               { return result }
          if (result[IS_IMMUTABLE] || result.id != null) { return result }
          return (($result = InterMap.get(result))) ?
            $Copy($result, true)[$RIND] : CopyObject(result, true)
      }
    }
  }[name]
}

function AsOuterValue(property, Handler) {
  const name = `${AsName(property)}_$outer$value`
  return {
    [name] : function (...args) {
      const $inner = InterMap.get(this)
      var   barrier, useNewBarrier, hasNewTarget, $pulp, result, $target

      if ($inner[IS_IMMUTABLE]) {
        barrier = $inner[$BARRIER]

        if ((useNewBarrier = barrier.$target)) {
          // Existing barrier is already in use, must generate another barrier and
          // $pulp, and then discard them.
          barrier = new Inner()
          $pulp   = new Proxy($inner, barrier)
        }
        else {
          // Use the existing barrier, and then reset it.
          $pulp = $inner[$PULP]
        }

        barrier.$target = $inner
        result          = Handler.apply($pulp, args) // <<----------
        $target         = barrier.$target
        barrier.$target = null

        if ((hasNewTarget = ($target !== $inner)) && !useNewBarrier) {
          delete barrier.get
          delete barrier.set
          delete barrier.deleteProperty
        }

        if (result === undefined || result === $pulp) {
          if (hasNewTarget) { $target._setImmutable.call($target[$PULP]) }
          return $target[$RIND]
        }
      }
      else {
        $pulp = $inner[$PULP]
        result = Handler.apply($pulp, args) // <<----------
        if (result === undefined || result === $pulp) { return $inner[$RIND] }
      }

      return result
    }
  }[name]
}

function AsOuterSelf(property, Handler) {
  const name = `${AsName(property)}_$outer$self`
  return {
    [name] : function (...args) {
      const $inner = InterMap.get(this)
      var   barrier, useNewBarrier, hasNewTarget, $pulp, $target

      if ($inner[IS_IMMUTABLE]) {
        barrier = $inner[$BARRIER]

        if ((useNewBarrier = barrier.$target)) {
          // Existing barrier is already in use, must generate another barrier and
          // $pulp, and then discard them.
          barrier = new Inner()
          $pulp   = new Proxy($inner, barrier)
        }
        else {
          // Use the existing barrier, and then reset it.
          $pulp = $inner[$PULP]
        }

        barrier.$target = $inner
        Handler.apply($pulp, args) // <<----------
        $target         = barrier.$target
        barrier.$target = null

        if ((hasNewTarget = ($target !== $inner)) && !useNewBarrier) {
          delete barrier.get
          delete barrier.set
          delete barrier.deleteProperty
        }

        if (hasNewTarget) { $target._setImmutable.call($target[$PULP]) }
        return $target[$RIND]
      }

      Handler.apply($inner[$PULP], args) // <<----------
      return $inner[$RIND]
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



function AsInnerFact(property, Handler) {
  const name = `${AsName(property)}_$inner$fact`
  return {
    [name] : function (...args) {
      const $pulp = this
      const result = Handler.apply($pulp, args) // <<----------
      var   $result

      if (result === undefined || result === $pulp)      { return $pulp  }
      // if (result === $inner[$RIND])                   { return result }
      if (typeof result !== "object" || result === null) { return result }
      if (result[IS_IMMUTABLE] || result.id != null)     { return result }
      return (($result = InterMap.get(result))) ?
        $Copy($result, true) : CopyObject(result, true)
    }
  }[name]
}

function AsInnerValue(property, Handler) {
  const name = `${AsName(property)}_$inner$value`
  return {
    [name] : function (...args) {
      const $pulp = this
      const result = Handler.apply($pulp, args) // <<----------
      return (result === undefined) ? $pulp : result
    }
  }[name]
}

function AsInnerSelf(property, Handler) {
  const name = `${AsName(property)}_$inner$self`
  return {
    [name] : function (...args) {
      const $pulp = this
      Handler.apply($pulp, args) // <<----------
      return $pulp
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

      if (result === undefined || result === $pulp)      { return $pulp  }
      // if (result === $inner[$RIND])                   { return result }
      if (typeof result !== "object" || result === null) { return result }
      if (result[IS_IMMUTABLE] || result.id != null)     { return result }
      return (($result = InterMap.get(result))) ?
        $Copy($result, true) : CopyObject(result, true)
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

function AsSuperSelf(property, Handler) {
  const name = `${AsName(property)}_$inner$value`
  return {
    [name] : function (...args) {
      // this is $super. Need to use $pulp instead
      const $pulp  = this[$PULP]
      Handler.apply($pulp, args) // <<----------
      return $pulp
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
    AsSuperFact(property, handler) : AsSuperValue(property, handler)
}



const VALUE_METHOD = {
  id    : "VALUE_METHOD",
  outer : AsOuterValue,
  inner : AsInnerValue,
  super : AsSuperValue,
}

// BASIC_VALUE_METHOD and BASIC_SELF_METHOD methods must are methods that call
// no other methods, except other basic methods.
const BASIC_VALUE_METHOD = {
  id    : "BASIC_VALUE_METHOD",
  outer : AsOuterBasicValue,
  inner : PassThru,
  super : AsSuperBasic,
}

const BASIC_SELF_METHOD = {
  id    : "BASIC_SELF_METHOD",
  outer : AsOuterBasicSelf,
  inner : PassThru,
  super : AsSuperBasic,
}


const STANDARD_METHOD = {
  id    : "STANDARD_METHOD",
  outer : AsOuterStandard,
  inner : AsInnerStandard,
  super : AsSuperStandard,
}

const DECLARATION = {
  id    : "DECLARATION",
}

const ASSIGNER = {
  id    : "ASSIGNER",
}

const SETTER = {
  id    : "SETTER",
  outer : AsOuterSelf,
  inner : AsInnerSelf,
  super : AsSuperSelf,
}

const MANDATORY = {
  __proto__ : SETTER,
  id        : "MANDATORY",
}




// const ANSWERS_PRIMITIVE = VALUE_METHOD
// const ANSWERS_NULL      = VALUE_METHOD
// const ANSWERS_BOOLEAN   = VALUE_METHOD
// const ANSWERS_NUMBER    = VALUE_METHOD
// const ANSWERS_STRING    = VALUE_METHOD
// const ANSWERS_FUNC      = VALUE_METHOD
//
// const ANSWERS_SELF      = VALUE_METHOD
//
// const ANSWERS_MUTABLE   = VALUE_METHOD
// const ANSWERS_IMMUTABLE = VALUE_METHOD
// const ANSWERS_FACT      = VALUE_METHOD
