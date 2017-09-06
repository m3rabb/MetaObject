_ObjectSauce(function (Thing, Type, OSauce) {
  "use strict"

  const Dog = Type({
    name : "Dog",
    supertype : Thing,

    shared : {
      boneyard : "345 Bone Way",
    },

    define : [
      "MANDATORY", [
        function setName(name) {
          this._basicSet("name", name)
        },

        "setAge"
      ],

      "SHARED", { hasTeeth : true },

      function _init(name, age, breed) {
        this.setName(name)
        this.setAge(age)
        this.breed = breed
      },

      "ALIAS", {
        yowl : "howl"
      },

      { RETROACTIVE : function speak() {
        return `My name is ${this.name}!`
      } },

      "LAZY",

      function howl() {
        return "AooooohhH!!!"
      },

      {
        SETTER : "setBreed",
      },

      "LAZY", function humanAge() {
        return this.age * 7
      },
    ]
  })

  OSauce.Dog = Dog

})
