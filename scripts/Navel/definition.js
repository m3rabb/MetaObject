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


AddMembershipSelector(_Definition, "isDeclaration", false)
AddMembershipSelector(_Definition, "isDurable",     false)
AddMembershipSelector(_Definition, "isAssigner"   , false)
AddMembershipSelector(_Definition, "isProperty"   , false)
AddMembershipSelector(_Definition, "isMethod"     , false)
AddMembershipSelector(_Definition, "isValue"      , false)


_Definition.addMethod(function _invalidSelectorError(selector) {
  this._signalError(`Definition must be set with a valid selector!! Not: '${selector}'`)
})
