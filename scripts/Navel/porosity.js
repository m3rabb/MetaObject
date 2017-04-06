// UNTESTED
const PrivacyPorosity = {
  __proto__ : null,

  get ($plup, selector, target) {
    let index
    return ($plup.atIndex && ((index = +selector) === index)) ?
      $plup.atIndex(index) : $plup[selector]
  },

  // Setting on things in not allowed because the setting semantics are broken.
  // For our model, the return value should always be the receiver, or a copy
  // of the receiver, with the property changed.

  // Further, note that the return value of a set always returns the value that
  // was tried to be set to, regardless of whether it was successful or not.

  set ($plup, selector, value, target) {
    return false
    // return InterMap.get(target)._externalWrite(selector, value) || false
  },

  has ($plup, selector) {
    // const firstChar = (typeof selector === "symbol") ?
    //   selector.toString()[7] : selector[0]
    switch (selector[0]) {
      case "_"       : return $plup._externalPrivateRead(selector) || false
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      case undefined : return false
    }
    return (selector in $plup)
  },

  // getOwnPropertyDescriptor ($plup, selector) {
  //   switch (selector[0]) {
  //     case "_"       : return $plup._externalPrivateRead(selector) || undefined
  //     // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
  //     case undefined : return undefined
  //   }
  //   return PropertyDescriptor($plup, selector)
  // },

  // ownKeys ($plup) { },

  getPrototypeOf : ALWAYS_NULL ,
  setPrototypeOf : ALWAYS_FALSE,
  defineProperty : ALWAYS_FALSE,
  deleteProperty : ALWAYS_FALSE,
  isExtensible   : ALWAYS_FALSE,
  // preventExtensions ???
}


class TypePrivacyPorosity {
  constructor ($plup) {
    this.$plup = $plup
  }

  get (disguisedFunc, selector, target) {
    let   index
    const $plup = this.$plup

    return ($plup.atIndex && ((index = +selector) === index)) ?
      $plup.atIndex(index) : $plup[selector]
  }

  has (disguisedFunc, selector) {
    const $plup = this.$plup
    // const firstChar = (typeof selector === "symbol") ?
    //   selector.toString()[7] : selector[0]
    switch (selector[0]) {
      case "_"       : return $plup._externalPrivateRead(selector) || false
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      case undefined : return false
    }
    return (selector in $plup)
  }
}

TypePrivacyPorosity.prototype = SpawnFrom(PrivacyPorosity)





// UNTESTED
const MutablePorosity = {
  __proto__ : null,

  set ($core, selector, value, $twin) {
    const isPublic = (selector[0] !== "_")

    if (!(selector in $core)) {
      delete $core[$KNOWN_SELECTORS]
    }

    switch (typeof value) {
      case "object" :
        if (!isPublic) { break }

        if (value === $twin) {  // Perhaps will force assignments to always be target!!!
          $core[selector] = $twin
          value = $core[RIND]
        }
        else if (value === $core[RIND]) {
          $core[selector] = $twin
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
        $core[$PULP][selector] = value
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
        if (isPublic) { $core[$PULP][selector] = value }
        break
    }

    $core[selector] = value
    return true
  },

  deleteProperty ($core, selector, $twin) {
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

  get (disguisedFunc, selector, $twin) {
    return this.$core[selector]
  }

  set (disguisedFunc, selector, value, $twin) {
    return MutablePorosity_set(this.$core, selector, value, $twin)
  }

  has (disguisedFunc, selector, $twin) {
    return (selector in this.$core)
  }

  deleteProperty (disguisedFunc, selector, $twin) {
    return MutablePorosity_delete(this.$core, selector, $twin)
  }
}



class ImmutableInnerPorosity {
  constructor ($core) {
    this.inUse = false
    this.target = this.$twin = new Proxy($core, this)
  }

  set ($core, selector, value, $twin) {
    if ($core[selector] !== value) {
      const copy = $twin.mutableCopyExcept(selector)
      copy[selector] = value
      this.target = copy

      this.set = this.detourSet
      this.get = this.detourGet
      this.deleteProperty = this.detourDelete
    }
    return true
  }

  deleteProperty ($core, selector, $twin) {
    switch (selector) {
      case "_IMMUTABILITY" : this.target = $core.asMutableCopy; break
      case "_ALL"          : this.target = $core._newBlank()  ; break
      default :
        if (!$core._hasOwn(selector)) { return true }
        this.target = $twin.mutableCopyExcept(selector)
        break
    }

    this.set = this.detourSet
    this.get = this.detourGet
    this.deleteProperty = this.detourDelete
    return true
  }

  detourSet ($core, selector, value, $twin) {
    this.target[selector] = value
    return true
  }

  detourGet ($core, selector, $twin) {
    return this.target[selector]
  }

  detourDelete ($core, selector, $twin) {
    delete this.target[selector]
    return true
  }
}

ImmutableInnerPorosity.prototype = SpawnFrom(null)
