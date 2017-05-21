

// UNTESTED
function SafeFunc(OriginalFunc) {
  return function $wrappedOutsideFunc(...args) {
    const receiver =
      (this != null && this[$SECRET] === $INNER) ? this[$RIND] : this
    return OriginalFunc.apply(receiver, ...args)
  }
}


function AsOuterFactMethod(selector, handler) {
  const namedHandler = FunctionNamer.make(selector, ``)
  return BeFrozenFunc(namedHandler)
}

function AsOuterValueMethod(selector, handler) {
  const namedHandler = FunctionNamer.make(selector,
  ``)
  return BeFrozenFunc(namedHandler)
}

function AsOuterSafeMethod(selector, handler) {
  const namedHandler = FunctionNamer.make(selector,
  `return osm_@name@(...args) {
    let $inner = InterMap.get(this)
    let $pulp  = $inner[$PULP]
    let result = handler.apply($pulp, args)
    return (result === $pulp) ? $inner[$RIND] : result
  }`)
  return BeFrozenFunc(namedHandler)
}



function AsOuterFactGetter(selector, handler) {
  const namedHandler = FunctionNamer.make(selector,
  ``)
  return BeFrozenFunc(namedHandler)
}

function AsOuterValueGetter(selector, handler) {
  const namedHandler = FunctionNamer.make(selector,
  ``)
  return BeFrozenFunc(namedHandler)
}

function AsOuterSafeGetter(selector, handler) {
  const namedHandler = FunctionNamer.make(selector,
  `return osg_@name@() {
    let $inner = InterMap.get(this[$RIND])
    let $pulp  = $inner[$PULP]
    let result = handler.call($pulp)
    return (result === $pulp) ? $inner[$RIND] : result
  }`)
  return BeFrozenFunc(namedHandler)
}





function AsInnerFactMethod(selector, handler) {
  const namedHandler = FunctionNamer.make(selector,
  `return ifm_@name@(...args) {
    let $pulp = this
    let result = handler.apply($pulp, args)

    if (result === $pulp)                              { return result }
    if (typeof result !== "object" || result === null) { return result }
    if (result[IS_IMMUTABLE] || result.id != null)     { return result }
    return ((result$inner = InterMap.get(result))) ?
      result$inner[$COPY](true).$ : CopyObject(result, true)
  }`)
  return BeFrozenFunc(namedHandler)
}

function AsInnerValueMethod(selector, handler) {
  // const namedHandler = FunctionNamer.make(selector,
  // `return ivm_@name@(...args) {
  //   let $pulp = this
  //   return handler.apply($pulp, args)
  // })`
  return BeFrozenFunc(handler)
}

function AsInnerSafeMethod(selector, handler) {
  // const namedHandler = FunctionNamer.make(selector,
  // `return ism_@name@(...args) {
  //   let $pulp = this
  //   return handler.apply($pulp, args)
  // })`
  return BeFrozenFunc(handler)
}





function AsInnerFactGetter(selector, handler) {
  const namedHandler = FunctionNamer.make(selector,
  `return ifg_@name@() {
    let $pulp = this[$PULP]
    let result = handler.call($pulp)

    if (result === $pulp)                              { return result }
    if (typeof result !== "object" || result === null) { return result }
    if (result[IS_IMMUTABLE] || result.id != null)     { return result }
    return ((result$inner = InterMap.get(result))) ?
      result$inner[$COPY](true).$ : CopyObject(result, true)
  }`)
  return BeFrozenFunc(namedHandler)
}


function AsInnerValueGetter(selector, handler) {
  // const namedHandler = FunctionNamer.make(selector,
  // `return ivg_@name@(...args) {
  //   let $pulp = this[$PULP]  // CHECK IF NECESARY!!!
  //   return handler.apply($pulp, args)
  // })`
  return BeFrozenFunc(handler)
}

function AsInnerSafeGetter(selector, handler) {
  // const namedHandler = FunctionNamer.make(selector,
  // `return isg_@name@(...args) {
  //   let $pulp = this[$PULP]  // CHECK IF NECESARY!!!
  //   return handler.apply($pulp, args)
  // })`
  return BeFrozenFunc(handler)
}





function AsOuterFactLazyLoader(selector, handler) {
  const namedHandler = FunctionNamer.make(selector,
  ``)
  return BeFrozenFunc(namedHandler)
}

function AsInnerFactLazyLoader(selector, handler) {
  const namedHandler = FunctionNamer.make(selector,
  `return ifl_@name@() {
    const $pulp = this[$PULP]
    DefineProperty(this[$INNER], @name@, InvisibleConfiguration)
    $pulp[@name@] = handler.call($pulp)
    return $inner[@name@]
  }`)
  return BeFrozenFunc(namedHandler)
}



$Inate.addLazyProperty(function _super() {
  return new Proxy(this[$INNER], SuperPorosity)
})

Method.addLazyProperty($SUPER, function () {
  return new Proxy(this.handler, SuperMethodPorosity)
})

function AsSuperFactMethod(selector, handler) {
  const namedHandler = FunctionNamer.make(selector,
  `return sfm_@name@(...args) {
    let $pulp = this[$PULP]
    let result = handler.apply($pulp, args)

    if (result === $pulp)                              { return result }
    if (typeof result !== "object" || result === null) { return result }
    if (result[IS_IMMUTABLE] || result.id != null)     { return result }
    return ((result$inner = InterMap.get(result))) ?
      result$inner[$COPY](true)[$RIND] : CopyObject(result, true)
  }`)
  return BeFrozenFunc(namedHandler)
}

function AsSuperValueMethod(selector, handler) {
  const namedHandler = FunctionNamer.make(selector,
  `return svm_@name@(...args) {
    return handler.apply(this[$PULP], args)
  }`)
  return BeFrozenFunc(namedHandler)
}

// AsSuperSafeMethod


function AsSuperFactGetter(selector, handler) {
  const namedHandler = FunctionNamer.make(selector,
  `return sfg_@name@() {
    let $pulp = this[$PULP]
    let result = handler.call($pulp)

    if (result === $pulp)                              { return result }
    if (typeof result !== "object" || result === null) { return result }
    if (result[IS_IMMUTABLE] || result.id != null)     { return result }
    return ((result$inner = InterMap.get(result))) ?
      result$inner[$COPY](true).$ : CopyObject(result, true)
  }`)
  return BeFrozenFunc(namedHandler)
}



const STANDARD = {
  id          : "STANDARD",
  isRelaxed   : false,
  isImmediate : false,
  isLazy      : false,
  outer       : AsOuterFactMethod,
  inner       : AsInnerFactMethod,
  super       : AsInnerFactMethod,
}

const GETTER = {
  id          : "GETTER",
  isRelaxed   : false,
  isImmediate : true ,
  isLazy      : false,
  outer       : AsOuterFactGetter,
  inner       : AsInnerFactGetter,
}

const LAZY_INSTALLER = {
  id          : "LAZY_INSTALLER",
  isRelaxed   : false,
  isImmediate : true ,
  isLazy      : true ,
  outer       : AsOuterFactGetter,
  inner       : AsInnerFactGetter,
}

const STANDARD_VALUE = {
  id          : "STANDARD_VALUE",
  isRelaxed   : true ,
  isImmediate : false,
  isLazy      : false,
  outer       : AsOuterValueMethod,
  inner       : AsInnerValueMethod,
}

const GETTER_VALUE = {
  id          : "GETTER_VALUE",
  isRelaxed   : true ,
  isImmediate : true ,
  isLazy      : false,
  outer       : AsOuterValueGetter,
  inner       : AsInnerValueGetter,
}

const STANDARD_SAFE = {
  id          : "STANDARD_SAFE",
  isRelaxed   : true ,
  isImmediate : false,
  isLazy      : false,
  outer       : AsOuterSafeMethod,
  inner       : AsInnerSafeMethod,
}

const GETTER_SAFE = {
  id          : "GETTER_SAFE",
  isRelaxed   : true ,
  isImmediate : true ,
  isLazy      : false,
  outer       : AsOuterSafeGetter,
  inner       : AsInnerSafeGetter,
}




return ofm_$$$$$(...args) {
  let $pulp, barrier, result, result$inner
  let $inner = InterMap.get(this)

  if ((barrier = $inner[$BARRIER])) { // indicates isImmutable
    if (barrier.inUse) { barrier = new ImmutableInner($inner) }
    barrier.inUse = true
    $pulp = barrier.target
    result = Handler.apply($pulp, args)

    if (result === $pulp) {
      result = porosity.target
      if (result !== $pulp) {
        barrier.target = barrier.originalTarget  // reset porosity
        result.beImmutable
      }
      barrier.inUse = false
      return result[$RIND]
    }
  }
  else {
    $pulp  = $inner[$PULP]
    result = handler.apply($pulp, args)
    if (result === $pulp) { return $inner[$RIND] }
  }

  // if (result === $inner[$RIND])                   { return result }
  if (typeof result !== "object" || result === null) { return result }
  if (result[IS_IMMUTABLE] || result.id != null)     { return result }
  return ((result$inner = InterMap.get(result))) ?
    result$inner[$COPY](true).$ : CopyObject(result, true)
}

return ofg_$$$$$() {
  let $pulp, barrier, result, result$inner
  let $inner = InterMap.get(this[$RIND])
  // Second term handles receiver being $outer from get in TypeOuter
  // Getters on type aren't common so this is simpler than using the more
  // elaborate steps that are required in get in TypeInner

  if ((barrier = $inner[$BARRIER])) { // indicates isImmutable
    if (barrier.inUse) { barrier = new ImmutableInner($inner) }
    barrier.inUse = true
    $pulp = barrier.target
    result = handler.call($pulp)

    if (result === $pulp) {
      result = porosity.target
      if (result !== $pulp) {
        barrier.target = barrier.originalTarget  // reset porosity
        result.beImmutable
      }
      barrier.inUse = false
      return result[$RIND]
    }
  }
  else {
    $pulp  = $inner[$PULP]
    result = handler.call($pulp)
    if (result === $pulp) { return $inner[$RIND] }
  }

  // if (result === $inner[$RIND])                   { return result }
  if (typeof result !== "object" || result === null) { return result }
  if (result[IS_IMMUTABLE] || result.id != null)     { return result }
  return ((result$inner = InterMap.get(result))) ?
    result$inner[$COPY](true).$ : CopyObject(result, true)
}

return ofl_$$$$$() {
  let result, result$inner
  let $inner = InterMap.get(this[$RIND])
  let $pulp = $inner[$PULP]

  if ($inner[IS_IMMUTABLE]) {
    if ($pulp.inUse) { $pulp = new ImmutableInner($inner) }
    $pulp.inUse = true
    result = handler.call($pulp)

    if (result === $pulp) {
      result = $pulp.target
      if (result !== $pulp) {
        $pulp.target = $pulp.originalTarget  // reset porosity
        result.beImmutable
      }
      $pulp.inUse = false
      return result[$RIND]
    }

    // if (result === $inner[$RIND])                   { return result }
    if (typeof result !== "object" || result === null) { return result }
    if (result[IS_IMMUTABLE] || result.id != null)     { return result }
    return ((result$inner = InterMap.get(result))) ?
      result$inner[$COPY](true).$ : CopyObject(result, true)
  }

  DefineProperty(this, @name@, InvisibleConfiguration)
  $pulp[@name@] = handler.call($pulp)
  return $inner[@name@]
}



return ovm_$$$$$(...args) {
  let $pulp, barrier, result
  let $inner = InterMap.get(this)

  if ((barrier = $inner[$BARRIER])) { // indicates isImmutable
    if (barrier.inUse) { barrier = new ImmutableInner($inner) }
    barrier.inUse = true
    $pulp = barrier.target
    result = handler.apply($pulp, args)

    if (result === $pulp) {
      result = porosity.target
      if (result !== $pulp) {
        barrier.target = barrier.originalTarget  // reset porosity
        result.beImmutable
      }
      barrier.inUse = false
      return result[$RIND]
    }
  }
  else {
    $pulp  = $inner[$PULP]
    result = handler.apply($pulp, args)
    if (result === $pulp) { return $inner[$RIND] }
  }
  return result
}

return ovg_$$$$$() {
  let $pulp, barrier, result
  let $inner = InterMap.get(this[$RIND])

  if ((barrier = $inner[$BARRIER])) { // indicates isImmutable
    if (barrier.inUse) { barrier = new ImmutableInner($inner) }
    barrier.inUse = true
    $pulp = barrier.target
    result = handler.call($pulp)

    if (result === $pulp) {
      result = porosity.target
      if (result !== $pulp) {
        barrier.target = barrier.originalTarget  // reset porosity
        result.beImmutable
      }
      barrier.inUse = false
      return result[$RIND]
    }
  }
  else {
    $pulp  = $inner[$PULP]
    result = handler.call($pulp)
    if (result === $pulp) { return $inner[$RIND] }
  }
  return result
}







=======






Public                            self-rind  barrier  fact  immediate  set
function AsOuterFactMethod           y        y        y
function AsOuterValueMethod          y        y
function AsOuterSafeMethod           y

function AsOuterFactGetter           y        y        y        y
function AsOuterValueGetter          y        y                 y
function AsOuterSafeGetter           y                          y

function AsOuterFactLazyLoader       y        y        im       y       mu

Public/Private
function AsInnerFactMethod                             y
function AsInnerValueMethod
function AsInnerSafeMethod
_private

function AsInnerFactGetter                             y        y
function AsInnerValueGetter                                     y
function AsInnerSafeGetter                                      y
_private                                                        y

function AsInnerFactLazyLoader                                  y      y
_private                                                        y

Private
function AsSuperFactMethod
function AsSuperValueMethod
function AsSuperSafeMethod

function AsSuperFactGetter                                      y
function AsSuperValueGetter                                     y
function AsSuperSafeGetter                                      y

function AsSuperFactLazyLoader                                  y      y


this._super.xyx()
this._super.abc
