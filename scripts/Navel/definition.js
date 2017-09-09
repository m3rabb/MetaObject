ObjectSauce(function (
  $INNER, ASSIGNER, DECLARATION, LAZY_INSTALLER, SAFE_FUNC,
  IDEMPOT_VALUE_METHOD,
  AddIntrinsicDeclaration, MarkAndSetFuncImmutable, SignalError,
  Definition, _Definition,
  _OSauce
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

      return SetFuncImmutable(handler, SAFE_FUNC)
    }
  }.super, BASIC_VALUE_METHOD)


  // _Definition.addLazyProperty(function isLazy() {
  //   return (this.mode === LAZY_INSTALLER)
  // })


  _Definition.addMethod(function toString(_) { // eslint-disable-line
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


  // AsDefinition(definition)
  // AsDefinition(tag, definition)
  // AsDefinition(namedFunc, mode_)
  // AsDefinition(selector, func, mode_)

  function AsDefinition(...args) {
    var def, tag
    switch (args.length) {
      case 1 :
        [def] = args
        if (def.isDefinition) { return def }
        break

      case 2 :
        [tag, def] = args
        if (def.isDefinition) {
          return (tag === def.tag) ? def : Definition(tag, def.handler, def.mode)
        }
        // break omitted

      case 3 :
        return Definition(...args) // selector, value, mode
    }
    return SignalError("Improper arguments to make a Definition!!")
  }

  // function AsDefinition(arg, arg_, arg__) {
  //   if (arg.isDefinition) { return arg }
  //   if (arg_.isDefinition) {
  //     return (arg === arg_.tag) ? arg_ : Definition(arg, arg_.handler, arg_.mode)
  //   }
  //   return Definition(arg, arg_, arg__)
  // }

  _OSauce.AsDefinition = AsDefinition

})
