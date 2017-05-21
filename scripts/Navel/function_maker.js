class NamedFunctionMaker {
  constructor (closure) {
    this.closure = closure
  }

  make (name, funcSource) {
    const funcBody   = funcSource.match(/function\s*.*\(.*\)\s*([\w\W]+)/)[1]
    const words      = funcBody.match(/[\$_]*[\w$]+/g)
    const closureIds = words.filter(word => /^[\$_]*[A-Z][\w$]*$/.test(word))
    const identifier = (typeof name === "symbol") ?
                          name.toString().match(/\((.*)\)/)[1] : name
    const newSource  = funcSource.replace("@name@", identifier)
    const makerBody  =
`return function Maker(${closureIds.sort()}) {
  return ${newSource}
}`
    const values     = closureIds.map(identifier => this.closure[identifier])
    const maker      = Function(makerBody)()
    return maker(values)
  }
}



// var globals = {SIZE : 3}
//
// var maker = new FunctionMaker(globals)
//
// var source = `function @name@(x, y) {
//   return x * SIZE + y
// }`
//
// var namedFunc = maker.make("mathy", source)
//
// var answer = namedFunc(10, 1)


// var globals = {$SECRET : "123", $INNER : "$INNER123", RIND : "RIND123"}
//
// var maker = new FunctionMaker(globals)
//
// var source = `function WrapFunc(OriginalFunc) {
//   return function @name@(...args) {
//     const receiver =
//       (this != null && this[$SECRET] === $INNER) ? this[RIND] : this
//     return OriginalFunc.apply(receiver, ...args)
//   }
// }`
//
// var namedFunc = maker.make("Doggy", source)
