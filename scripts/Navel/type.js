
Type.add("new", function (...args) {
  const core = new this[BLANK_CONSTRUCTOR]()
  core[INNER]._init(...args)
  return core[RIND]
})

Type.add(INSTANCEOF, (instance) => instance[IS_TYPE_SELECTOR])
