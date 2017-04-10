// UNTESTED
const PrivacyPorosity = {
  __proto__ : null,

  get ($outer, selector, target) {
    let index
    return ($outer.atIndex && ((index = +selector) === index)) ?
      $outer.atIndex(index) : $outer[selector]
  },

  // Setting on things in not allowed because the setting semantics are broken.
  // For our model, the return value should always be the receiver, or a copy
  // of the receiver, with the property changed.

  // Further, note that the return value of a set always returns the value that
  // was tried to be set to, regardless of whether it was successful or not.

  set ($outer, selector, value, target) {
    return false
    // return InterMap.get(target)._externalWrite(selector, value) || false
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

  get (disguisedFunc, selector, target) {
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
}

TypePrivacyPorosity.prototype = SpawnFrom(PrivacyPorosity)





// UNTESTED
const MutablePorosity = {
  __proto__ : null,

  set ($inner, selector, value, $flesh) {
    const isPublic = (selector[0] !== "_")

    if (!(selector in $inner)) {
      delete $inner[$KNOWN_SELECTORS]
    }

    switch (typeof value) {
      case "object" :
        if (!isPublic) { break }

        if (value === $flesh) {  // Perhaps will force assignments to always be target!!!
          $inner[selector] = $flesh
          value = $inner[RIND]
        }
        else if (value === $inner[RIND]) {
          $inner[selector] = $flesh
        }
        else if (value === null || value[IS_IMMUTABLE] || value.id != null) {
          $inner[selector] = value
        }
        else if (value === $inner[selector]) {/* NOP */}

        else if ((valueCore = InterMap.get(value))) {
          $inner[selector] = (value = valueCore[COPY](true, visited)[RIND])
        }
        else {
          $inner[selector] = (value = CopyObject(value, true))
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

  deleteProperty ($inner, selector, $flesh) {
    if (selector in $inner) {
      delete $inner[$KNOWN_SELECTORS]
      delete $inner[selector]
    }

    return true
  }
}

const MutablePorosity_set    = MutablePorosity.set
const MutablePorosity_delete = MutablePorosity.deleteProperty

class DisguisedMutablePorosity {
  constructor ($inner) {
    this.$inner = $inner
  }

  get (disguisedFunc, selector, $flesh) {
    return this.$inner[selector]
  }

  set (disguisedFunc, selector, value, $flesh) {
    return MutablePorosity_set(this.$inner, selector, value, $flesh)
  }

  has (disguisedFunc, selector, $flesh) {
    return (selector in this.$inner)
  }

  deleteProperty (disguisedFunc, selector, $flesh) {
    return MutablePorosity_delete(this.$inner, selector, $flesh)
  }
}



class ImmutableInnerPorosity {
  constructor ($inner) {
    this.inUse = false
    this.target = this.$flesh = new Proxy($inner, this)
  }

  set ($inner, selector, value, $flesh) {
    if ($inner[selector] !== value) {
      const copy = $flesh.mutableCopyExcept(selector)
      copy[selector] = value
      this.target = copy

      this.set = this.detourSet
      this.get = this.detourGet
      this.deleteProperty = this.detourDelete
    }
    return true
  }

  deleteProperty ($inner, selector, $flesh) {
    switch (selector) {
      case "_IMMUTABILITY" : this.target = $inner.asMutableCopy; break
      case "_ALL"          : this.target = $inner._newBlank()  ; break
      default :
        if (!$inner._hasOwn(selector)) { return true }
        this.target = $flesh.mutableCopyExcept(selector)
        break
    }

    this.set = this.detourSet
    this.get = this.detourGet
    this.deleteProperty = this.detourDelete
    return true
  }

  detourSet ($inner, selector, value, $flesh) {
    this.target[selector] = value
    return true
  }

  detourGet ($inner, selector, $flesh) {
    return this.target[selector]
  }

  detourDelete ($inner, selector, $flesh) {
    delete this.target[selector]
    return true
  }
}

ImmutableInnerPorosity.prototype = SpawnFrom(null)
