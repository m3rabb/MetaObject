describe("Type permeable outer", function() {
  beforeEach(function () {
    var context = {id: "Tester"}
    this.Bat_ = Type.new_({
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
        expect( this.Bat_.name ).toBe( "Bat" )
      })
    })

    describe("private property", function () {
      it("Answers the property value", function () {
        expect( this.Bat_._iidCount ).toBe( 0 )
      })
    })

    describe("symbol property", function () {
      it("Answers the property value", function () {
        expect( this.Bat_[$RIND] ).toBe( this.Bat_ )
      })
    })

    describe("public immediate method", function () {
      it("Executes the method", function () {
        expect( this.Bat_.formalName ).toBe( "Tester@Bat" )
      })
    })

    describe("private immediate method", function () {
      it("Executes the method", function () {
        expect( this.Bat_._nextIID ).toBe( 1 )
      })
    })

    describe("public method", function () {
      it("Answers the outer method handler", function () {
        expect( this.Bat_.toString.method.outer.name ).toBe( "toString_$outer$fact" )
      })
    })
  })

  describe("When accessing a nonexistent", function() {
    describe("public property", function () {
      it("Throws an unknown property error", function () {
        expect(() => this.Bat_.xyz ).toThrowError(/doesn't have a property/)
      })
    })

    describe("private property", function () {
      it("Throws an unknown property error", function () {
        expect(() => this.Bat_._xyz).toThrowError(/doesn't have a property/)
      })
    })

    describe("symbol property", function () {
      it("Throws an unknown property error", function () {
        var XYZ = Symbol("XYZ")
        expect(() => this.Bat_[XYZ] ).toThrowError(/doesn't have a property/)
      })
    })
  })

  describe("When assigning", function() {
    describe("A public property", function () {
      it("Throws a direct assignment from outside error", function () {
        expect(() => (this.Bat_.name = "Nancy")).toThrowError(/not allowed from the outside/)
      })
    })

    describe("A private property", function () {
      it("Throws a direct assignment from outside error", function () {
        expect(() => (this.Bat_._xyz = 123)).toThrowError(/not allowed from the outside/)
      })
    })
  })

  describe("When checking for the presence of", function () {
    describe("a public property", function () {
      describe("When present", function () {
        it("Answers true", function () {
          expect( "name" in this.Bat_ ).toBe( true )
        })
      })

      describe("When absent", function () {
        it("Answers false", function () {
          expect( "xyz" in this.Bat_ ).toBe( false )
        })
      })
    })

    describe("a private property", function () {
      describe("When present", function () {
        it("Answers true", function () {
          expect( "_properties" in this.Bat_ ).toBe( true )
        })
      })

      describe("When absent", function () {
        it("Answers false", function () {
          expect( "_xyz" in this.Bat_ ).toBe( false )
        })
      })
    })

    describe("a symbol property", function () {
      describe("When present", function () {
        describe("When the receive is immutable", function () {
          it("Answers true", function () {
            this.Bat_.beImmutable
            expect( this.Bat_.isImmutable ).toBe ( true )
            expect( $RIND in this.Bat_ ).toBe( true )
          })
        })

        describe("When the receive is mutable", function () {
          it("Answers true", function () {
            expect( this.Bat_.isMutable ).toBe ( true )
            expect( $RIND in this.Bat_ ).toBe( true )
          })
        })
      })

      describe("When absent", function () {
        it("Answers false", function () {
          var XYZ = Symbol("XYZ")
          expect( XYZ in this.Bat_ ).toBe( false )
        })
      })
    })
  })

  describe("When accessing the parent object", function () {
    describe("via the __proto__", function () {
      it("Throws an unknown property error", function () {
        expect(() => this.Bat_.__proto__).toThrowError(/doesn't have a property/)
      })
    })

    describe("via the getPrototypeOf", function () {
      describe("When the receive is immutable", function () {
        it("Answers null", function () {
          this.Bat_.beImmutable
          expect( this.Bat_.isImmutable ).toBe ( true )
          expect( Object.getPrototypeOf(this.Bat_) ).toBe( null )
        })
      })

      describe("When the receive is mutable", function () {
        it("Answers null", function () {
          expect( this.Bat_.isMutable ).toBe ( true )
          expect( Object.getPrototypeOf(this.Bat_) ).toBe( null )
        })
      })
    })
  })

  describe("When executed", function () {
    it("Created a new factual instance", function () {
      var bat = this.Bat_("Spooky", "Fruit")
      expect( bat.isBat ).toBe( true )
      expect( bat.name ).toBe( "Spooky" )
      expect( bat.kind ).toBe( "Fruit" )
      expect( bat.isImmutable ).toBe( true )
      expect( bat.oid ).toBe( "1.Tester@Bat" )
    })

    xit("Answers an instance that's the exactly same as when executing .newAsFact", function () {
      var bat = this.Bat_("Spooky", "Fruit")
      var bat2 = Bat.newAsFact("Spooky", "Fruit")
      expect( bat.isExactly(bat2) ).toBe( true )
    })
  })
})
