_Method.addLazyProperty("_$super", function () {
  const $inner = this[$INNER]
  return $inner.isImmediate ?
    $inner.mode.inner($inner.name, $inner.handler, $inner.isPublic) :
    $inner.mode.super($inner.name, $inner.handler, $inner.isPublic)
})

_Method.addLazyProperty(function isLazy() {
  return (this.mode === LAZY_INSTALLER)
})


_Method.addMethod(function toString() {
  var count = this.handler.length
  return `${this.selector}(${count})`
}, VALUE_METHOD)



_Method.addMethod(function _invalidSelectorError(selector) {
  this._signalError(`Method must be set with a valid selector!! Not: '${selector}'`)
})
