ObjectSauce.ImplementationTesting(function (
  $BARRIER, $OUTER, $PULP,
  HasOwn, OwnKeys, RootOf, Type
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
        ]
      }

      this.Cat_   = Type.new_(this.CatSpec)
    })

    describe("When the receiver is mutable", function () {
      beforeEach(function () {
        this.cat_     = this.Cat_.new("Rufus", "Siamese-tabby", 18)
        this._cat     = this.cat_.this[$PULP]
        this.$barrier = this._cat[$BARRIER]
      })

      it("Answers the receiver", function () {
        expect( this._cat._retarget ).toBe( this._cat )
      })

      it("Has no impact on the receiver's barrier", function () {
        this._cat._retarget
        expect( OwnKeys(this.$barrier).length ).toBe( 0 )
      })

      it("Adds _retarget as retroactive property", function () {
        expect( HasOwn(this._cat, "_retarget") ).toBe( false )
        this._cat._retarget
        expect( HasOwn(this._cat, "_retarget") ).toBe( true )
      })
    })

    describe("When the receiver is immutable", function () {
      beforeEach(function () {
        this.cat_          = this.Cat_("Rufus", "Siamese-tabby", 18)
        this._cat          = this.cat_.this[$PULP]
        this.$barrier      = this._cat[$BARRIER]
        this.$barrier$root = RootOf(this.$barrier)

        this.answer        = this._cat._retarget
      })

      it("Answers the receiver", function () {
        expect( this.answer ).toBe( this._cat )
      })

      it("Doesn't add a _retarget property to the receiver", function () {
        expect( HasOwn(this._cat, "_retarget") ).toBe( false )
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

        it("Is mutable", function () {
          expect( this.$barrier._$target[$PULP].isImmutable ).toBe( false )
        })

        it("Has no '_retarget' property", function () {
          expect( HasOwn(this._cat, "_retarget") ).toBe( false )
        })
      })

    })
  })
})
