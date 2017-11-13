describe("Skylighting example", function () {
  describe("The basic approach to defining a type", function () {
    beforeAll(function () {

      function Person(firstName, lastName, age, mood) {
        this.firstName   = firstName
        this.lastName    = lastName
        this.age         = age
        this.mood        = mood
        this.friends     = []

        this.fullName = function () {
          return `${this.firstName} ${this.lastName}`
        }

        this.greeting = function (isVerbose_) {
          const primary = `Hi, my name is ${this.firstName}`
          const secondary = (isVerbose_) ?
             ` I'm ${this.age} and I'm in a ${this.mood} mood.` : ""
          return primary + secondary
        }

        this.addFriend = function (friend) {
          this.friends.push(friend)
          return this
        }

        this.hasFriend = function (friend) {
          return this.friends.includes(friend)
        }

        this.deleteFriend = function (friend) {
          const index = this.friends.indexOf(friend)
          this.friends.splice(index, 1)
          return this
        }
      }

      function Employee(ssn, role) {
        this.ssn        = ssn
        this.role       = role
        this.manager    = null
        this.colleagues = []
      }

      this.fullName = function () {
        return `${this.firstName} ${this.lastName}`
      }

        this.greeting = function (isVerbose_) {
          const primary = `Hi, my name is ${this.firstName}`
          const secondary = (isVerbose_) ?
             ` I'm ${this.age} and I'm in a ${this.mood} mood.` : ""
          return primary + secondary
        }

        this.addFriend = function (friend) {
          this.friends.push(friend)
          return this
        }
      }

    }
})

Object hierarchy poisoning aka Skylighting
The semantics of getters, can make them problematic to use with proxies
