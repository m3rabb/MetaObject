// UNTESTED
const PrivacyPorosity = {
  __proto__ : null,

  get (outer, selector, rind) {
    let target, index

    return (outer.atIndex && ((index = +selector) === index)) ?
      outer.atIndex(index) : outer[selector]
  },

  // Setting on things in not allowed because the setting semantics are broken.
  // For our model, the return value should always be the receiver, or a copy
  // of the receiver, with the property changed.

  // Further, note that the return value of a set always returns the value that
  // was tried to be set to, regardless of whether it was successful or not.

  set (outer, selector, value, rind) {
    return false
    // return InterMap.get(rind)._externalWrite(selector, value) || false
  },

  has (outer, selector) {
    switch (selector[0]) {
      case "_"       : return outer._externalPrivateRead(selector) || false
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      case undefined : return false
    }
    return (selector in outer)
  },

  // getOwnPropertyDescriptor (outer, selector) {
  //   switch (selector[0]) {
  //     case "_"       : return outer._externalPrivateRead(selector) || undefined
  //     // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
  //     case undefined : return undefined
  //   }
  //   return PropertyDescriptor(outer, selector)
  // },

  // ownKeys (outer) { },

  getPrototypeOf : ALWAYS_NULL ,
  setPrototypeOf : ALWAYS_FALSE,
  defineProperty : ALWAYS_FALSE,
  deleteProperty : ALWAYS_FALSE,
  isExtensible   : ALWAYS_FALSE,
  // preventExtensions ???
}



// UNTESTED
const MutablePorosity = {
  __proto__ : null,

  set (core, selector, value, inner) {
    const isPublic = (selector[0] !== "_")

    // if ((core[selector] === undefined) && !core._hasOwn(selector)) {
    //   delete core[KNOWN_SELECTORS]
    // }

    switch (typeof value) {
      case "object" :
        if (!isPublic) { break }

        if (value === inner) {
          core[selector] = value
          value = core[RIND]
        }
        else if (value === null || value[IS_IMMUTABLE] || value.id != null) {
          core[selector] = value
        }
        else if (value === core[selector]) {/* NOP */}

        else if ((valueCore = InterMap.get(value))) {
          core[selector] = (value = valueCore[COPY](true, visited)[RIND])
        }
        else {
          core[selector] = (value = CopyObject(value, true))
        }
        core[OUTER][selector] = value
        return true

      case "function" : // LOOK: will catch Type things!!!
        // NOTE: Checking for value.constructor is inadequate to prevent func spoofing
        if (selector === "_initFrom_") {
          value = ((tag = InterMap.get(value)) && tag === "_initFrom_") ?
            value : Wrap_initFrom_(value)
        }
        else {
          value = (InterMap.get(value)) ? value : WrapFunc(value)
        }
        // break omitted

      default :
        if (isPublic) { core[OUTER][selector] = value }
        break
    }

    core[selector] = value
    return true
  },

  deleteProperty (core, selector, inner) {
    if ((core[selector] !== undefined) || core._hasOwn(selector)) {
      delete core[KNOWN_SELECTORS]
      delete core[selector]
    }

    return true
  }
}
