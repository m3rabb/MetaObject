HandAxe._(function (
  $BARRIER, $INNER, $OUTER, $RIND, DeclareImmutable, RootOf, ValueHasOwn,
  Thing, Type
) {
  "use strict"

  describe("Deleting a property on the inner of mutable object", function() {
    const BREED = Symbol("BREED")

    function mood(newMood) { return `very ${newMood}` }

    beforeAll(function () {
      this.redBall = DeclareImmutable({color : "red"})

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
      this.$rind  = this.Cat_.new("Rufus", "Siamese-tabby", 18)
      this.$pulp  = this.$rind.this
      this.$inner = this.$pulp[$INNER]
      this.$outer = this.$inner[$OUTER]
    })

    describe("When the property exists", function() {
      beforeEach(function () {
        this.$pulp.xyz = 123
        delete this.$pulp.xyz
      })

      it("Deletes the property", function () {
        expect( ValueHasOwn(this.$inner, "xyz") ).toBe( false )
        expect( ValueHasOwn(this.$outer, "xyz") ).toBe( false )
      })
    })

    describe("When the property has an assigner", function() {
      beforeEach(function () {
        this.$pulp.mood = "happy"
        delete this.$pulp.mood
      })

      it("Deletes the property", function () {
        expect( ValueHasOwn(this.$inner, "mood") ).toBe( false )
        expect( ValueHasOwn(this.$outer, "mood") ).toBe( false )
      })
    })

    describe("When the property is mandatory", function() {
      beforeEach(function () {
        this.$pulp.setStick("big stick")
      })

      it("Throws and disallowed delete error", function () {
        var execution =  () => { delete this.$pulp.stick }
        expect( execution ).toThrowError( /Delete of property 'stick'/ )
      })
    })

    describe("When the property value matches an inherited shared property", function() {
      beforeEach(function () {
        this.$pulp.ball = this.redBall
        delete this.$pulp.ball
      })

      it("Deletes the property", function () {
        expect( ValueHasOwn(this.$inner, "ball") ).toBe( false )
        expect( ValueHasOwn(this.$outer, "ball") ).toBe( false )
      })
    })

    describe("When the property exists only from the inherited shared property", function() {
      it("Makes no change", function () {
        expect( this.$pulp._hasOwn("ball") ).toBe( false )
        expect( this.$pulp.ball ).toBe( this.redBall )
        delete this.$pulp.ball
        expect( this.$pulp._hasOwn("ball") ).toBe( false )
        expect( this.$pulp.ball ).toBe( this.redBall )
      })
    })

    describe("When the property is nonexistent", function() {
      it("Makes no change", function () {
        expect( this.$pulp._hasOwn("xyz") ).toBe( false )
        delete this.$pulp.xyz
        expect( this.$pulp._hasOwn("xyz") ).toBe( false )
      })
    })

  })
})
