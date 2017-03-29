class Person {
  constructor(name, ssn) {
    this.name = name
    this._ssn = ssn
    // In es6 it also works as in es5: remember es6 class is nothing more than a Function
    // and `new` call the function defined by `constructor`;
    // in es5 works because when you call a `new` on a function the value retuned is the
    // value returned inside the function if it's an object otherwise returns `this`;
    // in es6 remains the same for backward compatibility
    return new Proxy(this, {
      get (target, name, proxy) {
        return (name[0] !== "_") ? target[name] : undefined
      }
    })
  }

  ssn() {
    return this._ssn
  }

  _obscureSSN () {
    return `OBSURED: ${this._ssn}`
  }

  obscure () {
    return this._obscureSSN()
  }

  get obscured () {
    return this._obscureSSN()
  }
}

var target = function () {}
var porosity = {
  apply (target, receiver, args) {
    const array = [target, receiver, args]
    return array
  }
}
var rind = new Proxy(target, porosity)

// =======================

// const DefineProperty     = Object.defineProperty
//
// const VisibleConfiguration = {
//   __proto__   : null,
//   writable    : true,
//   enumerable  : true,
//   configurable: true,
// }
//
// const InvisibleConfiguration = {
//   __proto__   : null,
//   writable    : true,
//   // enumerable  : true,
//   configurable: true,
// }
//
// function Dog(name) {
//   this.name = name
// }
//
// DefineProperty(Dog.prototype, "isImmutable", InvisibleConfiguration)
// var d = new Dog("bob")
// var KNOWNS = Symbol("KNOWNS")
//
// d[KNOWNS] = ["name", "id"]
//
// var a = []
//
// for (n in d) { a.push(n) }
//
// function List(...args) {
//   this.elems = args
// }
//
// var count = 1000
// var nums = []
// while (count--) { nums[count] = count }
// //=======================
//
// const InterMap = new WeakMap()
// const DefineProperty     = Object.defineProperty
// const IS_FACT = Symbol("IS_FACT")
// const MY_FACT = Symbol("MY_FACT")
// const OUTER = Symbol("OUTER")
// const VISIBLE_SYMBOLS = {}
//
// const KrustBehavior = {
//   __proto__ : null,
//
//   get (inner, selector, outer_) {
//     switch (selector[0]) {
//       case "_"       :
//         return undefined
//       case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return undefined }
//     }
//
//     return inner[selector]
//
//     //return (value[IS_INNER] === SECRET) ? value[OUTER] : value
//   },
// }
//
// function EnkrustThing(thing) {
//   const krust = new Proxy(thing, KrustBehavior)
//   InterMap.set(krust, thing)
//   return (thing.$ = thing[OUTER] = krust)
// }
//
// function Dog(name, id) { this.name = name, this.id = id }
//
// var _dog = new Dog("Sparkie", 1334)
// var dog = EnkrustThing(_dog)
// _dog[MY_FACT] = true
//
// DefineProperty(dog, IS_FACT, {
//   get () {
//     return this[MY_FACT]
//   }
// })
//
// //=======================
//
// class Person {
//   constructor(name) {
//     this._name = name
//     // In es6 it also works as in es5: remember es6 class is nothing more than a Function
//     // and `new` call the function defined by `constructor`;
//     // in es5 works because when you call a `new` on a function the value retuned is the
//     // value returned inside the function if it's an object otherwise returns `this`;
//     // in es6 remains the same for backward compatibility
//
//     return new Proxy(this, {
//       get(target, name) {
//         if ((name[0] === "_")) {
//           return "XYXYXXYXY"
//         } else {
//           return target[name]
//         }
//       },
//       set(target, name, value) {
//         target[name] = value
//         return true
//       },
//       defineProperty (target, property, descriptor) {
//         return true
//       }
//     })
//   }
//   name() {
//     return this._name
//   }
//
//   setName(name) {
//     this._name = name
//   }
//
//   set setKname(name) {
//     this._name = name
//   }
//
//   greeting(person) {
//     return `hi ${person.kname}`
//   }
//
//   get _original () { return this }
//
//   get original () { return this }
//
//   orig () { return this }
// }
//
// var mom = new Person("mom")
//
// //=======================
//
// // get kname() {
// //   return this._name
// // }
// Object.defineProperty(mom, "kname", {
//   get: function() {
//     return this._name
//   }
// })
//
//
// var stuff = {}
// var _bob = {}
//
// var bob = new Proxy(_bob, {
//   get(target, name) {
//     return stuff[name]
//   },
//   set(target, name, value) {
//     stuff[name] = value
//     return true
//   },
// })
//
// Object.freeze(bob)
//
//
//
//
//
// var xyzObj = {name: "xyz"}
// var obj = {}
//
// Object.defineProperty(obj, "xyz", {
//   get () { return xyzObj }
// })
//
// function times2(x) { return x * 2}
//
// obj.xyz.abc = times2(333)

//=======================

// function MakeConstructor(baseConstructor, root) {
//   const typeName = baseConstructor.name
//   const funcBody =
//     `return function ${typeName}(...args) {
//       const instance = { __proto__ : ${typeName}._instanceRoot }
//       instance._init(...args)
//       return (args.length) ? instance.beImmutable : instance
//     }`
//   const typeFunc           = Function(funcBody)()
//   const instanceRoot       = root || { __proto__ : null }
//   instanceRoot._init       = baseConstructor
//   instanceRoot.constructor = typeFunc
//   Object.defineProperty(instanceRoot, "beImmutable", {
//     get () { return Object.freeze(this) }
//   })
//   typeFunc._instanceRoot = instanceRoot
//   return typeFunc
// }
//
// function List(elements_) {
//   this._elements = elements_ || []
// }
