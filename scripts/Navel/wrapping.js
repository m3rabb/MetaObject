function AsTameFunc(Func) {
  const name = `${Func.name}_$tamed`
  const func = {
    [name] : function (...args) {
      const receiver =
        (this != null && this[$PROOF] === INNER_SECRET) ? this[$RIND] : this
      return Func.apply(receiver, args)
    }
  }[name]
  return SetImmutableFunc(func, TAMED_FUNC)
}


function AsBasicSetter(propertyName, setterName, mode) {
  const name = `${AsName(setterName)}_$set_${propertyName}`
  const PropertyName = (mode === MANDATORY_SETTER_METHOD) ?
     AsPropertySymbol(propertyName) : propertyName
  return {
    [name] : function (value) { this[PropertyName] = value }
  }[name]
}

function AsAssignmentSetter(propertyName, setterName, Assigner) {
  const name = `${AsName(setterName)}_$assignSet_${propertyName}`
  const PropertyName = AsPropertySymbol(propertyName)
  return {
    [name] : function (...args) {
      this[PropertyName] = Assigner.apply(this, args)
    }
  }[name]
}

function AsRetroactiveProperty(Property, Assigner) {
  const name = `${AsName(Property)}_$retro`
  return {
    [name] : function () {
      const _$receiver = this[$INNER]
      const value      = _$receiver[Property]
      const value$root = _$receiver[$ROOT][Property]

      if (_$receiver[IS_IMMUTABLE]) {
        // Object is already immutable
        if (value !== value$root) { return value }
        if (value === undefined)  { /* never been set */ }
        else if (HasOwnProperty.call(_$receiver, Property)) {
          // Fortunately, this (expensive) case is unlikely.to persist.
          return value
        }
        // Below, because $receiver is frosted, InSetProperty will only set _$receiver
      }

      DefineProperty(_$receiver, Property, InvisibleConfig)
      // if (Property[0] !== "_") {
      //   DefineProperty(_$receiver[$OUTER], Property, InvisibleConfig)
      // }
      return InSetProperty(_$receiver, Property, Assigner.call(this), this)
    }
  }[name]
}

function AsLazyProperty(Property, Assigner) {
  const name = `${AsName(Property)}_$lazy`
  return {
    [name] : function () {
      const _$receiver = this[$INNER]

      // Since receiver is immutable, execution defaults to being getter method.
      if (_$receiver[IS_IMMUTABLE]) { return Assigner.call(this) }

      DefineProperty(_$receiver, Property, InvisibleConfig)
      // if (Property[0] !== "_") {
      //   DefineProperty(_$receiver[$OUTER], Property, InvisibleConfig)
      // }
      return InSetProperty(_$receiver, Property, Assigner.call(this), this)
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
      const _$receiver = InterMap.get(this)
      var   barrier, useNewBarrier, changedTarget, _receiver, result, _$target
      var   outer, _$result

      if (_$receiver[IS_IMMUTABLE]) {
        barrier = _$receiver[$BARRIER]

        if ((useNewBarrier = barrier._$target)) {
          // Existing barrier is already in use, must generate another barrier and
          // _receiver, and then discard them.
          barrier   = new InnerBarrier()
          _receiver = new Proxy(_$receiver, barrier)
        }
        else {
          // Use the existing barrier, and then reset it.
          _receiver = _$receiver[$PULP]
        }

        barrier._$target = _$receiver // Marks barrier as in use
        result           = Handler.apply(_receiver, args) // <<----------
        _$target         = barrier._$target
        barrier._$target = null       // Marks barrier as not in use

        changedTarget = (_$target !== _$receiver)
        if (changedTarget && !useNewBarrier) { // Reset existing barrier

          delete barrier.get
          delete barrier.set
          delete barrier.deleteProperty
        }
        // Else, if didn't change targets handlers were not set. Or if new
        // barrier, it will be garbage collected, so no need to clean it up

        if (result === undefined || result === _receiver) {
          if (changedTarget) { _$target._setImmutable.call(_$target[$PULP]) }
          return _$target[$RIND]
        }
      }
      else {
        _receiver = _$receiver[$PULP]
        result    = Handler.apply(_receiver, args) // <<----------
        if (result === undefined) { return _$receiver[$RIND] }
        if (result === _receiver) { return _$receiver[$RIND] }
      }

      switch (typeof result) {
        default         :                                   return result
        case "function" :
          return result[$OUTER_WRAPPER] || result
          // Note: the following approach was overkill as $OUTER_WRAPPER are
          // never assigned to untrusted external functions.
          // return (outer && InterMap.get(outer) === OUTER_FUNC) ? outer : result
        case "object"   : if (result === null)            { return result }
          // if (result === _$receiver[$RIND])               { return result }
          if (result[IS_IMMUTABLE] || result.id != null)  { return result }
          return ((_$result = InterMap.get(result))) ?
            _$Copy(_$result, true)[$RIND] : CopyObject(result, true)
      }
    }
  }[name]
}

function AsOuterValue(property, Handler) {
  const name = `${AsName(property)}_$outer$value`
  return {
    [name] : function (...args) {
      const _$receiver = InterMap.get(this)
      var   barrier, useNewBarrier, changedTarget, _receiver, result, _$target

      if (_$receiver[IS_IMMUTABLE]) {
        barrier = _$receiver[$BARRIER]

        if ((useNewBarrier = barrier._$target)) {
          // Existing barrier is already in use, must generate another barrier and
          // _receiver, and then discard them.
          barrier   = new InnerBarrier()
          _receiver = new Proxy(_$receiver, barrier)
        }
        else {
          // Use the existing barrier, and then reset it.
          _receiver = _$receiver[$PULP]
        }

        barrier._$target = _$receiver
        result           = Handler.apply(_receiver, args) // <<----------
        _$target         = barrier._$target
        barrier._$target = null

        changedTarget = (_$target !== _$receiver)
        if (changedTarget && !useNewBarrier) {
          delete barrier.get
          delete barrier.set
          delete barrier.deleteProperty
        }

        if (result === undefined || result === _receiver) {
          if (changedTarget) { _$target._setImmutable.call(_$target[$PULP]) }
          return _$target[$RIND]
        }
      }
      else {
        _receiver = _$receiver[$PULP]
        result    = Handler.apply(_receiver, args) // <<----------
        if (result === undefined) { return _$receiver[$RIND] }
        if (result === _receiver) { return _$receiver[$RIND] }
      }

      return result
    }
  }[name]
}

function AsOuterSelf(property, Handler) {
  const name = `${AsName(property)}_$outer$self`
  return {
    [name] : function (...args) {
      const _$receiver = InterMap.get(this)
      var   barrier, useNewBarrier, changedTarget, _receiver, _$target

      if (_$receiver[IS_IMMUTABLE]) {
        barrier = _$receiver[$BARRIER]

        if ((useNewBarrier = barrier._$target)) {
          // Existing barrier is already in use, must generate another barrier and
          // _receiver, and then discard them.
          barrier   = new InnerBarrier()
          _receiver = new Proxy(_$receiver, barrier)
        }
        else {
          // Use the existing barrier, and then reset it.
          _receiver = _$receiver[$PULP]
        }

        barrier._$target = _$receiver
        Handler.apply(_receiver, args) // <<----------
        _$target         = barrier._$target
        barrier._$target = null

        changedTarget = (_$target !== _$receiver)
        if (changedTarget && !useNewBarrier) {
          delete barrier.get
          delete barrier.set
          delete barrier.deleteProperty
        }

        if (changedTarget) { _$target._setImmutable.call(_$target[$PULP]) }
        return _$target[$RIND]
      }

      Handler.apply(_$receiver[$PULP], args) // <<----------
      return _$receiver[$RIND]
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
      const _$receiver = InterMap.get(this)
      Handler.apply(_$receiver[$PULP], args) // <<----------
      return _$receiver[$RIND]
    }
  }[name]
}



function AsInnerFact(property, Handler) {
  const name = `${AsName(property)}_$inner$fact`
  return {
    [name] : function (...args) {
      const _receiver = this
      const result    = Handler.apply(_receiver, args) // <<----------
      var   _$result

      if (result === undefined || result === _receiver)  { return _receiver }
      // if (result === _$receiver[$RIND])               { return result    }
      if (typeof result !== "object" || result === null) { return result    }
      if (result[IS_IMMUTABLE] || result.id != null)     { return result    }
      return ((_$result = InterMap.get(result))) ?
        _$Copy(_$result, true) : CopyObject(result, true)
    }
  }[name]
}

function AsInnerValue(property, Handler) {
  const name = `${AsName(property)}_$inner$value`
  return {
    [name] : function (...args) {
      const _receiver = this
      const result    = Handler.apply(_receiver, args) // <<----------
      return (result === undefined) ? _receiver : result
    }
  }[name]
}

function AsInnerSelf(property, Handler) {
  const name = `${AsName(property)}_$inner$self`
  return {
    [name] : function (...args) {
      Handler.apply(this, args) // <<----------
      return this
    }
  }[name]
}



function AsSuperFact(property, Handler) {
  const name = `${AsName(property)}_$super$fact`
  return {
    [name] : function (...args) {
      // this is $super. Need to use _receiver instead
      const _receiver = this[$PULP]
      const result    = Handler.apply(_receiver, args) // <<----------
      var   _$result

      if (result === undefined || result === _receiver)  { return _receiver }
      // if (result === _$receiver[$RIND])               { return result    }
      if (typeof result !== "object" || result === null) { return result    }
      if (result[IS_IMMUTABLE] || result.id != null)     { return result    }
      return ((_$result = InterMap.get(result))) ?
        _$Copy(_$result, true) : CopyObject(result, true)
    }
  }[name]
}

function AsSuperValue(property, Handler) {
  const name = `${AsName(property)}_$inner$value`
  return {
    [name] : function (...args) {
      // this is $super. Need to use _receiver instead
      const _receiver = this[$PULP]
      const result    = Handler.apply(_receiver, args) // <<----------

      return (result === undefined) ? _receiver : result
    }
  }[name]
}

function AsSuperSelf(property, Handler) {
  const name = `${AsName(property)}_$inner$value`
  return {
    [name] : function (...args) {
      // this is $super. Need to use _receiver instead
      const _receiver = this[$PULP]
      Handler.apply(_receiver, args) // <<----------
      return _receiver
    }
  }[name]
}

function AsSuperBasic(property, Handler) {
  const name = `${AsName(property)}_$super$basic`
  return {
    [name] : function (...args) {
      // this is $super. Need to use _receiver instead
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

// BASIC_VALUE_METHOD and BASIC_SELF_METHOD methods must be methods that call
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

const IMMEDIATE_METHOD = {
  __proto__ : STANDARD_METHOD,
  id        : "IMMEDIATE_METHOD",
}

const DECLARATION = {
  id    : "DECLARATION",
}

const ASSIGNER = {
  id    : "ASSIGNER",
}

const SETTER_METHOD = {
  id    : "SETTER_METHOD",
  outer : AsOuterSelf,
  inner : AsInnerSelf,
  super : AsSuperSelf,
}

const MANDATORY_SETTER_METHOD = {
  __proto__ : SETTER_METHOD,
  id        : "MANDATORY_SETTER_METHOD",
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
