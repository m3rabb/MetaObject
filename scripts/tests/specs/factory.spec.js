describe("CoreConstructorMaker", function () {
  beforeEach(function () {
    this.pairedOuter = function () {}
  })

  it("answers a constructor func", function () {
    var constructr = CoreConstructorMaker(this.pairedOuter)
    expect( typeof constructr ).toBe( "function" )
  })

  describe("When the generated constructor is executed", function () {
    beforeEach(function () {
      this.coreConstructor = CoreConstructorMaker(this.pairedOuter)
    })

    it("answers a core object", function () {
      var core = new this.coreConstructor()
      expect( typeof core ).toBe( "object" )
    })

    describe("Where the core object", function () {
      it("has an inner proxy", function () {
        var core = new this.coreConstructor()
        var inner = core[INNER]
        var tester = function () {}

        inner.abc = tester
        expect( inner.abc.name ).toBe( "$wrappedOutsideFunc" )
      })

      it("has an outer object", function () {
        var core = new this.coreConstructor()
        var outer = core[OUTER]

        core[INNER].xyz = 123
        expect( outer.xyz ).toBe( 123 )
      })

      it("has a rind proxy", function () {
        var core = new this.coreConstructor()
        var rind = core[RIND]
        rind.xyz = 123
        expect( core.xyz ).toBe( undefined )
      })

      it("its outer also has a reference to the rind proxy", function () {
        var core = new this.coreConstructor()
        var rind = core[RIND]
        expect( core[OUTER][RIND] ).toBe( rind )
      })

      it("it's reachable by its rind via the InterMap", function () {
        var core = new this.coreConstructor()
        var rind = core[RIND]
        expect( InterMap.get(rind) ).toBe( core )
      })
    })
  })
})

describe("TypeCoreConstructorMaker", function () {
  beforeEach(function () {
    this.typeOuter = function () {}
  })

  it("answers a constructor func", function () {
    var typeConstructor = TypeCoreConstructorMaker(this.typeOuter)
    expect( typeof typeConstructor ).toBe( "function" )
  })

  it("answers a constructor func named '$Type'", function () {
    var typeConstructor = TypeCoreConstructorMaker(this.typeOuter)
    expect( typeConstructor.name ).toBe( "$Type" )
  })

  describe("When the generated constructor is executed", function () {
    beforeEach(function () {
      this.typeConstructor = TypeCoreConstructorMaker(this.typeOuter)
    })

    it("answers a core object", function () {
      var core = new this.typeConstructor()
      expect( typeof core ).toBe( "object" )
    })

    describe("Where the core object", function () {
      beforeEach(function () {
        this.core = new this.typeConstructor()
        this.inner = this.core[INNER]
        this.outer = this.core[OUTER]
        this.rind = this.core[RIND]
        this.blanker = this.core[BLANKER]
      })

      it("has a blank constructor function", function () {
        expect( typeof this.blanker ).toBe( "function" )
      })

      describe("Where the blanker", function () {
        it("is named '$blanker'", function () {
          expect( this.blanker.name ).toBe( "$blanker" )
        })

        it("has a confirmed 'safe' function", function () {
          expect( InterMap.get(this.blanker) ).toBe( SAFE_FUNCTION )
        })

        describe("When executed", function () {
          beforeEach(function () {
            var Dog$core = new this.typeConstructor()
            var testInstance = {
              name    : "Mr. Peabody",
              kind    : "Canine",
              [INNER] : {_init: () => "INITED"}
            }
            testInstance[RIND] = testInstance
            Dog$core._blankConstructor = function () {
              return testInstance
            }

            spyOn(Dog$core, "_blankConstructor").and.callThrough()
            spyOn(testInstance[INNER], "_init").and.callThrough()

            this.testInstance = testInstance
            this.Dog = Dog$core[RIND]
            this.rover = this.Dog("Rover", 3)
          })

          it("creates a new instance", function () {
            expect( this.rover.kind ).toBe( "Canine" )
          })

          it("calls #_blankConstructor on itself", function () {
            var Dog$core = InterMap.get(this.Dog)
            expect( Dog$core._blankConstructor ).toHaveBeenCalled()
          })

          it("calls #_init on the instance's $inner", function () {
            var _init = this.testInstance[INNER]._init
            expect( _init ).toHaveBeenCalledWith( "Rover", 3 )
          })
        })
      })

      it("has an inner proxy", function () {
        this.inner.abc = function tester() {}
        expect( this.inner.abc.name ).toBe( "$wrappedOutsideFunc" )
      })

      describe("Where the inner proxy", function () {
        it("disguises the core as the blanker func", function () {
          expect( typeof this.inner ).toBe( "function" )
        })

        it("makes access go to the core object", function () {
          this.inner.xyz = 123
          expect( this.core.xyz ).toBe( 123 )
        })

        it("not the disguising blanker func", function () {
          this.inner.xyz = 123
          expect( this.blanker.xyz ).toBe( undefined )
        })
      })

      it("has an outer object", function () {
        this.inner.xyz = 123
        expect( this.outer.xyz ).toBe( 123 )
      })

      it("has a rind proxy", function () {
        this.rind.xyz = 123
        expect( this.outer.xyz ).toBe( undefined )
        expect( this.core.xyz ).toBe( undefined )
      })

      describe("Where the rind proxy", function () {
        it("disguises the outer as the blanker func", function () {
          expect( typeof this.rind ).toBe( "function" )
        })

        it("makes access go to the outer object", function () {
          this.outer.xyz = 123
          expect( this.rind.xyz ).toBe( 123 )
        })

        it("not the disguising blanker func", function () {
          this.blanker.xyz = 123
          expect( this.rind.xyz ).toBe( undefined )
        })

        it("making the blanker's prototype inaccessible", function () {
          expect( this.rind.prototype ).toBe( undefined )
        })
      })

      it("its outer also has a reference to the rind proxy", function () {
        expect( this.outer[RIND] ).toBe( this.rind )
      })

      it("it's reachable by its rind via the InterMap", function () {
        expect( InterMap.get(this.rind) ).toBe( this.core )
      })
    })
  })
})

describe("NewBlankConstructor", function () {
  beforeEach(function () {
    this.constructor = NewBlankConstructor(CoreConstructorMaker)
  })

  it("answers a fully formed blank constructor using a core constructor maker", function () {
    expect( typeof this.constructor ).toBe( "function" )
  })

  describe("The answered constructor", function () {
    it("has its prototype set to a new root descends from the Something core root", function () {
      var coreRoot = this.constructor.prototype
      var Something$core = RootOf(coreRoot)
      expect( InHasSelector.call(Something$core, "_has") ).toBe( true )
    })

    it("has an outer root set to a new root descends from the Something outer root", function () {
      var $root$outer = this.constructor.$root$outer
      expect( typeof $root$outer ).toBe( "object" )
    })

    it("is a confirmed 'safe' function", function () {
      expect( InterMap.get(this.constructor) ).toBe( SAFE_FUNCTION )
    })
  })
})


describe("DegenerateConstructorForNamingInDebugger", function () {
  beforeEach(function () {
    this.func = DegenerateConstructorForNamingInDebugger("Carrot")
  })

  it("answers a new constructor function", function () {
    expect( typeof this.func ).toBe( "function" )
  })

  it("has the type's name", function () {
    expect( this.func.name ).toBe( "Carrot" )
  })

  it("return null when executed", function () {
    expect( this.func() ).toBe( null )
  })

  describe("When not handling errors quietly", function () {
    it("throws an error when executed", function () {
      HandleErrorsQuietly = false
      var message = "This constructor is only used for debugging!"
      expect( this.func ).toThrowError(Error, message)
      HandleErrorsQuietly = true
    })
  })

  it("is frozen", function () {
    expect( IsFrosted(this.func) ).toBe( true )
  })

  it("its immutable", function () {
    expect( this.func[IS_IMMUTABLE] ).toBe( true )
  })

  it("sets its prototype's constructor to itself", function () {
    expect( this.func.prototype.constructor ).toBe( this.func )
  })

  it("has its prototype has no other properties", function () {
    expect( AllSelectors(this.func.prototype).length ).toBe( 1 )
  })

  it("has its prototype set immutable", function () {
    expect( IsFrosted(this.func.prototype) ).toBe( true )
  })
})
