// beforeEach(function () {
//   jasmine.addMatchers({
//     toBePlaying: function () {
//       return {
//         compare: function (actual, expected) {
//           var player = actual
//
//           return {
//             pass: player.currentlyPlayingSong === expected && player.isPlaying
//           }
//         }
//       }
//     }
//   })
// })

beforeEach(function() {
  this.addMatchers({
    toBeReferencedFrom : function (object) {
      var target, propertyName
      target = this.actual
      for (propertyName in object) {
        if (object[propertyName] === target) { return true }
      }
      return false
    }
  })
})
