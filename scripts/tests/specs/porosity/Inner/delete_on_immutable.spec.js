Tranya.ImplementationTesting(function (
  $BARRIER, $INNER, $OUTER, $RIND,
  CrudeBeImmutable, HasOwn, OwnKeys, RootOf,
  Thing, Type
) {
  "use strict"

  describe("Deleting a property on the inner of immutable object", function() {
    const BREED = Symbol("BREED")

    function mood(newMood) { return `very ${newMood}` }

    beforeAll(function () {
      this.redBall = CrudeBeImmutable({color : "red"})

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

          function setMood(value) { this.mood = value },

          function setBall(value) { this.ball = value },

          function deleteBall() { delete this.ball },

          function deleteName() { delete this.name },

          function deleteMood() { delete this.mood },

          function deleteStick() { delete this.stick },

          function deleteXyz() { delete this.xyz },

          {
            FOR_ASSIGN    : { mood : mood },
            SHARED        : { ball : this.redBall },
            FOR_MANDATORY : "stick"
          },
        ]
      })
    })

    beforeEach(function () {
      this.$rind         = this.Cat_.new("Rufus", "Siamese-tabby", 18)
      this.$pulp         = this.$rind.this
      this.$inner        = this.$pulp[$INNER]
      this.$outer        = this.$inner[$OUTER]
      this.$barrier      = this.$inner[$BARRIER]
      this.$barrier$root = RootOf(this.$barrier)
    })

    describe("When the property exists", function() {
      beforeEach(function () {
        this.$rind.beImmutable
        this.result = this.$rind.deleteName
      })

      it("Doesn't delete the property in the receiver, itself", function () {
        expect( this.$inner.name ).toBe( "Rufus" )
        expect( this.$outer.name ).toBe( "Rufus" )
      })

      it("The receiver's barrier is no longer in use", function () {
        expect( this.$barrier.isInUse ).toBe( false )
      })

      it("The receiver's barrier's target is restored", function () {
        expect( this.$barrier._$target ).toBe( this.$inner )
      })

      it("Creates an immutable copy lest the property", function () {
        expect( this.result.isImmutable ).toBe( true )
        expect( this.result.this._hasOwn(BREED) ).toBe( false )
        expect( this.result.this._age ).toBe( 18 )
        expect( this.result.this._hasOwn("name") ).toBe( false )
        expect( this.result.this.name ).toBe( null )
      })

      describe("In the copy", function () {
        beforeEach(function () {
          this.result$inner = this.result.this[$INNER]
          this.result$outer = this.result.this[$OUTER]
        })

        it("Sets the $inner property to the value", function () {
          expect( HasOwn(this.result$inner, "_xyz") ).toBe( false )
        })

        it("Doesn't set the $outer property", function () {
          expect( HasOwn(this.result$outer, "_xyz") ).toBe( false )
        })
      })
    })

    describe("When the property has an assigner", function() {
      beforeEach(function () {
        this.$rind.setMood("happy")
        this.$rind.beImmutable
        this.result = this.$rind.deleteMood
      })

      it("Doesn't delete the property in the receiver, itself", function () {
        expect( this.$inner.mood ).toBe( "very happy" )
        expect( this.$outer.mood ).toBe( "very happy" )
      })

      it("The receiver's barrier is no longer in use", function () {
        expect( this.$barrier.isInUse ).toBe( false )
      })

      it("The receiver's barrier's target is restored", function () {
        expect( this.$barrier._$target ).toBe( this.$inner )
      })

      it("Creates an immutable copy lest the property", function () {
        expect( this.result.isImmutable ).toBe( true )
        expect( this.result.this.name ).toBe( "Rufus" )
        expect( this.result.this._hasOwn(BREED) ).toBe( false )
        expect( this.result.this._age ).toBe( 18 )
        expect( this.result.hasOwn("mood") ).toBe( false )
        expect( this.result.this.mood ).toBe( null )
      })

      describe("In the copy", function () {
        beforeEach(function () {
          this.result$inner = this.result.this[$INNER]
          this.result$outer = this.result.this[$OUTER]
        })

        it("Sets the $inner property to the value", function () {
          expect( HasOwn(this.result$inner, "mood") ).toBe( false )
        })

        it("Doesn't set the $outer property", function () {
          expect( HasOwn(this.result$outer, "mood") ).toBe( false )
        })
      })
    })

    describe("When the property is mandatory", function() {
      beforeEach(function () {
        this.$rind.setStick("big stick")
        this.$rind.beImmutable
      })

      it("Throws and disallowed delete error", function () {
        var execution =  () => { this.$rind.deleteStick }
        expect( execution ).toThrowError( /Delete of property 'stick'/ )
      })
    })

    describe("When the property value matches an inherited shared property", function() {
      beforeEach(function () {
        this.$rind.setBall(this.redBall)
        this.$rind.beImmutable
        this.result = this.$rind.deleteBall
      })

      it("Doesn't delete the property in the receiver, itself", function () {
        expect( this.$inner.ball ).toBe( this.redBall )
        expect( this.$outer.ball ).toBe( this.redBall )
      })

      it("The receiver's barrier is no longer in use", function () {
        expect( this.$barrier.isInUse ).toBe( false )
      })

      it("The receiver's barrier's target is restored", function () {
        expect( this.$barrier._$target ).toBe( this.$inner )
      })

      it("Creates an immutable copy lest the property", function () {
        expect( this.result.isImmutable ).toBe( true )
        expect( this.result.this.name ).toBe( "Rufus" )
        expect( this.result.this._hasOwn(BREED) ).toBe( false )
        expect( this.result.this._age ).toBe( 18 )
        expect( this.result.this.ball ).toBe( this.redBall )
        expect( this.result.this._hasOwn("ball") ).toBe( false )
      })

      describe("In the copy", function () {
        beforeEach(function () {
          this.result$inner = this.result.this[$INNER]
          this.result$outer = this.result.this[$OUTER]
        })

        it("Sets the $inner property to the value", function () {
          expect( HasOwn(this.result$inner, "ball") ).toBe( false )
        })

        it("Doesn't set the $outer property", function () {
          expect( HasOwn(this.result$outer, "ball") ).toBe( false )
        })
      })
    })

    describe("When the property exists only from the inherited shared property", function() {
      beforeEach(function () {
        this.$rind.beImmutable
        this.result = this.$rind.deleteBall
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

      it("Makes no change", function () {
        expect( this.$pulp._hasOwn("ball") ).toBe( false )
        expect( this.$pulp.ball ).toBe( this.redBall )
      })
    })

    describe("When the property is nonexistent", function() {
      beforeEach(function () {
        this.$rind.beImmutable
        this.result = this.$rind.deleteXyz
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

      it("Makes no change", function () {
        expect( this.$pulp._hasOwn("xyz") ).toBe( false )
      })
    })

  })
})
