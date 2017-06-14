const Dog = Type({
  name : "Dog",
  supertype : Thing,

  shared : {
    boneyard : "345 Bone Way",
  },

  define : [
    "SHARED", { hasTeeth : true },

    function _init(name, age, breed) {
      this.name = name
      this.age  = age
      this.breed = breed
    },

    "ALIAS", {
      yowl : "howl"
    },

    function speak() {
      return `My name is ${this.name}!`
    },

    function howl() {
      return "AooooohhH!!!"
    },

    {
      SETTER : "setBreed",
    },

    "LAZY", function humanAge() {
      return this.age * 7
    },

    "MANDATORY", [
      function setName(name) {
        this.name = name
      },

      "setAge"
    ]
  ]
})
