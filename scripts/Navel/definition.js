HandAxe(function (
  $INNER, $OUTER_WRAPPER, $RIND,
  ASSIGNER, DECLARATION, LAZY_INSTALLER, SUPER_FUNC,
  AddIntrinsicDeclaration, Definition, KnowAndSetFuncImmutable,
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
      handler[$OUTER_WRAPPER] = $inner.outer
      handler.method          = $inner[$RIND]

      return KnowAndSetFuncImmutable(handler, SUPER_FUNC)
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

/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
