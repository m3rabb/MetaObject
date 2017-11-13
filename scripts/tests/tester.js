(function () {
  "use strict"

  Object.prototype.xyz = 123

  var obj = {}
  var result = obj.xyz
})()

this.addEventListener("DOMContentLoaded", function(event) {
  // HTMLIFrameElement.prototype.contentWindow
  //
  // Object.defineProperty(
  //   HTMLIFrameElement.prototype, 'contentWindow', {
  //     get: function() {
  //       return this.
  //     }
  //   })


  const originalCreateElement = document.createElement

  document.createElement = function(...args) {
    return originalCreateElement.apply(this, args)
  }
  // const iframe = document.createElement("iframe")
  // iframe.hidden = true
  // document.body.appendChild(iframe)
  // const hasOwnPropertyhandler = iframe.contentWindow.Object.hasOwnProperty
  //
  // const iframe2 = new HTMLIFrameElement()
})


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
