const FUNC_MATCHER       = /function\s*.*\(.*\)\s*([\w\W]+)/
const IDENTIFIER_MATCHER = /[\$_]*[\w$]+/g
const EXTERNAL_MATCHER   = /^[\$_]*[A-Z][\w$]*$/
class NamedFunctionMaker {
  constructor (vars) {
    this.externalVars = vars
  }

  make (name_vars, func_funcSource) {
    let Closure = Object.create(this.externalVars)

    if (typeof name_vars === "string") {
      Closure.$$$$$ = name_vars
    }
    else {
      const varNames = Object.keys(name_vars)
      varNames.forEach(next => Closure[next] = name_vars[next])
    }

    let source      = (typeof func_funcSource === "string") ?
      func_funcSource : func_funcSource.toString()
    let funcBody    = source.match(FUNC_MATCHER)[1]
    let identifiers = funcBody.match(IDENTIFIER_MATCHER)
    let externals   = {}

    identifiers.forEach(word => {
      if (EXTERNAL_MATCHER.test(word)) { externals[word] = word }
    })

    let varNames = Object.keys(externals).sort()
    let newName  = Closure.$$$$$

    if (typeof newName === "symbol") {
      newName = newName.toString().match(/\((.*)\)/)[1]
    }

    let newSource = source.replace(/\$\$\$\$\$/g, newName)
    let makerBody =
`return function Maker(${varNames}) {
  return ${newSource}
}`
    let values    = varNames.map(name => Closure[name])
    let maker     = new Function(makerBody)()
    
    return maker(...values)
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


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/