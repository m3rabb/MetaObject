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




// function AddGetter(target, name, isVisible, getter) {
//   const configuration = {
//     configurable: true,
//     enumerable  : isVisible,
//     get         : getter
//   }
//   return DefineProperty(target, name, configuration)
// }


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
  const $outer       = $inner[$OUTER]
  const method$inner = InterMap.get(method)
  const selector     = method$inner.selector
  const mode         = method$inner.mode

  if (mode.isImmediate) {
    $inner[$IMMEDIATES][selector] = method$inner
    $inner[selector] = IMMEDIATE
    if (method$inner.isPublic) { $outer[selector] = IMMEDIATE }
  }
  else if (mode === SET_LOADER) {
    $inner[$SET_LOADERS][selector] = method$inner.handler
  }
  else {
    $inner[selector] = method$inner.inner
    if (method$inner.isPublic) { $outer[selector] = method$inner.outer }
  }
}



function AsMethod(method_func__name, func__, mode___) {
  return (method_func__name.isMethod) ?
    method_func__name : Method(method_func__name, func__, mode___)
}

// function MakeLazyLoader(Selector, Handler) {
//   const $loader = function () {
//     if (this[IS_IMMUTABLE]) { return Handler.call(this) }
//     DefineProperty(this, Selector, InvisibleConfiguration)
//     return (this[Selector] = Handler.call(this))
//   }
//   $loader.isLoader = true // is necessary???
//   // $loader[$SECRET] = LOADER
//   return BeFrozenFunc($loader) // $loader
// }


function BeFrozenFunc(func) {
  InterMap.set(func, SAFE_FUNCTION)
  Frost(func.prototype)
  return Frost(func)
}


function MakeNamelessVacuousFunction() {
  return function () {}
}

function MakeVacuousConstructor(Name, freeze_) {
  return {
    [Name] : function () {
      return SignalError(Name, "This constructor is only used for naming!")
    }
  }[Name]
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

  supers[$IMMEDIATES]       = SpawnFrom(null)
  supers[$SUPERS]           = supers
  $root$inner[$SUPERS]      = supers
  $root$inner[$IMMEDIATES]  = SpawnFrom(null)
  $root$inner[$SET_LOADERS] = SpawnFrom(null)

  InterMap.set(Blanker, SAFE_FUNCTION)
  return Frost(Blanker)
}

// NOT TESTED
function MakeTypeInnerBlanker(PairedOuter) {
  return function ([name_spec]) {  // $Type // NewTypeBlanker
    const typeName = (typeof name_spec === "object") ?
      name_spec.name : name_spec
    const func = MakeVacuousConstructor(typeName)
    Frost(func.prototype)
    DefineProperty(func, "name", InvisibleConfiguration)

    const mutablePorosity = new TypeInner(this)
    const $pulp           = new Proxy(func, mutablePorosity)
    mutablePorosity.$pulp = $pulp
    const $outer          = new PairedOuter()
    const privacyPorosity = new TypeOuter($pulp, $outer)
    const $rind           = new Proxy(func, privacyPorosity)
    // const $rind           = new Proxy(NewAsFact, privacyPorosity)
    const blanker         = NewBlankerFrom($InateBlanker, MakeInnerBlanker)
    const properties      = SpawnFrom(null)

    this._disguisedFunc = func
    this._blanker       = blanker
    this._properties    = properties

    this[$INNER]  = this
    this[$PULP]   = $pulp
    // this[$PULP]   = new Proxy(NewAsFact, mutablePorosity)
    this[$OUTER]  = $outer
    this[$RIND]   = $rind
    $outer[$RIND] = $rind
    InterMap.set($rind, this)

    // $pulp.name = typeName   // Unnecessary here but helps with implementation debugging!!!

  }
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



function Make__newBlank(Blanker) {
  return function _newBlank() { return new Blanker()[$RIND] }
}

function AsMembershipSelector(name) {
  return `is${name[0].toUpperCase()}${name.slice(1)}`
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


// // To ease debugging, consider dynamic naming new${TypeName}AsFact !!!
// const NewAsFact = function newAsFact(...args) {
//   let instance = this.new(...args)
//   if (instance.id == null) { instance.beImmutable }
//   return instance
// }
// // BeFrozenFunc(NewAsFact) // Causes proxy error on read of name!!!














/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
