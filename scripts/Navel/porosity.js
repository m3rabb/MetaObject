


// UNTESTED
const BaseOuterBehavior = {
  __proto__ : null,

  get (base$root, property, $outer) {
    const $inner = InterMap.get($outer[$RIND])
    if (property[0] === "_") {
      return PrivateAccessFromOutsideError($inner[$RIND], property)
    }
    return $inner._noSuchProperty ?
      $inner[$PULP]._noSuchProperty(property) : undefined
  },
  // getPrototypeOf (base$root) { return base$root }
}

const BaseInnerBehavior = {
  __proto__ : null,

  get (base$root, property, $inner) {
    return $inner._noSuchProperty ?
      $inner[$PULP]._noSuchProperty(property) : undefined
  },

  // getPrototypeOf (base$root) { return base$root }
}



// UNTESTED
const DefaultBehavior = {
  __proto__      : null        ,
  getPrototypeOf : ALWAYS_NULL ,
  setPrototypeOf : ALWAYS_FALSE,
  defineProperty : ALWAYS_FALSE,
  deleteProperty : ALWAYS_FALSE,
  isExtensible   : ALWAYS_FALSE,
  // preventExtensions ???
}




function Outer(id) {
  this.id = id
}

const Outer_prototype = Outer.prototype = SpawnFrom(DefaultBehavior)


// Setting on things in not allowed because the setting semantics are broken.
// For our model, the return value should always be the receiver, or a copy
// of the receiver, with the property changed.

// Further, note that the return value of a set always returns the value that
// was tried to be set to, regardless of whether it was successful or not.

Outer_prototype.set = function set($outer, property, value, $rind) {
  return DirectAssignmentFromOutsideError($rind) || false
  // return InterMap.get($rind)._externalWrite(property, value) || false
}


// getOwnPropertyDescriptor ($outer, property) {
//   switch (property[0]) {
//     case "_"       : return $outer._externalPrivateRead(property) || undefined
//     // case undefined : if (!(property in VISIBLE_SYMBOLS)) { return false }
//     case undefined : return undefined
//   }
//   return PropertyDescriptor($outer, property)
// },

// ownKeys ($outer) { },



const Impermeable = new Outer("Impermeable")

Impermeable.get = function get($outer, property, $rind) {
  const value = $outer[property]
  return (value !== IMMEDIATE) ? value :
    $outer[$IMMEDIATES][property].outer.call($rind)
}

Impermeable.has = function has($outer, property) {
  // const firstChar = (typeof property === "symbol") ?
  //   property.toString()[7] : property[0]
  switch (property[0]) {
    case "_"       :
      return PrivateAccessFromOutsideError($inner[$RIND], property) || false
    // case undefined : if (!(property in VISIBLE_SYMBOLS)) { return false }
    case undefined :
      return false
  }
  return (property in $outer)
}


const Permeable = new Outer("Permeable")

Permeable.get = function get($outer, property, $rind) {
  const $method = $outer[$IMMEDIATES][property]
  if ($method) { return $method.outer.call($rind) }

  const $inner = InterMap.get($rind)
  const value  = $inner[property]
  return (typeof value !== "function") ? value : value.outer || value
}

Permeable.has = function has($outer, property) {
  const $inner = InterMap.get($outer[$RIND])
  return (property in $inner)
}



function TypeOuter($pulp, $outer, permeability) {
  this.$pulp        = $pulp
  this.$outer       = $outer
  this.permeability = permeability
}

const TypeOuter_prototype = SpawnFrom(Outer_prototype)
TypeOuter.prototype = TypeOuter_prototype

TypeOuter_prototype.get = function get(disguisedFunc, property, $rind) {
  return this.permeability.get(this.$outer, property, $rind)
}

TypeOuter_prototype.has = function has(disguisedFunc, property) {
  return this.permeability.has(this.$outer, property)
}

TypeOuter_prototype.apply = function newAsFact(func, receiver, args) {
  // return func.apply(this.$inner, args)
  // return this.$pulp.newAsFact(...args)

  // This is the same code as in newAsFact(...args)
  const  instance = this.$pulp.new(...args)
  const _instance = InterMap.get(instance)[$PULP]
  if (_instance.id == null) { _instance._setImmutable() }
  return instance
}





// UNTESTED
function MutableInner() {}

const MutableInner_prototype = MutableInner.prototype = EMPTY_OBJECT
const Mutability = new MutableInner()

Mutability.get = function get($inner, property, $pulp) {
  const value = $inner[property]
  return (value !== IMMEDIATE) ? value :
    $inner[$IMMEDIATES][property].inner.call($pulp)
}


Mutability.set = function set($inner, property, value, $pulp) {
  const loader   = $inner[$SET_LOADERS][property]
  const newValue = (loader) ? loader.call($pulp, value) : value
  InSetProperty($inner, property, newValue, $pulp)
  return true
}

function InSetProperty($inner, property, value, $pulp) {
  if (value === $inner[property]) { return $pulp }

  const isPublic = (property[0] !== "_")

  if (!(property in $inner)) {
    // Consider making id invisible, and ensuring that id is only set thru a special method here!!!
    delete $inner[KNOWN_PROPERTIES]
    delete $inner[$OUTER][KNOWN_PROPERTIES]
  }

  switch (typeof value) {
    case "undefined" :
      return AssignmentOfUndefinedError($inner[$RIND])

    case "object" :
           if (!isPublic)                  {          break           }
      else if (value === null)             {         /* NOP */        }
      else if (value[IS_IMMUTABLE])        {         /* NOP */        }
      else if (value.id != null)           {         /* NOP */        }
      else if (value === $pulp)            {   value = $inner[$RIND]  }
      else if (value === $inner[$RIND])    {         /* NOP */        }
      else {   value = ($value = InterMap.get(value)) ?
                 $Copy($value, true)[$RIND] : CopyObject(value, true) }

      $inner[$OUTER][property] = value
    break

    case "function" : // LOOK: will catch Type things!!!
      // Note: Checking for value.constructor is inadequate to prevent func spoofing
      switch (InterMap.get(value)) {
        default           : break
        // case WRAPPER_FUNC : return $pulp.addOwnMethod(value.method)
        case undefined    : value = AsTameFunc(value); break
      }

      // if (property === "_initFrom_") {
      //   value = ((tag = InterMap.get(value)) && tag === "_initFrom_") ?
      //     value : Wrap_initFrom_(value)
      // }
      // else {
      //   value = (InterMap.get(value)) ? value : TameFunc(value)
      // }
    // break omitted

    default :
      if (isPublic) { $inner[$OUTER][property] = value }
    break
  }

  $inner[property] = value
  return $pulp
}

Mutability.deleteProperty = function deleteProperty($inner, property, $pulp) {
  // const property = SymbolPropertyMap[symbol]
  //
  // if (property === undefined) {
  //   const message = "Use property setter instead of delete!"
  //   return SignalError($pulp, message)
  // }

  if (property in $inner) {
    delete $inner[property]
    delete $inner[KNOWN_PROPERTIES]
    delete $inner[$OUTER][property]
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


TypeInner_prototype.get = function get(disguisedFunc, property, $pulp) {
  // return Mutability.get(this.$inner, property, $pulp)
  const $inner = this.$inner
  const value  = $inner[property]
  return (value !== IMMEDIATE) ? value :
    $inner[$IMMEDIATES][property].inner.call($pulp)
}


TypeInner_prototype.set = function set(disguisedFunc, property, value, $pulp) {
  return Mutability.set(this.$inner, property, value, $pulp)
  // return Mutability.set(this.$inner, property, value, $pulp)
}

TypeInner_prototype.has = function has(disguisedFunc, property, $pulp) {
  return (property in this.$inner)
}

TypeInner_prototype.deleteProperty = function deleteProperty(disguisedFunc, property, $pulp) {
  return Mutability.deleteProperty(this.$inner, property, $pulp)
  // return Mutability.deleteProperty(this.$inner, property, $pulp)
}

TypeInner_prototype.apply = function newAsFact(func, receiver, args) {
  // return func.apply(this.$inner, args)
  // return this.$pulp.newAsFact(...args)

  // This is the same code as in newAsFact(...args)
  const  instance = this.$pulp.new(...args)
  const _instance = InterMap.get(instance)[$PULP]
  if (_instance.id == null) { _instance._setImmutable() }
  return instance
}


// TypeInner.prototype = SpawnFrom(DefaultBehavior)



// BEWARE!!! The $pulp of the original target of the barrier/proxy always
// references the original pulp proxy.
function ImmutableInner() {}

const ImmutableInner_prototype = SpawnFrom(EMPTY_OBJECT)
ImmutableInner.prototype = ImmutableInner_prototype

ImmutableInner_prototype.get = function get($inner, property, $pulp) {
  // Might need to put in check for $PULP property, if so return this proxy???
  const value = $inner[property]
  return (value !== IMMEDIATE) ? value :
    $inner[$IMMEDIATES][property].inner.call($pulp)
}

ImmutableInner_prototype.set = function set($inner, property, value, $pulp) {
  if ($inner[property] !== value) {
    const $copy  = $Copy($inner, false, undefined, property)

    $copy[$PULP][property] = value
    this.$target           = $copy
    this.set               = this.retargetedSet
    this.get               = this.retargetedGet
    this.deleteProperty    = this.retargetedDelete
  }
  return true
}

ImmutableInner_prototype.deleteProperty = function deleteProperty($inner, property, $pulp) {
  var $copy
  switch (property) {
    case _DELETE_IMMUTABILITY   : $copy = $Copy($inner, false); break
    case _DELETE_ALL_PROPERTIES : $copy = $inner[$BLANKER]()  ; break
    default :
      if (!$inner._hasOwn(property)) { return true }
      $copy = $Copy($inner, false, undefined, property)
      break
  }

  this.$target         = $copy
  this.set            = this.retargetedSet
  this.get            = this.retargetedGet
  this.deleteProperty = this.retargetedDelete
  return true
}

ImmutableInner_prototype.retargetedGet = function retargetedGet($inner, property, $pulp) {
  // DOUBLE CHECK THIS!!!
  const $target = this.$target
  const value   = $target[property]
  return (value !== IMMEDIATE) ? value :
    $target[$IMMEDIATES][property].inner.call($target[$PULP])
}

ImmutableInner_prototype.retargetedSet = function retargetedSet($inner, property, value, $pulp) {
  this.$target[$PULP][property] = value
  return true
}

ImmutableInner_prototype.retargetedDelete = function retargetedDelete($inner, property, $pulp) {
  delete this.$target[$PULP][property]
  return true
}




// REVISIT!!!
function SetSuperPropertyFor($inner, property) {
  const ancestors = $inner.type.ancestry
  const supers    = $inner[$SUPERS]
  var next, $type, nextProperties, value, mode, handler, _super

  next = ancestors.length
  if (!$inner._hasOwn(property)) { next-- }

  while (next--) {
    $type          = InterMap.get(ancestors[next])
    nextProperties = $type._properties
    value          = nextProperties[property]

    if (value !== undefined) {
      if (value && value.isMethod) {
        mode    = value.mode
        handler = value.super ||
          (value.super = mode.super(property, value.handler, value.isPublic))

        if (mode.isImmediate) {
          supers[$IMMEDIATES][property] = handler
          return (supers[property] = IMMEDIATE)
        }
        return (supers[property] = handler)
      }
      return (supers[property] = value)
    }
  }
  return (supers[property] = NO_SUPER)
}


function Super() {}

const Super_prototype = SpawnFrom(DefaultBehavior)
Super.prototype = Super_prototype

Super_prototype.get = function get($inner, property, $super) {
  const supers = $inner[$SUPERS]
  var   value = supers[property]

  do {
    switch (value) {
      case undefined :
        value = SetSuperPropertyFor($inner, property)
      break

      case NO_SUPER  :
        return $inner._noSuchProperty ?
          $inner[$PULP]._noSuchProperty(property) : undefined

      case IMMEDIATE :
        return supers[$IMMEDIATES][property].call($inner[$PULP])

      default :
        return value
    }
  } while (true)

    //
    // (value && value[$SECRET] === $INNER ?
    //   value.handler.call($inner[$PULP]) : value)
}


// const OwnSuperBehavior = {
//   __proto__ : SuperBehavior,
//
//   get ($inner, property, target) {
//     // const supers = $inner[SUPERS]
//     // const value =
//     //
//     // if (property in supers) {
//     //   let sharedSupers = supers[SUPERS]
//     //   if (sharedSupers !== supers) { // instance has its own SUPERS
//     //     if (!(property in sharedSupers)) {
//     //
//     //     }
//     //
//     //   }
//     //   value = supers[property]
//     // }
//     // else {
//     //   value = SetSuperPropertyFor($inner, property)
//     // }
//     // return (value === NO_SUPER) ?
//     //   ($inner._noSuchProperty ?
//     //     $inner[$PULP]._noSuchProperty(property) : undefined) :
//     //   (value && value[$SECRET] === $INNER ?
//     //     value.handler.call($inner[$PULP]) : value)
//   }
// }
