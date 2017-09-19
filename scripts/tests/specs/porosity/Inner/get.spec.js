Tranya.ImplementationTesting(function (Type_, AsName) {
  "use strict"

  describe("Inner get", function() {
    const BREED = Symbol("BREED")
    const XYZ   = Symbol("XYZ")

    beforeAll(function () {
      this.Cat = Type_({
        name   : "Cat",
        define : [
          function _init(name, breed, age) {
            this._setName(name)
            this[BREED] = breed
            this._age   = age
          },

          function age() { return this._age },

          function _inc() { this._age += 1 },

          function setAge(age) { this._age = age },

          function _unknownProperty(property) { return `<${AsName(property)}>` }
        ]
      })
    })

    beforeEach(function () {
      this.cat  = this.Cat.new("Nutmeg", "Torty", 1.5)
      this._cat = this.cat.this
    })

    describe("When accessing an existing property", function() {
      describe("public property", function () {
        it("Answers the property value", function () {
          expect( this._cat.name ).toBe( "Nutmeg" )
        })
      })

      describe("private property", function () {
        it("Answers the property value", function () {
          expect( this._cat._age ).toBe( 1.5 )
        })
      })

      describe("symbol property", function () {
        it("Answers the property value", function () {
          expect( this._cat[BREED] ).toBe( "Torty" )
        })
      })

      describe("public immediate method", function () {
        it("Executes the method", function () {
          expect( this._cat.age ).toBe( 1.5 )
        })
      })

      describe("private immediate method", function () {
        it("Executes the method", function () {
          this._cat._inc
          expect( this._cat.age ).toBe( 2.5 )
        })
      })

      describe("public method", function () {
        it("Answers the outer method handler", function () {
          expect( this._cat.setAge.method.outer.name ).toBe( "setAge_$outer$fact" )
        })
      })
    })

    describe("When accessing a nonexistent", function() {
      describe("public property", function () {
        it("Calls ._unknownProperty", function () {
          expect( this._cat.xyz ).toBe( "<xyz>" )
        })
      })

      describe("private property", function () {
        it("Calls ._unknownProperty", function () {
          expect( this._cat._xyz ).toBe( "<_xyz>" )
        })
      })

      describe("symbol property", function () {
        it("Calls ._unknownProperty", function () {
          expect( this._cat[XYZ] ).toBe( "<XYZ>" )
        })
      })
    })

  })
})
