HandAxe(function (
  $BARRIER, $INNER, $OUTER, $OUTER_WRAPPER, $PULP, $RIND, $ROOT, IMMUTABLE,
  AsPropertySymbol, FreezeSurface, InnerBarrier, InterMap,
  InvisibleConfig, ValueAsName, _$Copy, _CopyObject,
  DefineProperty, IsPublicSelector, SetProperty,
  _Shared
) {
  "use strict"


  function AsOuter_targeting_fact(selector, Handler) {
    const name = `${ValueAsName(selector)}_$outer_targeting_fact`
    return ({
      [name] : function (...args) {
        var barrier, _receiver, _$target, result, _$result
        const _$receiver = InterMap.get(this)

        if (_$receiver[IMMUTABLE]) {
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

          if (result === _receiver) {
            return (_$target !== _$receiver) ?
              _$target._setImmutable.call(_$target[$PULP])[$RIND] :
              _$receiver[$RIND]
          }
        }
        else {
          _receiver = _$receiver[$PULP]
          result    = Handler.apply(_receiver, args) // <<----------
        }

        switch (typeof result) {
          default         :                                    return result
          case "function" :
            // Next line properly handlers contexts and types since they always have id.
                                     return result[$OUTER_WRAPPER] || result
              // Note: Revisit this if $OUTER_WRAPPER can hold NONE instead.
              // Note: the following approach was overkill as $OUTER_WRAPPER are
              // never assigned to untrusted external functions.
              // return (outer && InterMap.get(outer) === OUTER_FUNC) ? outer : result
          case "object"   : if (result === null)             { return result }
          if (result[IMMUTABLE] || result.id != null)        { return result }
          if (result === _receiver) { return _$Copy(_receiver[$INNER], true) }
            return ((_$result = InterMap.get(result))) ?
              _$Copy(_$result, true)[$RIND] : _CopyObject(result, true)
        }
      }
    })[name]
  }

  function AsOuter_targeting_self(selector, Handler) {
    const name = `${ValueAsName(selector)}_$outer_targeting_self`
    return ({
      [name] : function (...args) {
        const _$receiver = InterMap.get(this)
        var   barrier, _receiver, _$target

        if (_$receiver[IMMUTABLE]) {
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
    })[name]
  }

  function AsOuter_nontargeting_value(selector, Handler) {
    const name = `${ValueAsName(selector)}_$outer_nontargeting_value`
    return ({
      [name] : function (...args) {
        const _$receiver = InterMap.get(this)
        const  _receiver = _$receiver[$PULP]
        const   result   = Handler.apply(_receiver, args) // <<----------
        return (result === _receiver) ? _$receiver[$RIND] : result
      }
    })[name]
  }

  function AsInner_fact(selector, Handler) {
    const name = `${ValueAsName(selector)}_$inner_fact`
    return ({
      [name] : function (...args) {
        var _$result
        const _receiver = this
        const result    = Handler.apply(_receiver, args) // <<----------

        if (typeof result !== "object" || result === null) { return result }
        if (result[IMMUTABLE] || result.id != null)        { return result }
        if (result === _receiver) { return _$Copy(_receiver[$INNER], true) }
        return ((_$result = InterMap.get(result))) ?
          _$Copy(_$result, true) : _CopyObject(result, true)
      }
    })[name]
  }

  function AsInner_self(selector, Handler) {
    const name = `${ValueAsName(selector)}_$inner_self`
    return ({
      [name] : function (...args) {
        Handler.apply(this, args) // <<----------
        return this
      }
    })[name]
  }

  function AsInner_value(selector, Handler) {
    return Handler  // Simply passes thru!!!
  }


  function AsSuper_fact(selector, Handler) {
    const name = `${ValueAsName(selector)}_$super_fact`
    return ({
      [name] : function (...args) {
        var _$result
        const _receiver = this[$PULP]  // this is $super
        const result    = Handler.apply(_receiver, args) // <<----------

        if (typeof result !== "object" || result === null) { return result }
        if (result[IMMUTABLE] || result.id != null)        { return result }
        if (result === _receiver) { return _$Copy(_receiver[$INNER], true) }
        return ((_$result = InterMap.get(result))) ?
          _$Copy(_$result, true) : _CopyObject(result, true)
      }
    })[name]
  }

  function AsSuper_self(selector, Handler) {
    const name = `${ValueAsName(selector)}_$super_self`
    return ({
      [name] : function (...args) {
        // this is $super. Need to use _receiver instead
        const _receiver = this[$PULP]
        Handler.apply(_receiver, args) // <<----------
        return _receiver
      }
    })[name]
  }

  function AsSuper_value(selector, Handler) {
    const name = `${ValueAsName(selector)}_$super_value`
    return ({
      [name] : function (...args) {
        // this is $super. Need to use _receiver instead
        return Handler.apply(this[$PULP], args) // <<----------
      }
    })[name]
  }



  _Shared.FACT_METHOD = FreezeSurface({
    id          : "FACT_METHOD",
    outer       : AsOuter_targeting_fact,
    inner       : AsInner_fact,
    super       : AsSuper_fact,
    [IMMUTABLE] : true,
  })

  _Shared.SELF_METHOD = FreezeSurface({
    id          : "SELF_METHOD",
    outer       : AsOuter_targeting_self,
    inner       : AsInner_self,
    super       : AsSuper_self,
    [IMMUTABLE] : true,
  })

  _Shared.VALUE_METHOD = FreezeSurface({
    id          : "VALUE_METHOD",
    outer       : AsOuter_nontargeting_value,
    inner       : AsInner_value,
    super       : AsSuper_value,
    [IMMUTABLE] : true,
  })

  _Shared.SETTER_METHOD = FreezeSurface({
    __proto__   : _Shared.SELF_METHOD,
    id          : "SETTER_METHOD",
    [IMMUTABLE] : true,
  })

  const MANDATORY_SETTER_METHOD = FreezeSurface({
    __proto__   : _Shared.SETTER_METHOD,
    id          : "MANDATORY_SETTER_METHOD",
    [IMMUTABLE] : true,
  })
  _Shared.MANDATORY_SETTER_METHOD = MANDATORY_SETTER_METHOD

  _Shared.IMMEDIATE_METHOD = FreezeSurface({
    __proto__   : _Shared.FACT_METHOD,
    id          : "IMMEDIATE_METHOD",
    [IMMUTABLE] : true,
  })

  _Shared.DECLARATION = FreezeSurface({
    id          : "DECLARATION",
    [IMMUTABLE] : true,
  })

  _Shared.ASSIGNER = FreezeSurface({
    id          : "ASSIGNER",
    [IMMUTABLE] : true,
  })


  _Shared.AsBasicSetter = function (propertyName, setterName, isIndirect) {
    const PropertyName = isIndirect ?
      AsPropertySymbol(propertyName) : propertyName
    const displaySetterName   = ValueAsName(setterName)
    const displayPropertyName = ValueAsName(PropertyName)
    const name = `${displaySetterName}_$set_${displayPropertyName}`
    return ({
      [name] : function (value) { this[PropertyName] = value }
    })[name]
  }


  _Shared.AsAssignmentSetter = function (propertyName, setterName, isIndirect, Assigner) {
    const PropertyName = isIndirect ?
      AsPropertySymbol(propertyName) : propertyName
    const displaySetterName   = ValueAsName(setterName)
    const displayPropertyName = ValueAsName(PropertyName)
    const name = `${displaySetterName}_$assignSet_${displayPropertyName}`
    return ({
      [name] : function (...args) {
        this[PropertyName] = Assigner.apply(this, args)
      }
    })[name]
  }


  _Shared.AsRetroactiveProperty = function (Selector, Assigner) {
    const name     = `${ValueAsName(Selector)}_$retro`
    const IsPublic = IsPublicSelector(Selector)
    return ({
      [name] : function () {
        const _$receiver = this[$INNER]
        const   value    = Assigner.call(this)
        if (IsPublic) {
          DefineProperty(_$receiver[$OUTER], Selector, InvisibleConfig)
        }
        DefineProperty(_$receiver, Selector, InvisibleConfig)
        return SetProperty(_$receiver, Selector, value, IsPublic)
      }
    })[name]
  }

  _Shared.AsLazyProperty = function (Selector, Assigner) {
    const name     = `${ValueAsName(Selector)}_$lazy`
    const IsPublic = IsPublicSelector(Selector)
    return ({
      [name] : function () {
        const _$receiver = this[$INNER]
        const   value    = Assigner.call(this)
        // Since receiver is immutable, execution defaults to being getter method.
        if (_$receiver[IMMUTABLE]) { return value }
        if (IsPublic) {
          DefineProperty(_$receiver[$OUTER], Selector, InvisibleConfig)
        }
        DefineProperty(_$receiver, Selector, InvisibleConfig)
        return SetProperty(_$receiver, Selector, value, IsPublic)
      }
    })[name]
  }

})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
