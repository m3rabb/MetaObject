// https://gist.github.com/ifraixedes/e9311748c961f1dbb93e

// Big surprise that getters and setters bypass all proxy!!! JS Bug???

class Person {
  constructor(name) {
    this._name = name
    // In es6 it also works as in es5: remember es6 class is nothing more than a Function
    // and `new` call the function defined by `constructor`;
    // in es5 works because when you call a `new` on a function the value retuned is the
    // value returned inside the function if it's an object otherwise returns `this`;
    // in es6 remains the same for backward compatibility

    return new Proxy(this, {
      get(target, name) {
        if ((name[0] === "_")) {
          return "XYXYXXYXY"
        } else {
          return target[name]
        }
      },
      set(target, name, value) {
        target[name] = value
        return true
      },
      defineProperty (target, property, descriptor) {
        return true
      }
    })
  }
  name() {
    return this._name
  }

  setName(name) {
    this._name = name
  }

  greeting(person) {
    return `hi ${person.kname}`
  }

  get _original () { return this }

  get original () { return this }

  orig () { return this }
}

var mom = new Person("mom")



// get kname() {
//   return this._name
// }
Object.defineProperty(mom, "kname", {
  get: function() {
    return this._name
  }
})
