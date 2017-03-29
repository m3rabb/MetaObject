class DisguisedPrivacyPorosity {
  constructor (outer) {
    this.outer = outer
  }

  get (disguisedFunc, selector, rind) {
    let target, index
    const outer = this.outer

    return (outer.atIndex && ((index = +selector) === index)) ?
      outer.atIndex(index) : outer[selector]
  }

  has (disguisedFunc, selector) {
    const outer = this.outer
    switch (selector[0]) {
      case "_"       : return outer._externalPrivateRead(selector) || false
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      case undefined : return false
    }
    return (selector in outer)
  }
}

DisguisePrivacyPorosity.prototype = SpawnFrom(PrivacyPorosity.prototype)


const MutablePorosity_set    = MutablePorosity.set
const MutablePorosity_delete = MutablePorosity.deleteProperty

class DisguisedMutablePorosity {
  constructor (core) {
    this.core = core
  }

  get (disguisedFunc, selector, inner) {
    return this.core[selector]
  }

  set (disguisedFunc, selector, value, inner) {
    return MutablePorosity_set.call(this.core, selector, value, inner)
  }

  has (disguisedFunc, selector, inner) {
    return (selector in this.core)
  }

  deleteProperty (disguisedFunc, selector, inner) {
    return MutablePorosity_delete(this.core, selector, inner)
  }
}


// rind
//   disguisedFunc
//   disguisedPrivacyPorosity
//     outer
//
// inner
//   disguisedFunc
//   disguisedMutablePorosity
//     core
//       disguised
//       inner
//       outer
//       rind
//
// rind --> core









/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
