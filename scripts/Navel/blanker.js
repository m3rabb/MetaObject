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
    const $pulp = new PairedOuter()
    const rind  = new Proxy($pulp, PrivacyPorosity)

    this[$TWIN] = new Proxy(this, MutablePorosity)
    this[$PULP] = $pulp
    this[RIND]  = rind
    $pulp[RIND] = rind
    InterMap.set(rind, this)
  }
}


function MakeTypeCoreBlanker(TypeOuter) {
  return function () {  // $Type // NewTypeBlanker
    const type = this
    function $new(...args) {
      const core = new type._blanker()
      core[$TWIN]._init(...args)
      if (core.id == null) { core.beImmutable }
      return core[RIND]
    }
    InterMap.set($new, SAFE_FUNCTION)

    const mutablePorosity = new DisguisedMutablePorosity(this)
    const $pulp           = new TypeOuter()
    const privacyPorosity = new TypePrivacyPorosity($pulp)
    const rind            = new Proxy($new, privacyPorosity)

    this.newFact  = $new
    this[$TWIN]   = new Proxy($new, mutablePorosity)
    this[$PULP]   = $pulp
    this[RIND]    = rind
    $pulp[RIND]   = rind
    InterMap.set(rind, this)

    this._blanker = NewBlankerFrom($InateBlanker, MakeCoreBlanker)
  }
}

function NewBlankerFrom(superBlanker, coreBlankerMaker) {
  const $root$core  = SpawnFrom(superBlanker.$root$core)
  const $root$plup = SpawnFrom(superBlanker.$root$plup)
  const PairedOuter = MakeNamelessVacuousFunction()
  const Blanker     = coreBlankerMaker(PairedOuter)

  $root$core[$PULP]     = $root$plup
  PairedOuter.prototype = $root$plup
  Blanker.prototype     = $root$core
  Blanker.$root$core    = $root$core
  Blanker.$root$twin   = new Proxy($root$core, MutablePorosity)
  Blanker.$root$plup   = $root$plup

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

function SetDisplayNames(blanker, outerName, innerName = ("_" + outerName)) {
  blanker.$root$plup.constructor = VacuousConstructor(outerName)
  blanker.$root$core.constructor  = VacuousConstructor(innerName)
  return blanker
}
