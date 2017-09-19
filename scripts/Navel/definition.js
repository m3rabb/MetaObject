Tranya(function (
  $INNER,
  ASSIGNER, DECLARATION, IDEMPOT_VALUE_METHOD, LAZY_INSTALLER, SAFE_FUNC,
  AddIntrinsicDeclaration, Definition, MarkAndSetFuncImmutable, SignalError,
  _Definition
) {
  // "use strict"

  _Definition.addRetroactiveProperty("super", {
    super : function () {
      const $inner = this[$INNER]

      switch ($inner.mode) {
        case DECLARATION : return null
        case ASSIGNER    : return null
      }

      if ($inner.isImmediate) { return $inner.inner }

      const handler =
        $inner.mode.super($inner.selector, $inner.handler, $inner.isPublic)

      return MarkAndSetFuncImmutable(handler, SAFE_FUNC)
    }
  }.super, IDEMPOT_VALUE_METHOD)


  // _Definition.addLazyProperty(function isLazy() {
  //   return (this.mode === LAZY_INSTALLER)
  // })


  _Definition.addMethod(function toString(_) { // eslint-disable-line
    var count = this.handler.length
    return `${this.selector}(${count})`
  }, IDEMPOT_VALUE_METHOD)


  AddIntrinsicDeclaration("isDeclaration")
  AddIntrinsicDeclaration("isDurable")
  AddIntrinsicDeclaration("isAssigner")
  AddIntrinsicDeclaration("isProperty")
  AddIntrinsicDeclaration("isMethod")
  AddIntrinsicDeclaration("isValue")


  _Definition.addMethod(function _invalidSelectorError(selector) {
    this._signalError(`Definition must be set with a valid selector!! Not: '${selector}'`)
  })

})
