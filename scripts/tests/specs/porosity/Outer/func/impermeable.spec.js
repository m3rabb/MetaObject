Tranya.ImplementationTesting(function (Type_, AsName) {
  "use strict"

  describe("Type impermeable outer", function() {
    const XYZ = Symbol("XYZ")
    const QRS = Symbol("QRS")

    beforeEach(function () {
      this.Bat = Type_.new({
        name: "Bat",
        defines: [
          "name, kind",

          function _init(name, kind) {
            this.name = name
            this.kind = kind
          },
        ]
      })
      this.Bat.addOwnMethod(function _unknownProperty(selector) {
        return `<<${AsName(selector)}>>`
      })

      this.Bat.addOwnMethod(function _externalPrivateAccess(selector) {
        return `>>${AsName(selector)}<<`
      })
      this.Bat.this[XYZ] = 123
    })

    describe("When accessing an existing", function() {
      describe("public property", function () {
        it("Answers the property value", function () {
          var result = this.Bat.name
          expect( result ).toBe( "Bat" )
        })
      })

      describe("private property", function () {
        it("Executes its _externalPrivateAccess method", function () {
          expect( this.Bat._iidCount ).toBe( ">>_iidCount<<" )
        })
      })

      describe("symbol property", function () {
        it("Answers the property value", function () {
          expect( this.Bat[XYZ] ).toBe( 123 )
        })
      })

      describe("public immediate method", function () {
        it("Executes the method", function () {
          expect( this.Bat.formalName ).toBe( "Bat" )
        })
      })

      describe("private immediate method", function () {
        it("Executes its _externalPrivateAccess method", function () {
          expect( this.Bat._nextIID ).toBe( ">>_nextIID<<" )
        })
      })

      describe("public method", function () {
        it("Answers the outer method handler", function () {
          expect( this.Bat.toString.method.outer.name ).toBe( "toString_$outer_nontargeting_value" )
        })
      })
    })

    describe("When accessing a nonexistent", function() {
      describe("public property", function () {
        it("Executes its _unknownProperty method", function () {
          expect( this.Bat.xyz ).toBe( "<<xyz>>" )
        })
      })

      describe("private property", function () {
        it("Executes its _externalPrivateAccess method", function () {
          expect( this.Bat._xyz ).toBe( ">>_xyz<<" )
        })
      })

      describe("symbol property", function () {
        it("Executes its _unknownProperty method", function () {
          expect( this.Bat[QRS] ).toBe( "<<QRS>>" )
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
            expect(() => "_properties" in this.Bat).toThrowError(/access to private property/)
          })
        })

        describe("When absent", function () {
          it("Throws an private property error", function () {
            expect(() => "_xyz" in this.Bat).toThrowError(/access to private property/)
          })
        })
      })

      describe("a symbol property", function () {
        // xdescribe("When present", function () {
        //   describe("When the receive is immutable", function () {
        //     it("Answers false", function () {
        //       this.Bat.beImmutable
        //       expect( this.Bat.isImmutable ).toBe ( true )
        //       expect( $RIND in this.Bat ).toBe( false )
        //     })
        //   })
        //
        //   describe("When the receive is mutable", function () {
        //     it("Answers false", function () {
        //       expect( this.Bat.isMutable ).toBe ( true )
        //       expect( $RIND in this.Bat ).toBe( false )
        //     })
        //   })
        // })

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
        it("Executes its _externalPrivateAccess method", function () {
          expect( this.Bat.__proto__ ).toBe( ">>__proto__<<" )
        })
      })

      xdescribe("via the getPrototypeOf", function () {
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
        expect( bat.oid ).toBe( "1.Bat_" )
      })

      xit("Answers an instance that's the exactly same as when executing .newAsFact", function () {
        var bat = this.Bat("Spooky", "Fruit")
        var bat2 = this.Bat.newAsFact("Spooky", "Fruit")
        expect( bat.isExactly(bat2) ).toBe( true )
      })
    })
  })
})
