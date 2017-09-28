Tranya.ImplementationTesting(function (Type, AsName) {
  "use strict"

  describe("Impermeable outer", function() {
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

          function setAge(age) { this._age = age },

          function _unknownProperty(selector) {
            return `<<${AsName(selector)}>>`
          },

          function _externalPrivateAccess(selector) {
            return `>>${AsName(selector)}<<`
          },
        ]
      })
    })

    beforeEach(function () {
      this.iCat = this.Cat("Nutmeg", "Tortoise Shell", 1.5)
      this.mCat = this.Cat.new("Chancy", "Tabby", 3)
    })


    describe("When accessing an existing", function() {
      describe("public property", function () {
        it("Answers the property value", function () {
          expect( this.iCat.name ).toBe( "Nutmeg" )
        })
      })

      describe("private property", function () {
        it("Executes its _externalPrivateAccess method", function () {
          expect( this.iCat._age ).toBe( ">>_age<<" )
        })
      })

      describe("symbol property", function () {
        it("Answers the property value", function () {
          expect( this.iCat[BREED] ).toBe( "Tortoise Shell" )
        })
      })

      describe("public immediate method", function () {
        it("Executes the method", function () {
          expect( this.iCat.age ).toBe( 1.5 )
        })
      })

      describe("private immediate method", function () {
        it("Executes its _externalPrivateAccess method", function () {
          expect( this.iCat._age ).toBe( ">>_age<<" )
        })
      })

      describe("public method", function () {
        it("Answers the outer method handler", function () {
          expect( this.iCat.setAge.method.outer.name ).toBe( "setAge_$outer_targeting_fact" )
        })
      })
    })

    describe("When accessing a nonexistent", function() {
      describe("public property", function () {
        it("Executes its _unknownProperty method", function () {
          expect( this.iCat.lifestyle ).toBe( "<<lifestyle>>" )
        })
      })

      describe("private property", function () {
        it("Executes its _externalPrivateAccess method", function () {
          expect( this.iCat._butter ).toBe( ">>_butter<<" )
        })
      })

      describe("symbol property", function () {
        it("Executes its _unknownProperty method", function () {
          expect( this.iCat.lifestyle ).toBe( "<<lifestyle>>" )
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
        it("Throws a direct assignment from outside error", function () {
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
          it("Throws an private property error", function () {
            expect(() => "_inc" in this.iCat).toThrowError(/access to private property/)
          })
        })

        describe("When absent", function () {
          it("Throws an private property error", function () {
            expect(() => "_xyz" in this.iCat).toThrowError(/access to private property/)
          })
        })
      })

      describe("a symbol property", function () {
        describe("When present", function () {
          // describe("When the receive is immutable", function () {
          //   it("Throws a TypeError", function () {
          //     expect( this.iCat.isImmutable ).toBe ( true )
          //     expect(() => $RIND in this.iCat ).toThrowError(TypeError)
          //   })
          // })

          describe("When the receive is mutable", function () {
            it("Answers false", function () {
              expect( this.mCat.isMutable ).toBe ( true )
              expect( BREED in this.mCat ).toBe( false )
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
        it("Executes its _externalPrivateAccess method", function () {
          expect( this.iCat.__proto__ ).toBe( ">>__proto__<<" )
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

})
