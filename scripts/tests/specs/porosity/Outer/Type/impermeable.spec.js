describe("Type impermeable outer", function() {
  beforeEach(function () {
    var context = {id: "Tester"}
    this.Bat = Type({
      name: "Bat",
      context: context,
      defines: [
        "name, kind",

        function _init(name, kind) {
          this.name = name
          this.kind = kind
        }
      ]
    })
  })

  describe("When accessing an existing", function() {
    describe("public property", function () {
      it("Answers the property value", function () {
        expect( this.Bat.name ).toBe( "Bat" )
      })
    })

    describe("private property", function () {
      it("Throws an private property error", function () {
        expect(() => this.Bat._iidCount).toThrowError(/Access to private property/)
      })
    })

    describe("symbol property", function () {
      it("Answers the property value", function () {
        expect( this.Bat[$RIND] ).toBe( this.Bat )
      })
    })

    describe("public immediate method", function () {
      it("Executes the method", function () {
        expect( this.Bat.formalName ).toBe( "Tester@Bat" )
      })
    })

    describe("private immediate method", function () {
      it("Throws an private property error", function () {
        expect(() => this.Bat._nextIID).toThrowError(/Access to private property/)
      })
    })

    describe("public method", function () {
      it("Answers the outer method handler", function () {
        expect( this.Bat.toString.method.outer.name ).toBe( "toString_$outer$fact" )
      })
    })
  })

  describe("When accessing a nonexistent", function() {
    describe("public property", function () {
      it("Throws an unknown property error", function () {
        expect(() => this.Bat.xyz ).toThrowError(/doesn't have a property/)
      })
    })

    describe("private property", function () {
      it("Throws an private property error", function () {
        expect(() => this.Bat._xyz).toThrowError(/Access to private property/)
      })
    })

    describe("symbol property", function () {
      it("Throws an unknown property error", function () {
        var XYZ = Symbol("XYZ")
        expect(() => this.Bat[XYZ] ).toThrowError(/doesn't have a property/)
      })
    })
  })

  describe("When assigning", function() {
    describe("A public property", function () {
      it("Throws a direct assignment from outside error", function () {
        expect(() => (this.Bat.name = "Nancy")).toThrowError(/not allowed from the outside/)
      })
    })

    describe("A private property", function () {
      it("Throws a direct assignment from outside error", function () {
        expect(() => (this.Bat._xyz = 123)).toThrowError(/not allowed from the outside/)
      })
    })
  })

  describe("When checking for the presence of", function () {
    describe("a public property", function () {
      describe("When present", function () {
        it("Answers true", function () {
          expect( "name" in this.Bat ).toBe( true )
        })
      })

      describe("When absent", function () {
        it("Answers false", function () {
          expect( "xyz" in this.Bat ).toBe( false )
        })
      })
    })

    describe("a private property", function () {
      describe("When present", function () {
        it("Throws an private property error", function () {
          expect(() => "_properties" in this.Bat).toThrowError(/Access to private property/)
        })
      })

      describe("When absent", function () {
        it("Throws an private property error", function () {
          expect(() => "_xyz" in this.Bat).toThrowError(/Access to private property/)
        })
      })
    })

    describe("a symbol property", function () {
      describe("When present", function () {
        describe("When the receive is immutable", function () {
          it("Answers false", function () {
            this.Bat.beImmutable
            expect( this.Bat.isImmutable ).toBe ( true )
            expect( $RIND in this.Bat ).toBe( false )
          })
        })

        describe("When the receive is mutable", function () {
          it("Answers false", function () {
            expect( this.Bat.isMutable ).toBe ( true )
            expect( $RIND in this.Bat ).toBe( false )
          })
        })
      })

      describe("When absent", function () {
        it("Answers false", function () {
          var XYZ = Symbol("XYZ")
          expect( XYZ in this.Bat ).toBe( false )
        })
      })
    })
  })

  describe("When accessing the parent object", function () {
    describe("via the __proto__", function () {
      it("Throws an private property error", function () {
        expect(() => this.Bat.__proto__).toThrowError(/Access to private property/)
      })
    })

    describe("via the getPrototypeOf", function () {
      describe("When the receive is immutable", function () {
        it("Answers null", function () {
          this.Bat.beImmutable
          expect( this.Bat.isImmutable ).toBe ( true )
          expect( Object.getPrototypeOf(this.Bat) ).toBe( null )
        })
      })

      describe("When the receive is mutable", function () {
        it("Answers null", function () {
          expect( this.Bat.isMutable ).toBe ( true )
          expect( Object.getPrototypeOf(this.Bat) ).toBe( null )
        })
      })
    })
  })

  describe("When executed", function () {
    it("Created a new factual instance", function () {
      var bat = this.Bat("Spooky", "Fruit")
      expect( bat.isBat ).toBe( true )
      expect( bat.name ).toBe( "Spooky" )
      expect( bat.kind ).toBe( "Fruit" )
      expect( bat.isImmutable ).toBe( true )
      expect( bat.oid ).toBe( "1.Tester@Bat" )
    })

    xit("Answers an instance that's the exactly same as when executing .newAsFact", function () {
      var bat = this.Bat("Spooky", "Fruit")
      var bat2 = Bat.newAsFact("Spooky", "Fruit")
      expect( bat.isExactly(bat2) ).toBe( true )
    })
  })
})
