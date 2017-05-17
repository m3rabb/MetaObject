// UNTESTED

const BasePorosity = {
  getPrototypeOf : ALWAYS_NULL ,
  setPrototypeOf : ALWAYS_FALSE,
  defineProperty : ALWAYS_FALSE,
  deleteProperty : ALWAYS_FALSE,
  isExtensible   : ALWAYS_FALSE,
  // preventExtensions ???
}

class _PrivacyPorosity {
  get ($outer, selector, $rind) {
    let index
    return ($outer.atIndex && ((index = +selector) === index)) ?
      $outer.atIndex(index) : $outer[selector]
  }

  // Setting on things in not allowed because the setting semantics are broken.
  // For our model, the return value should always be the receiver, or a copy
  // of the receiver, with the property changed.

  // Further, note that the return value of a set always returns the value that
  // was tried to be set to, regardless of whether it was successful or not.

  set ($outer, selector, value, $rind) {
    return false
    // return InterMap.get($rind)._externalWrite(selector, value) || false
  }

  has ($outer, selector) {
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
}

_PrivacyPorosity.prototype = SpawnFrom(BasePorosity)

const PrivacyPorosity = new _PrivacyPorosity()


class DisguisedPrivacyPorosity {
  constructor ($inner, $outer) {
    this.$inner = $inner
    this.$outer = $outer
  }

  get (disguisedFunc, selector, $rind) {
    let   index
    const $outer = this.$outer

    return ($outer.atIndex && ((index = +selector) === index)) ?
      $outer.atIndex(index) : $outer[selector]
  }

  has (disguisedFunc, selector) {
    const $outer = this.$outer
    // const firstChar = (typeof selector === "symbol") ?
    //   selector.toString()[7] : selector[0]
    switch (selector[0]) {
      case "_"       : return $outer._externalPrivateRead(selector) || false
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      case undefined : return false
    }
    return (selector in $outer)
  }

  apply (func, receiver, args) {
    return func.apply(this.$inner, args)
  }
}

DisguisedPrivacyPorosity.prototype = SpawnFrom(PrivacyPorosity)



// UNTESTED
const MutablePorosity = {
  __proto__ : null,

  set ($inner, selector, value, $pulp) {
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
        else if (value === $inner[$RIND]) {
          $inner[selector] = $pulp
        }
        else if (value === null || value[IS_IMMUTABLE] || value.id != null) {
          $inner[selector] = value
        }
        else if (value === $inner[selector]) {/* NOP */}

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
  },

  deleteProperty ($inner, selector, $pulp) {
    if (selector in $inner) {
      delete $inner[KNOWN_PROPERTIES]
      delete $inner[selector]
      delete $inner[$OUTER][selector]
    }

    return true
  },

  // has () {
  //   // hide symbols from view
  // }
}

class DisguisedMutablePorosity {
  constructor ($inner, $pulp) {
    this.$inner = $inner
  }

  get (disguisedFunc, selector, $pulp) {
    const $inner  = this.$inner
    const getters = $inner[$GETTERS]
    const handler = getters[selector]
    return (handler) ? handler.call($pulp) : $inner[selector]
  }

  set (disguisedFunc, selector, value, $pulp) {
    // return super.set(this.$inner, selector, value, $pulp)
    return MutablePorosity.set(this.$inner, selector, value, $pulp)
  }

  has (disguisedFunc, selector, $pulp) {
    return (selector in this.$inner)
  }

  deleteProperty (disguisedFunc, selector, $pulp) {
    // return super.deleteProperty(this.$inner, selector, $pulp)
    return MutablePorosity.deleteProperty(this.$inner, selector, $pulp)
  }
}

// DisguisedMutablePorosity.prototype = SpawnFrom(MutablePorosity)



class ImmutableInnerPorosity {
  constructor ($inner) {
    this.inUse = false
    this.target = this.originalTarget = new Proxy($inner, this)
  }

  set ($inner, selector, value, $pulp) {
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

  deleteProperty ($inner, selector, $pulp) {
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

  retargetedSet ($inner, selector, value, $pulp) {
    this.target[selector] = value
    return true
  }

  retargetedGet ($inner, selector, $pulp) {
    return this.target[selector]
  }

  retargetedDelete ($inner, selector, $pulp) {
    delete this.target[selector]
    return true
  }
}

ImmutableInnerPorosity.prototype = SpawnFrom(null)


const SuperMethodPorosity = {
  __proto__ : null,

  apply (func, receiver, args) {
    return func.apply(receiver[$PULP], args)
  }
}


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
