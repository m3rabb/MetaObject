Tranya.ImplementationTesting(function (
  $BARRIER, $INNER, $OUTER, $RIND, GlazeImmutable, RootOf, Thing, Type
) {
  "use strict"

  describe("Setting a private property on the inner of immutable object", function() {
    const BREED = Symbol("BREED")

    function mood(newMood) { return `very ${newMood}` }


    beforeAll(function () {
      this.redBall  = GlazeImmutable({color : "red"})
      this.blueBall = GlazeImmutable({color : "blue"})

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

          function setXyz(value) { this._xyz = value },

          function setAbc(value) { this.abc = value },

          function setMood(value) { this._mood = value },

          function setAge(value) { this._age = value },

          function setBall(value) { this._ball = value },

          {
            FOR_ASSIGN : { _mood : mood },
            SHARED     : { _ball : this.redBall },
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
        expect( this.result.hasOwn("xyz") ).toBe( false )
        expect( this.result.this._xyz ).toBe( this.value )
      })
    })

    describe("When the value is a number", function() {
      beforeEach(function () {
        this.value      = 49
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
        expect( this.result.hasOwn("xyz") ).toBe( false )
        expect( this.result.this._xyz ).toBe( this.value )
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
        expect( this.result.hasOwn("xyz") ).toBe( false )
        expect( this.result.this._xyz ).toBe( this.value )
      })
    })

    describe("When the value is a function", function() {
      describe("When the value is an untrusted external", function() {
        beforeEach(function () {
          this.value  = function danger() { return this }
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is used as a handler for a method", function() {
        beforeEach(function () {
          this.value  = this.Cat_.methodAt("age").handler
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is used as an assigner for a property", function() {
        beforeEach(function () {
          this.value  = mood
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is an inner wrapper", function() {
        beforeEach(function () {
          this.value  = this.Cat_.methodAt("age").inner
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is an outer wrapper", function() {
        beforeEach(function () {
          this.value  = this.Cat_.methodAt("age").outer
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is an tamed wrapper", function() {
        beforeEach(function () {
          function danger() { return this }
          var result  = this.$rind.setAbc(danger)
          this.tamed  = result.abc
          this.result = this.$rind.setXyz(this.tamed)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.tamed )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is a disguised func/object", function() {
        beforeEach(function () {
          this.value  = this.Cat_
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
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
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is immutable", function() {
        beforeEach(function () {
          this.value  = this.Cat_("Nutmeg", "Tortie", 1.5)
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is an immutable JS object", function() {
        beforeEach(function () {
          this.value  = GlazeImmutable([1, 2, 3])
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
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
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is the receiver's inner itself", function() {
        beforeEach(function () {
          this.result = this.$rind.setXyz(this.$pulp)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.result )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is the receiver's outer itself", function() {
        beforeEach(function () {
          this.result = this.$rind.setXyz(this.$rind)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.result )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is a mutable object", function() {
        beforeEach(function () {
          this.value  = this.Cat_.new("Nutmeg", "Tortie", 1.5)
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is a mutable JS object", function() {
        beforeEach(function () {
          this.value  = [1, 2, 3]
          this.result = this.$rind.setXyz(this.value)
        })

        it("Doesn't set the property in the receiver, itself", function () {
          expect( this.$inner._xyz ).toBe( undefined )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.value )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
          })
        })
      })

      describe("When the value is another object's inner", function() {
        it("Throws an detected inner error", function () {
          var value = Thing.new_().this
          expect( () => { this.$rind.setXyz(value) } )
            .toThrowError(/forgot to pass the 'this.self'/)
        })
      })

      describe("When the value is another disguise object's inner", function() {
        it("Throws an detected inner error", function () {
          var value = Type.new_("Cat").this
          expect( () => { this.$rind.setXyz(value) } )
            .toThrowError(/forgot to pass the 'this.self'/)
        })
      })
    })

    describe("When the property has an assigner", function () {
      beforeEach(function () {
        this.result = this.$rind.setMood("grumpy")
      })

      it("Doesn't set the property in the receiver, itself", function () {
        expect( this.$inner._mood ).toBe( undefined )
        expect( this.$outer._mood ).toBe( undefined )
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
        expect( this.result.this._hasOwn("_mood") ).toBe( true )
      })

      describe("In the copy", function () {
        beforeEach(function () {
          this.result$inner = this.result.this[$INNER]
          this.result$outer = this.result.this[$OUTER]
        })

        it("Executes the assigner", function () {
          expect( this.result$inner._mood ).toBe( "very grumpy" )
        })

        it("Doesn't set the $outer property", function () {
          expect( this.result$outer._mood ).toBe( undefined )
        })
      })
    })

    describe("When the property already has an initialized value", function () {
      describe("When the existing value is a different value", function () {
        beforeEach(function () {
          this.value  = 100
          this.result = this.$rind.setAge(this.value)
        })

        it("The property value in the receiver remains the same", function () {
          expect( this.$inner._age ).toBe( 18 )
          expect( this.$outer._age ).toBe( undefined )
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
          expect( this.result.this._age ).toBe( 100 )
          expect( this.result.hasOwn("age") ).toBe( false )
        })
      })

      describe("When the existing value is the same object", function () {
        beforeEach(function () {
          this.result = this.$rind.setAge(18)
        })

        it("The property value in the receiver remains the same", function () {
          expect( this.$inner._age ).toBe( 18 )
          expect( this.$outer._age ).toBe( undefined )
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
          expect( this.$inner._xyz ).toBe( this.redBall )
          expect( this.$outer._xyz ).toBe( undefined )
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
          expect( this.result.this._hasOwn("_xyz") ).toBe( true )
        })

        describe("In the copy", function () {
          beforeEach(function () {
            this.result$inner = this.result.this[$INNER]
            this.result$outer = this.result.this[$OUTER]
          })

          it("Sets the $inner property to the value", function () {
            expect( this.result$inner._xyz ).toBe( this.blueBall )
          })

          it("Doesn't set the $outer property", function () {
            expect( this.result$outer._xyz ).toBe( undefined )
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
          expect( this.$inner._xyz ).toBe( this.redBall )
          expect( this.$outer._xyz ).toBe( undefined )
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
            expect( this.$pulp._ball.color ).toBe( "red" )
            expect( this.$pulp._hasOwn("_ball") ).toBe( false )
          })

          describe("When the existing value is a different value", function () {
            beforeEach(function () {
              this.result = this.$rind.setBall(this.blueBall)
            })

            it("Doesn't set the property in the receiver, itself", function () {
              expect( this.$pulp._hasOwn("_ball") ).toBe( false )
              expect( this.$inner._ball ).toBe( this.redBall )
              expect( this.$outer._ball ).toBe( undefined )
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
              expect( this.result.this._hasOwn("_ball") ).toBe( true )
            })

            describe("In the copy", function () {
              beforeEach(function () {
                this.result$inner = this.result.this[$INNER]
                this.result$outer = this.result.this[$OUTER]
              })

              it("Sets the $inner property to the value", function () {
                expect( this.result$inner._ball ).toBe( this.blueBall )
              })

              it("Doesn't set the $outer property", function () {
                expect( this.result$outer._ball ).toBe( undefined )
              })
            })
          })

          describe("When the existing value is the same object", function () {
            beforeEach(function () {
              this.result = this.$rind.setBall(this.redBall)
            })

            it("Doesn't set the property in the receiver, itself", function () {
              expect( this.$pulp._hasOwn("_ball") ).toBe( false )
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
              expect( this.result.this._hasOwn("_ball") ).toBe( true )
            })

            describe("In the copy", function () {
              beforeEach(function () {
                this.result$inner = this.result.this[$INNER]
                this.result$outer = this.result.this[$OUTER]
              })

              it("Sets the $inner property to the value", function () {
                expect( this.result$inner._ball ).toBe( this.redBall )
              })

              it("Doesn't set the $outer property", function () {
                expect( this.result$outer._ball ).toBe( undefined )
              })
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
            expect( this.$pulp._ball.color ).toBe( "red" )
            expect( this.$pulp._hasOwn("_ball") ).toBe( false )
          })

          describe("When the existing value is a different value", function () {
            beforeEach(function () {
              this.result = this.$rind.setBall(this.blueBall)
            })

            it("Doesn't set the property in the receiver, itself", function () {
              expect( this.$pulp._hasOwn("_ball") ).toBe( false )
              expect( this.$inner._ball ).toBe( this.redBall )
              expect( this.$outer._ball ).toBe( undefined )
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
              expect( this.result.this._hasOwn("_ball") ).toBe( true )
            })

            describe("In the copy", function () {
              beforeEach(function () {
                this.result$inner = this.result.this[$INNER]
                this.result$outer = this.result.this[$OUTER]
              })

              it("Sets the $inner property to the value", function () {
                expect( this.result$inner._ball ).toBe( this.blueBall )
              })

              it("Doesn't set the $outer property", function () {
                expect( this.result$outer._ball ).toBe( undefined )
              })
            })
          })

          describe("When the existing value is the same object", function () {
            beforeEach(function () {
              this.result = this.$rind.setBall(this.redBall)
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
