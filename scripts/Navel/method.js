_Method.addRetroactiveProperty(function _$super() {
  const $inner   = this[$INNER]
  const selector = $inner.isImmediate ? "inner" : "super"
  return $inner.mode[selector]($inner.name, $inner.handler, $inner.isPublic)
})

_Method.addLazyProperty(function isLazy() {
  return (this.mode === LAZY_INSTALLER)
})


_Method.addMethod(function toString() {
  var count = this.handler.length
  return `${this.selector}(${count})`
}, BASIC_VALUE_METHOD)



_Method.addMethod(function _invalidSelectorError(selector) {
  this._signalError(`Method must be set with a valid selector!! Not: '${selector}'`)
})
