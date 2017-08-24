describe("Inner get", function() {
  const BREED = Symbol("BREED")
  const XYZ   = Symbol("XYZ")

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

        function _inc() { this._age += 1 },

        function setAge(age) { this._age = age },

        function _unknownProperty(property) { return `<${AsName(property)}>` }
      ]
    })
  })

  beforeEach(function () {
    this.cat = this.Cat.new_("Nutmeg", "Torty", 1.5).$INNER[$PULP]
  })

  describe("When accessing an existing property", function() {
    describe("public property", function () {
      it("Answers the property value", function () {
        expect( this.cat.name ).toBe( "Nutmeg" )
      })
    })

    describe("private property", function () {
      it("Answers the property value", function () {
        expect( this.cat._age ).toBe( 1.5 )
      })
    })

    describe("symbol property", function () {
      it("Answers the property value", function () {
        expect( this.cat[BREED] ).toBe( "Torty" )
      })
    })

    describe("public immediate method", function () {
      it("Executes the method", function () {
        expect( this.cat.age ).toBe( 1.5 )
      })
    })

    describe("private immediate method", function () {
      it("Executes the method", function () {
        this.cat._inc
        expect( this.cat.age ).toBe( 2.5 )
      })
    })

    describe("public method", function () {
      it("Answers the outer method handler", function () {
        expect( this.cat.setAge.method.outer.name ).toBe( "setAge_$outer$fact" )
      })
    })
  })

  describe("When accessing a nonexistent", function() {
    describe("public property", function () {
      it("Calls ._unknownProperty", function () {
        expect( this.cat.xyz ).toBe( "<xyz>" )
      })
    })

    describe("private property", function () {
      it("Calls ._unknownProperty", function () {
        expect( this.cat._xyz ).toBe( "<_xyz>" )
      })
    })

    describe("symbol property", function () {
      it("Calls ._unknownProperty", function () {
        expect( this.cat[XYZ] ).toBe( "<XYZ>" )
      })
    })
  })

})
