(function () {
  "use strict"

  Object.prototype.xyz = 123

  var obj = {}
  var result = obj.xyz
})()

// (function (global) {
//   "use strict"
//
//   function factory(require) {
//     var HandleInheritancePoisoning = true
//
//     function NewStash(spec_) {
//       var stash, selectors, index, selector, value
//
//       stash = SpawnFrom(Stash_root)
//       if (spec_) {
//         if (HandleInheritancePoisoning && spec_ instanceof Object) {
//           selectors = PropertiesOf(spec_)
//           index = selectors.length
//           while (index--) {
//             selector = selectors[index]
//             value    = spec_[selector]
//             if (value !== Object_prototype[selector] ||
//                 IsLocalProperty.call(spec_, selector)) {
//               stash[selector] = spec_[selector]
//             }
//           }
//         } else {
//           for (selector in spec_) {
//             stash[selector] = spec_[selector]
//           }
//         }
//       }
//       return stash
//     }
//
//
//   }
//   if (typeof define === "function" && define.amd) {
//       // AMD. Register as an anonymous module.
//       define(factory)
//   } else {
//       // Browser globals
//       global.Top = factory(global)
//   }
// })(this)
