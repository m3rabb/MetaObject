// http://www.answers.com/Q/What_is_the_inside_of_a_loaf_of_bread_called?#slide=1

const WeakKrustMap = new WeakMap()

const SpawnFrom = Object.create

const INNER = Symbol("INNER")
const INTER = Symbol("INTER")
const OUTER = Symbol("OUTER")
const _OUTER = Symbol("_OUTER")
const TOP_SECRET = Symbol("TOP_SECRET")
const NONE = Symbol("NONE FOR YOU!")

const root = SpawnFrom(null)
const Cell_root = SpawnFrom(root)

root[INTER] = TOP_SECRET

const cell0 = SpawnFrom(Cell_root)
cell.name = "A"
cell.childCount = 0
cell.children = []

let NextCode = 65


Cell_root.nextName = function () {
  return String.fromCharCode(++NextCode)
}

Cell_root.friend = function (cell) {
  this.friend = cell
  return this
}

Cell_root.breed = function () {
  const child = SpawnFrom(Cell_root)
  child.name = `${this.nextName()}<-${this.name}:${++this.childCount}`
  child.childCount = 0
  this.children.push(child)
  return child
}

Object.defineProperty(root, OUTER, {
  writable     : true,
  enumerable   : false,
  configurable : false,
  get          : function () {
    return this[OUTER] = this[_OUTER] = new Proxy(this, KrustHandler)
  }
})

const KrustHandler = {
  get (inner, selector, outer) {
    switch (selector[0]) {
      case "_" :
        return NONE
      case undefined :
        // if (selector === OUTER) { return outer }
        if (selector === INTER) { WeakKrustMap.set(outer, this) }
        return undefined
      default :
        const value = inner[selector]
        switch (typeof value) {
          case "function" :
            return WeakKrustMap.get(value) ? value : WrapFunc(value)
          case "object" :
            return (value[INTER] === SECRET) ? value[OUTER] :
              (WeakKrustMap.get(value) ?
                value : new Proxy(value, OutputHandler))
            // return (value instanceof Inner) ? value[OUTER] : value
            // return value && value[OUTER] || value
        }
      default :
        const value = inner[selector]
        switch (typeof value) {
          case "function" :
            return value[OUTER] || WrapFunc(value)
          case "object" :
            return (value[INTER] === SECRET) ? value[OUTER] :
              (WeakKrustMap.get(value) ?
                value : new Proxy(value, OutputHandler))

        if (value) {
          return value[OUTER] || (typeof value === "function" ?
            WrapFunc(value) : value)
          if (outer)
        }
        value && value
          case "function" :
            return WeakKrustMap.get(value) ? value : WrapFunc(value)
          case "object" :
            return (value[INTER] === SECRET) ? value[OUTER] :
              (WeakKrustMap.get(value) ?
                value : new Proxy(value, OutputHandler))
            // return (value instanceof Inner) ? value[OUTER] : value
            // return value && value[OUTER] || value
        }
    }
  }
}

function WrapParam(target) {
  const Krumb = SpawnFrom(null)
  const Krust = SpawnFrom(null)
  const paramHandler = SpawnFrom()
  paramHandler.get = function (object, selector) {
    const current = object[selector]
    switch (typeof current) {
      default         : return current
      case "function" :
        return (current === Krumb[selector]) ?
          Krust[selector] : WrapFunc(current)
      case "object"   :
        if (current[INTER] === SECRET) { return current }
        if (current === Krumb[selector]) { return Krust[selector] }
        Krumb[selector] = current
        return (Krust[selector] =
          WeakKrustMap.get(current) ? current : WrapParam(current))
    }
  }
  paramHandler.set = function (object, selector, value) {
    if (value && value[INTER] === SECRET) {
      const current = object[selector]
      object[selector] = (current && current[INTER] === SECRET) ?
        value : value[OUTER]
    }
    else {
      object[selector] = value
    }
    return true
  }
  return new Proxy(target, paramHandler)
}


      const wrapped = new Proxy(current, ObjHandler)
      return value && (value[INNER] === SECRET) ? value[OUTER] : value
      // return (value instanceof Inner) ? value[OUTER] : value
      // return value && value[OUTER] || value
    }
  }
}



function WrapFunc(Func) {
  return function (...args) {
    const wrappedArgs = WrappedArgs(args)
    const result = Func.apply(this, wrappedArgs)
    switch (typeof result) {
      default         : return result
      case "function" : return Block.new(arg)
      case "object" :
        return (arg[INTER] === SECRET) ?
          arg[OUTER] :
          (WeakKrustMap.get(arg) ?
            arg : Wrapper.new(arg))

    }
  }
}

function WrappedArgs(args) {
  const wrappedArgs = []
  let next = args.length
  while (next--) {
    const arg = args[next]
    switch (typeof arg) {
      default :
        wrappedArgs[next] = arg; break
      case "object" :
        wrappedArgs[next] = (arg[INTER] === SECRET) ?
          arg[OUTER] :
          (WeakKrustMap.get(arg) ?
            arg : Wrapper.new(arg)); break
      case "function" :
        wrappedArgs[next] = Block.new(arg); break
    }
  }
  return wrappedArgs
}


const SpyHandler = {
  get (target, selector, proxy) {
    console.log(`Spy on: ${selector}`)
    const value = target[selector]
    return [value]
  },
  set (target, selector, value, proxy) {
    console.log(`Spy set: ${selector} to value`)
    target[selector] = `THE ${value}`
    return true
  }
}

dog = {name: "fido", setName: function (name) {this.name = name} }
coat = new Proxy(dog, Handler)
dog.coat = coat
spy = new Proxy(coat, SpyHandler)


// const BaseHandler = {
//   set (target, selector, value, original) {
//     console.log("No setting of base root object!")
//     return true
//   }
// }
// const RootHandler = {
//   set (target, selector, value, original) {
//     target[selector] = value
//     return true
//   },
//   get (root, name, inner) {
//     return root._noSuchProperty(name)
//   }
// }
//
// base = new Proxy({name: "BASE_ROOT"}, BaseHandler)
// root = new Proxy(base, RootHandler)
// dogRoot = Object.create(root)
// dogRoot.name = "DOG_ROOT"
//
// dog = Object.create(dogRoot)
// dog.name = "Fido"
//
// base._noSuchProperty = (name) => {
//   console.log(`Has no such property: ${name}!`)
//   return "DUMMY"
// }

// Object.freeze(base)


// function Turtle(name, age) {
//   this.name = name
//   this.age = age
//
//   var handler = {
//       get: (target, name, receiver) => {
//         var validity = receiver === this.shell ? "Valid" : "Invalid";
//         console.log(`${validity} proxy access`)
//         return target[name]
//       }
//   };
//
//   this.growShell = function () {
//     return (this.shell = new Proxy(this, handler))
//   }
// }
//
//
//
//
// var t0 = new Turtle("Princess", 13)
// var t1 = t0.growShell()
// var t2 = new Proxy(t0, {})
// var t3 = new Proxy(t1, {})

// var over = {parent: 333}
// var obj = Object.create(over)
// obj.vis = 123
// obj.invis = 456
//
// var sym = Symbol("__selector")
// obj[sym] = "sel"
//
// var hidden = {
//   writable    : true,
//   enumerable  : false,
//   configurable: true,
// }
// var syms
//
// console.log(`local keys: ${Object.keys(obj)}`)
// console.log(`all props: ${Object.getOwnPropertyNames(obj)}`)
// syms = Object.getOwnPropertySymbols(obj).map(s => s.toString())
// console.log(`symbols: ${syms}`)
//
// Object.defineProperty(obj, "invis", hidden)
// console.log(`local keys: ${Object.keys(obj)}`)
// console.log(`all props: ${Object.getOwnPropertyNames(obj)}`)
// syms = Object.getOwnPropertySymbols(obj).map(s => s.toString())
// console.log(`symbols: ${syms}`)
//
//
// Object.defineProperty(obj, sym, hidden)
// console.log(`local keys: ${Object.keys(obj)}`)
// console.log(`all props: ${Object.getOwnPropertyNames(obj)}`)
// syms = Object.getOwnPropertySymbols(obj).map(s => s.toString())
// console.log(`symbols: ${syms}`)


// var pulp = {abc: 123}
// var proxy_root = new Proxy(pulp, {
//     get(target, selector, rind) {
//         console.log('GET ' + selector);
//         return target[selector];
//     },
//
//     set(target, selector, value, rind) {
//       console.log(`SET ${selector} TO ${value}`);
//       rind[selector] = value;
//       return true
//     }
// })
//
// var r1 = Object.create(proxy_root);


// var o = {}
//
// o.new =
// o.type =


// function turn(turnNumber, turnsleft) {
//   console.log("This is turn number: " + turnNumber)
//   if (turnsleft) {
//     setTimeout(turn, 2000, turnNumber + 1, turnsleft - 1)
//   }
// }
//
// function takeTurns(turnCount) {
//   setTimeout(turn, 2000, 1, turnCount - 1)
//   console.log("Still going!")
//   console.log("Yet, more code!")
// }

//
// function turn(turnNumber) {
//   console.log("This is turn number: " + turnNumber)
// }
//
// function takeTurns(turnCount) {
//   var turnNumber = 1
//   while (turnNumber <= turnCount) {
//     var delay = turnNumber * 2000
//     setTimeout(turn, delay, turnNumber)
//     turnNumber += 1
//   }
// }
