describe("Util", function() {
  describe("CreateNamelessEmptyFunction", function () {
    it("answers a nameless functionr", function () {
      var func = CreateNamelessEmptyFunction()
      expect( func.name ).toBe( "" )
    })

    describe("When executed", function () {
      it("answers a function", function () {
        var result = CreateNamelessEmptyFunction()
        expect( typeof result ).toBe( "function" )
      })

      it("which answers undefined", function () {
        var func = CreateNamelessEmptyFunction()
        expect( func() ).toBe( undefined )
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

  describe("AddGetter", function () {
    it("adds a getter property to an object", function () {
      const obj = {}
      const xyz = function () { return 123 }
      AddGetter(obj, xyz)
      const descriptor = PropertyDescriptor(obj, "xyz")
      expect ( descriptor.get ).toBe( xyz )
    })

    describe("When accessed", function () {
      it("answers a value", function () {
        const obj = {}
        const xyz = function () { return 123 }
        AddGetter(obj, xyz)
        expect ( obj.xyz ).toBe( 123 )
      })

      it("executes the getter function", function () {
        const getter = jasmine.createSpy("getter")
        const obj = {}
        AddGetter(obj, "xyz", getter)
        const result = obj.xyz
        expect( getter ).toHaveBeenCalled()
      })
    })
  })

  describe("AddLazyProperty", function () {
    it("adds a getter loader property to an object", function () {
      const obj = {}
      const xyz = function () { return 123 }
      AddLazyProperty(obj, xyz)
      const descriptor = PropertyDescriptor(obj, "xyz")
      expect ( descriptor.get.name ).toBe( "$loader" )
    })

    describe("When accessed", function () {
      it("answers a value", function () {
        const obj = {}
        const xyz = function () { return 123 }
        AddLazyProperty(obj, xyz)
        expect ( obj.xyz ).toBe( 123 )
      })

      it("executes the getter/installer function", function () {
        const installer = jasmine.createSpy("installer")
        const obj = {}
        AddLazyProperty(obj, "xyz", installer)
        const result = obj.xyz
        expect( installer ).toHaveBeenCalled()
      })

      it("sets the property", function () {
        const installer = jasmine.createSpy("installer")
        const obj = {}
        installer.and.returnValue(123)
        AddLazyProperty(obj, "xyz", installer)
        const result = obj.xyz
        const descriptor = PropertyDescriptor(obj, "xyz")
        expect( descriptor.value ).toBe( 123 )
      })

      it("overwriting the installer", function () {
        const installer = jasmine.createSpy("installer")
        const obj = {}
        AddLazyProperty(obj, "xyz", installer)
        const result = obj.xyz
        const descriptor = PropertyDescriptor(obj, "xyz")
        expect( descriptor.get ).toBe( undefined )
      })
    })
  })
})
