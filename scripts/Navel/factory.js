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


function CoreConstructorMaker(PairedOuter) {
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

function TypeCoreConstructorMaker(TypeOuter) {
  return function $Type() {  // NewBlankTypeConstructor
    const $factory = (...args) => {
      const core = new this._blankConstructor()
      core[INNER]._init(...args)
      if (core.id == null) { core.beImmutable }
      return core[RIND]
    }
    InterMap.set($factory, SAFE_FUNCTION)

    const mutablePorosity = new DisguisedMutablePorosity(this)
    const outer           = new TypeOuter()
    const privacyPorosity = new TypePrivacyPorosity(outer)
    const rind            = new Proxy($factory, privacyPorosity)

    this[FACTORY] = $factory
    this[INNER]   = new Proxy($factory, mutablePorosity)
    this[OUTER]   = outer
    this[RIND]    = rind
    outer[RIND]   = rind
    InterMap.set(rind, this)
  }
}

function NewBlankConstructor(coreConstructorMaker) {
  const $root$core           = SpawnFrom(Something$root$core)
  const $root$outer          = SpawnFrom(Something$root$outer)
  const PairedOuter          = function $outer() {}
  const BlankConstructor     = coreConstructorMaker(PairedOuter)

  $root$core[OUTER]            = $root$outer
  BlankConstructor.prototype   = $root$core
  BlankConstructor.$root$inner = new Proxy($root$core, MutablePorosity)
  BlankConstructor.$root$outer = $root$outer
  PairedOuter.prototype        = $root$outer
  InterMap.set(BlankConstructor, SAFE_FUNCTION)
  return BlankConstructor
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
