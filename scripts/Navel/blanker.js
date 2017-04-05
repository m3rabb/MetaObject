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


function MakeCoreBlanker(PairedOuter) {
  return function () {
    const outer = new PairedOuter()
    const rind  = new Proxy(outer, PrivacyPorosity)

    this[INNER] = new Proxy(this, MutablePorosity)
    this[OUTER] = outer
    this[RIND]  = rind
    outer[RIND] = rind
    InterMap.set(rind, this)
  }
}


function MakeTypeCoreBlanker(TypeOuter) {
  return function () {  // $Type // NewTypeBlanker
    const type = this
    function $new(...args) {
      const core = new type._blanker()
      core[INNER]._init(...args)
      if (core.id == null) { core.beImmutable }
      return core[RIND]
    }
    InterMap.set($new, SAFE_FUNCTION)

    const mutablePorosity = new DisguisedMutablePorosity(this)
    const outer           = new TypeOuter()
    const privacyPorosity = new TypePrivacyPorosity(outer)
    const rind            = new Proxy($new, privacyPorosity)

    this.newFact  = $new
    this[INNER]   = new Proxy($new, mutablePorosity)
    this[OUTER]   = outer
    this[RIND]    = rind
    outer[RIND]   = rind
    InterMap.set(rind, this)

    this._blanker = NewBlankerFrom($InateBlanker, MakeCoreBlanker)
  }
}

function NewBlankerFrom(superBlanker, coreBlankerMaker) {
  const $root$core  = SpawnFrom(superBlanker.$root$core)
  const $root$outer = SpawnFrom(superBlanker.$root$outer)
  const PairedOuter = MakeNamelessVacuousFunction()
  const Blanker     = coreBlankerMaker(PairedOuter)

  $root$core[OUTER]     = $root$outer
  PairedOuter.prototype = $root$outer
  Blanker.prototype     = $root$core
  Blanker.$root$core    = $root$core
  Blanker.$root$inner   = new Proxy($root$core, MutablePorosity)
  Blanker.$root$outer   = $root$outer

  return AsSafeFunction(Blanker, true)
}


function VacuousConstructor(name) {
  const funcBody = `
    return function ${name}() {
      const message = "This constructor is only used for debugging!"
      return SignalError(${name}, message)
    }
  `
  const constructor = Function(funcBody)()
  return AsSafeFunction(constructor)
}

function SetDisplayNames(blanker, outerName, coreName = ("_" + outerName)) {
  blanker.$root$outer.constructor = VacuousConstructor(outerName)
  blanker.$root$core.constructor  = VacuousConstructor(coreName)
  return blanker
}
