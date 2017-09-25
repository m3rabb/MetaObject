Tranya(function (
  $INNER, ASSIGNER, DECLARATION, LAZY_INSTALLER, SAFE_FUNC,
  AddIntrinsicDeclaration, Definition, MarkAndSetFuncImmutable,
  _Definition
) {
  // "use strict"

  _Definition.addRetroactiveValue("super", {
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
  }.super)


  // _Definition.addLazyProperty(function isLazy() {
  //   return (this.mode === LAZY_INSTALLER)
  // })


  _Definition.addValueMethod(function toString(_) { // eslint-disable-line
    var count = this.handler.length
    return `${this.selector}(${count})`
  })


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
