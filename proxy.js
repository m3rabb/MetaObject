// var pulp = NewStash()
// var configuration = NewStash({
//   get: function (pulp, selector, rind) {
//     $
//   }
// })
//
// var p = new Proxy(target, {
//   set: function(target, property, value, receiver) {
//   }
// });
//


function CompareObjects(pulp, other) {
  
}

// "use strict";
var K = Symbol()

function Equals(unknown) {
  if (!(unknown instanceof _Top_root)) { return false }
  const method = unknown[__equalityIntern]
  if (typeof method !== "function") {
    return this._EqualityAttemptOnCounterfeit(unknown)
  }
  Reflect.apply(method, this)
  CompareObjects(this, unknown)
}

function EqualUsing(comparator, unsafebox) {
  if (comparator !== Comparator) { return new Error() }
  Comparator(this, unsafebox)
}
