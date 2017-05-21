// UNTESTED

const BasePorosity = {
  __proto__      : null        ,
  getPrototypeOf : ALWAYS_NULL ,
  setPrototypeOf : ALWAYS_FALSE,
  defineProperty : ALWAYS_FALSE,
  deleteProperty : ALWAYS_FALSE,
  isExtensible   : ALWAYS_FALSE,
  // preventExtensions ???
}

function Outer() {}

const Outer_prototype = Outer.prototype = SpawnFrom(BasePorosity)
const PrivacyPorosity = new Outer()

  // get ($outer, selector, $rind) {
  //   let index
  //   return ($outer.atIndex && ((index = +selector) === index)) ?
  //     $outer.atIndex(index) : $outer[selector]
  // }

  // Setting on things in not allowed because the setting semantics are broken.
  // For our model, the return value should always be the receiver, or a copy
  // of the receiver, with the property changed.

  // Further, note that the return value of a set always returns the value that
  // was tried to be set to, regardless of whether it was successful or not.
PrivacyPorosity.set = function set($outer, selector, value, $rind) {
  return false
  // return InterMap.get($rind)._externalWrite(selector, value) || false
}

PrivacyPorosity.has = function has($outer, selector) {
  // const firstChar = (typeof selector === "symbol") ?
  //   selector.toString()[7] : selector[0]
  switch (selector[0]) {
    case "_"       : return $outer._externalPrivateRead(selector) || false
    // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
    case undefined : return false
  }
  return (selector in $outer)
}

  // getOwnPropertyDescriptor ($outer, selector) {
  //   switch (selector[0]) {
  //     case "_"       : return $outer._externalPrivateRead(selector) || undefined
  //     // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
  //     case undefined : return undefined
  //   }
  //   return PropertyDescriptor($outer, selector)
  // },

  // ownKeys ($outer) { },






function TypeOuter($pulp, $outer) {
  this.$pulp  = $pulp
  this.$outer = $outer
}

const TypeOuter_prototype = TypeOuter.prototype = SpawnFrom(Outer_prototype)

TypeOuter_prototype.get = function get(disguisedFunc, selector, $rind) {
  return this.$outer[selector]
}

TypeOuter_prototype.set = function set(disguisedFunc, selector, value, $rind) {
  return false
  // return InterMap.get($rind)._externalWrite(selector, value) || false
}

TypeOuter_prototype.has = function has(disguisedFunc, selector) {
  const $outer = this.$outer
  // const firstChar = (typeof selector === "symbol") ?
  //   selector.toString()[7] : selector[0]
  switch (selector[0]) {
    case "_"       : return $outer._externalPrivateRead ?
      $outer._externalPrivateRead(selector) : false
    // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
    case undefined : return false
  }
  return (selector in $outer)
}

TypeOuter_prototype.apply = function apply(func, receiver, args) {
  // return func.apply(this.$inner, args)
  // return this.$pulp.newAsFact(...args)

  // This is the same code as in newAsFact(...args)
  let instance = this.$pulp.new(...args)
  if (instance.id == null) { instance.beImmutable }
  return instance
}



// UNTESTED
function MutableInner() {}

const MutableInner_prototype = MutableInner.prototype = SpawnFrom(null)
const MutablePorosity = new MutableInner()


MutablePorosity.set = function set($inner, selector, value, $pulp) {
  const isPublic = (selector[0] !== "_")

  if (!(selector in $inner)) {
    // Consider making id invisible, and ensuring that id is only set thru a special method here!!!
    delete $inner[KNOWN_PROPERTIES]
  }

  switch (typeof value) {
    case "object" :
      if (!isPublic) { break }

      if (value === $pulp) {  // Perhaps will force assignments to always be target!!!
        $inner[selector] = $pulp
        value = $inner[$RIND]
      }
      else if (value === null || value[IS_IMMUTABLE] || value.id != null) {
        $inner[selector] = value
      }
      else if (value === $inner[selector]) {/* NOP */}

      else if (value === $inner[$RIND]) {
        $inner[selector] = $pulp
      }
      else if ((value$inner = InterMap.get(value))) {
        $inner[selector] = (value = value$inner[COPY](true)[$RIND])
      }
      else {
        $inner[selector] = value // (value = CopyObject(value, true))
      }
      $inner[$OUTER][selector] = value
      return true

    case "function" : // LOOK: will catch Type things!!!
      // NOTE: Checking for value.constructor is inadequate to prevent func spoofing
      value = (InterMap.get(value)) ? value : WrapFunc(value)

      // if (selector === "_initFrom_") {
      //   value = ((tag = InterMap.get(value)) && tag === "_initFrom_") ?
      //     value : Wrap_initFrom_(value)
      // }
      // else {
      //   value = (InterMap.get(value)) ? value : WrapFunc(value)
      // }

      // break omitted
    default :
      if (isPublic) { $inner[$OUTER][selector] = value }
      break
  }

  $inner[selector] = value
  return true
}

MutablePorosity.deleteProperty = function deleteProperty($inner, selector, $pulp) {
  // const selector = SymbolPropertyMap[symbol]
  //
  // if (selector === undefined) {
  //   const message = "Use property setter instead of delete!"
  //   return SignalError($pulp, message)
  // }

  if (selector in $inner) {
    delete $inner[selector]
    delete $inner[KNOWN_PROPERTIES]
    delete $inner[$OUTER][selector]
  }
  return true
}

// has () {
//   // hide symbols from view
// }


// CHECK THAT BARRIER WORK ON TYPE PROXIES!!!

function TypeInner($inner) {
  this.$inner = $inner
  // this.$pulp  = $pulp // this is the proxy, which is now set from the outside
}

const TypeInner_prototype = TypeInner.prototype = SpawnFrom(MutableInner_prototype)


TypeInner_prototype.get = function get(disguisedFunc, selector, $pulp) {
  // Double check this!!!
  const $inner     = this.$inner
  const immediates = $inner[$IMMEDIATES]
  const handler    = immediates[selector]
  return (handler) ? handler.call($pulp) : $inner[selector]
}

TypeInner_prototype.set = function set(disguisedFunc, selector, value, $pulp) {
  return MutablePorosity.set(this.$inner, selector, value, $pulp)
  // return MutablePorosity.set(this.$inner, selector, value, $pulp)
}

TypeInner_prototype.has = function has(disguisedFunc, selector, $pulp) {
  return (selector in this.$inner)
}

TypeInner_prototype.deleteProperty = function deleteProperty(disguisedFunc, selector, $pulp) {
  return MutablePorosity.deleteProperty(this.$inner, selector, $pulp)
  // return MutablePorosity.deleteProperty(this.$inner, selector, $pulp)
}

TypeInner_prototype.apply = function apply(func, receiver, args) {
  // return func.apply(this.$inner, args)
  // return this.$pulp.newAsFact(...args)

  // This is the same code as in newAsFact(...args)
  let instance = this.$inner[$PULP].new(...args)
  if (instance.id == null) { instance.beImmutable }
  return instance
}


// TypeInner.prototype = SpawnFrom(BasePorosity)




function ImmutableInner($inner) {
  this.inUse = false
  this.target = this.originalTarget = new Proxy($inner, this)
}

const ImmutableInner_prototype = ImmutableInner.prototype = SpawnFrom(null)


ImmutableInner_prototype.set = function set($inner, selector, value, $pulp) {
  if ($inner[selector] !== value) {
    const copy = $pulp.mutableCopyExcept(selector) // Check returns rind|pulp
    copy[selector] = value
    this.target = copy // Must be $pulp!!!

    this.set = this.retargetedSet
    this.get = this.retargetedGet
    this.deleteProperty = this.retargetedDelete
  }
  return true
}

ImmutableInner_prototype.deleteProperty = function deleteProperty($inner, selector, $pulp) {
  switch (selector) {
    case "_IMMUTABILITY" : this.target = $inner.asMutableCopy; break
    case "_ALL"          : this.target = $inner._newBlank()  ; break
    default :
      if (!$inner._hasOwn(selector)) { return true }
      this.target = $pulp.mutableCopyExcept(selector)
      break
  }

  this.set = this.retargetedSet
  this.get = this.retargetedGet
  this.deleteProperty = this.retargetedDelete
  return true
}

ImmutableInner_prototype.retargetedSet = function retargetedSet($inner, selector, value, $pulp) {
  this.target[selector] = value
  return true
}

ImmutableInner_prototype.retargetedGet = function retargetedGet($inner, selector, $pulp) {
  return this.target[selector]
}

ImmutableInner_prototype.retargetedDelete = function retargetedDelete($inner, selector, $pulp) {
  delete this.target[selector]
  return true
}






function FactMethod () {}

FactMethod.prototype = SpawnFrom(null)
const FactMethodPorosity = new FactMethod()

MethodPorosity.apply = function apply(handler, receiver, args) {
  if (receiver[$SECRET] === $INNER) {
    $pulp = receiver
    result = handler.apply($pulp, args)
    // CHECK how this wprks with SUPER!!!
  }
  else {
    $inner = InterMap.get(receiver)

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
  }

  if (typeof result !== "object" || result === null) { return result }
  if (result === receiver)                           { return result }
  if (result[IS_IMMUTABLE] || result.id != null)     { return result }
  return ((result$inner = InterMap.get(result))) ?
    result$inner[$COPY](true).$ : CopyObject(result, true)
}


function FactGetter () {}

FactGetter.prototype = SpawnFrom(null)
const FactGetterPorosity = new FactGetter()

FactGetterPorosity.apply = function apply(handler, receiver, args_) {
  if (receiver[$SECRET] === $INNER) {
    $pulp = receiver
    result = handler.call($pulp)
    // CHECK how this wprks with SUPER!!!
  }
  else {
    $inner = InterMap.get(receiver) || InterMap.get(receiver[$RIND])
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
      result = handler.apply($pulp, args)
      if (result === $pulp) { return $inner[$RIND] }
    }
  }

  if (typeof result !== "object" || result === null) { return result }
  if (result === receiver)                           { return result }
  if (result[IS_IMMUTABLE] || result.id != null)     { return result }
  return ((result$inner = InterMap.get(result))) ?
    result$inner[$COPY](true).$ : CopyObject(result, true)
}


// CHECK CODE BELOW!!!



function RelaxedMethod () {}

RelaxedMethod.prototype = SpawnFrom(null)
const RelaxedMethodPorosity = new RelaxedMethod()

RelaxedMethodPorosity.apply = function apply(handler, receiver, args) {
  if (receiver[$SECRET] === $INNER) {
    $pulp = receiver
    return handler.apply($pulp, args)
    // CHECK how this works with SUPER!!!
  }
  else {
    $inner = InterMap.get(receiver)
    $pulp  = $inner[$PULP]
    result = handler.apply($pulp, args)
    if (result === $pulp) { return $inner[$RIND] }
  }
}


class MutableOuterGetter {
  apply (handler, receiver, args_) {
    // load getters raw (like private methods) into $root$inner!!!
    // if (receiver[$SECRET] === $INNER) {
    //   $pulp = receiver
    //   return handler.call($pulp)
    // }

    $inner = InterMap.get(receiver) || InterMap.get(receiver[$RIND])
      // Second term handles receiver being $outer from get in TypeOuter
      // Getters on type aren't common so this is simpler than using the more
      // elaborate steps that are required in get in TypeInner

    $pulp  = $inner[$PULP]
    result = handler.call($pulp)
    return (result === $pulp) ? $inner[$RIND] : result
    // CHECK how this wprks with SUPER!!!
  }
}


class SuperInnerMethod {
  apply (func, receiver, args) {
    return func.apply(receiver[$PULP], args)
  }
}

const SuperMethodPorosity = new SuperInnerMethod()


function SetSuperPropertyFor($inner, selector) {
  let ancestors = $inner.type.ancestry
  let next      = ancestors.length

  if ($inner._hasOwn(selector)) { next++ }

  while (--next) {
    let type$inner = InterMap.get(ancestors[next])
    let nextPropertiess = type$inner._properties

    if (selector in nextProperties) {
      let value = nextProperties[selector]
      if (value && value)
      if (value != null) { return value }
      switch (value.mode) {
        case STANDARD :
          return ($inner[$SUPERS][selector] = value[$SUPER])
        case GETTER :
        case LAZY_INSTALLER :
          return ($inner[$SUPERS][selector] = InterMap.get(value))
        default :
          return ($inner[$SUPERS][selector] = value)
      }
    }
  }
  return NO_SUPER
}


const SuperPorosity = {
  __proto__ : null,

  get ($inner, selector, target) {
    const supers = $inner[$SUPERS]
    const value = (selector in supers) ?
      supers[selector] : SetSuperPropertyFor($inner, selector)
    return (value === NO_SUPER) ?
      ($inner._noSuchProperty ?
        $inner[$PULP]._noSuchProperty(selector) : undefined) :
      (value && value[$SECRET] === $INNER ?
        value.handler.call($inner[$PULP]) : value)
  },

  set            : ALWAYS_FALSE,
  getPrototypeOf : ALWAYS_NULL ,
  setPrototypeOf : ALWAYS_FALSE,
  defineProperty : ALWAYS_FALSE,
  deleteProperty : ALWAYS_FALSE,
  isExtensible   : ALWAYS_FALSE,
}


const OwnSuperPorosity = {
  __proto__ : SuperPorosity,

  get ($inner, selector, target) {
    // const supers = $inner[SUPERS]
    // const value =
    //
    // if (selector in supers) {
    //   let sharedSupers = supers[SUPERS]
    //   if (sharedSupers !== supers) { // instance has its own SUPERS
    //     if (!(selector in sharedSupers)) {
    //
    //     }
    //
    //   }
    //   value = supers[selector]
    // }
    // else {
    //   value = SetSuperPropertyFor($inner, selector)
    // }
    // return (value === NO_SUPER) ?
    //   ($inner._noSuchProperty ?
    //     $inner[$PULP]._noSuchProperty(selector) : undefined) :
    //   (value && value[$SECRET] === $INNER ?
    //     value.handler.call($inner[$PULP]) : value)
  }
}
