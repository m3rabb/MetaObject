
// Unnecessary because a private property such as _initFrom_ cannot be set
// from the outside!!!
//
// function Wrap_initFrom_(OriginalFunc) {
//   if (OriginalFunc.length < 4) {
//     return function $_initFrom_3(_source, visited, exceptSelector_) {
//       const receiver =
//         (this != null && this[SECRET] === INNER) ? this[RIND] : this
//       const source = (_source != null && _source[SECRET] === INNER) ?
//         _source[RIND] : _source
//       return OriginalFunc.apply(receiver, source, visited, exceptSelector_)
//     }
//   }
//   return function $_initFrom_4(_source, visited, exceptSelector_, asImmutable) {
//     const receiver =
//       (this != null && this[SECRET] === INNER) ? this[RIND] : this
//     const source = (_source != null && _source[SECRET] === INNER) ?
//       _source[RIND] : _source
//     return OriginalFunc.apply(
//       receiver, source, visited, exceptSelector_, asImmutable)
//   }
// }


// UNTESTED
function WrapFunc(OriginalFunc) {
  return function $wrappedOutsideFunc(/* arguments */) {
    const receiver =
      (this != null && this[SECRET] === INNER) ? this[RIND] : this
    return OriginalFunc.apply(receiver, arguments)
  }
}


function PublicHandlerFor(selector, IsGetter) {
  let publicHandler = IsGetter ?
    PublicGetters.get(selector) : PublicHandlers.get(selector)

  if (publicHandler) { return publicHandler }

  publicHandler = function (/* arguments */) {
    let $core, porosity, $inner, result

    $core = InterMap.get(this)

    if ((porosity = $core[INNER_POROSITY])) {
      if (porosity.inUse) { porosity = new ImmutableInnerPorosity($core) }
      porosity.inUse = true
      $inner = porosity.target
    }
    else { $inner = $core[INNER] }

    result = IsGetter ? $inner[selector] : $inner[selector](arguments)

    if (porosity) { // indicator that $inner isImmutable
      if (result === $inner) {
        result = porosity.target
        if (result !== inner) {
          porosity.target = porosity.$inner  // reset porosity
          result.beImmutable
        }
        porosity.inUse = false
        return result.$
      }
      if (typeof value !== "object" || value === null) { return result }
      if (value[IS_IMMUTABLE] || value.id != null)     { return result }
      return ((valueCore = InterMap.get(value))) ?
        valueCore[COPY](true).$ : CopyObject(value, true)
    }

    return (result === $inner) ? result.$ : result
  }

  IsGetter ?
    PublicGetters.set(selector, publicHandler) :
    PublicHandlers.set(selector, publicHandler)
  InterMap.set(publicHandler, SAFE_FUNCTION)
  (publicHandler.prototype)
  return Frost(publicHandler)
}


// function AsPublic(originalFunc) {
//   const name     = originalFunc.name
//   const funcBody = `
//     return function (
//       InterMap, Frost, ImmutableInnerPorosity,
//       INNER, IS_IMMUTABLE, INNER_POROSITY
//     ) {
//       return function ${name}(OriginalMethod) {
//         let core, porosity, receiver, result
//         ...
//         return (result === receiver) ? result.$ : result
//       }
//     }
//   `
//   const maker = Function(funcBody)
//   const publicHandler = maker(
//     InterMap, Frost, ImmutableInnerPorosity,
//     INNER, IS_IMMUTABLE, INNER_POROSITY
//   )
//   publicHandler[IS_IMMUTABLE] = true
//   Frost(publicMethod.prototype)
//   return Frost(publicMethod)
// }
