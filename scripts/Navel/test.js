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


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
