// UNTESTED
const PrivacyPorosity = {
  __proto__ : null,

  get ($outer, selector, $rind) {
    let target, index

    return ($outer.atIndex && ((index = +selector) === index)) ?
      $outer.atIndex(index) : $outer[selector]
  },

  // Setting on things in not allowed because the setting semantics are broken.
  // For our model, the return value should always be the receiver, or a copy
  // of the receiver, with the property changed.

  // Further, note that the return value of a set always returns the value that
  // was tried to be set to, regardless of whether it was successful or not.

  set ($outer, selector, value, $rind) {
    return false
    // return InterMap.get($rind)._externalWrite(selector, value) || false
  },

  has ($outer, selector) {
    // const firstChar = (typeof selector === "symbol") ?
    //   selector.toString()[7] : selector[0]
    switch (selector[0]) {
      case "_"       : return $outer._externalPrivateRead(selector) || false
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      case undefined : return false
    }
    return (selector in $outer)
  },

  // getOwnPropertyDescriptor ($outer, selector) {
  //   switch (selector[0]) {
  //     case "_"       : return $outer._externalPrivateRead(selector) || undefined
  //     // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
  //     case undefined : return undefined
  //   }
  //   return PropertyDescriptor($outer, selector)
  // },

  // ownKeys ($outer) { },

  getPrototypeOf : ALWAYS_NULL ,
  setPrototypeOf : ALWAYS_FALSE,
  defineProperty : ALWAYS_FALSE,
  deleteProperty : ALWAYS_FALSE,
  isExtensible   : ALWAYS_FALSE,
  // preventExtensions ???
}


class TypePrivacyPorosity {
  constructor ($outer) {
    this.$outer = $outer
  }

  get (disguisedFunc, selector, $rind) {
    let target, index
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
}

TypePrivacyPorosity.prototype = SpawnFrom(PrivacyPorosity)





// UNTESTED
const MutablePorosity = {
  __proto__ : null,

  set ($core, selector, value, $inner) {
    const isPublic = (selector[0] !== "_")

    if (!(selector in $core)) {
      delete $core[$KNOWN_SELECTORS]
    }

    switch (typeof value) {
      case "object" :
        if (!isPublic) { break }

        if (value === $inner) {  // Perhaps will force assignments to always be $rinds
          $core[selector] = $inner
          value = $core[RIND]
        }
        else if (value === $core[RIND]) {
          $core[selector] = $inner
        }
        else if (value === null || value[IS_IMMUTABLE] || value.id != null) {
          $core[selector] = value
        }
        else if (value === $core[selector]) {/* NOP */}

        else if ((valueCore = InterMap.get(value))) {
          $core[selector] = (value = valueCore[COPY](true, visited)[RIND])
        }
        else {
          $core[selector] = (value = CopyObject(value, true))
        }
        $core[OUTER][selector] = value
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
        if (isPublic) { $core[OUTER][selector] = value }
        break
    }

    $core[selector] = value
    return true
  },

  deleteProperty ($core, selector, $inner) {
    if (selector in $core) {
      delete $core[$KNOWN_SELECTORS]
      delete $core[selector]
    }

    return true
  }
}

const MutablePorosity_set    = MutablePorosity.set
const MutablePorosity_delete = MutablePorosity.deleteProperty

class DisguisedMutablePorosity {
  constructor ($core) {
    this.$core = $core
  }

  get (disguisedFunc, selector, $inner) {
    return this.$core[selector]
  }

  set (disguisedFunc, selector, value, $inner) {
    return MutablePorosity_set(this.$core, selector, value, $inner)
  }

  has (disguisedFunc, selector, $inner) {
    return (selector in this.$core)
  }

  deleteProperty (disguisedFunc, selector, $inner) {
    return MutablePorosity_delete(this.$core, selector, $inner)
  }
}



class ImmutableInnerPorosity {
  constructor ($core) {
    this.inUse = false
    // this.target = new Proxy($core, this)
    this.target = this.$inner = new Proxy($core, this)
  }

  set ($core, selector, value, $inner) {
    if ($core[selector] !== value) {
      const copy = $inner.mutableCopyExcept(selector)
      copy[selector] = value
      this.target = copy

      this.set = this.detourSet
      this.get = this.detourGet
      this.deleteProperty = this.detourDelete
    }
    return true
  }

  deleteProperty ($core, selector, $inner) {
    switch (selector) {
      case "_IMMUTABILITY" : this.target = $core.asMutableCopy; break
      case "_ALL"          : this.target = $core._newBlank()  ; break
      default :
        if (!$core._hasOwn(selector)) { return true }
        this.target = $inner.mutableCopyExcept(selector)
        break
    }

    this.set = this.detourSet
    this.get = this.detourGet
    this.deleteProperty = this.detourDelete
    return true
  }

  detourSet ($core, selector, value, $inner) {
    this.target[selector] = value
    return true
  }

  detourGet ($core, selector, $inner) {
    return this.target[selector]
  }

  detourDelete ($core, selector, $inner) {
    delete this.target[selector]
    return true
  }
}

ImmutableInnerPorosity.prototype = SpawnFrom(null)
