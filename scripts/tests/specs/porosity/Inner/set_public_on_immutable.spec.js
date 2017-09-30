Tranya.ImplementationTesting(function (
  $BARRIER, $INNER, $OUTER, $RIND, CrudeBeImmutable, RootOf, Thing, Type
) {
  "use strict"

  describe("Setting a public property on the inner of immutable object", function() {
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

          "SELF",

          function setXyz(value) { this.xyz = value },

          function setMood(value) { this.mood = value },

          function setName(value) { this.name = value },

          function setBall(value) { this.ball = value },

          {
            FOR_ASSIGN : { mood : mood },
            SHARED     : { ball : this.redBall },
          },
        ]
      })
    })

    beforeEach(function () {
      this.$rind         = this.Cat_("Rufus", "Siamese-tabby", 18)
      this.$pulp         = this.$rind.this
      this.$inner        = this.$pulp[$INNER]
      this.$outer        = this.$inner[$OUTER]
      this.$barrier      = this.$inner[$BARRIER]
      this.$barrier$root = RootOf(this.$barrier)
    })

    it("Before setting, it's barrier is not in use", function () {
      expect( this.$barrier.isInUse ).toBe( undefined )
    })

    it("Before setting, it's barrier's target is itself", function () {
      expect( this.$barrier._$target ).toBe( this.$inner )
    })


    describe("When the value is undefined", function() {
      it("Throws an assignment of undefined error", function () {
        var execution =  () => { this.$rind.setXyz(undefined) }
        expect( execution ).toThrowError( /Assignment of undefined/ )
      })
    })

    describe("When the value is a boolean", function() {
      beforeEach(function () {
        this.value  = true
        this.result = this.$rind.setXyz(this.value)
      })

      it("Doesn't set the property in the receiver, itself", function () {
        expect( this.$inner.xyz ).toBe( undefined )
        expect( this.$outer.xyz ).toBe( undefined )
      })

      it("The receiver's barrier is no longer in use", function () {
        expect( this.$barrier.isInUse ).toBe( false )
      })

      it("The receiver's barrier's target is restored", function () {
        expect( this.$barrier._$target ).toBe( this.$inner )
      })

      it("Creates an immutable copy with the new property", function () {
        expect( this.result.isImmutable ).toBe( true )
        expect( this.result.name ).toBe( "Rufus" )
        expect( this.result.this._hasOwn(BREED) ).toBe( false )
        expect( this.result.this._age ).toBe( 18 )
        expect( this.result.xyz ).toBe( this.value )
        expect( this.result.this.xyz ).toBe( this.value )
      })
    })

    describe("When the value is a number", function() {
      beforeEach(function () {
        this.value  = 49
        this.result = this.$rind.setXyz(this.value)
      })

      it("Doesn't set the property in the receiver, itself", function () {
        expect( this.$inner.xyz ).toBe( undefined )
        expect( this.$outer.xyz ).toBe( undefined )
      })

      it("The receiver's barrier is no longer in use", function () {
        expect( this.$barrier.isInUse ).toBe( false )
      })

      it("The receiver's barrier's target is restored", function () {
        expect( this.$barrier._$target ).toBe( this.$inner )
      })

      it("Creates an immutable copy with the new property", function () {
        expect( this.result.isImmutable ).toBe( true )
        expect( this.result.name ).toBe( "Rufus" )
        expect( this.result.this._hasOwn(BREED) ).toBe( false )
        expect( this.result.this._age ).toBe( 18 )
        expect( this.result.xyz ).toBe( this.value )
        expect( this.result.this.xyz ).toBe( this.value )
      })
    })

    describe("When the value is a string", function() {
      beforeEach(function () {
        this.value  = "Nutmeg"
        this.result = this.$rind.setXyz(this.value)
      })

      it("Doesn't set the property in the receiver, itself", function () {
        expect( this.$inner.xyz ).toBe( undefined )
        expect( this.$outer.xyz ).toBe( undefined )
      })

      it("The receiver's barrier is no longer in use", function () {
        expect( this.$barrier.isInUse ).toBe( false )
      })

      it("The receiver's barrier's target is restored", function () {
        expect( this.$barrier._$target ).toBe( this.$inner )
      })

      it("Creates an immutable copy with the new property", function () {
        expect( this.result.isImmutable ).toBe( true )
        expect( this.result.name ).toBe( "Rufus" )
        expect( this.result.this._hasOwn(BREED) ).toBe( false )
        expect( this.result.this._age ).toBe( 18 )
        expect( this.result.xyz ).toBe( this.value )
        expect( this.result.this.xyz ).toBe( this.value )
      })
    })


    describe("When the value is a function", function() {
      describe("When the value is an untrusted external", function() {
        beforeEach(function () {
          this.value  = function danger() { return this }
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Wraps the function, and sets the $inner property to a tamed function", function () {
            expect( this.result$inner.xyz ).not.toBe( this.value )
            expect( this.result$inner.xyz.name ).toBe( "danger_$tamed" )
          })

          it("Wraps the function, and sets the $outer property to a tamed function", function () {
            expect( this.result$outer.xyz ).not.toBe( this.value )
            expect( this.result$outer.xyz.name ).toBe( "danger_$tamed" )
          })

          it("Sets the $inner and $outer to the same function", function () {
            expect( this.result$inner.xyz ).toBe( this.result$outer.xyz )
          })
        })
      })

      describe("When the value is used as a handler for a method", function() {
        beforeEach(function () {
          this.value  = this.Cat_.methodAt("age").handler
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Wraps the function, and sets the $inner property to a tamed function", function () {
            expect( this.result$inner.xyz ).not.toBe( this.value )
            expect( this.result$inner.xyz.name ).toBe( "age_$tamed" )
          })

          it("Wraps the function, and sets the $outer property to a tamed function", function () {
            expect( this.result$outer.xyz ).not.toBe( this.value )
            expect( this.result$outer.xyz.name ).toBe( "age_$tamed" )
          })

          it("Sets the $inner and $outer to the same function", function () {
            expect( this.result$inner.xyz ).toBe( this.result$outer.xyz )
          })
        })
      })

      describe("When the value is used as an assigner for a property", function() {
        beforeEach(function () {
          this.value  = mood
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Wraps the function, and sets the $inner property to a tamed function", function () {
            expect( this.result$inner.xyz ).not.toBe( this.value )
            expect( this.result$inner.xyz.name ).toBe( "mood_$tamed" )
          })

          it("Wraps the function, and sets the $outer property to a tamed function", function () {
            expect( this.result$outer.xyz ).not.toBe( this.value )
            expect( this.result$outer.xyz.name ).toBe( "mood_$tamed" )
          })

          it("Sets the $inner and $outer to the same function", function () {
            expect( this.result$inner.xyz ).toBe( this.result$outer.xyz )
          })
        })
      })

      describe("When the value is an inner wrapper", function() {
        beforeEach(function () {
          this.value  = this.Cat_.methodAt("age").inner
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the inner wrapper", function () {
            expect( this.result$inner.xyz ).toBe( this.value )
          })

          it("Sets the $outer property to the outer wrapper of the inner wrapper", function () {
            var outerWrapper = this.Cat_.methodAt("age").outer
            expect( this.result$outer.xyz ).toBe( outerWrapper )
          })
        })
      })

      describe("When the value is an outer wrapper", function() {
        beforeEach(function () {
          this.value  = this.Cat_.methodAt("age").outer
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner.xyz ).toBe( this.value )
          })

          it("Sets the $outer property to the value", function () {
            expect( this.result$outer.xyz ).toBe( this.value )
          })
        })
      })

      describe("When the value is an tamed wrapper", function() {
        beforeEach(function () {
          function danger() { return this }
          var result  = this.$rind.setXyz(danger)
          this.tamed  = result.xyz
          this.result = this.$rind.setXyz(this.tamed)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner.xyz ).toBe( this.tamed )
            expect( this.result$inner.xyz.name ).toBe( "danger_$tamed" )
          })

          it("Sets the $outer property to the value", function () {
            expect( this.result$outer.xyz ).toBe( this.tamed )
            expect( this.result$outer.xyz.name ).toBe( "danger_$tamed" )
          })
        })
      })

      describe("When the value is a disguised func/object", function() {
        beforeEach(function () {
          this.value  = this.Cat_
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner.xyz ).toBe( this.value )
          })

          it("Sets the $outer property to the value", function () {
            expect( this.result$outer.xyz ).toBe( this.value )
          })
        })
      })
    })

    describe("When the value is an object", function() {
      describe("When the value is null", function() {
        beforeEach(function () {
          this.value  = null
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner.xyz ).toBe( this.value )
          })

          it("Sets the $outer property to the value", function () {
            expect( this.result$outer.xyz ).toBe( this.value )
          })
        })
      })

      describe("When the value is immutable", function() {
        beforeEach(function () {
          this.value  = this.Cat_("Nutmeg", "Tortie", 1.5)
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner.xyz ).toBe( this.value )
          })

          it("Sets the $outer property to the value", function () {
            expect( this.result$outer.xyz ).toBe( this.value )
          })
        })
      })

      describe("When the value is an immutable JS object", function() {
        beforeEach(function () {
          this.value  = CrudeBeImmutable([1, 2, 3])
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner.xyz ).toBe( this.value )
          })

          it("Sets the $outer property to the value", function () {
            expect( this.result$outer.xyz ).toBe( this.value )
          })
        })
      })

      describe("When the value is mutable and has an id", function() {
        beforeEach(function () {
          this.value = this.Cat_.new("Nutmeg", "Tortie", 1.5)
          this.value.this.setId()
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner.xyz ).toBe( this.value )
          })

          it("Sets the $outer property to the value", function () {
            expect( this.result$outer.xyz ).toBe( this.value )
          })

          it("The value stays mutable", function () {
            expect( this.value.isMutable ).toBe( true )
          })
        })
      })

      describe("When the value is the receiver's inner itself", function() {
        beforeEach(function () {
          this.result = this.$rind.setXyz(this.$pulp)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the new target's outer", function () {
            expect( this.result$inner.xyz ).toBe( this.result )
          })

          it("Sets the $outer property to the new target's outer", function () {
            expect( this.result$outer.xyz ).toBe( this.result )
          })
        })
      })

      describe("When the value is the receiver's outer itself", function() {
        beforeEach(function () {
          this.result = this.$rind.setXyz(this.$rind)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the new target's outer", function () {
            expect( this.result$inner.xyz ).toBe( this.result )
          })

          it("Sets the $outer property to the new target's outer", function () {
            expect( this.result$outer.xyz ).toBe( this.result )
          })
        })
      })

      describe("When the value is a mutable object", function() {
        beforeEach(function () {
          this.value  = this.Cat_.new("Nutmeg", "Tortie", 1.5)
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to a copy of the value", function () {
            expect( this.result$inner.xyz ).not.toBe( this.value )
            expect( this.result$inner.xyz.asString ).toBe( "Nutmeg:1.5" )
          })

          it("Sets the $outer property to a copy of the value", function () {
            expect( this.result$outer.xyz ).not.toBe( this.value )
            expect( this.result$outer.xyz.asString ).toBe( "Nutmeg:1.5" )
          })

          it("Sets the $inner and $outer to the same copy", function () {
            expect( this.result$inner.xyz ).toBe( this.result$outer.xyz )
          })
        })
      })

      describe("When the value is a mutable JS object", function() {
        beforeEach(function () {
          this.value  = [1, 2, 3]
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( undefined )
          expect( this.$outer.xyz ).toBe( undefined )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to a copy of the value", function () {
            expect( this.result$inner.xyz ).not.toBe( this.value )
            expect( this.result$inner.xyz ).toEqual( this.value )
          })

          it("Sets the $outer property to a copy of the value", function () {
            expect( this.result$outer.xyz ).not.toBe( this.value )
            expect( this.result$outer.xyz ).toEqual( this.value )
          })

          it("Sets the $inner and $outer to the same copy", function () {
            expect( this.result$inner.xyz ).toBe( this.result$outer.xyz )
          })
        })
      })

      describe("When the value is another object's inner", function() {
        it("Throws an detected inner error", function () {
          var value = Thing.new_().this
          expect( () => { this.$rind.setXyz(value) } )
            .toThrowError(/forgot to pass the 'this'/)
        })
      })

      describe("When the value is another disguise object's inner", function() {
        it("Throws an detected inner error", function () {
          var value = Type.new_("Cat").this
          expect( () => { this.$rind.setXyz(value) } )
            .toThrowError(/forgot to pass the 'this'/)
        })
      })
    })

    describe("When the property has an assigner", function () {
      beforeEach(function () {
        this.result = this.$rind.setMood("grumpy")
      })

      it("Doesn't set the property in the receiver, itself", function () {
        expect( this.$inner.mood ).toBe( undefined )
        expect( this.$outer.mood ).toBe( undefined )
      })

      it("The receiver's barrier is no longer in use", function () {
        expect( this.$barrier.isInUse ).toBe( false )
      })

      it("The receiver's barrier's target is restored", function () {
        expect( this.$barrier._$target ).toBe( this.$inner )
      })

      it("Creates an immutable copy with the new property", function () {
        expect( this.result.isImmutable ).toBe( true )
        expect( this.result.name ).toBe( "Rufus" )
        expect( this.result.this._hasOwn(BREED) ).toBe( false )
        expect( this.result.this._age ).toBe( 18 )
        expect( this.result.hasOwn("mood") ).toBe( true )
      })

      describe("In the copy", function () {
        beforeEach(function () {
          this.result$inner = this.result.this[$INNER]
          this.result$outer = this.result.this[$OUTER]
        })

        it("Executes the assigner", function () {
          expect( this.result$inner.mood ).toBe( "very grumpy" )
          expect( this.result$outer.mood ).toBe( "very grumpy" )
        })
      })
    })

    describe("When the property already has an initialized value", function () {
      describe("When the existing value is a different value", function () {
        beforeEach(function () {
          this.result = this.$rind.setName("Bozo")
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.name ).toBe( "Rufus" )
          expect( this.$outer.name ).toBe( "Rufus" )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Bozo" )
          expect( this.result.this.name ).toBe( "Bozo" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
        })
      })

      describe("When the existing value is the same object", function () {
        beforeEach(function () {
          this.result = this.$rind.setName("Rufus")
        })

        it("The property value in the receiver remains the same", function () {
          expect( this.$inner.name ).toBe( "Rufus" )
          expect( this.$outer.name ).toBe( "Rufus" )
        })

        it("The receiver remains immutable", function () {
          expect( this.$rind.isImmutable ).toBe( true )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is unchanged", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("The result to be the receiver", function () {
          expect( this.result ).toBe( this.$rind )
        })
      })
    })

    describe("When the property already has a value", function () {
      describe("When the existing value is a different value", function () {
        beforeEach(function () {
          this.$rind         = this.Cat_.new("Rufus", "Siamese-tabby", 18)
          this.$pulp         = this.$rind.this
          this.$inner        = this.$pulp[$INNER]
          this.$outer        = this.$inner[$OUTER]
          this.$barrier      = this.$inner[$BARRIER]

          this.$rind.setXyz(this.redBall).beImmutable
          this.result = this.$rind.setXyz(this.blueBall)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner.xyz ).toBe( this.redBall )
          expect( this.$outer.xyz ).toBe( this.redBall )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is restored", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("Creates an immutable copy with the new property", function () {
          expect( this.result.isImmutable ).toBe( true )
          expect( this.result.name ).toBe( "Rufus" )
          expect( this.result.this._hasOwn(BREED) ).toBe( false )
          expect( this.result.this._age ).toBe( 18 )
          expect( this.result.hasOwn("xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the property to the new value", function () {
            expect( this.result$inner.xyz ).toBe( this.blueBall )
            expect( this.result$outer.xyz ).toBe( this.blueBall )
          })
        })
      })

      describe("When the existing value is the same object", function () {
        beforeEach(function () {
          this.$rind         = this.Cat_.new("Rufus", "Siamese-tabby", 18)
          this.$pulp         = this.$rind.this
          this.$inner        = this.$pulp[$INNER]
          this.$outer        = this.$inner[$OUTER]
          this.$barrier      = this.$inner[$BARRIER]

          this.$rind.setXyz(this.redBall).beImmutable
          this.result = this.$rind.setXyz(this.redBall)
        })

        it("The property value in the receiver remains the same", function () {
          expect( this.$inner.xyz ).toBe( this.redBall )
          expect( this.$outer.xyz ).toBe( this.redBall )
        })

        it("The receiver remains immutable", function () {
          expect( this.$rind.isImmutable ).toBe( true )
        })

        it("The receiver's barrier is no longer in use", function () {
          expect( this.$barrier.isInUse ).toBe( false )
        })

        it("The receiver's barrier's target is unchanged", function () {
          expect( this.$barrier._$target ).toBe( this.$inner )
        })

        it("The result to be the receiver", function () {
          expect( this.result ).toBe( this.$rind )
        })
      })

      describe("When the existing value is from a shared property", function () {
        describe("When the receiver's type is mutable", function () {
          it("Inherits the value", function () {
            expect( this.$pulp.isImmutable ).toBe( true )
            expect( this.$pulp.ball.color ).toBe( "red" )
            expect( this.$pulp.hasOwn("ball") ).toBe( false )
          })

          describe("When the existing value is a different value", function () {
            beforeEach(function () {
              this.result = this.$rind.setBall(this.blueBall)
            })

            it("Doesn't set the property in the receiver, itself", function () {
              expect( this.$pulp.hasOwn("ball") ).toBe( false )
              expect( this.$inner.ball.color ).toBe( "red" )
              expect( this.$outer.ball.color ).toBe( "red" )
            })

            it("The receiver's barrier is no longer in use", function () {
              expect( this.$barrier.isInUse ).toBe( false )
            })

            it("The receiver's barrier's target is restored", function () {
              expect( this.$barrier._$target ).toBe( this.$inner )
            })

            it("Creates an immutable copy with the new property", function () {
              expect( this.result.isImmutable ).toBe( true )
              expect( this.result.name ).toBe( "Rufus" )
              expect( this.result.this._hasOwn(BREED) ).toBe( false )
              expect( this.result.this._age ).toBe( 18 )
              expect( this.result.hasOwn("ball") ).toBe( true )
            })

            describe("In the copy", function () {
              beforeEach(function () {
                this.result$inner = this.result.this[$INNER]
                this.result$outer = this.result.this[$OUTER]
              })

              it("Sets the property to the new value", function () {
                expect( this.result$inner.ball ).toBe( this.blueBall )
                expect( this.result$outer.ball ).toBe( this.blueBall )
              })
            })
          })

          describe("When the existing value is the same object", function () {
            beforeEach(function () {
              this.result = this.$rind.setBall(this.redBall)
            })

            it("Doesn't set the property in the receiver, itself", function () {
              expect( this.$pulp.hasOwn("ball") ).toBe( false )
            })

            it("The receiver remains immutable", function () {
              expect( this.$rind.isImmutable ).toBe( true )
            })

            it("The receiver's barrier is no longer in use", function () {
              expect( this.$barrier.isInUse ).toBe( false )
            })

            it("The receiver's barrier's target is restored", function () {
              expect( this.$barrier._$target ).toBe( this.$inner )
            })

            it("Creates an immutable copy with the new property", function () {
              expect( this.result.isImmutable ).toBe( true )
              expect( this.result.name ).toBe( "Rufus" )
              expect( this.result.this._hasOwn(BREED) ).toBe( false )
              expect( this.result.this._age ).toBe( 18 )
              expect( this.result.hasOwn("ball") ).toBe( true )
            })

            describe("In the copy", function () {
              beforeEach(function () {
                this.result$inner = this.result.this[$INNER]
                this.result$outer = this.result.this[$OUTER]
              })

              it("Sets the property to the new value", function () {
                expect( this.result$inner.ball ).toBe( this.redBall )
                expect( this.result$outer.ball ).toBe( this.redBall )
              })
            })
          })

          describe("When the receiver's type is immutable", function () {
            beforeEach(function () {
              var iCat_          = this.Cat_.asImmutableCopy
              this.$rind         = iCat_("Rufus", "Siamese-tabby", 18)
              this.$pulp         = this.$rind.this
              this.$inner        = this.$pulp[$INNER]
              this.$outer        = this.$inner[$OUTER]
              this.$barrier      = this.$inner[$BARRIER]
              this.$barrier$root = RootOf(this.$barrier)
            })

            it("Inherits the value", function () {
              expect( this.$pulp.isImmutable ).toBe( true )
              expect( this.$pulp.ball.color ).toBe( "red" )
              expect( this.$pulp.hasOwn("ball") ).toBe( false )
            })

            describe("When the existing value is a different value", function () {
              beforeEach(function () {
                this.result = this.$rind.setBall(this.blueBall)
              })

              it("Doesn't set the property in the receiver, itself", function () {
                expect( this.$pulp.hasOwn("ball") ).toBe( false )
                expect( this.$inner.ball.color ).toBe( "red" )
                expect( this.$outer.ball.color ).toBe( "red" )
              })

              it("The receiver remains immutable", function () {
                expect( this.$rind.isImmutable ).toBe( true )
              })

              it("The receiver's barrier is no longer in use", function () {
                expect( this.$barrier.isInUse ).toBe( false )
              })

              it("The receiver's barrier's target is restored", function () {
                expect( this.$barrier._$target ).toBe( this.$inner )
              })

              it("Creates an immutable copy with the new property", function () {
                expect( this.result.isImmutable ).toBe( true )
                expect( this.result.name ).toBe( "Rufus" )
                expect( this.result.this._hasOwn(BREED) ).toBe( false )
                expect( this.result.this._age ).toBe( 18 )
                expect( this.result.hasOwn("ball") ).toBe( true )
              })

              describe("In the copy", function () {
                beforeEach(function () {
                  this.result$inner = this.result.this[$INNER]
                  this.result$outer = this.result.this[$OUTER]
                })

                it("Sets the property to the new value", function () {
                  expect( this.result$inner.ball ).toBe( this.blueBall )
                  expect( this.result$outer.ball ).toBe( this.blueBall )
                })
              })
            })

            describe("When the existing value is the same object", function () {
              beforeEach(function () {
                this.result = this.$rind.setBall(this.redBall)
              })

              it("Doesn't set the property in the receiver, itself", function () {
                expect( this.$pulp.hasOwn("ball") ).toBe( false )
              })

              it("The property value in the receiver remains the same", function () {
                expect( this.$inner.ball ).toBe( this.redBall )
                expect( this.$outer.ball ).toBe( this.redBall )
              })

              it("The receiver remains immutable", function () {
                expect( this.$rind.isImmutable ).toBe( true )
              })

              it("The receiver's barrier is no longer in use", function () {
                expect( this.$barrier.isInUse ).toBe( false )
              })

              it("The receiver's barrier's target is unchanged", function () {
                expect( this.$barrier._$target ).toBe( this.$inner )
              })

              it("The result to be the receiver", function () {
                expect( this.result ).toBe( this.$rind )
              })
            })
          })
        })
      })
    })
  })
})
