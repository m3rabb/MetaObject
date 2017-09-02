_Definition.addMethod("super", AsRetroactiveProperty("super", {
  super : function () {
    const $inner = this[$INNER]

    switch ($inner.mode) {
      case DECLARATION : return null
      case ASSIGNER    : return null
    }

    if ($inner.isImmediate) { return $inner.inner }

    const handler =
      $inner.mode.super($inner.selector, $inner.handler, $inner.isPublic)

    return SetImmutableFunc(handler, SAFE_FUNC)
  }
}.super), BASIC_VALUE_METHOD)


_Definition.addLazyProperty(function isLazy() {
  return (this.mode === LAZY_INSTALLER)
})


_Definition.addMethod(function toString(_) {
  var count = this.handler.length
  return `${this.selector}(${count})`
}, BASIC_VALUE_METHOD)


AddIntrinsicDeclaration("isDeclaration")
AddIntrinsicDeclaration("isDurable")
AddIntrinsicDeclaration("isAssigner")
AddIntrinsicDeclaration("isProperty")
AddIntrinsicDeclaration("isMethod")
AddIntrinsicDeclaration("isValue")


_Definition.addMethod(function _invalidSelectorError(selector) {
  this._signalError(`Definition must be set with a valid selector!! Not: '${selector}'`)
})
