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




function AddGetter(target, name, isVisible, getter) {
  const configuration = {
    configurable: true,
    enumerable  : isVisible,
    get         : getter
  }
  return DefineProperty(target, name, configuration)
}


// function SetMethod($inner, method) {
//   const $outer   = $inner[$OUTER]
//   const mode     = method.mode
//   const selector = method.selector
//   const handler  = method.handler
//   const isPublic = method.isPublic
//
//   if (mode === STANDARD) {
//     if (isPublic) { $outer[selector] = method }
//     $inner[selector] = handler
//   }
//   else {
//     const getHandler =
//       (mode === LAZY_INSTALLER) ? MakeLazyLoader(selector, handler) : handler
//     // const getters = $inner[GETTERS] || ($inner[GETTERS] = SpawnFrom(null))
//     $inner[$GETTERS][selector] = handler // necessary???
//     AddGetter($inner, selector, true, getHandler)
//     if (isPublic) {
//       const publicGetHandler = PublicHandlerFor(selector, GETTER)
//       AddGetter($outer, selector, true, publicGetHandler)
//     }
//   }
// }

function SetMethod($inner, method) {
  const $outer        = $inner[$OUTER]
  const selector      = method.selector
  const handler       = method.handler
  const publicHandler = method.publicHandler
  const isPublic      = method.isPublic

  if (method.isImmediate) {
    $inner[$IMMEDIATES][selector] = handler
    AddGetter($inner, selector, true, handler)
    if (isPublic) { AddGetter($outer, selector, true, publicHandler) }
  }
  else if (isPublic) {
    $outer[selector] = $inner[selector] = publicHandler
  }
  else {
    $inner[selector] = handler
  }
}



function AsMethod(method_func__name, func__, mode___) {
  return (method_func__name.isMethod) ?
    method_func__name : Method(method_func__name, func__, mode___)
}

function MakeLazyLoader(Selector, Handler) {
  const $loader = function () {
    if (this[IS_IMMUTABLE]) { return Handler.call(this) }
    DefineProperty(this, Selector, InvisibleConfiguration)
    return (this[Selector] = Handler.call(this))
  }
  $loader.isLoader = true // is necessary???
  // $loader[$SECRET] = LOADER
  return BeSafeFunction($loader) // $loader
}


function BeSafeFunction(func, ignorePrototype) {
  InterMap.set(func, SAFE_FUNCTION)
  if (ignorePrototype !== IGNORE) { Frost(func.prototype) }
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
  return BeSafeFunction(constructor)
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

  supers[$IMMEDIATES]      = SpawnFrom(null)
  supers[$SUPERS]          = supers
  $root$inner[$SUPERS]     = supers
  $root$inner[$IMMEDIATES] = SpawnFrom(null)

  return BeSafeFunction(Blanker, IGNORE)
}

function MakeInnerBlanker(PairedOuter) {
  return function () {
    const $outer = new PairedOuter()
    const $rind  = new Proxy($outer, PrivacyPorosity)

    this[$INNER]  = this
    this[$PULP]   = new Proxy(this, MutablePorosity)
    this[$OUTER]  = $outer
    this[$RIND]   = $rind
    $outer[$RIND] = $rind
    InterMap.set($rind, this)
  }
}

function MakeTypeInnerBlanker(PairedOuter) {
  return function ([typeName = "<none>"]) {  // $Type // NewTypeBlanker
    const func            = MakeVacuousConstructor(typeName)
    const mutablePorosity = new TypeInner(this)
    const $pulp           = new Proxy(func, mutablePorosity)
    // mutablePorosity.$pulp = $pulp
    const $outer          = new PairedOuter()
    const privacyPorosity = new TypeOuter($pulp, $outer)
    const $rind           = new Proxy(func, privacyPorosity)
    // const $rind           = new Proxy(NewAsFact, privacyPorosity)
    const blanker         = NewBlankerFrom($InateBlanker, MakeInnerBlanker)

    this.name        = typeName   // Unnecessary here but helps with implementation debugging!!!
    this._blanker    = blanker
    this._properties = SpawnFrom(null)

    this[$INNER]  = this
    this[$PULP]   = $pulp
    // this[$PULP]   = new Proxy(NewAsFact, mutablePorosity)
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
// BeSafeFunction(NewAsFact) // Causes proxy error on read of name!!!














/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
