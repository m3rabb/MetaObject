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


function NewBlankerFrom(superBlanker, innerBlankerMaker) {
  const $root$inner = SpawnFrom(superBlanker.$root$inner)
  const $root$outer = SpawnFrom(superBlanker.$root$outer)
  const PairedOuter = MakeNamelessVacuousFunction()
  const Blanker     = innerBlankerMaker(PairedOuter)

  $root$inner[$OUTER]     = $root$outer
  PairedOuter.prototype = $root$outer
  Blanker.prototype     = $root$inner
  Blanker.$root$inner    = $root$inner
  Blanker.$root$flesh   = new Proxy($root$inner, MutablePorosity)
  Blanker.$root$outer   = $root$outer

  return AsSafeFunction(Blanker, true)
}

function MakeCoreBlanker(PairedOuter) {
  return function () {
    const $outer = new PairedOuter()
    const rind  = new Proxy($outer, PrivacyPorosity)

    this[$FLESH] = new Proxy(this, MutablePorosity)
    this[$OUTER] = $outer
    this[RIND]   = rind
    $outer[RIND] = rind
    InterMap.set(rind, this)
  }
}

function MakeTypeCoreBlanker(TypeOuter) {
  return function () {  // $Type // NewTypeBlanker
    const type = this
    function newAsFact(...args) {
      const $inner = new type._blanker()
      $inner[$FLESH]._init(...args)
      if ($inner.id == null) { $inner.beImmutable }
      return $inner[RIND]
    }
    InterMap.set(newAsFact, SAFE_FUNCTION)

    const mutablePorosity = new DisguisedMutablePorosity(this)
    const $outer          = new TypeOuter()
    const privacyPorosity = new TypePrivacyPorosity($outer)
    const rind            = new Proxy(newAsFact, privacyPorosity)
    const blanker         = NewBlankerFrom($InateBlanker, MakeCoreBlanker)

    blanker.$root$flesh.newAsFact = newAsFact // <<==
    this._blanker = blanker
    this[$FLESH]  = new Proxy(newAsFact, mutablePorosity)
    this[$OUTER]  = $outer
    this[RIND]    = rind
    $outer[RIND]  = rind
    InterMap.set(rind, this)
  }
}

function InSetAsSpecialMethod(_type, selector, handler) {
  const method        = Method(name, func)
  const isPublic      = method.isPublic
  const blanker       = _type._blanker

  if (isPublic) { blanker.$root$outer[selector] = PublicHandlerFor(selector) }
  blanker.$root$inner[selector] = handler
}

function InSetAsSpecialMethod(_type, selector, handler) {
  const method        = Method(name, func)
  const isPublic      = method.isPublic
  const blanker       = _type._blanker

  if (isPublic) { blanker.$root$outer[selector] = PublicHandlerFor(selector) }
  blanker.$root$inner[selector] = handler
}

function InSetMethod(_type, method) {
  const mode          = method.mode
  const selector      = method.selector
  const handler       = method.handler
  const isPublic      = method.isPublic

  const blanker       = _type._blanker
  const $root$outer   = blanker.$root$outer
  const $root$inner   = blanker.$root$inner

  if (mode === STANDARD) {
    if (isPublic) { $root$outer[selector] = PublicHandlerFor(selector) }
    $root$inner[selector] = handler
  }
  else {
    const getHandler = (mode === GETTER) ? handler : MakeLazyLoader(handler)
    if (!isPublic) {
      _AddGetter($root$outer, selector, true, PublicHandlerFor(selector, true))
    }
    _AddGetter($root$inner, selector, true, getHandler)
  }
}

function InSetProperty(_type, selector, value) {
  _type._blanker.$root$flesh[selector] = value
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
  blanker.$root$outer.constructor = VacuousConstructor(outerName)
  blanker.$root$inner.constructor  = VacuousConstructor(innerName)
  return blanker
}

function AsSafeFunction(func, ignorePrototype_) {
  func[IS_IMMUTABLE] = true
  InterMap.set(func, SAFE_FUNCTION)
  if (!ignorePrototype_) { Frost(func.prototype) }
  return Frost(func)
}


function MakeAncestors(_supertypes) {
  let next, _supertype, _ancestors, visited

  next = _supertypes.length
  if (next === 0) { return [] }

  _supertype = _supertypes[--next]
  _ancestors = _supertype._ancestors.slice()
  if (next === 0) {
    _ancestors.push(_supertype)
    return _ancestors
  }

  visited = new Set(_ancestors)
  do {
    _supertype = _supertypes[--next]
    if (!visited.has(_supertype)) {
      _supertype._ancestors.forEach(_type => {
        if (!visited.has(_type)) { _ancestors.push(_type) }
      })
    }
  } while (next)
  return _ancestors
}
