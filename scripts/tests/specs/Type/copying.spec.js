describe("Type copying", function () {
  const BREED = Symbol("BREED")

  function mood(newMood) { return `very ${newMood}` }

  beforeAll(function () {
    this.redBall = SetImmutable({color : "red"})

    this.CatSpec = {
      name   : "Cat",
      define : [
        function _init(name, breed, age) {
          this._setName(name)
          this[BREED] = breed
          this._age   = age
        },

        function age() { return this._age },

        function asString() { return `${this.name}:${this.age}` },

        {
          FOR_ASSIGN    : { mood : mood },
          SHARED        : { ball : this.redBall },
          FOR_MANDATORY : "stick"
        },
      ]
    }
  })


  beforeEach(function () {
    this.Cat = Type(this.CatSpec)
    var id = this.Cat.id
  })

  describe("#copy", function () {
    describe("When called with 0 args", function () {
      beforeEach(function () {
        this.copy = this.Cat.copy()
      })

      describe("In the answer", function () {
        it("has the same name", function () {
          expect( this.copy.name ).toBe( this.Cat.name )
        })

        it("has the same supertypes", function () {
          expect( this.copy.supertypes ).toBe( this.Cat.supertypes )
          expect( IsFrosted(this.copy.supertypes) ).toBe( true )
        })

        it("has no context", function () {
          expect( this.copy.context ).toBe( null )
        })

        it("has a different id", function () {
          expect( this.copy.id ).toBe( this.Cat.id )
        })

        it("has the same methods", function () {
          expect( this.copy.methods ).toEqual( this.Cat.methods )
        })
      })
    })

    // describe("When called with 1 args: immutability", function () {
    //
    // })
  })
})









// xdescribe("Create_new", function () {
//   function _init(name, age) {
//     this.name = name
//     this.age  = age
//   }
//
//   beforeEach(function () {
//     this.Cat_root = SpawnFrom(Core_root)
//     this.Cat_root._init = _init
//     this.BlankCat = CoreConstructorFor(this.Cat_root)
//     this.new       = Create_new(this.BlankCat)
//   })
//
//   it("answers a new function named 'new'", function () {
//     const func = Create_new(this.BlankCat)
//     expect( typeof func ).toBe( "function" )
//     expect( func.name ).toBe( "new" )
//   })
//
//   describe("When run", function () {
//     it("answers the rind of a newly initialized object", function () {
//       const cat = this.new("Nutmeg", 1)
//       cat.xyz = 123
//       const catCore = InterMap.get(cat)
//       expect( catCore[RIND] ).toBe( cat )
//     })
//
//     it("the new object is of the type of the Blank", function () {
//       const cat = this.new("Nutmeg", 1)
//       const catCore = InterMap.get(cat)
//       expect( RootOf(catCore) ).toBe( this.Cat_root )
//     })
//   })
// })
//
//
// xdescribe("CreateFactory", function () {
//   function _init(id, name) {
//     this.id   = id
//     this.name = name
//   }
//
//   function beImmutable() {
//     this[IS_IMMUTABLE] = true
//     Frost(this[OUTER])
//   }
//
//   beforeEach(function () {
//     // REVISIT once Types are fully formed
//     this.Cat_root = SpawnFrom(Core_root)
//     this.Cat_root._init = _init
//     AddGetter(this.Cat_root, beImmutable)
//     this.BlankCat = CoreConstructorFor(this.Cat_root)
//     this.Cat = CreateFactory(this.BlankCat)
//   })
//
//   it("answers a new constructor function named $type", function () {
//     expect( typeof this.Cat ).toBe( "function" )
//     expect( this.Cat.name ).toBe( "$type" )
//   })
//
//   it("the constructor has no prototype", function () {
//     expect( this.Cat.prototype ).toBe( undefined )
//   })
//
//   describe("When run", function () {
//     it("answers the rind of a newly initialized object", function () {
//       const cat = new this.Cat("Nutmeg", 1)
//       cat.xyz = 123
//       const catCore = InterMap.get(cat)
//       expect( catCore[RIND] ).toBe( cat )
//     })
//
//     it("the new object is of the type of the Blank", function () {
//       const cat = this.Cat("Nutmeg", 1)
//       const catCore = InterMap.get(cat)
//       expect( RootOf(catCore) ).toBe( this.Cat_root )
//     })
//
//     it("the outside of the new object is immutable", function () {
//       const cat = this.Cat("Nutmeg", 1)
//       const catCore = InterMap.get(cat)
//       expect( catCore[IS_IMMUTABLE] ).toBe( true )
//       expect( IsFrosted(cat) ).toBe( true )
//     })
//
//     it("but the inside of the new object is mmutable", function () {
//       const cat = this.Cat("Nutmeg", 1)
//       const catCore = InterMap.get(cat)
//       expect( IsFrosted(catCore) ).toBe( false )
//     })
//   })
//
//   xdescribe("When used with instanceof", function () {
//     it("answers true if the object is an instance of the type", function () {
//       const cat = this.Cat("Nutmeg", 1)
//     })
//   })
// })
