function OuterConstructorFor(outerRoot) {
  const constructor = CreateNamelessEmptyFunction()
  constructor.prototype = outerRoot
  return constructor
}


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

function CreateNamelessCoreConstructor(PairedOuter) {
  return function () {
    const outer = new PairedOuter()
    const rind  = new Proxy(outer, PrivacyPorosity)

    this[INNER] = new Proxy(this, MutablePorosity)
    this[OUTER] = outer
    this[RIND]  = rind
    InterMap.set(rind, this)
  }
}

function CreateNamelessDisguiseConstructor(PairedOuter) {
  return function (disguisedFunc) {
    const mutablePorosity = new DisguisedMutablePorosity(this)
    const outer           = new PairedOuter()
    const privacyPorosity = new DisguisedPrivacyPorosity(outer)
    const rind            = new Proxy(disguisedFunc, privacyPorosity)

    this[DISGUISED] = disguisedFunc
    this[INNER]     = new Proxy(disguisedFunc, mutablePorosity)
    this[OUTER]     = outer
    this[RIND]      = rind
    InterMap.set(rind, this)
  }
}


function CoreConstructorFor(coreRoot, isDisguised_) {
  const outerRoot   = SpawnFrom(Outer_root)
  const PairedOuter = OuterConstructorFor(outerRoot)
  const Core        = isDisguised_ ?
    CreateNamelessDisguiseConstructor(PairedOuter) :
    CreateNamelessCoreConstructor(PairedOuter)
  Core.prototype    = coreRoot
  return Core
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

function Create_new(BlankInstanceConstructor) {
  const target = isDisguised_ ?
    {
      new : function (disguisedFunc, ...args) {
        const core = new BlankInstanceConstructor(disguisedFunc)
        core[INNER]._init(...args)
        return core[RIND]
      }
    } :
    {
      new : function (...args) {
        const core = new BlankInstanceConstructor()
        core[INNER]._init(...args)
        return core[RIND]
      }
    }
  return target.new
}

function Create_$factory(BlankInstanceConstructor, isDisguised) {
  return isDisguised_ ?
    function $factory(disguisedFunc, ...args) {
      const core = new BlankInstanceConstructor(disguisedFunc)
      core[INNER]._init(...args)
      if (core.id == null) { core.beImmutable }
      return core[RIND]
    } :
    function $factory(...args) {
      const core = new BlankInstanceConstructor()
      core[INNER]._init(...args)
      if (core.id == null) { core.beImmutable }
      return core[RIND]
    }
}



function Type_new(spec, context_, $root__) {
  const isDisguised = spec && spec.isDisguised
  const $root       = $root__ || SpawnFrom(Core_root)
  const blankInstanceConstructor = CoreConstructorFor($root, isDisguised)
  const $factory    = Create_$factory(blankInstanceConstructor, isDisguised)
  const typeCore    = new BlankTypeConstructor($factory)

  typeCore._isDisguised              = isDisguised
  typeCore._$root                    = $root
  typeCore._blankInstanceConstructor = blankInstanceConstructor

  typeCore[INNER]._init(spec, context_)
  return typeCore[RIND]
}
