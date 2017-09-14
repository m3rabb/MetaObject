ObjectSauce(function (
  $BARRIER, $INNER, $OUTER, $OUTER_WRAPPER, $PULP, $RIND, $ROOT, IS_IMMUTABLE,
  AsName, AsPropertySymbol, CopyObject, _HasOwn, InnerBarrier, InterMap,
  InvisibleConfig, _$Copy,
  DefineProperty, InSetProperty,
  _OSauce
) {
  "use strict"


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
          else if (_HasOwn.call(_$receiver, Property)) {
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
        var barrier, useNewBarrier, _receiver, changedTarget,
            _$target, result, _$result
        const _$receiver = InterMap.get(this)

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


  _OSauce.AsRetroactiveProperty = AsRetroactiveProperty
  _OSauce.AsLazyProperty        = AsLazyProperty


  _OSauce.TRUSTED_VALUE_METHOD = {
    id    : "TRUSTED_VALUE_METHOD",
    outer : AsOuterValue,
    inner : AsInnerValue,
    super : AsSuperValue,
  }

  // IDEMPOT_VALUE_METHOD and IDEMPOT_SELF_METHOD must be methods that can
  // NEVER can any change to the receiver and
  // that call no other methods, except other idempot methods.
  _OSauce.IDEMPOT_VALUE_METHOD = {
    id    : "IDEMPOT_VALUE_METHOD",
    outer : AsOuterBasicValue,
    inner : PassThru,
    super : AsSuperBasic,
  }

  _OSauce.IDEMPOT_SELF_METHOD = {
    id    : "IDEMPOT_SELF_METHOD",
    outer : AsOuterBasicSelf,
    inner : PassThru,
    super : AsSuperBasic,
  }


  _OSauce.STANDARD_METHOD = {
    id    : "STANDARD_METHOD",
    outer : AsOuterStandard,
    inner : AsInnerStandard,
    super : AsSuperStandard,
  }

  _OSauce.IMMEDIATE_METHOD = {
    __proto__ : _OSauce.STANDARD_METHOD,
    id        : "IMMEDIATE_METHOD",
  }

  _OSauce.DECLARATION = {
    id    : "DECLARATION",
  }

  _OSauce.ASSIGNER = {
    id    : "ASSIGNER",
  }

  _OSauce.SETTER_METHOD = {
    id    : "SETTER_METHOD",
    outer : AsOuterSelf,
    inner : AsInnerSelf,
    super : AsSuperSelf,
  }

  const MANDATORY_SETTER_METHOD = {
    __proto__ : _OSauce.SETTER_METHOD,
    id        : "MANDATORY_SETTER_METHOD",
  }

  _OSauce.MANDATORY_SETTER_METHOD = MANDATORY_SETTER_METHOD

  _OSauce.AsBasicSetter = function (propertyName, setterName, mode) {
    const name = `${AsName(setterName)}_$set_${propertyName}`
    const PropertyName = (mode === MANDATORY_SETTER_METHOD) ?
       AsPropertySymbol(propertyName) : propertyName
    return {
      [name] : function (value) { this[PropertyName] = value }
    }[name]
  }


  _OSauce.AsAssignmentSetter = function (propertyName, setterName, Assigner) {
    const name = `${AsName(setterName)}_$assignSet_${propertyName}`
    const PropertyName = AsPropertySymbol(propertyName)
    return {
      [name] : function (...args) {
        this[PropertyName] = Assigner.apply(this, args)
      }
    }[name]
  }

})

// NOTE: Change the 'As' method names!!!!
// NOTE: new New methods need to be added using addMutableValueMethod


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


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
