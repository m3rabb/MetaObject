Thing.addSMethod("equals", Thing_root.is)

Thing.addSMethod(function exec(selector, ...args) {
  // Must check that selector is not private!!!
  return Apply(this[selector], this, args)
})

Thing.addSMethod(function _asExec(type, selector, ...args) {

  // Must check that type is a valid supertype!!!
  // It might be enough to check whether or not type is extensible!!!
  return type.isExtensible ?
    Apply(type.handlerAt(selector), this, args) :
    this.error(`Can't call _asExec with a nonextensible type!`)
})
Thing.addSMethod(function _asExec(type, selector, ...args) {
  // Might need a security check to make sure target object is a
  // subtype of the given type to prevent unauthorized param access!!!

  // using _handlerAt vs handlerAt might be enough
  return Apply(type._instanceRoot[selector], this, args)
})

Thing.addSMethod(function _superExec(selector, ...args) {
  const handler = this[selector]
  const ancestry = this.ancestry
  let next = ancestry.length
  while (next--) {
    let type = ancestry[next]
    let superHandler = type.methods[selector]
    if (superHandler && superHandler !== handler) {
      return Apply(superHandler, this, args) // do these need to be protected too???
    }
  }
  return this._noSuchProperty(selector, args)
})

Thing.addSMethod(function understands(selector) {
  !!return this.type.handlerAt(selector)
})

Thing.addSMethod(function hasProperty(selector) {
  return (selector[0] === "_") ? undefined : (selector in this)
})

Thing.addSMethod(function isImmutable() { return !!this[_$isImmutable]}) }

Thing.addSMethod(function isMutable() { return !this[_$isImmutable]}) }

Thing.addSMethod(function shouldNotImplementError() {
  return this.error("Method should not be implemented!");
});

Thing.addSMethod(function notYetImplementedError() {
  return this.error("Method not yet implemented!");
});

Thing.addSMethod(function notYetTestedError() {
  return this.error("Method not yet tested!");
});

Thing.addSMethod(function subtypeResponsibilityError() {
  return this.error("Method should be implemented by this or subtype!");
});
