// HandAxe._(function (Thing) {
//   var secret = Symbol("SECRET")
//   var t1 = Thing.new_({name: "momo", _age: 50, [secret]: "funny" })
//   t1.addOwnMethod(function bark() { return "Woof!" })
//   t1.beImmutable
//
//   var selectors = t1.ownSelectors
//
// })


var secret = Symbol("SECRET")
var t1 = HandAxe.Thing.new_({name: "momo", _age: 50, [secret]: "funny" })
t1.addOwnMethod(function bark() { return "Woof!" })
t1.beImmutable

var selectors = t1.ownSelectors
