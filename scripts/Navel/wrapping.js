Tranya(function (
  $BARRIER, $INNER, $OUTER, $OUTER_WRAPPER, $PULP, $RIND, $ROOT, IS_IMMUTABLE,
  AsName, AsPropertySymbol, ObjectCopy, _HasOwn, InnerBarrier, InterMap,
  InvisibleConfig, _$Copy,
  DefineProperty, InSetProperty,
  _Shared
) {
  "use strict"




  // Method       outer                     inner          super
  //              AsTargetingAnsweringSelfOrFact               AsInnerFact    AsSuperFact
  // Fact         self|immCopy|fact         _self|fact     _self|fact  ()
  //
  //              AsTargetingAnsweringSelfOrValue              AsInnerValue   AsSuperValue
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



  function AsOuter_targeting_fact(property, Handler) {
    const name = `${AsName(property)}_$outer_targeting_fact`
    return {
      [name] : function (...args) {
        var barrier, _receiver, _$target, result, _$result
        const _$receiver = InterMap.get(this)

        if (_$receiver[IS_IMMUTABLE]) {
          barrier = _$receiver[$BARRIER]

          if (barrier.isInUse) {
            // Existing barrier is already in use, must generate another barrier and
            // _receiver, and then discard them.
            barrier   = new InnerBarrier(_$receiver)
            _receiver = new Proxy(_$receiver, barrier)
          }
          else {
            // Use the existing barrier, and then reset it.
            _receiver = _$receiver[$PULP]
          }

          barrier.isInUse  = true
          result           = Handler.apply(_receiver, args) // <<----------
          _$target         = barrier._$target
          barrier._$target = _$receiver
          barrier.isInUse  = false

          if (result === undefined || result === _receiver) {
            return (_$target !== _$receiver) ?
              _$target._setImmutable.call(_$target[$PULP])[$RIND] :
              _$receiver[$RIND]
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
          // Next line properly handlers contexts and types since they always have id.
          return result[$OUTER_WRAPPER] || result
            // Note: Revisit this if $OUTER_WRAPPER can hold NONE instead.
            // Note: the following approach was overkill as $OUTER_WRAPPER are
            // never assigned to untrusted external functions.
            // return (outer && InterMap.get(outer) === OUTER_FUNC) ? outer : result
          case "object"   : if (result === null)            { return result }
            // if (result === _$receiver[$RIND])               { return result }
            if (result[IS_IMMUTABLE] || result.id != null)  { return result }
            return ((_$result = InterMap.get(result))) ?
              _$Copy(_$result, true)[$RIND] : ObjectCopy(result, true)
        }
      }
    }[name]
  }

  function AsOuter_targeting_value(property, Handler) {
    const name = `${AsName(property)}_$outer_targeting_value`
    return {
      [name] : function (...args) {
        var barrier, _receiver, result, _$target
        const _$receiver = InterMap.get(this)

        if (_$receiver[IS_IMMUTABLE]) {
          barrier = _$receiver[$BARRIER]

          if (barrier.isInUse) {
            // Existing barrier is already in use, must generate another barrier and
            // _receiver, and then discard them.
            barrier   = new InnerBarrier(_$receiver)
            _receiver = new Proxy(_$receiver, barrier)
          }
          else {
            // Use the existing barrier, and then reset it.
            _receiver = _$receiver[$PULP]
          }

          barrier.isInUse  = true
          result           = Handler.apply(_receiver, args) // <<----------
          _$target         = barrier._$target
          barrier._$target = _$receiver
          barrier.isInUse  = false

          if (result === undefined || result === _receiver) {
            return (_$target !== _$receiver) ?
              _$target._setImmutable.call(_$target[$PULP])[$RIND] :
              _$receiver[$RIND]
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

  function AsOuter_targeting_self(property, Handler) {
    const name = `${AsName(property)}_$outer_targeting_self`
    return {
      [name] : function (...args) {
        const _$receiver = InterMap.get(this)
        var   barrier, _receiver, _$target

        if (_$receiver[IS_IMMUTABLE]) {
          barrier = _$receiver[$BARRIER]

          if (barrier.isInUse) {
            // Existing barrier is already in use, must generate another barrier and
            // _receiver, and then discard them.
            barrier   = new InnerBarrier(_$receiver)
            _receiver = new Proxy(_$receiver, barrier)
          }
          else {
            // Use the existing barrier, and then reset it.
            _receiver = _$receiver[$PULP]
          }

          barrier.isInUse  = true
          Handler.apply(_receiver, args) // <<----------
          _$target         = barrier._$target
          barrier._$target = _$receiver
          barrier.isInUse  = false

          return (_$target !== _$receiver) ?
            _$target._setImmutable.call(_$target[$PULP])[$RIND] :
            _$receiver[$RIND]
        }

        Handler.apply(_$receiver[$PULP], args) // <<----------
        return _$receiver[$RIND]
      }
    }[name]
  }

  function AsOuter_noncopying_value(property, Handler) {
    const name = `${AsName(property)}_$outer_noncopying_value`
    return {
      [name] : function (...args) {
        const result = Handler.apply(InterMap.get(this)[$PULP], args) // <<----------
        return (result === undefined) ? this : result
      }
    }[name]
  }

  function AsOuter_noncopying_self(property, Handler) {
    const name = `${AsName(property)}_$outer_noncopying_self`
    return {
      [name] : function (...args) {
        Handler.apply(InterMap.get(this)[$PULP], args) // <<----------
        return this
      }
    }[name]
  }

  function AsOuter_passthru(property, Handler) {
    const name = `${AsName(property)}_$outer_passthru`
    return {
      [name] : function (...args) {
        return Handler.apply(InterMap.get(this)[$PULP], args) // <<----------
      }
    }[name]
  }

  function AsInner_fact(property, Handler) {
    const name = `${AsName(property)}_$inner_fact`
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
          _$Copy(_$result, true) : ObjectCopy(result, true)
      }
    }[name]
  }

  function AsInner_value(property, Handler) {
    const name = `${AsName(property)}_$inner_value`
    return {
      [name] : function (...args) {
        const result = Handler.apply(this, args) // <<----------
        return (result === undefined) ? this : result
      }
    }[name]
  }

  function AsInner_self(property, Handler) {
    const name = `${AsName(property)}_inner_self`
    return {
      [name] : function (...args) {
        Handler.apply(this, args) // <<----------
        return this
      }
    }[name]
  }

  function AsInner_passthru(property, Handler) {
    return Handler
  }


  function AsSuper_fact(property, Handler) {
    const name = `${AsName(property)}_$super_fact`
    return {
      [name] : function (...args) {
        var   _$result
        // this is $super. Need to use _receiver instead
        const _receiver = this[$PULP]
        const result    = Handler.apply(_receiver, args) // <<----------

        if (result === undefined || result === _receiver)  { return _receiver }
        // if (result === _$receiver[$RIND])               { return result    }
        if (typeof result !== "object" || result === null) { return result    }
        if (result[IS_IMMUTABLE] || result.id != null)     { return result    }
        return ((_$result = InterMap.get(result))) ?
          _$Copy(_$result, true) : ObjectCopy(result, true)
      }
    }[name]
  }

  function AsSuper_value(property, Handler) {
    const name = `${AsName(property)}_$super_value`
    return {
      [name] : function (...args) {
        // this is $super. Need to use _receiver instead
        const _receiver = this[$PULP]
        const result    = Handler.apply(_receiver, args) // <<----------
        return (result === undefined) ? _receiver : result
      }
    }[name]
  }

  function AsSuper_self(property, Handler) {
    const name = `${AsName(property)}_$super_self`
    return {
      [name] : function (...args) {
        // this is $super. Need to use _receiver instead
        const _receiver = this[$PULP]
        Handler.apply(_receiver, args) // <<----------
        return _receiver
      }
    }[name]
  }

  function AsSuper_passthru(property, Handler) {
    const name = `${AsName(property)}_$super_passthru`
    return {
      [name] : function (...args) {
        // this is $super. Need to use _receiver instead
        return Handler.apply(this[$PULP], args) // <<----------
      }
    }[name]
  }



  function AsOuterStandard(property, handler, isPublic) {
    return isPublic ?
      AsOuter_targeting_fact(property, handler) :
      AsOuter_targeting_value(property, handler)
      // false condition should be NONE instead!!!
  }

  function AsInnerStandard(property, handler, isPublic) {
    return isPublic ?
      AsInner_fact(property, handler) :
      AsInner_value(property, handler)
  }

  function AsSuperStandard(property, handler, isPublic) {
    return isPublic ?
      AsSuper_fact(property, handler) :
      AsSuper_value(property, handler)
  }


  _Shared.STANDARD_METHOD = {
    id    : "STANDARD_METHOD",
    outer : AsOuterStandard,
    inner : AsInnerStandard,
    super : AsSuperStandard,
  }

  _Shared.SELF_METHOD = {
    id    : "SELF_METHOD",
    outer : AsOuter_targeting_self,
    inner : AsInner_self,
    super : AsSuper_self,
  }

  _Shared.VALUE_METHOD = {
    id    : "VALUE_METHOD",
    outer : AsOuter_noncopying_value,
    inner : AsInner_passthru,
    super : AsSuper_passthru,
  }

  _Shared.PASS_THRU_METHOD = {
    id    : "PASS_THRU_METHOD",
    outer : AsOuter_passthru,
    inner : AsInner_passthru,
    super : AsSuper_passthru,
  }

  _Shared.TRUSTED_VALUE_METHOD = _Shared.VALUE_METHOD



  // IDEMPOT_VALUE_METHOD and IDEMPOT_SELF_METHOD must be methods that can
  // NEVER can any change to the receiver and
  // that call no other methods, except other idempot methods.
  _Shared.IDEMPOT_VALUE_METHOD = {
    id    : "IDEMPOT_VALUE_METHOD",
    outer : AsOuter_passthru,
    inner : AsInner_passthru,
    super : AsSuper_passthru,
  }

  _Shared.IDEMPOT_SELF_METHOD = {
    id    : "IDEMPOT_SELF_METHOD",
    outer : AsOuter_noncopying_self,
    inner : AsInner_self,
    super : AsSuper_self,
  }


  _Shared.SETTER_METHOD = {
    id    : "SETTER_METHOD",
    outer : AsOuter_targeting_self,
    inner : AsInner_self,
    super : AsSuper_self,
  }

  const MANDATORY_SETTER_METHOD = {
    __proto__ : _Shared.SETTER_METHOD,
    id        : "MANDATORY_SETTER_METHOD",
  }

  _Shared.MANDATORY_SETTER_METHOD = MANDATORY_SETTER_METHOD


  _Shared.IMMEDIATE_METHOD = {
    __proto__ : _Shared.STANDARD_METHOD,
    id        : "IMMEDIATE_METHOD",
  }

  _Shared.DECLARATION = {
    id    : "DECLARATION",
  }

  _Shared.ASSIGNER = {
    id    : "ASSIGNER",
  }


  _Shared.AsBasicSetter = function (propertyName, setterName, mode) {
    const name = `${AsName(setterName)}_$set_${propertyName}`
    const PropertyName = (mode === MANDATORY_SETTER_METHOD) ?
       AsPropertySymbol(propertyName) : propertyName
    return {
      [name] : function (value) { this[PropertyName] = value }
    }[name]
  }


  _Shared.AsAssignmentSetter = function (propertyName, setterName, Assigner) {
    const name = `${AsName(setterName)}_$assignSet_${propertyName}`
    const PropertyName = AsPropertySymbol(propertyName)
    return {
      [name] : function (...args) {
        this[PropertyName] = Assigner.apply(this, args)
      }
    }[name]
  }


  _Shared.AsRetroactiveProperty = function (Property, Assigner) {
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
        return InSetProperty(_$receiver, Property, Assigner.call(this))
      }
    }[name]
  }

  _Shared.AsLazyProperty = function (Property, Assigner) {
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
        return InSetProperty(_$receiver, Property, Assigner.call(this))
      }
    }[name]
  }

})


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
