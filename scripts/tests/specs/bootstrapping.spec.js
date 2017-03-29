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
    it("sets up the BlankRoot", function () {
      const blankInstance = new BlankRoot()
      expect( blankInstance[RIND] ).toBeDefined()
    })

    it("sets up the BlankThing", function () {
      const blankInstance = new BlankThing()
      expect( blankInstance[RIND] ).toBeDefined()
    })

    it("sets up the BlankMethod", function () {
      const blankInstance = new BlankMethod()
      expect( blankInstance[RIND] ).toBeDefined()
    })
  })

})
