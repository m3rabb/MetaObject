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


const InterMap = new WeakMap()


const VisibleConfiguration = {
  configurable: true,
  writable    : true,
  enumerable  : true,
}

const InvisibleConfiguration = {
  configurable: true,
  writable    : true,
  enumerable  : false,
}

function AddGetter(target, name, isVisible, getter) {
  const configuration = {
    configurable: true,
    enumerable  : isVisible,
    get         : getter
  }
  return DefineProperty(target, name, configuration)
}


function SetMethod($inner, method) {
  const $outer   = $inner[$OUTER]
  const mode     = method.mode
  const selector = method.selector
  const handler  = method.handler
  const isPublic = method.isPublic

  if (mode === STANDARD) {
    if (isPublic) { $outer[selector] = PublicHandlerFor(selector, STANDARD) }
    $inner[selector] = handler
  }
  else {
    const getHandler =
      (mode === LAZY_INSTALLER) ? MakeLazyLoader(selector, handler) : handler
    // const getters = $inner[GETTERS] || ($inner[GETTERS] = SpawnFrom(null))
    $inner[$GETTERS][selector] = getHandler // necessary???
    AddGetter($inner, selector, true, getHandler)
    if (isPublic) {
      const publicGetHandler = PublicHandlerFor(selector, GETTER)
      AddGetter($outer, selector, true, publicGetHandler)
    }
  }
}



function AsMethod(method_func__name, func__, mode___) {
  return (method_func__name.isMethod) ?
    method_func__name : Method(method_func__name, func__, mode___)
}

function MakeLazyLoader(Selector, Handler) {
  const $loader = function () {
    DefineProperty(this, Selector, InvisibleConfiguration)
    return (this[Selector] = Handler.call(this))
  }
  $loader[$SECRET] = LOADER
  return $loader
}


function AsSafeFunction(func, mode) {
  InterMap.set(func, SAFE_FUNCTION)
  if (mode !== BLANKER) { Frost(func.prototype) }
  return Frost(func)
}


function MakeNamelessVacuousFunction() {
  return function () {}
}

function MakeVacuousConstructor(name) {
  const funcBody = `
    return function ${name}() {
      const message = "This constructor is only used for debugging!"
      return SignalError(${name}, message)
    }
  `
  const constructor = Function(funcBody)()
  return AsSafeFunction(constructor)
}

// function SetDisplayNames(blanker, outerName, innerName = ("_" + outerName)) {
//   blanker.$root$outer.constructor = MakeVacuousConstructor(outerName)
//   blanker.$root$inner.constructor = MakeVacuousConstructor(innerName)
//   return blanker
// }


function NewBlankerFrom(superBlanker, blankerMaker) {
  const $root$inner = SpawnFrom(superBlanker.$root$inner)
  const $root$outer = SpawnFrom(superBlanker.$root$outer)
  const PairedOuter = MakeNamelessVacuousFunction()
  const Blanker     = blankerMaker(PairedOuter)
  const supers       = SpawnFrom(null)

  $root$inner[$OUTER]   = $root$outer
  PairedOuter.prototype = $root$outer
  Blanker.prototype     = $root$inner
  Blanker.$root$inner   = $root$inner
  Blanker.$root$pulp    = new Proxy($root$inner, MutablePorosity)
  Blanker.$root$outer   = $root$outer

  supers[$GETTERS]      = SpawnFrom(null)
  supers[$SUPERS]       = supers
  $root$inner[$SUPERS]  = supers
  $root$inner[$GETTERS] = SpawnFrom(null)

  return AsSafeFunction(Blanker, BLANKER)
}

function MakeInnerBlanker(PairedOuter) {
  return function () {
    const $outer = new PairedOuter()
    const $rind  = new Proxy($outer, PrivacyPorosity)

    this[$PULP]   = new Proxy(this, MutablePorosity)
    this[$OUTER]  = $outer
    this[$RIND]   = $rind
    $outer[$RIND] = $rind
    InterMap.set($rind, this)
  }
}

function MakeTypeInnerBlanker(TypeOuter) {
  return function () {  // $Type // NewTypeBlanker
    const mutablePorosity = new DisguisedMutablePorosity(this)
    const $outer          = new TypeOuter()
    const privacyPorosity = new DisguisedPrivacyPorosity(this, $outer)
    const $rind           = new Proxy(NewAsFact, privacyPorosity)
    const blanker         = NewBlankerFrom($InateBlanker, MakeInnerBlanker)

    this._blanker    = blanker
    this._properties = SpawnFrom(null)

    this[$PULP]   = new Proxy(NewAsFact, mutablePorosity)
    this[$OUTER]  = $outer
    this[$RIND]   = $rind
    $outer[$RIND] = $rind
    InterMap.set($rind, this)
  }
}

// const NewAsFact = function newAsFact(...args) {
//   let $inner = new this._blanker()
//   let $pulp  = $inner[$PULP]
//   $pulp._init(...args)
//   if ($inner._postCreation) {
//     const $pulp = $pulp._postCreation()
//     if ($pulp[IS_IMMUTABLE]) { return $pulp[$RIND] }
//   }
//   if ($pulp.id == null) { $pulp.beImmutable }
//   return $pulp[$RIND]
// }


// To ease debugging, consider dynamic naming new${TypeName}AsFact !!!
const NewAsFact = function newAsFact(...args) {
  let instance = this.new(...args)
  if (instance.id == null) { instance.beImmutable }
  return instance
}
// AsSafeFunction(NewAsFact) // Causes proxy error on read of name!!!














/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
