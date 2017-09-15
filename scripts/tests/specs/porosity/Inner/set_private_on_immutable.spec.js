ObjectSauce.ImplementationTesting(function (
  $BARRIER, $INNER, $OUTER, $RIND,
  CrudeBeImmutable, OwnKeys, RootOf,
  Thing, Type
) {
  "use strict"

  describe("Setting a private property on the inner of immutable object", function() {
    const BREED = Symbol("BREED")

    function mood(newMood) { return `very ${newMood}` }

    beforeAll(function () {
      this.redBall  = CrudeBeImmutable({color : "red"})
      this.blueBall = CrudeBeImmutable({color : "blue"})

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
      this.$rind         = this.Cat_("Rufus", "Siamese-tabby", 18)
      this.$pulp         = this.$rind.this
      this.$inner        = this.$pulp[$INNER]
      this.$outer        = this.$inner[$OUTER]
      this.$barrier      = this.$inner[$BARRIER]
      this.$barrier$root = RootOf(this.$barrier)
    })

    it("Before setting it's barrier, has no properties", function () {
      expect( OwnKeys(this.$barrier).length ).toBe( 0 )
    })


    describe("When the value is undefined", function() {
      it("Throws an assignment of undefined error", function () {
        var priorCount = OwnKeys(this.$barrier).length
        expect( priorCount ).toBe( 0 )
        var execution =  () => { this.$pulp._xyz = undefined }
        expect( execution ).toThrowError( /Assignment of undefined/ )
        expect( OwnKeys(this.$barrier).length ).toBe( 0 )
      })
    })

    describe("When the value is a boolean", function() {
      beforeEach(function () {
        this.value      = true
        this.$pulp._xyz = this.value
      })

      it("Doesn't set the property in the receiver, itself", function () {
        expect( this.$inner._xyz ).toBe( undefined )
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Sets its barrier to the inner of a copy of the target", function () {
        expect( this.$barrier._$target.isInner ).toBe( true )
        expect( this.$barrier._$target.name ).toBe( "Rufus" )
        expect( this.$barrier._$target[BREED] ).toBe( undefined )
        expect( this.$barrier._$target._age ).toBe( 18 )
      })

      it("Retargets the handlers in the receiver's barrier", function () {
        expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
        expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
        expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
      })

      describe("In the new target", function () {
        beforeEach(function () {
          this.$target$inner = this.$barrier._$target
          this.$target$outer = this.$barrier._$target[$OUTER]
        })

        it("Sets the $inner property to the value", function () {
          expect( this.$target$inner._xyz ).toBe( this.value )
        })

        it("Doesn't set the $outer property", function () {
          expect( this.$target$outer._xyz ).toBe( undefined )
        })
      })
    })

    describe("When the value is a boolean", function() {
      beforeEach(function () {
        this.value      = true
        this.$pulp._xyz = this.value
      })

      it("Doesn't set the property in the receiver, itself", function () {
        expect( this.$inner._xyz ).toBe( undefined )
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Sets its barrier to the inner of a copy of the target", function () {
        expect( this.$barrier._$target.isInner ).toBe( true )
        expect( this.$barrier._$target.name ).toBe( "Rufus" )
        expect( this.$barrier._$target[BREED] ).toBe( undefined )
        expect( this.$barrier._$target._age ).toBe( 18 )
      })

      it("Retargets the handlers in the receiver's barrier", function () {
        expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
        expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
        expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
      })

      describe("In the new target", function () {
        beforeEach(function () {
          this.$target$inner = this.$barrier._$target
          this.$target$outer = this.$barrier._$target[$OUTER]
        })

        it("Sets the $inner property to the value", function () {
          expect( this.$target$inner._xyz ).toBe( this.value )
        })

        it("Doesn't set the $outer property", function () {
          expect( this.$target$outer._xyz ).toBe( undefined )
        })
      })
    })

    describe("When the value is a number", function() {
      beforeEach(function () {
        this.value      = 49
        this.$pulp._xyz = this.value
      })

      it("Doesn't set the property in the receiver, itself", function () {
        expect( this.$inner._xyz ).toBe( undefined )
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Sets its barrier to the inner of a copy of the target", function () {
        expect( this.$barrier._$target.isInner ).toBe( true )
        expect( this.$barrier._$target.name ).toBe( "Rufus" )
        expect( this.$barrier._$target[BREED] ).toBe( undefined )
        expect( this.$barrier._$target._age ).toBe( 18 )
      })

      it("Retargets the handlers in the receiver's barrier", function () {
        expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
        expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
        expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
      })

      describe("In the new target", function () {
        beforeEach(function () {
          this.$target$inner = this.$barrier._$target
          this.$target$outer = this.$barrier._$target[$OUTER]
        })

        it("Sets the $inner property to the value", function () {
          expect( this.$target$inner._xyz ).toBe( this.value )
        })

        it("Doesn't set the $outer property", function () {
          expect( this.$target$outer._xyz ).toBe( undefined )
        })
      })
    })

    describe("When the value is a string", function() {
      beforeEach(function () {
        this.value      = "Nutmeg"
        this.$pulp._xyz = this.value
      })

      it("Doesn't set the property in the receiver, itself", function () {
        expect( this.$inner._xyz ).toBe( undefined )
        expect( this.$outer._xyz ).toBe( undefined )
      })

      it("Sets its barrier to the inner of a copy of the target", function () {
        expect( this.$barrier._$target.isInner ).toBe( true )
        expect( this.$barrier._$target.name ).toBe( "Rufus" )
        expect( this.$barrier._$target[BREED] ).toBe( undefined )
        expect( this.$barrier._$target._age ).toBe( 18 )
      })

      it("Retargets the handlers in the receiver's barrier", function () {
        expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
        expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
        expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
      })

      describe("In the new target", function () {
        beforeEach(function () {
          this.$target$inner = this.$barrier._$target
          this.$target$outer = this.$barrier._$target[$OUTER]
        })

        it("Sets the $inner property to the value", function () {
          expect( this.$target$inner._xyz ).toBe( this.value )
        })

        it("Doesn't set the $outer property", function () {
          expect( this.$target$outer._xyz ).toBe( undefined )
        })
      })
    })

    describe("When the value is a function", function() {
      describe("When the value is an untrusted external", function() {
        beforeEach(function () {
          this.value      = function danger() { return this }
          this.$pulp._xyz = this.value
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.$target$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is used as a handler for a method", function() {
        beforeEach(function () {
          this.value      = this.Cat_.methodAt("age").handler
          this.$pulp._xyz = this.value
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.$target$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is used as an assigner for a property", function() {
        beforeEach(function () {
          this.value      = mood
          this.$pulp._xyz = this.value
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.$target$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is an inner wrapper", function() {
        beforeEach(function () {
          this.value      = this.Cat_.methodAt("age").inner
          this.$pulp._xyz = this.value
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.$target$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is an outer wrapper", function() {
        beforeEach(function () {
          this.value      = this.Cat_.methodAt("age").outer
          this.$pulp._xyz = this.value
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.$target$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is an tamed wrapper", function() {
        beforeEach(function () {
          this.danger     = function danger() { return this }
          this.$pulp.qrs  = this.danger
          this.tamed      = this.$pulp.qrs
          this.$pulp._xyz = this.tamed
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.$target$inner._xyz ).toBe( this.tamed )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is a disguised func/object", function() {
        beforeEach(function () {
          this.value      = this.Cat_
          this.$pulp._xyz = this.value
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.$target$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })
    })

    describe("When the value is an object", function() {
      describe("When the value is null", function() {
        beforeEach(function () {
          this.value      = null
          this.$pulp._xyz = this.value
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.$target$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is immutable", function() {
        beforeEach(function () {
          this.value      = this.Cat_("Nutmeg", "Tortie", 1.5)
          this.$pulp._xyz = this.value
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.$target$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is an immutable JS object", function() {
        beforeEach(function () {
          this.value      = CrudeBeImmutable([1, 2, 3])
          this.$pulp._xyz = this.value
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.$target$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is mutable and has an id", function() {
        beforeEach(function () {
          this.value = this.Cat_.new("Nutmeg", "Tortie", 1.5)
          this.value.this._setId()
          this.$pulp._xyz = this.value
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        it("The value stays mutable", function () {
          expect( this.value.isMutable ).toBe( true )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.$target$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is the receiver's inner itself", function() {
        beforeEach(function () {
          this.$pulp._xyz = this.$pulp
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
            this.$target$rind  = this.$barrier._$target[$RIND]
          })

          it("Sets the $inner property to the new target's outer", function () {
            expect( this.$target$inner._xyz ).toBe( this.$target$rind )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is the receiver's outer itself", function() {
        beforeEach(function () {
          this.$pulp._xyz = this.$rind
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
            this.$target$rind  = this.$barrier._$target[$RIND]
          })

          it("Sets the $inner property to the new target's outer", function () {
            expect( this.$target$inner._xyz ).toBe( this.$target$rind )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is a mutable object", function() {
        beforeEach(function () {
          this.value      = this.Cat_.new("Nutmeg", "Tortie", 1.5)
          this.$pulp._xyz = this.value
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.$target$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is a mutable JS object", function() {
        beforeEach(function () {
          this.value      = [1, 2, 3]
          this.$pulp._xyz = this.value
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.$target$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
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
      beforeEach(function () {
        this.$pulp._mood = "grumpy"
      })

      it("Doesn't set the property in the receiver, itself", function () {
        expect( this.$inner.xyz ).toBe( undefined )
        expect( this.$outer.xyz ).toBe( undefined )
      })

      it("Sets its barrier to the inner of a copy of the target", function () {
        expect( this.$barrier._$target.isInner ).toBe( true )
        expect( this.$barrier._$target.name ).toBe( "Rufus" )
        expect( this.$barrier._$target[BREED] ).toBe( undefined )
        expect( this.$barrier._$target._age ).toBe( 18 )
      })

      it("Retargets the handlers in the receiver's barrier", function () {
        expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
        expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
        expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
      })

      describe("In the new target", function () {
        beforeEach(function () {
          this.$target$inner = this.$barrier._$target
          this.$target$outer = this.$barrier._$target[$OUTER]
        })

        it("Executes the assigner", function () {
          expect( this.$target$inner._mood ).toBe( "very grumpy" )
          expect( this.$target$outer._mood ).toBe( undefined )
        })
      })
    })

    describe("When the property already has an initialized value", function () {
      describe("When the existing value is a different value", function () {
        beforeEach(function () {
          this.value      = 100
          this.$pulp._age = this.value
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._age ).toBe( 18 )
          expect( this.$outer._age ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the property to the new value", function () {
            expect( this.$target$inner._age ).toBe( this.value )
            expect( this.$target$outer._age ).toBe( undefined )
          })
        })
      })

      describe("When the existing value is the same object", function () {
        beforeEach(function () {
          this.$pulp._age = 18
        })

        it("The property value in the receiver remains the same", function () {
          expect( this.$inner._age ).toBe( 18 )
          expect( this.$outer._age ).toBe( undefined )
        })

        it("The receiver remains immutable", function () {
          expect( this.$rind.isImmutable ).toBe( true )
        })

        it("Has no impact on the receiver's barrier", function () {
          expect( OwnKeys(this.$barrier).length ).toBe( 0 )
        })
      })
    })

    describe("When the property already has a value", function () {
      describe("When the existing value is a different value", function () {
        beforeEach(function () {
          this.$pulp._xyz = this.redBall
          this.$pulp._xyz = this.blueBall
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("Sets the property to the new value", function () {
            expect( this.$target$inner._xyz ).toBe( this.blueBall )
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the existing value is the same object", function () {
        beforeEach(function () {
          this.$pulp._xyz = this.redBall
          this.$pulp._xyz = this.redBall
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
        })

        it("Sets its barrier to the inner of a copy of the target", function () {
          expect( this.$barrier._$target.isInner ).toBe( true )
          expect( this.$barrier._$target.name ).toBe( "Rufus" )
          expect( this.$barrier._$target[BREED] ).toBe( undefined )
          expect( this.$barrier._$target._age ).toBe( 18 )
        })

        it("Retargets the handlers in the receiver's barrier", function () {
          expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
          expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
          expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
        })

        describe("In the new target", function () {
          beforeEach(function () {
            this.$target$inner = this.$barrier._$target
            this.$target$outer = this.$barrier._$target[$OUTER]
          })

          it("The property value remains the same", function () {
            expect( this.$target$inner._xyz ).toBe( this.redBall )
            expect( this.$target$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the existing value is from a shared property", function () {
        describe("When the receiver's type is mutable", function () {
          it("Inherits the value", function () {
            expect( this.$pulp.isImmutable ).toBe( true )
            expect( this.$pulp._ball.color ).toBe( "red" )
            expect( this.$pulp._hasOwn("ball") ).toBe( false )
          })

          describe("When the existing value is a different value", function () {
            beforeEach(function () {
              this.$pulp._ball = this.blueBall
            })

            it("Doesn't set the property in the receiver, itself", function () {
              expect( this.$pulp._hasOwn("_ball") ).toBe( false )
              expect( this.$inner._ball ).toBe( this.redBall )
              expect( this.$outer._ball ).toBe( undefined )
            })

            it("Sets its barrier to the inner of a copy of the target", function () {
              expect( this.$barrier._$target.isInner ).toBe( true )
              expect( this.$barrier._$target.name ).toBe( "Rufus" )
              expect( this.$barrier._$target[BREED] ).toBe( undefined )
              expect( this.$barrier._$target._age ).toBe( 18 )
            })

            it("Retargets the handlers in the receiver's barrier", function () {
              expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
              expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
              expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
            })

            describe("In the new target", function () {
              beforeEach(function () {
                this.$target$inner = this.$barrier._$target
                this.$target$outer = this.$barrier._$target[$OUTER]
              })

              it("Sets the property to the new value", function () {
                expect( this.$target$inner._ball ).toBe( this.blueBall )
                expect( this.$target$outer._ball ).toBe( undefined )
              })
            })
          })

          describe("When the existing value is the same object", function () {
            beforeEach(function () {
              this.$pulp._ball = this.redBall
            })

            it("Doesn't set the property in the receiver, itself", function () {
              expect( this.$pulp._hasOwn("_ball") ).toBe( false )
            })

            it("Sets its barrier to the inner of a copy of the target", function () {
              expect( this.$barrier._$target.isInner ).toBe( true )
              expect( this.$barrier._$target.name ).toBe( "Rufus" )
              expect( this.$barrier._$target[BREED] ).toBe( undefined )
              expect( this.$barrier._$target._age ).toBe( 18 )
            })

            it("Retargets the handlers in the receiver's barrier", function () {
              expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
              expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
              expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
            })

            describe("In the new target", function () {
              beforeEach(function () {
                this.$target$inner = this.$barrier._$target
                this.$target$outer = this.$barrier._$target[$OUTER]
              })

              it("Sets the property to the value", function () {
                expect( this.$target$inner._ball ).toBe( this.redBall )
                expect( this.$target$outer._ball ).toBe( undefined )
              })
            })
          })
        })

        describe("When the receiver's type is immutable", function () {
          beforeEach(function () {
            this.$rind         = this.Dog_("Princess", "Shepard", 13)
            this.$pulp         = this.$rind.this
            this.$inner        = this.$pulp[$INNER]
            this.$outer        = this.$inner[$OUTER]
            this.$barrier      = this.$inner[$BARRIER]
            this.$barrier$root = RootOf(this.$barrier)
          })

          it("Inherits the value", function () {
            expect( this.$pulp.isImmutable ).toBe( true )
            expect( this.$pulp._ball.color ).toBe( "red" )
            expect( this.$pulp._hasOwn("_ball") ).toBe( false )
          })

          describe("When the existing value is a different value", function () {
            beforeEach(function () {
              this.$pulp._ball = this.blueBall
            })

            it("Doesn't set the property in the receiver, itself", function () {
              expect( this.$pulp._hasOwn("_ball") ).toBe( false )
              expect( this.$inner._ball ).toBe( this.redBall )
              expect( this.$outer._ball ).toBe( undefined )
            })

            it("Sets its barrier to the inner of a copy of the target", function () {
              expect( this.$barrier._$target.isInner ).toBe( true )
              expect( this.$barrier._$target.name ).toBe( "Princess" )
              expect( this.$barrier._$target[BREED] ).toBe( undefined )
              expect( this.$barrier._$target._age ).toBe( 13 )
            })

            it("Retargets the handlers in the receiver's barrier", function () {
              expect( this.$barrier.get ).toBe( this.$barrier$root.retargetedGet )
              expect( this.$barrier.set ).toBe( this.$barrier$root.retargetedSet )
              expect( this.$barrier.deleteProperty ).toBe( this.$barrier$root.retargetedDelete )
            })

            describe("In the new target", function () {
              beforeEach(function () {
                this.$target$inner = this.$barrier._$target
                this.$target$outer = this.$barrier._$target[$OUTER]
              })

              it("Sets the property to the new value", function () {
                expect( this.$target$inner._ball ).toBe( this.blueBall )
                expect( this.$target$outer._ball ).toBe( undefined )
              })
            })
          })

          describe("When the existing value is the same object", function () {
            beforeEach(function () {
              this.$pulp._ball = this.redBall
            })

            it("Doesn't set the property in the receiver, itself", function () {
              expect( this.$pulp._hasOwn("_ball") ).toBe( false )
            })

            it("The property value in the receiver remains the same", function () {
              expect( this.$inner._ball ).toBe( this.redBall )
              expect( this.$outer._ball ).toBe( undefined )
            })

            it("The receiver remains immutable", function () {
              expect( this.$rind.isImmutable ).toBe( true )
            })

            it("Has no impact on the receiver's barrier", function () {
              expect( OwnKeys(this.$barrier).length ).toBe( 0 )
            })
          })
        })
      })
    })
  })
})
