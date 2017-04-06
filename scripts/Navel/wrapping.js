
// Unnecessary because a private property such as _initFrom_ cannot be set
// from the outside!!!
//
// function Wrap_initFrom_(OriginalFunc) {
//   if (OriginalFunc.length < 4) {
//     return function $_initFrom_3(_source, visited, exceptSelector_) {
//       const receiver =
//         (this != null && this[SECRET] === $TWIN) ? this[RIND] : this
//       const source = (_source != null && _source[SECRET] === $TWIN) ?
//         _source[RIND] : _source
//       return OriginalFunc.apply(receiver, source, visited, exceptSelector_)
//     }
//   }
//   return function $_initFrom_4(_source, visited, exceptSelector_, asImmutable) {
//     const receiver =
//       (this != null && this[SECRET] === $TWIN) ? this[RIND] : this
//     const source = (_source != null && _source[SECRET] === $TWIN) ?
//       _source[RIND] : _source
//     return OriginalFunc.apply(
//       receiver, source, visited, exceptSelector_, asImmutable)
//   }
// }


// UNTESTED
function WrapFunc(OriginalFunc) {
  return function $wrappedOutsideFunc(...args) {
    const receiver =
      (this != null && this[_SECRET] === $TWIN) ? this[RIND] : this
    return OriginalFunc.apply(receiver, ...args)
  }
}

const PublicHandlers = SpawnFrom(null)
const PublicGetters  = SpawnFrom(null)


function PublicHandlerFor(selector, IsGetter) {
  const publicHandlers = IsGetter ? PublicGetters : PublicHandlers
  let publicHandler    = publicHandlers[selector]

  if (publicHandler) { return publicHandler }

  publicHandler = function (...args) {
    let $core, porosity, $twin, result, result$core

    $core = InterMap.get(this)

    if ((porosity = $core[_INNER_POROSITY])) {
      if (porosity.inUse) { porosity = new ImmutableInnerPorosity($core) }
      porosity.inUse = true
      $twin = porosity.target
    }
    else { $twin = $core[$TWIN] }

    result = IsGetter ? $twin[selector] : $twin[selector](...args)

    if (porosity) { // indicator that $twin isImmutable
      if (result === $twin) {
        result = porosity.target
        if (result !== $twin) {
          porosity.target = porosity.$twin  // reset porosity
          result.beImmutable
        }
        porosity.inUse = false
        return result.$
      }
      if (typeof result !== "object" || result === null) { return result }
      if (result[IS_IMMUTABLE] || result.id != null)     { return result }
      return ((result$core = InterMap.get(result))) ?
        result$core[COPY](true).$ : CopyObject(result, true)
    }

    return (result === $twin) ? result[RIND] : result
  }

  publicHandlers[selector] = publicHandler
  return AsSafeFunction(publicHandler)
}


// function AsPublic(originalFunc) {
//   const name     = originalFunc.name
//   const funcBody = `
//     return function (
//       InterMap, Frost, ImmutableInnerPorosity,
//       $TWIN, IS_IMMUTABLE, _INNER_POROSITY
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
//     $TWIN, IS_IMMUTABLE, _INNER_POROSITY
//   )
//   publicHandler[IS_IMMUTABLE] = true
//   Frost(publicMethod.prototype)
//   return Frost(publicMethod)
// }
