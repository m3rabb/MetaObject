_Method.addLazyProperty("super", function () {
  return this.mode.super(this.name, this.handler, this.isPublic)
})

_Method.addLazyProperty(function isLazy() {
  return (this.mode === LAZY_INSTALLER)
})

_Method.addLazyProperty(function isImmediate() {
  return this.mode.isImmediate
})


_Method.addMethod(function toString() {
  var count = this.handler.length
  return `${this.selector}(${count})`
}, VALUE_METHOD)



_Method.addMethod(function _invalidSelectorError(selector) {
  this._signalError(`Method must be set with a valid selector!! Not: '${selector}'`)
})
