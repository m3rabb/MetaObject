ObjectSauce.ImplementationTesting(function (
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
        delete this.$pulp.name
      })

      it("Doesn't delete the property in the receiver, itself", function () {
        expect( this.$inner.name ).toBe( "Rufus" )
        expect( this.$outer.name ).toBe( "Rufus" )
      })

      it("Retargets the receiver's barrier", function () {
        expect( this.$barrier._$target ).not.toBe( this.$inner )
      })

      it("Sets its barrier to the inner of a copy of the target, lest the property", function () {
        expect( this.$barrier._$target.isInner ).toBe( true )
        expect( this.$barrier._$target.name ).toBe( undefined )
        expect( this.$barrier._$target[BREED] ).toBe( undefined )
        expect( this.$barrier._$target._age ).toBe( 18 )
      })

      describe("In the new target", function () {
        beforeEach(function () {
          this.$target$inner = this.$barrier._$target
          this.$target$outer = this.$barrier._$target[$OUTER]
        })

        it("Deletes the property", function () {
          expect( HasOwn(this.$target$inner, "name") ).toBe( false )
          expect( HasOwn(this.$target$outer, "name") ).toBe( false )
        })
      })
    })

    describe("When the property has an assigner", function() {
      beforeEach(function () {
        this.$pulp.mood = "happy"
        this.$rind.beImmutable
        delete this.$pulp.mood
      })

      it("Doesn't delete the property in the receiver, itself", function () {
        expect( this.$inner.mood ).toBe( "very happy" )
        expect( this.$outer.mood ).toBe( "very happy" )
      })

      it("Retargets the receiver's barrier", function () {
        expect( this.$barrier._$target ).not.toBe( this.$inner )
      })

      it("Sets its barrier to the inner of a copy of the target, lest the property", function () {
        expect( this.$barrier._$target.isInner ).toBe( true )
        expect( this.$barrier._$target.name ).toBe( "Rufus" )
        expect( this.$barrier._$target[BREED] ).toBe( undefined )
        expect( this.$barrier._$target._age ).toBe( 18 )
        expect( this.$barrier._$target.mood ).toBe( undefined )
      })

      describe("In the new target", function () {
        beforeEach(function () {
          this.$target$inner = this.$barrier._$target
          this.$target$outer = this.$barrier._$target[$OUTER]
        })

        it("Deletes the property", function () {
          expect( HasOwn(this.$target$inner, "mood") ).toBe( false )
          expect( HasOwn(this.$target$outer, "mood") ).toBe( false )
        })
      })
    })

    describe("When the property is mandatory", function() {
      beforeEach(function () {
        this.$pulp.setStick("big stick")
        this.$rind.beImmutable
      })

      it("Throws and disallowed delete error", function () {
        var execution =  () => { delete this.$pulp.stick }
        expect( execution ).toThrowError( /Delete of property 'stick'/ )
      })
    })

    describe("When the property value matches an inherited shared property", function() {
      beforeEach(function () {
        this.$pulp.ball = this.redBall
        this.$rind.beImmutable
        delete this.$pulp.ball
      })

      it("Doesn't delete the property in the receiver, itself", function () {
        expect( this.$inner.ball ).toBe( this.redBall )
        expect( this.$outer.ball ).toBe( this.redBall )
      })

      it("Retargets the receiver's barrier", function () {
        expect( this.$barrier._$target ).not.toBe( this.$inner )
      })

      it("Sets its barrier to the inner of a copy of the target, lest the property", function () {
        expect( this.$barrier._$target.isInner ).toBe( true )
        expect( this.$barrier._$target.name ).toBe( "Rufus" )
        expect( this.$barrier._$target[BREED] ).toBe( undefined )
        expect( this.$barrier._$target._age ).toBe( 18 )
        expect( this.$barrier._$target.ball ).toBe( this.redBall )
        expect( HasOwn(this.$barrier._$target, "ball") ).toBe( false )
      })

      describe("In the new target", function () {
        beforeEach(function () {
          this.$target$inner = this.$barrier._$target
          this.$target$outer = this.$barrier._$target[$OUTER]
        })

        it("Deletes the property", function () {
          expect( HasOwn(this.$target$inner, "ball") ).toBe( false )
          expect( HasOwn(this.$target$outer, "ball") ).toBe( false )
        })
      })
    })

    describe("When the property exists only from the inherited shared property", function() {
      beforeEach(function () {
        this.$rind.beImmutable
        delete this.$pulp.ball
      })

      it("The receiver's barrier's target is unchanged", function () {
        expect( this.$barrier._$target ).toBe( this.$inner )
      })

      it("Makes no change", function () {
        expect( this.$pulp._hasOwn("ball") ).toBe( false )
        expect( this.$pulp.ball ).toBe( this.redBall )
      })
    })

    describe("When the property is nonexistent", function() {
      beforeEach(function () {
        this.$rind.beImmutable
        delete this.$pulp.xyz
      })

      it("The receiver's barrier's target is unchanged", function () {
        expect( this.$barrier._$target ).toBe( this.$inner )
      })

      it("Makes no change", function () {
        expect( this.$pulp._hasOwn("xyz") ).toBe( false )
      })
    })

  })
})
