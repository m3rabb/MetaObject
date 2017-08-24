describe("Permeable outer", function() {
  const BREED = Symbol("BREED")
  const TASTE = Symbol("TASTE")

  beforeAll(function () {
    this.Cat_ = Type.new_({
      name   : "Cat",
      define : [
        function _init(name, breed, age) {
          this._setName(name)
          this[BREED] = breed
          this._age   = age
        },

        function age() { return this._age },

        function _inc() { this._age += 1 },

        function setAge(age) { this._age = age }
      ]
    })
  })

  beforeEach(function () {
    this.iCat = this.Cat_("Nutmeg", "Torty", 1.5)
    this.mCat = this.Cat_.new("Chancy", "Tabby", 3)
  })

  describe("When accessing an existing", function() {
    describe("public property", function () {
      it("Answers the property value", function () {
        expect( this.iCat.name ).toBe( "Nutmeg" )
      })
    })

    describe("private property", function () {
      it("Answers the property value", function () {
        expect( this.iCat._age ).toBe( 1.5 )
      })
    })

    describe("symbol property", function () {
      it("Answers the property value", function () {
        expect( this.iCat[BREED] ).toBe( "Torty" )
      })
    })

    describe("public immediate method", function () {
      it("Executes the method", function () {
        expect( this.iCat.age ).toBe( 1.5 )
      })
    })

    describe("private immediate method", function () {
      it("Executes the method", function () {
        var iCat2 = this.iCat._inc
        expect( iCat2.age ).toBe( 2.5 )
      })
    })

    describe("public method", function () {
      it("Answers the outer method handler", function () {
        expect( this.iCat.setAge.method.outer.name ).toBe( "setAge_$outer$fact" )
      })
    })
  })

  describe("When accessing a nonexistent", function() {
    describe("public property", function () {
      it("Throws an unknown property error", function () {
        expect(() => this.iCat.lifestyle ).toThrowError(/doesn't have a property/)
      })
    })

    describe("private property", function () {
      it("Throws an unknown property error", function () {
        expect(() => this.iCat._butter).toThrowError(/doesn't have a property/)
      })
    })

    describe("symbol property", function () {
      it("Throws an unknown property error", function () {
        expect(() => this.iCat[TASTE] ).toThrowError(/doesn't have a property/)
      })
    })
  })

  describe("When assigning", function() {
    describe("A public property", function () {
      it("Throws a direct assignment from outside error", function () {
        expect(() => (this.iCat.name = "Nancy")).toThrowError(/not allowed from the outside/)
      })
    })

    describe("A private property", function () {
      it("Throws an private property error", function () {
        expect(() => (this.iCat._age = 123)).toThrowError(/not allowed from the outside/)
      })
    })
  })

  describe("When checking for the presence of", function () {
    describe("a public property", function () {
      describe("When present", function () {
        it("Answers true", function () {
          expect( "age" in this.iCat ).toBe( true )
        })
      })

      describe("When absent", function () {
        it("Answers false", function () {
          expect( "xyz" in this.iCat ).toBe( false )
        })
      })
    })

    describe("a private property", function () {
      describe("When present", function () {
        it("Answers true", function () {
          expect( "_inc" in this.iCat ).toBe( true )
        })
      })

      describe("When absent", function () {
        it("Answers false", function () {
          expect( "_xyz" in this.iCat ).toBe( false )
        })
      })
    })

    describe("a symbol property", function () {
      describe("When present", function () {
        describe("When the receive is immutable", function () {
          it("Answers true", function () {
            expect( this.iCat.isImmutable ).toBe ( true )
            expect( BREED in this.iCat ).toBe( true )
          })
        })

        describe("When the receive is mutable", function () {
          it("Answers true", function () {
            expect( this.mCat.isMutable ).toBe ( true )
            expect( BREED in this.mCat ).toBe( true )
          })
        })
      })

      describe("When absent", function () {
        it("Answers false", function () {
          expect( TASTE in this.iCat ).toBe( false )
        })
      })
    })
  })

  describe("When accessing the parent object", function () {
    describe("via the __proto__", function () {
      it("Throws an unknown property error", function () {
        expect(() => this.iCat.__proto__).toThrowError(/doesn't have a property/)
      })
    })

    describe("via the getPrototypeOf", function () {
      describe("When the receive is immutable", function () {
        it("Throws a TypeError", function () {
          expect( this.iCat.isImmutable ).toBe ( true )
          expect(() => Object.getPrototypeOf(this.iCat)).toThrowError(TypeError)
        })
      })

      describe("When the receive is mutable", function () {
        it("Answers null", function () {
          expect( this.mCat.isMutable ).toBe ( true )
          expect( Object.getPrototypeOf(this.mCat) ).toBe( null )
        })
      })
    })
  })
})
