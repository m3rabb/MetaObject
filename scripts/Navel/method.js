_Method.addLazyProperty("super", function () {
  return this.mode.super[this.isPublic](this.selector, this.handler)
})

_Method.addLazyProperty(function isGetter() {
  const mode = this.mode
  return (mode.isImmediate && mode !== LAZY_INSTALLER)
})

_Method.addLazyProperty(function isLazy() {
  return (this.mode === LAZY_INSTALLER)
})

_Method.addLazyProperty(function isImmediate() {
  return this.mode.isImmediate
})

// _Method.addSharedProperty("STANDARD"      , STANDARD      )
// _Method.addSharedProperty("GETTER"        , GETTER        )
// _Method.addSharedProperty("LAZY"          , LAZY_INSTALLER)
// _Method.addSharedProperty("LAZY_INSTALLER", LAZY_INSTALLER)
