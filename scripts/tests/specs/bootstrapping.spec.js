describe("Bootstrapping", function() {
  it("sets up the InterMap", function () {
    expect( InterMap.constructor ).toBe( WeakMap )
  })

  it("sets up the base root hierarchy", function() {
    expect( RootOf( Base$root        ) ).toBe( null      )
    expect( RootOf(   Base$root$outer) ).toBe( Base$root )
    expect( RootOf(   Base$root$core ) ).toBe( Base$root )
  })

  it("sets up the Nothing constructor", function() {
    expect( typeof BlankNothing ).toBe( "function" )
    expect( BlankNothing.name ).toBe( "$core" )
    expect( (new BlankNothing())[RIND] ).toBeDefined()
    expect( RootOf(BlankNothing.prototype)  ).toBe( Base$root$core  )
    expect( RootOf(BlankNothing.$root$outer) ).toBe( Base$root$outer )
  })

  it("sets up the Something constructor", function() {
    expect( typeof BlankSomething ).toBe( "function" )
    expect( BlankSomething.name ).toBe( "$core" )
    expect( (new BlankSomething())[RIND] ).toBeDefined()
    expect( RootOf(BlankSomething.prototype)  ).toBe(BlankNothing.prototype)
    expect( RootOf(BlankSomething.$root$outer) ).toBe(BlankNothing.$root$outer)
  })

  it("sets up the Type constructor", function() {
    expect( typeof BlankType ).toBe( "function" )
    expect( BlankType.name ).toBe( "$Type" )
    expect( (new BlankType())[RIND] ).toBeDefined()
    expect( RootOf(BlankType.prototype)  ).toBe(BlankSomething.prototype)
    expect( RootOf(BlankType.$root$outer) ).toBe(BlankSomething.$root$outer)
  })


  it("sets up the default SECRET in the Nothing$root$core", function () {
    var Nothing$root$core = BlankNothing.prototype
    expect( Nothing$root$core[SECRET] ).toBe( INNER )
  })

  it("sets up the default _noSuchProperty in the Nothing$root$core", function () {
    var Nothing$root$core = BlankNothing.prototype
    expect( typeof Nothing$root$core._noSuchProperty ).toBe( "function" )
  })

  describe("The default _noSuchProperty", function() {
    it("answers undefined", function () {
      expect( BlankNothing.prototype._noSuchProperty.call() ).toBe( undefined )
    })
  })

  it("sets up the default _hasOwn method in the Something$root$core", function () {
    var Something$root$core = BlankSomething.prototype
    expect( typeof Something$root$core._hasOwn ).toBe( "function" )
  })

  it("sets up the functions for Type#_init", function () {
    expect( Create_COPY ).toBeDefined()
    expect( BlankType.prototype.setId ).toBeDefined()
    expect( BlankType.prototype.setSupertypes ).toBeDefined()
    expect( BlankType.prototype.setName ).toBeDefined()
    expect( BlankType.prototype.addProperty ).toBeDefined()
    expect( BlankType.prototype.add ).toBeDefined()
    expect( BlankType.prototype.addAll ).toBeDefined()
  })

  describe("Type#_init", function () {
    beforeEach(function () {
      this.Robot          = Type({name: "Robot"})
      this.Animal         = Type({name: "Animal"})
      this.Cat            = Type({name: "Cat", supertype: this.Animal})
      this.RoboCat        =
        Type({name: "RoboCat", supertypes: [this.Cat, this.Robot]})
      this.BlankType      = Type()
      this.BlankType$core = InterMap.get(this.BlankType)
    })

    it("sets the receiver's blank constructor", function () {
      expect( this.BlankType$core._blankConstructor.name ).toBe( "$core" )
    })

    it("sets the receiver's next IID", function () {
      expect( this.BlankType$core._nextIID ).toBe( 0 )
    })

    it("sets the receiver's subtypes", function () {
      expect( this.BlankType$core._subtypes.constructor ).toBe( Set )
    })

    it("sets the receiver's method dictionary", function () {
      var dict = this.BlankType$core._methods
      expect ( typeof dict ).toBe( "object" )
      expect( RootOf(dict) ).toBe( null )
    })

    it("sets the receiver's context", function () {
      expect( this.BlankType.context ).toBe( null )
    })

    xit("sets the receiver's id", function () {
      expect( this.BlankType.id ).toBeDefined()
    })

    it("sets the receiver's name", function () {
      expect( this.BlankType.name ).toBe( undefined )
    })

    it("sets the receiver's supertypes", function () {
      expect( this.BlankType$core._supertypes ).toEqual( [Thing] )
    })

    describe("It adds properties to receiver's instance root", function () {
      beforeEach(function () {
        this.blankConstructor = this.BlankType$core._blankConstructor
        this.$root$core        = this.blankConstructor.prototype
        this.$root$outer       = this.blankConstructor.$root$outer
      })

      xit("sets the COPY method, as private", function () {
        expect( typeof this.$root$core[COPY]  ).toBe( "function" )
        expect( typeof this.$root$outer[COPY] ).toBe( undefined )
      })

      it("sets the type property, as public", function () {
        expect( this.$root$core.type  ).toBe( this.BlankType )
        expect( this.$root$outer.type ).toBe( this.BlankType )
      })

      xit("sets the _newBlank method, as private", function () {
        expect( typeof this.$root$core._newBlank  ).toBe( "function" )
        expect( typeof this.$root$outer._newBlank ).toBe( undefined )
      })

      xdescribe("When _newBlank is executed", function () {
        it("answers a new blank copy of the type of instance", function () {
          var _newBlank = this.$root$core._newBlank
          var instance  = _newBlank()
          expect( instance.type ).toBe( this.BlankType )
        })

        it("doesn't call _init on the new instance", function () {
          spyOn(instance$root$core, "_init")
          var instance = this.$root$core._newBlank()
          expect( instance$root$core._init ).toHaveBeenCalledTimes( 0 )
        })
      })
    })

    describe("When the spec arg has a name", function () {
      it("sets the receiver's name to the given value", function () {
        expect( this.Cat.name ).toBe( "Cat" )
      })
    })

    describe("When the spec arg has a supertype", function () {
      it("sets the receiver's supertypes to an array with the given value", function () {
        var Cat$core = InterMap.get(this.Cat)
        expect( Cat$core._supertypes ).toEqual( [this.Animal] )
      })
    })

    describe("When the spec arg has supertypes", function () {
      it("sets the receiver's supertypes to the given value", function () {
        var RoboCat$core = InterMap.get(this.RoboCat)
        expect( RoboCat$core._supertypes ).toEqual( [this.Cat, this.Robot] )
      })
    })

    xdescribe("When there is a context arg", function () {
      it("sets the receiver's context to the given value", function () {
        var RoboCat$core = InterMap.get(this.RoboCat)
        expect( RoboCat$core._supertypes ).toEqual( [this.Cat, this.Robot] )
      })
    })

    describe("When there is a blank constructor arg", function () {
      it("sets the receiver's context to the given value", function () {
        var constructr = NewBlankConstructor(TypeCoreConstructorMaker)
        var Dog = Type({name : "Dog"}, null, constructr)
        var Dog$core = InterMap.get(Dog)
        expect( Dog$core._blankConstructor ).toBe( constructr )
      })
    })
  })

  it("sets up the basis types", function () {
    expect( Type.name      ).toBe( "Type"      )
    expect( Nothing.name   ).toBe( "Nothing"   )
    expect( Something.name ).toBe( "Something" )
    expect( Thing.name     ).toBe( "Thing"     )
    expect( Method.name    ).toBe( "Method"    )

    expect( Nothing.type   ).toBe( Type )
    expect( Something.type ).toBe( Type )
    expect( Thing.type     ).toBe( Type )
    expect( Method.type    ).toBe( Type )
    expect( Type.type      ).toBe( Type )
  })
})

describe("_noSuchProperty", function () {
  xit("description", function () {
    // body...
  })
})

describe("_hasOwn", function () {
  xit("description", function () {
    // body...
  })
})
