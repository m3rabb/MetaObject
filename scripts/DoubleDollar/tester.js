function MakeConstructor(baseConstructor, root) {
  const typeName = baseConstructor.name
  const funcBody =
    `return function ${typeName}(...args) {
      const instance = { __proto__ : ${typeName}._instanceRoot }
      instance._init(...args)
      return (args.length) ? instance.beImmutable : instance
    }`
  const typeFunc           = Function(funcBody)()
  const instanceRoot       = root || { __proto__ : null }
  instanceRoot._init       = baseConstructor
  instanceRoot.constructor = typeFunc
  Object.defineProperty(instanceRoot, "beImmutable", {
    get () { return Object.freeze(this) }
  })
  typeFunc._instanceRoot = instanceRoot
  return typeFunc
}

function List(elements_) {
  this._elements = elements_ || []
}
