HandAxe._(function (
  $BARRIER, $INNER, $OUTER, $PULP,
  DeclareImmutable, RootOf, Type, ValueHasOwn
) {
  "use strict"

  describe("#_retarget", function () {
    const BREED = Symbol("BREED")

    beforeAll(function () {
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

          function test_retarget() {
            var results = [
              this._retarget,
              this[$BARRIER].isInUse,
              this[$BARRIER]._$target,
            ]
            return DeclareImmutable(results)
          },

          "SELF",

          function tester() {
            this._retarget
            this.xyz = 123
          },
        ]
      }

      this.Cat_ = Type.new_(this.CatSpec)
    })

    describe("When the receiver is mutable", function () {
      beforeEach(function () {
        this.cat      = this.Cat_.new("Rufus", "Siamese-tabby", 18)
        this._cat     = this.cat.this
        this._$cat    = this._cat[$INNER]
        this.$barrier = this._$cat[$BARRIER]
      })

      it("Answers the receiver", function () {
        expect( this._cat._retarget ).toBe( this._cat )
      })

      it("The receiver's barrier is unuse", function () {
        expect( this.$barrier.isInUse ).toBe( undefined )
      })

      it("The receiver's barrier's target is unchanged", function () {
        this._cat._retarget
        expect( this.$barrier._$target ).toBe( this._$cat )
      })

      it("Adds _retarget as retroactive property", function () {
        expect( ValueHasOwn(this._cat, "_retarget") ).toBe( false )
        this._cat._retarget
        expect( ValueHasOwn(this._cat, "_retarget") ).toBe( true )
      })
    })

    describe("When the receiver is immutable", function () {
      beforeEach(function () {
        this.cat      = this.Cat_("Rufus", "Siamese-tabby", 18)
        this._cat     = this.cat.this
        this.$barrier = this._cat[$BARRIER]
        this.results  = this.cat.test_retarget
      })

      it("Answers the receiver", function () {
        var answer = this.results[0]
        expect( answer ).toBe( this._cat )
      })

      it("The created barrier is unused", function () {
        var isInUse = this.results[1]
        expect( isInUse ).toBe( undefined )
      })

      it("The created barrier targets a new mutable copy", function () {
        var _target = this.results[2][$PULP]
        expect( _target.isMutable ).toBe( true )
        expect( _target._hasOwn(BREED) ).toBe( false )
        expect( _target._age ).toBe( 18 )
        expect( _target.name ).toBe( "Rufus" )
      })

      it("The receiver has no '_retarget' property", function () {
        expect( ValueHasOwn(this._cat, "_retarget") ).toBe( false )
      })

      describe("When _retarget is called within a method", function () {
        beforeEach(function () {
          this.answer = this.cat.tester
        })

        it("Causes a new immutable copy to be created", function () {
          expect( this.answer.isImmutable ).toBe( true )
          expect( this.answer.this._hasOwn(BREED) ).toBe( false )
          expect( this.answer.this._age ).toBe( 18 )
          expect( this.answer.name ).toBe( "Rufus" )
          expect( this.answer.xyz ).toBe( 123 )
        })

        it("The receiver remains unchanged", function () {
          expect( this.cat.isImmutable ).toBe( true )
          expect( this.cat.hasOwn("xyz") ).toBe( false )
        })
      })
    })
  })
})
