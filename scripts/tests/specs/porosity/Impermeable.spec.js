describe("Object porosity", function() {
  const BREED = Symbol("BREED")
  const TASTE = Symbol("TASTE")

  beforeAll(function () {
    this.Cat = Type({
      name   : "Cat",
      define : [
        function _init(name, breed, age) {
          this._setName(name)
          this[BREED] = breed
          this._age   = age
        },

        function age() { return this._age },

        function _inc() { this._age++ },

        function setAge(age) { this._age = age }
      ]
    })
  })

  beforeEach(function () {
    this.cat = this.Cat("Nutmeg", "Tortoise Shell", 1.5)
    this.mCat = this.Cat.new("Chancy", "Tabby", 3)
  })

  describe("Impermeable objects", function() {
    describe("When accessing an existing", function() {
      describe("public property", function () {
        it("answers the property value", function () {
          expect( this.cat.name ).toBe( "Nutmeg" )
        })
      })

      describe("private property", function () {
        it("throws an private property error", function () {
          expect(() => this.cat._age).toThrowError(/Access to private property/)
        })
      })

      describe("symbol property", function () {
        it("answers the property value", function () {
          expect( this.cat[BREED] ).toBe( "Tortoise Shell" )
        })
      })

      describe("public immediate method", function () {
        it("executes the method", function () {
          expect( this.cat.age ).toBe( 1.5 )
        })
      })

      describe("private immediate method", function () {
        it("throws an private property error", function () {
          expect(() => this.cat._inc).toThrowError(/Access to private property/)
        })
      })

      describe("public method", function () {
        it("answers the outer method handler", function () {
          expect( this.cat.setAge.method.outer.name ).toBe( "setAge_$outer$fact" )
        })
      })
    })

    describe("When accessing a nonexistent", function() {
      describe("public property", function () {
        it("throws an unknown property error", function () {
          expect(() => this.cat.lifestyle ).toThrowError(/doesn't have a property/)
        })
      })

      describe("private property", function () {
        it("throws an private property error", function () {
          expect(() => this.cat._butter).toThrowError(/Access to private property/)
        })
      })

      describe("symbol property", function () {
        it("throws an unknown property error", function () {
          expect(() => this.cat[TASTE] ).toThrowError(/doesn't have a property/)
        })
      })
    })

    describe("When assigning", function() {
      describe("A public property", function () {
        it("throws a direct assignment from outside error", function () {
          expect(() => (this.cat.name = "Nancy")).toThrowError(/not allowed from the outside/)
        })
      })

      describe("A private property", function () {
        it("throws a direct assignment from outside erro", function () {
          expect(() => (this.cat._age = 123)).toThrowError(/not allowed from the outside/)
        })
      })
    })

    describe("When checking for the presence of", function () {
      describe("a public property", function () {
        describe("When present", function () {
          it("answers true", function () {
            expect( "age" in this.cat ).toBe( true )
          })
        })

        describe("When absent", function () {
          it("answers false", function () {
            expect( "xyz" in this.cat ).toBe( false )
          })
        })
      })

      describe("a private property", function () {
        describe("When present", function () {
          it("throws an private property error", function () {
            expect(() => "_inc" in this.cat).toThrowError(/Access to private property/)
          })
        })

        describe("When absent", function () {
          it("throws an private property error", function () {
            expect(() => "_xyz" in this.cat).toThrowError(/Access to private property/)
          })
        })
      })

      describe("a symbol property", function () {
        describe("When present", function () {
          describe("When the receive is immutable", function () {
            it("throws a TypeError", function () {
              expect( this.cat.isImmutable ).toBe ( true )
              expect(() => BREED in this.cat ).toThrowError(TypeError)
            })
          })

          describe("When the receive is mutable", function () {
            it("answers false", function () {
              expect( this.mCat.isMutable ).toBe ( true )
              expect( BREED in this.mCat ).toBe( false )
            })
          })
        })

        describe("When absent", function () {
          it("answers false", function () {
            expect( TASTE in this.cat ).toBe( false )
          })
        })
      })
    })

    describe("When accessing the parent object", function () {
      describe("via the __proto__", function () {
        it("throws an private property error", function () {
          expect(() => this.cat.__proto__).toThrowError(/Access to private property/)
        })
      })

      describe("via the getPrototypeOf", function () {
        describe("When the receive is immutable", function () {
          it("throws a TypeError", function () {
            expect( this.cat.isImmutable ).toBe ( true )
            expect(() => Object.getPrototypeOf(this.cat)).toThrowError(TypeError)
          })
        })

        describe("When the receive is mutable", function () {
          it("answers null", function () {
            expect( this.mCat.isMutable ).toBe ( true )
            expect( Object.getPrototypeOf(this.mCat) ).toBe( null )
          })
        })
      })
    })
  })
})
