describe("Bootstrapping", function() {
  it("sets up the InterMap", function () {
    expect( InterMap.constructor ).toBe( WeakMap )
  })

  it("sets up the initial root hierarchy", function() {

    expect( RootOf(Base_root)          ).toBe( null       )
    expect( RootOf(  Outer_base)       ).toBe( Base_root  )
    expect( RootOf(    Outer_root)     ).toBe( Outer_base )

    expect( RootOf(  Core_base)        ).toBe( Base_root  )
    expect( RootOf(    Core_root)      ).toBe( Core_base  )
    expect( RootOf(      Thing_core)   ).toBe( Core_root  )
    expect( RootOf(      Type_core)    ).toBe( Core_root  )
    expect( RootOf(      Method_core)  ).toBe( Core_root  )
  })

  it("sets up the default INNER", function () {
    expect( Core_root[INNER] ).toBe( Core_root )
  })

  it("sets up the default SECRET", function () {
    expect( Core_root[SECRET] ).toBe( INNER )
  })

  describe("Make foundational core constructors", function() {
    it("sets up the BlankThing", function () {
      const blankInstance = new BlankThing()
      expect( blankInstance[RIND] ).toBeDefined()
    })

    it("sets up the BlankType", function () {
      const blankInstance = new BlankType()
      expect( blankInstance[RIND] ).toBeDefined()
    })

    it("sets up the BlankMethod", function () {
      const blankInstance = new BlankMethod()
      expect( blankInstance[RIND] ).toBeDefined()
    })
  })

})

describe("SignalError", function () {
  beforeEach(function () {
    this.obj = {abc: 123}
    this.message = "Something happened!"
    this.testRun = (() => SignalError(this.obj, this.message))

  })

  it("defaults to not throwing an error", function () {
    expect(this.testRun).not.toThrow()
  })

  it("defaults to answering null", function () {
    var result = SignalError(this.obj, this.message)
    expect(result).toBe(null)
  })

  describe("When logging errors", function () {
    beforeEach(function () {
      this.prior = LogErrors
      this.testRun = (() => SignalError(this.obj, this.message))
      LogErrors = true
    })

    afterEach(function () {
      LogErrors = this.prior
      ErrorLog.length = 0
    })

    it("records the error message", function () {
      const message = "[object Object]: Something happened!"
      SignalError(this.obj, this.message)
      expect( ErrorLog.length ).toBe( 1 )
      expect( ErrorLog[0] ).toBe( message )
    })
  })

  describe("When not handling errors quietly", function () {
    beforeEach(function () {
      this.prior = HandleErrorsQuietly
      this.testRun = (() => SignalError(this.obj, this.message))
      HandleErrorsQuietly = false
    })

    afterEach(function () {
      HandleErrorsQuietly = this.prior
    })

    it("throws an error", function () {
      expect(this.testRun).toThrowError(Error, this.message)
    })

    it("sets the error's name to 'Purple Carrot Error'", function () {
      var result
      try { this.testRun() }
      catch (ex) { result = ex }
      expect(result.name).toBe("Purple Carrot Error")
    })

    it("sets the error's target", function () {
      var result
      try { this.testRun() }
      catch (ex) { result = ex }
      expect(result.target).toBe(this.obj)
    })
  })
})

describe("InAtPut", function () {
  it("assigns a property to a selector within a target object", function () {
    var obj = {}
    InAtPut(obj, "abc", 123)
    expect( obj.abc ).toBe( 123 )
  })
})

describe("InPutMethod", function () {
  it("assigns a named function to selector within a target object", function () {
    var obj = {}
    var func = function abc() {}
    InPutMethod(obj, func)
    expect( obj.abc ).toBe( func )
  })
})

describe("CreateNamelessOuterConstructor", function () {
  it("answers a nameless outer constructor", function () {
    var func = CreateNamelessOuterConstructor()
    expect( func.name ).toBe( "" )
  })

  describe("When executed", function () {
    it("answers a function", function () {
      var result = CreateNamelessOuterConstructor()
      expect( typeof result ).toBe( "function" )
    })

    it("which answers an outer object", function () {
      var constructr = CreateNamelessOuterConstructor()
      var outer = new constructr()
      expect( typeof outer ).toBe( "object" )
    })

    it("with a rind", function () {
      var constructr = CreateNamelessOuterConstructor()
      var outer = new constructr()
      var rind = outer[RIND]
      rind.xyz = 123
      expect( outer.xyz ).toBe( undefined )
      expect( rind.xyz ).toBe( undefined )
    })
  })
})

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
    expect( IsFrozen(this.func) ).toBe( true )
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
    expect( IsFrozen(this.func.prototype) ).toBe( true )
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
    Freeze(this[OUTER])
  }

  beforeEach(function () {
    this.Cat_root = SpawnFrom(Core_root)
    this.Cat_root._init = _init
    AddGetter(this.Cat_root, beImmutable)
    this.BlankCat = CoreConstructorFor(this.Cat_root)
    this.factory  = CreateFactory(this.BlankCat)
  })

  it("answers a new nameless function", function () {
    expect( typeof this.factory ).toBe( "function" )
    expect( this.factory.name ).toBe( "" )
  })

  describe("When run", function () {
    it("answers the rind of a newly initialized object", function () {
      const cat = new this.factory("Nutmeg", 1)
      cat.xyz = 123
      const catCore = InterMap.get(cat)
      expect( catCore[RIND] ).toBe( cat )
    })

    it("the new object is of the type of the Blank", function () {
      const cat = this.factory("Nutmeg", 1)
      const catCore = InterMap.get(cat)
      expect( RootOf(catCore) ).toBe( this.Cat_root )
    })

    it("the outside of the new object is immutable", function () {
      const cat = this.factory("Nutmeg", 1)
      const catCore = InterMap.get(cat)
      expect( catCore[IS_IMMUTABLE] ).toBe( true )
      expect( IsFrozen(cat) ).toBe( true )
    })

    it("but the inside of the new object is mmutable", function () {
      const cat = this.factory("Nutmeg", 1)
      const catCore = InterMap.get(cat)
      expect( IsFrozen(catCore) ).toBe( false )
    })
  })
})
