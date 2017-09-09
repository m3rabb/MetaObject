ObjectSauce(function (
  $BARRIER, $INNER, $OUTER,
  BasicSetObjectImmutable, OwnKeys, RootOf,
  Thing, Type
) {
  "use strict"

  describe("Setting a public property on the inner of mutable object", function() {
    const BREED = Symbol("BREED")

    function mood(newMood) { return `very ${newMood}` }

    beforeAll(function () {
      this.redBall  = BasicSetObjectImmutable({color : "red"})
      this.blueBall = BasicSetObjectImmutable({color : "blue"})

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
            FOR_ASSIGN : { mood : mood },
            SHARED     : { ball : this.redBall },
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

          "SHARED",  { ball : this.redBall },
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
      expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
    })


    describe("When the value is undefined", function() {
      it("Throws an assignment of undefined error", function () {
        expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        var execution =  () => { this.$pulp.xyz = undefined }
        expect( execution ).toThrowError( /Assignment of undefined/ )
        expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
      })
    })

    describe("When the value is a boolean", function() {
      beforeEach(function () {
        this.value     = true
        this.$pulp.xyz = this.value
      })

      it("Sets the $inner property to the value", function () {
        expect( this.$inner.xyz ).toBe( this.value )
      })

      it("Sets the $outer property to the value", function () {
        expect( this.$outer.xyz ).toBe( this.value )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the value is a number", function() {
      beforeEach(function () {
        this.value     = 49
        this.$pulp.xyz = this.value
      })

      it("Sets the $inner property to the value", function () {
        expect( this.$inner.xyz ).toBe( this.value )
      })

      it("Sets the $outer property to the value", function () {
        expect( this.$outer.xyz ).toBe( this.value )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the value is a string", function() {
      beforeEach(function () {
        this.value     = "Rufus"
        this.$pulp.xyz = this.value
      })

      it("Sets the $inner property to the value", function () {
        expect( this.$inner.xyz ).toBe( this.value )
      })

      it("Sets the $outer property to the value", function () {
        expect( this.$outer.xyz ).toBe( this.value )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })


    describe("When the value is a function", function() {
      describe("When the value is an untrusted external", function() {
        beforeEach(function () {
          this.value     = function danger() { return this }
          this.$pulp.xyz = this.value
        })

        it("Wraps the function, and sets the $inner property to a tamed function", function () {
          expect( this.$inner.xyz ).not.toBe( this.value )
          expect( this.$inner.xyz.name ).toBe( "danger_$tamed" )
        })

        it("Wraps the function, and sets the $outer property to a tamed function", function () {
          expect( this.$outer.xyz ).not.toBe( this.value )
          expect( this.$outer.xyz.name ).toBe( "danger_$tamed" )
        })

        it("Sets the $inner and $outer to the same function", function () {
          expect( this.$inner.xyz ).toBe( this.$outer.xyz )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })

      describe("When the value is used as a handler for a method", function() {
        beforeEach(function () {
          this.value     = this.Cat_.methodAt("age").handler
          this.$pulp.xyz = this.value
        })

        it("Wraps the function, and sets the $inner property to a tamed function", function () {
          expect( this.$inner.xyz ).not.toBe( this.value )
          expect( this.$inner.xyz.name ).toBe( "age_$tamed" )
        })

        it("Wraps the function, and sets the $outer property to a tamed function", function () {
          expect( this.$outer.xyz ).not.toBe( this.value )
          expect( this.$outer.xyz.name ).toBe( "age_$tamed" )
        })

        it("Sets the $inner and $outer to the same function", function () {
          expect( this.$inner.xyz ).toBe( this.$outer.xyz )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })

      describe("When the value is used as an assigner for a property", function() {
        beforeEach(function () {
          this.value     = mood
          this.$pulp.xyz = this.value
        })

        it("Wraps the function, and sets the $inner property to a tamed function", function () {
          expect( this.$inner.xyz ).not.toBe( this.value )
          expect( this.$inner.xyz.name ).toBe( "mood_$tamed" )
        })

        it("Wraps the function, and sets the $outer property to a tamed function", function () {
          expect( this.$outer.xyz ).not.toBe( this.value )
          expect( this.$outer.xyz.name ).toBe( "mood_$tamed" )
        })

        it("Sets the $inner and $outer to the same function", function () {
          expect( this.$inner.xyz ).toBe( this.$outer.xyz )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })


      describe("When the value is an inner wrapper", function() {
        beforeEach(function () {
          this.value     = this.Cat_.methodAt("age").inner
          this.$pulp.xyz = this.value
        })

        it("Sets the $inner property to the inner wrapper", function () {
          expect( this.$inner.xyz ).toBe( this.value )
        })

        it("Sets the $outer property to the outer wrapper of the inner wrapper", function () {
          var outerWrapper = this.Cat_.methodAt("age").outer
          expect( this.$outer.xyz ).toBe( outerWrapper )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })

      describe("When the value is an outer wrapper", function() {
        beforeEach(function () {
          this.value     = this.Cat_.methodAt("age").outer
          this.$pulp.xyz = this.value
        })

        it("Sets the $inner property to the value", function () {
          expect( this.$inner.xyz ).toBe( this.value )
        })

        it("Sets the $outer property to the value", function () {
          expect( this.$outer.xyz ).toBe( this.value )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })

      describe("When the value is an tamed wrapper", function() {
        beforeEach(function () {
          this.danger    = function danger() { return this }
          this.$pulp.qrs = this.danger
          this.tamed     = this.$pulp.qrs
          this.$pulp.xyz = this.tamed
        })

        it("Sets the $inner property to the value", function () {
          expect( this.$inner.xyz ).toBe( this.tamed )
          expect( this.$inner.xyz.name ).toBe( "danger_$tamed" )
        })

        it("Sets the $outer property to the value", function () {
          expect( this.$outer.xyz ).toBe( this.tamed )
          expect( this.$outer.xyz.name ).toBe( "danger_$tamed" )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })

      describe("When the value is a disguised func/object", function() {
        beforeEach(function () {
          this.value     = this.Cat_
          this.$pulp.xyz = this.value
        })

        it("Sets the $inner property to the value", function () {
          expect( this.$inner.xyz ).toBe( this.value )
        })

        it("Sets the $outer property to the value", function () {
          expect( this.$outer.xyz ).toBe( this.value )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })
    })


    describe("When the value is an object", function() {
      describe("When the value is null", function() {
        beforeEach(function () {
          this.value     = null
          this.$pulp.xyz = this.value
        })

        it("Sets the $inner property to the value", function () {
          expect( this.$inner.xyz ).toBe( this.value )
        })

        it("Sets the $outer property to the value", function () {
          expect( this.$outer.xyz ).toBe( this.value )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })

      describe("When the value is immutable", function() {
        beforeEach(function () {
          this.value      = this.Cat_("Rufus", "Tabby", 18)
          this.$pulp.xyz = this.value
        })

        it("Sets the $inner property to the value", function () {
          expect( this.$inner.xyz ).toBe( this.value )
        })

        it("Sets the $outer property to the value", function () {
          expect( this.$outer.xyz ).toBe( this.value )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })

      describe("When the value is an immutable JS object", function() {
        beforeEach(function () {
          this.value     = BasicSetObjectImmutable([1, 2, 3])
          this.$pulp.xyz = this.value
        })

        it("Sets the $inner property to the value", function () {
          expect( this.$inner.xyz ).toBe( this.value )
        })

        it("Sets the $outer property to the value", function () {
          expect( this.$outer.xyz ).toBe( this.value )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })

      describe("When the value is mutable and has an id", function() {
        beforeEach(function () {
          this.value = this.Cat_.new("Rufus", "Tabby", 18)
          this.value.this._setId()
          this.$pulp.xyz = this.value
        })

        it("The value stays mutable", function () {
          expect( this.value.isMutable ).toBe( true )
        })

        it("Sets the $inner property to the value", function () {
          expect( this.$inner.xyz ).toBe( this.value )
        })

        it("Sets the $outer property to the value", function () {
          expect( this.$outer.xyz ).toBe( this.value )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })

      describe("When the value is the receiver's inner itself", function() {
        beforeEach(function () {
          this.$pulp.xyz = this.$pulp
        })

        it("Sets the $inner property to the receiver's outer", function () {
          expect( this.$inner.xyz ).toBe( this.$rind )
        })

        it("Sets the $outer property to the receiver's outer", function () {
          expect( this.$outer.xyz ).toBe( this.$rind )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })

      describe("When the value is the receiver's outer itself", function() {
        beforeEach(function () {
          this.$pulp.xyz = this.$rind
        })

        it("Sets the $inner property to the receiver's outer", function () {
          expect( this.$inner.xyz ).toBe( this.$rind )
        })

        it("Sets the $outer property to the receiver's outer", function () {
          expect( this.$outer.xyz ).toBe( this.$rind )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })

      describe("When the value is a mutable object", function() {
        beforeEach(function () {
          this.value = this.Cat_.new("Rufus", "Tabby", 18)
          this.$pulp.xyz = this.value
        })

        it("Sets the $inner property to a copy of the value", function () {
          expect( this.$inner.xyz ).not.toBe( this.value )
          expect( this.$inner.xyz.asString ).toBe( "Rufus:18" )
        })

        it("Sets the $outer property to a copy of the value", function () {
          expect( this.$outer.xyz ).not.toBe( this.value )
          expect( this.$outer.xyz.asString ).toBe( "Rufus:18" )
        })

        it("Sets the $inner and $outer to the same copy", function () {
          expect( this.$inner.xyz ).toBe( this.$outer.xyz )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })

      describe("When the value is a mutable JS object", function() {
        beforeEach(function () {
          this.value     = [1, 2, 3]
          this.$pulp.xyz = this.value
        })

        it("Sets the $inner property to a copy of the value", function () {
          expect( this.$inner.xyz ).not.toBe( this.value )
          expect( this.$inner.xyz ).toEqual( this.value )
        })

        it("Sets the $outer property to a copy of the value", function () {
          expect( this.$outer.xyz ).not.toBe( this.value )
          expect( this.$outer.xyz ).toEqual( this.value )
        })

        it("Sets the $inner and $outer to the same copy", function () {
          expect( this.$inner.xyz ).toBe( this.$outer.xyz )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })


      describe("When the value is another object's inner", function() {
        it("Throws an detected inner error", function () {
          var value = Thing.new_().this
          expect( () => {this.$pulp.xyz = value} ).toThrowError(/forgot to pass the 'this'/)
        })
      })

      describe("When the value is another type's inner", function() {
        it("Throws an detected inner error", function () {
          var value = Type.new_("Cat").this
          expect( () => {this.$pulp.xyz = value} ).toThrowError(/forgot to pass the 'this'/)
        })
      })
    })

    describe("When the property has an assigner", function () {
      it("Executes the assigner", function () {
        this.$pulp.mood = "grumpy"
        expect( this.$inner.mood ).toBe( "very grumpy" )
        expect( this.$outer.mood ).toBe( "very grumpy" )
      })

      it("The receiver remains mutable", function () {
        expect( this.$rind.isMutable ).toBe( true )
        this.$pulp.mood = "grumpy"
        expect( this.$rind.isMutable ).toBe( true )
      })

      it("Has no impact on the receiver's barrier", function () {
        expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
      })

      it("Remains mutable", function () {
        expect( this.$pulp.isMutable ).toBe( true )
      })
    })

    describe("When the property already has an initialized value", function () {
      describe("When the existing value is a different value", function () {
        beforeEach(function () {
          this.value      = "Bozo"
          this.$pulp.name = this.value
        })

        it("Sets the $inner property to the value", function () {
          expect( this.$inner.name ).toBe( this.value )
        })

        it("Sets the $outer property to the value", function () {
          expect( this.$outer.name ).toBe( this.value )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })

      describe("When the existing value is the same object", function () {
        beforeEach(function () {
          this.$pulp.name = "Rufus"
        })

        it("The property value remains the same", function () {
          expect( this.$inner.name ).toBe( "Rufus" )
          expect( this.$outer.name ).toBe( "Rufus" )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })
    })

    describe("When the property already has a value", function () {
      describe("When the existing value is a different value", function () {
        it("Set the property to the new value", function () {
          this.$pulp.xyz = this.redBall
          expect( this.$inner.xyz ).toBe( this.redBall )
          expect( this.$outer.xyz ).toBe( this.redBall )
          this.$pulp.xyz = this.blueBall
          expect( this.$inner.xyz ).toBe( this.blueBall )
          expect( this.$outer.xyz ).toBe( this.blueBall )
        })

        it("Has no impact on the receiver's barrier", function () {
          this.$pulp.xyz = this.redBall
          this.$pulp.xyz = this.blueBall
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
        })

        it("Remains mutable", function () {
          this.$pulp.xyz = this.redBall
          this.$pulp.xyz = this.blueBall
          expect( this.$pulp.isMutable ).toBe( true )
        })
      })

      describe("When the existing value is the same object", function () {
        it("The property value remains the same", function () {
          this.$pulp.xyz = this.redBall
          expect( this.$inner.xyz ).toBe( this.redBall )
          expect( this.$outer.xyz ).toBe( this.redBall )
          this.$pulp.xyz = this.redBall
          expect( this.$inner.xyz ).toBe( this.redBall )
          expect( this.$outer.xyz ).toBe( this.redBall )
        })

        it("Has no impact on the receiver's barrier", function () {
          this.$pulp.xyz = this.redBall
          this.$pulp.xyz = this.redBall
          expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
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
            expect( this.$pulp.ball.color ).toBe( "red" )
            expect( this.$pulp.hasOwn("ball") ).toBe( false )
          })

          describe("When the existing value is a different value", function () {
            beforeEach(function () {
              this.$pulp.ball = this.blueBall
            })

            it("Sets its own property to the new value", function () {
              expect( this.$inner.ball ).toBe( this.blueBall )
              expect( this.$outer.ball ).toBe( this.blueBall )
              expect( this.$pulp.hasOwn("ball") ).toBe( true )
            })

            it("Has no impact on the receiver's barrier", function () {
              expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
            })

            it("Remains mutable", function () {
              expect( this.$pulp.isMutable ).toBe( true )
            })
          })

          describe("When the existing value is the same object", function () {
            beforeEach(function () {
              this.$pulp.ball = this.redBall
            })

            it("Set its own property to the new value", function () {
              expect( this.$inner.ball ).toBe( this.redBall )
              expect( this.$outer.ball ).toBe( this.redBall )
              expect( this.$pulp.hasOwn("ball") ).toBe( true )
            })

            it("Has no impact on the receiver's barrier", function () {
              expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
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
            expect( this.$pulp.ball.color ).toBe( "red" )
            expect( this.$pulp.hasOwn("ball") ).toBe( false )
          })

          describe("When the existing value is a different value", function () {
            beforeEach(function () {
              this.$pulp.ball = this.blueBall
            })

            it("Sets its own property to the new value", function () {
              expect( this.$inner.ball ).toBe( this.blueBall )
              expect( this.$outer.ball ).toBe( this.blueBall )
              expect( this.$pulp.hasOwn("ball") ).toBe( true )
            })

            it("Has no impact on the receiver's barrier", function () {
              expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
            })

            it("Remains mutable", function () {
              expect( this.$pulp.isMutable ).toBe( true )
            })
          })

          describe("When the existing value is the same object", function () {
            beforeEach(function () {
              this.$pulp.ball = this.redBall
            })

            it("Set its own property to the new value", function () {
              expect( this.$inner.ball ).toBe( this.redBall )
              expect( this.$outer.ball ).toBe( this.redBall )
              expect( this.$pulp.hasOwn("ball") ).toBe( true )
            })

            it("Has no impact on the receiver's barrier", function () {
              expect( OwnKeys(this.$inner[$BARRIER]).length ).toBe( 0 )
            })

            it("Remains mutable", function () {
              expect( this.$pulp.isMutable ).toBe( true )
            })
          })
        })

      })
    })
  })
})
