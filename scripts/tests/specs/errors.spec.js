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
