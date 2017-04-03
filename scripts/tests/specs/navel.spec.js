describe("OuterConstructorFor", function () {
  it("answers an constructor for a root", function () {
    var proto = {}
    var constructr = OuterConstructorFor(proto)
    var outer = new constructr()
    expect( RootOf(outer) ).toBe( proto )
  })
})

describe("CreateNamelessCoreConstructor", function () {
  it("answers a nameless core constructor", function () {
    var func = CreateNamelessCoreConstructor()
    expect( func.name ).toBe( "" )
  })

  describe("When executed", function () {
    beforeEach(function () {
      this.outerRoot = {kind: "outer"}
      this.outerConstructor = OuterConstructorFor(this.outerRoot)
      this.coreConstructor =
        CreateNamelessCoreConstructor(this.outerConstructor)
    })

    it("answers a function that answers an core object", function () {
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

      it("is it reachable by its rind via the InterMap", function () {
        var core = new this.coreConstructor()
        var rind = core[RIND]
        expect( InterMap.get(rind) ).toBe( core )
      })
    })
  })
})

describe("CoreConstructorFor", function () {
  it("answers an constructor for a root", function () {
    var coreProto = {}
    var constructr = CoreConstructorFor(coreProto)
    expect( typeof constructr ).toBe( "function" )
  })

  describe("An object created by the constructor", function () {
    it("descends from the core prototype", function () {
      var coreProto = {}
      var constructr = CoreConstructorFor(coreProto)
      var core = new constructr()
      expect( RootOf(core) ).toBe( coreProto )
    })

    it("has an outer that descends from the outer prototype", function () {
      var coreProto = {}
      var constructr = CoreConstructorFor(coreProto)
      var core = new constructr()
      var outer = core[OUTER]
      var outerRoot = RootOf(outer)

      expect( RootOf(outerRoot) ).toBe( Outer_root )
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

describe("Create_new", function () {
  function _init(name, age) {
    this.name = name
    this.age  = age
  }

  beforeEach(function () {
    this.Cat_root = SpawnFrom(Core_root)
    this.Cat_root._init = _init
    this.BlankCat = CoreConstructorFor(this.Cat_root)
    this.new       = Create_new(this.BlankCat)
  })

  it("answers a new function named 'new'", function () {
    const func = Create_new(this.BlankCat)
    expect( typeof func ).toBe( "function" )
    expect( func.name ).toBe( "new" )
  })

  describe("When run", function () {
    it("answers the rind of a newly initialized object", function () {
      const cat = this.new("Nutmeg", 1)
      cat.xyz = 123
      const catCore = InterMap.get(cat)
      expect( catCore[RIND] ).toBe( cat )
    })

    it("the new object is of the type of the Blank", function () {
      const cat = this.new("Nutmeg", 1)
      const catCore = InterMap.get(cat)
      expect( RootOf(catCore) ).toBe( this.Cat_root )
    })
  })
})

describe("CreateFactory", function () {
  function _init(name, age) {
    this.name = name
    this.age  = age
  }

  function beImmutable() {
    this[IS_IMMUTABLE] = true
    Frost(this[OUTER])
  }

  beforeEach(function () {
    // REVISIT once Types are fully formed
    this.Cat_root = SpawnFrom(Core_root)
    this.Cat_root._init = _init
    AddGetter(this.Cat_root, beImmutable)
    this.BlankCat = CoreConstructorFor(this.Cat_root)
    this.Cat = CreateFactory(this.BlankCat)
  })

  it("answers a new constructor function named $type", function () {
    expect( typeof this.Cat ).toBe( "function" )
    expect( this.Cat.name ).toBe( "$type" )
  })

  it("the constructor has no prototype", function () {
    expect( this.Cat.prototype ).toBe( undefined )
  })

  describe("When run", function () {
    it("answers the rind of a newly initialized object", function () {
      const cat = new this.Cat("Nutmeg", 1)
      cat.xyz = 123
      const catCore = InterMap.get(cat)
      expect( catCore[RIND] ).toBe( cat )
    })

    it("the new object is of the type of the Blank", function () {
      const cat = this.Cat("Nutmeg", 1)
      const catCore = InterMap.get(cat)
      expect( RootOf(catCore) ).toBe( this.Cat_root )
    })

    it("the outside of the new object is immutable", function () {
      const cat = this.Cat("Nutmeg", 1)
      const catCore = InterMap.get(cat)
      expect( catCore[IS_IMMUTABLE] ).toBe( true )
      expect( IsFrosted(cat) ).toBe( true )
    })

    it("but the inside of the new object is mmutable", function () {
      const cat = this.Cat("Nutmeg", 1)
      const catCore = InterMap.get(cat)
      expect( IsFrosted(catCore) ).toBe( false )
    })
  })

  xdescribe("When used with instanceof", function () {
    it("answers true if the object is an instance of the type", function () {
      const cat = this.Cat("Nutmeg", 1)
    })
  })
})
