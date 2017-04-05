// "use strict"

// rind
//   porosity
//   outer
//
// inner
//   porosity
//   core
//     inner
//     outer
//     rind
//
// rind --> core

// rind
//   disguisedFunc
//   disguisedPrivacyPorosity
//     outer
//
// inner
//   disguisedFunc
//   disguisedMutablePorosity
//     core
//       disguised
//       inner
//       outer
//       rind
//
// rind --> core


function CoreBlankerMaker(PairedOuter) {
  return function $core() {
    const outer = new PairedOuter()
    const rind  = new Proxy(outer, PrivacyPorosity)

    this[INNER] = new Proxy(this, MutablePorosity)
    this[OUTER] = outer
    this[RIND]  = rind
    outer[RIND] = rind
    InterMap.set(rind, this)
  }
}


function TypeCoreBlankerMaker(TypeOuter) {
  return function $Type() {  // NewTypeBlanker
    const $blanker = (/* arguments */) => {
      const core = new this._instanceBlanker()
      core[INNER]._init(arguments)
      if (core.id == null) { core.beImmutable }
      return core[RIND]
    }
    InterMap.set($blanker, SAFE_FUNCTION)

    const mutablePorosity = new DisguisedMutablePorosity(this)
    const outer           = new TypeOuter()
    const privacyPorosity = new TypePrivacyPorosity(outer)
    const rind            = new Proxy($blanker, privacyPorosity)

    this[BLANKER] = $blanker
    this[INNER]   = new Proxy($blanker, mutablePorosity)
    this[OUTER]   = outer
    this[RIND]    = rind
    outer[RIND]   = rind
    InterMap.set(rind, this)

    this._instanceBlanker = NewBlankerFrom($InateBlanker, CoreBlankerMaker)
  }
}

function NewBlankerFrom(superBlanker, coreBlankerMaker) {
  const $root$core  = SpawnFrom(superBlanker.$root$core)
  const $root$outer = SpawnFrom(superBlanker.$root$outer)
  const PairedOuter = function $outer() {}
  const Blanker     = coreBlankerMaker(PairedOuter)

  $root$core[OUTER]     = $root$outer
  PairedOuter.prototype = $root$outer
  Blanker.prototype     = $root$core
  Blanker.$root$core    = $root$core
  Blanker.$root$inner   = new Proxy($root$core, MutablePorosity)
  Blanker.$root$outer   = $root$outer
  InterMap.set(Blanker, SAFE_FUNCTION)
  return Blanker
}



function DegenerateConstructorForNamingInDebugger(typeName, isInner) {
  const funcName = (isInner ? "_" : "") + typeName
  const funcBody = `
    return function ${funcName}() {
      const message = "This constructor is only used for debugging!"
      return SignalError(${funcName}, message)
    }
  `
  const constructor = Function(funcBody)()

  constructor[IS_IMMUTABLE] = true
  Frost(constructor.prototype)
  return Frost(constructor)
}
