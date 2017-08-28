describe("Setting a private property on the inner of mutable object", function() {
  const BREED = Symbol("BREED")

  function mood(newMood) { return `very ${newMood}` }

  beforeAll(function () {
    this.redBall  = SetImmutable({color : "red"})
    this.blueBall = SetImmutable({color : "blue"})

    this.Cat_ = Type.new_({
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
          FOR_ASSIGN : { _mood : mood },
          SHARED     : { _ball : this.redBall },
        },
      ]
    })

    this.Dog_ = Type.new_({
      name   : "Dog",
      define : [
        function _init(name, breed, age) {
          this._setName(name)
          this[BREED] = breed
          this._age   = age
        },

        "SHARED",  { _ball : this.redBall },
      ]
    })
    this.Dog_.beImmutable
  })

  beforeEach(function () {
    this.$rind    = this.Cat_.new("Rufus", "Siamese-tabby", 18)
    this.$pulp    = this.$rind.this
    this.$inner   = this.$pulp[$INNER]
    this.$outer   = this.$inner[$OUTER]
  })

  it("Before setting it's barrier, has no properties", function () {
    expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
  })


  describe("When the value is undefined", function() {
    it("Throws an assignment of undefined error", function () {
      expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      var execution =  () => { this.$pulp._xyz = undefined }
      expect( execution ).toThrowError( /Assignment of undefined/ )
      var newCount = AllProperties(this.$inner[$BARRIER]).length
      expect( newCount ).toBe( 0 )
    })
  })

  describe("When the value is a boolean", function() {
    beforeEach(function () {
      this.value      = true
      this.$pulp._xyz = this.value
    })

    it("Sets the $inner property to the value", function () {
      expect( this.$inner._xyz ).toBe( this.value )
    })

    it("Doesn't set the $outer property", function () {
      expect( this.$outer._xyz ).toBe( undefined )
    })

    it("Has no impact on the receiver's barrier", function () {
      expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
    })

    it("Remains mutable", function () {
      expect( this.$pulp.isMutable ).toBe( true )
    })
  })

  describe("When the value is a number", function() {
    beforeEach(function () {
      this.value      = 49
      this.$pulp._xyz = this.value
    })

    it("Sets the $inner property to the value", function () {
      expect( this.$inner._xyz ).toBe( this.value )
    })

    it("Doesn't set the $outer property", function () {
      expect( this.$outer._xyz ).toBe( undefined )
    })

    it("Has no impact on the receiver's barrier", function () {
      expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
    })

    it("Remains mutable", function () {
      expect( this.$pulp.isMutable ).toBe( true )
    })
  })

  describe("When the value is a string", function() {
    beforeEach(function () {
      this.value      = "Rufus"
      this.$pulp._xyz = this.value
    })

    it("Sets the $inner property to the value", function () {
      expect( this.$inner._xyz ).toBe( this.value )
    })

    it("Doesn't set the $outer property", function () {
      expect( this.$outer._xyz ).toBe( undefined )
    })

    it("Has no impact on the receiver's barrier", function () {
      expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
    })

    it("Remains mutable", function () {
      expect( this.$pulp.isMutable ).toBe( true )
    })
  })

  describe("When the value is a function", function() {
    describe("When the value is an untrusted external", function() {
      beforeEach(function () {
        this.value      = function danger() { return this }
        this.$pulp._xyz = this.value
      })

      it("Sets the $inner property to the function", function () {
        expect( this.$inner._xyz ).toBe( this.value )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the value is used as a handler for a method", function() {
      beforeEach(function () {
        this.value      = this.Cat_.instanceMethodAt("age").handler
        this.$pulp._xyz = this.value
      })

      it("Sets the $inner property to the function", function () {
        expect( this.$inner._xyz ).toBe( this.value )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the value is used as an assigner for a property", function() {
      beforeEach(function () {
        this.value      = mood
        this.$pulp._xyz = this.value
      })

      it("Sets the $inner property to the function", function () {
        expect( this.$inner._xyz ).toBe( this.value )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })


    describe("When the value is an inner wrapper", function() {
      beforeEach(function () {
        this.value      = this.Cat_.instanceMethodAt("age").inner
        this.$pulp._xyz = this.value
      })

      it("Sets the $inner property to the function", function () {
        expect( this.$inner._xyz ).toBe( this.value )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the value is an outer wrapper", function() {
      beforeEach(function () {
        this.value      = this.Cat_.instanceMethodAt("age").outer
        this.$pulp._xyz = this.value
      })

      it("Sets the $inner property to the function", function () {
        expect( this.$inner._xyz ).toBe( this.value )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the value is an tamed wrapper", function() {
      beforeEach(function () {
        this.danger      = function danger() { return this }
        this.$pulp.qrs  = this.danger
        this.tamed       = this.$pulp.qrs
        this.$pulp._xyz = this.tamed
      })

      it("Sets the $inner property to the function", function () {
        expect( this.$inner._xyz ).toBe( this.tamed )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the value is a disguised func/object", function() {
      beforeEach(function () {
        this.value      = this.Cat_
        this.$pulp._xyz = this.value
      })

      it("Sets the $inner property to the function", function () {
        expect( this.$inner._xyz ).toBe( this.value )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })
  })


  describe("When the value is an object", function() {
    describe("When the value is null", function() {
      beforeEach(function () {
        this.value      = null
        this.$pulp._xyz = this.value
      })

      it("Sets the $inner property to the value", function () {
        expect( this.$inner._xyz ).toBe( this.value )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the value is immutable", function() {
      beforeEach(function () {
        this.value      = this.Cat_("Rufus", "Tabby", 18)
        this.$pulp._xyz = this.value
      })

      it("Sets the $inner property to the value", function () {
        expect( this.$inner._xyz ).toBe( this.value )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the value is an immutable JS object", function() {
      beforeEach(function () {
        this.value      = SetImmutable([1, 2, 3])
        this.$pulp._xyz = this.value
      })

      it("Sets the $inner property to the value", function () {
        expect( this.$inner._xyz ).toBe( this.value )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the value is mutable and has an id", function() {
      beforeEach(function () {
        this.value = this.Cat_.new("Rufus", "Tabby", 18)
        this.value.this._setId()
        this.$pulp._xyz = this.value
      })

      it("The value stays mutable", function () {
        expect( this.value.isMutable ).toBe( true )
      })

      it("Sets the $inner property to the value", function () {
        expect( this.$inner._xyz ).toBe( this.value )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the value is the receiver's inner itself", function() {
      beforeEach(function () {
        this.$pulp._xyz = this.$pulp
      })

      it("Sets the $inner property to the receiver's inner", function () {
        expect( this.$inner._xyz ).toBe( this.$pulp )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the value is the receiver's outer itself", function() {
      beforeEach(function () {
        this.$pulp._xyz = this.$rind
      })

      it("Sets the $inner property to the receiver's outer", function () {
        expect( this.$inner._xyz ).toBe( this.$rind )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the value is a mutable object", function() {
      beforeEach(function () {
        this.value      = this.Cat_.new("Rufus", "Tabby", 18)
        this.$pulp._xyz = this.value
      })

      it("Sets the $inner property to the value", function () {
        expect( this.$inner._xyz ).toBe( this.value )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the value is a mutable JS object", function() {
      beforeEach(function () {
        this.value      = [1, 2, 3]
        this.$pulp._xyz = this.value
      })

      it("Sets the $inner property to the value", function () {
        expect( this.$inner._xyz ).toBe( this.value )
      })

      it("Doesn't set the $outer property", function () {
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })


    describe("When the value is another object's inner", function() {
      it("Throws an detected inner error", function () {
        var value = Thing.new_().this
        expect( () => {this.$pulp._xyz = value} ).toThrowError(/forgot to pass the 'this'/)
      })
    })

    describe("When the value is another type's inner", function() {
      it("Throws an detected inner error", function () {
        var value = Type.new_("Cat").this
        expect( () => {this.$pulp._xyz = value} ).toThrowError(/forgot to pass the 'this'/)
      })
    })
  })

  describe("When the property has an assigner", function () {
    it("Executes the assigner", function () {
      this.$pulp._mood = "grumpy"
      expect( this.$inner._mood ).toBe( "very grumpy" )
      expect( this.$outer._mood ).toBe( undefined )
    })

    it("The receiver remains mutable", function () {
      expect( this.$rind.isMutable ).toBe( true )
      this.$pulp._mood = "grumpy"
      expect( this.$rind.isMutable ).toBe( true )
    })

    it("Has no impact on the receiver's barrier", function () {
      expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
    })

    it("Remains mutable", function () {
      expect( this.$pulp.isMutable ).toBe( true )
    })
  })

  describe("When the property already has an initialized value", function () {
    describe("When the existing value is a different value", function () {
      beforeEach(function () {
        this.value      = 100
        this.$pulp._age = this.value
      })

      it("Sets the $inner property to the value", function () {
        expect( this.$inner._age ).toBe( this.value )
      })

      it("Sets the $outer property to the value", function () {
        expect( this.$outer._age ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the existing value is the same object", function () {
      beforeEach(function () {
        this.$pulp._age = 18
      })

      it("The property value remains the same", function () {
        expect( this.$inner._age ).toBe( 18 )
        expect( this.$outer._age ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })
  })


  describe("When the property already has a value", function () {
    describe("When the existing value is a different value", function () {
      it("Set the property to the new value", function () {
        this.$pulp._xyz = this.redBall
        expect( this.$inner._xyz ).toBe( this.redBall )
        expect( this.$outer._xyz ).toBe( undefined )
        this.$pulp._xyz = this.blueBall
        expect( this.$inner._xyz ).toBe( this.blueBall )
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        this.$pulp.xyz = this.redBall
        this.$pulp.xyz = this.blueBall
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        this.$pulp.xyz = this.redBall
        this.$pulp.xyz = this.blueBall
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the existing value is the same object", function () {
      it("Set the property to the new value", function () {
        this.$pulp._xyz = this.redBall
        expect( this.$inner._xyz ).toBe( this.redBall )
        expect( this.$outer._xyz ).toBe( undefined )
        this.$pulp._xyz = this.redBall
        expect( this.$inner._xyz ).toBe( this.redBall )
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Has no impact on the receiver's barrier", function () {
        this.$pulp.xyz = this.redBall
        this.$pulp.xyz = this.redBall
        expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        this.$pulp.xyz = this.redBall
        this.$pulp.xyz = this.redBall
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the existing value is from a shared property", function () {
      describe("When the receiver's type is mutable", function () {
        it("Inherits the value", function () {
          expect( this.$pulp.isMutable ).toBe( true )
          expect( this.$pulp._ball.color ).toBe( "red" )
          expect( this.$pulp._hasOwn("_ball") ).toBe( false )
        })

        describe("When the existing value is a different value", function () {
          beforeEach(function () {
            this.$pulp._ball = this.blueBall
          })

          it("Sets its own property to the new value", function () {
            expect( this.$inner._ball ).toBe( this.blueBall )
            expect( this.$outer._ball ).toBe( undefined )
            expect( this.$pulp._hasOwn("_ball") ).toBe( true )
          })

          it("Has no impact on the receiver's barrier", function () {
            expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
          })

          it("Remains mutable", function () {
            expect( this.$pulp.isMutable ).toBe( true )
          })
        })

        describe("When the existing value is the same object", function () {
          beforeEach(function () {
            this.$pulp._ball = this.redBall
          })

          it("Set its own property to the new value", function () {
            expect( this.$inner._ball ).toBe( this.redBall )
            expect( this.$outer._ball ).toBe( undefined )
            expect( this.$pulp._hasOwn("_ball") ).toBe( true )
          })

          it("Has no impact on the receiver's barrier", function () {
            expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
          })

          it("Remains mutable", function () {
            expect( this.$pulp.isMutable ).toBe( true )
          })
        })
      })

      describe("When the receiver's type is immutable", function () {
        beforeEach(function () {
          this.$rind         = this.Dog_.new("Princess", "Shepard", 13)
          this.$pulp         = this.$rind.this
          this.$inner        = this.$pulp[$INNER]
          this.$outer        = this.$inner[$OUTER]
          this.$barrier      = this.$inner[$BARRIER]
          this.$barrier$root = RootOf(this.$barrier)
        })

        it("Inherits the value", function () {
          expect( this.$pulp.isMutable ).toBe( true )
          expect( this.$pulp._ball.color ).toBe( "red" )
          expect( this.$pulp._hasOwn("_ball") ).toBe( false )
        })

        describe("When the existing value is a different value", function () {
          beforeEach(function () {
            this.$pulp._ball = this.blueBall
          })

          it("Sets its own property to the new value", function () {
            expect( this.$inner._ball ).toBe( this.blueBall )
            expect( this.$outer._ball ).toBe( undefined )
            expect( this.$pulp._hasOwn("_ball") ).toBe( true )
          })

          it("Has no impact on the receiver's barrier", function () {
            expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
          })

          it("Remains mutable", function () {
            expect( this.$pulp.isMutable ).toBe( true )
          })
        })

        describe("When the existing value is the same object", function () {
          beforeEach(function () {
            this.$pulp._ball = this.redBall
          })

          it("Sets its own property to the new value", function () {
            expect( this.$inner._ball ).toBe( this.redBall )
            expect( this.$outer._ball ).toBe( undefined )
            expect( this.$pulp._hasOwn("_ball") ).toBe( true )
          })

          it("Has no impact on the receiver's barrier", function () {
            expect( AllProperties(this.$inner[$BARRIER]).length ).toBe( 0 )
          })

          it("Remains mutable", function () {
            expect( this.$pulp.isMutable ).toBe( true )
          })
        })
      })

    })
  })
})
