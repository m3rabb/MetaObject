
// Unnecessary because a private property such as _initFrom_ cannot be set
// from the outside!!!
//
// function Wrap_initFrom_(OriginalFunc) {
//   if (OriginalFunc.length < 4) {
//     return function $_initFrom_3(_source, visited, exceptSelector_) {
//       const receiver =
//         (this != null && this[SECRET] === $FLESH) ? this[RIND] : this
//       const source = (_source != null && _source[SECRET] === $FLESH) ?
//         _source[RIND] : _source
//       return OriginalFunc.apply(receiver, source, visited, exceptSelector_)
//     }
//   }
//   return function $_initFrom_4(_source, visited, exceptSelector_, asImmutable) {
//     const receiver =
//       (this != null && this[SECRET] === $FLESH) ? this[RIND] : this
//     const source = (_source != null && _source[SECRET] === $FLESH) ?
//       _source[RIND] : _source
//     return OriginalFunc.apply(
//       receiver, source, visited, exceptSelector_, asImmutable)
//   }
// }


// UNTESTED
function WrapFunc(OriginalFunc) {
  return function $wrappedOutsideFunc(...args) {
    const receiver =
      (this != null && this[_SECRET] === $FLESH) ? this[RIND] : this
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
    let $inner, porosity, $flesh, result, result$inner

    $inner = InterMap.get(this)

    if ((porosity = $inner[_INNER_POROSITY])) {
      if (porosity.inUse) { porosity = new ImmutableInnerPorosity($inner) }
      porosity.inUse = true
      $flesh = porosity.target
    }
    else { $flesh = $inner[$FLESH] }

    result = IsGetter ? $flesh[selector] : $flesh[selector](...args)

    if (porosity) { // indicator that $flesh isImmutable
      if (result === $flesh) {
        result = porosity.target
        if (result !== $flesh) {
          porosity.target = porosity.$flesh  // reset porosity
          result.beImmutable
        }
        porosity.inUse = false
        return result.$
      }
      if (typeof result !== "object" || result === null) { return result }
      if (result[IS_IMMUTABLE] || result.id != null)     { return result }
      return ((result$inner = InterMap.get(result))) ?
        result$inner[COPY](true).$ : CopyObject(result, true)
    }

    return (result === $flesh) ? result[RIND] : result
  }

  publicHandlers[selector] = publicHandler
  return AsSafeFunction(publicHandler)
}


// function AsPublic(originalFunc) {
//   const name     = originalFunc.name
//   const funcBody = `
//     return function (
//       InterMap, Frost, ImmutableInnerPorosity,
//       $FLESH, IS_IMMUTABLE, _INNER_POROSITY
//     ) {
//       return function ${name}(OriginalMethod) {
//         let inner, porosity, receiver, result
//         ...
//         return (result === receiver) ? result.$ : result
//       }
//     }
//   `
//   const maker = Function(funcBody)
//   const publicHandler = maker(
//     InterMap, Frost, ImmutableInnerPorosity,
//     $FLESH, IS_IMMUTABLE, _INNER_POROSITY
//   )
//   publicHandler[IS_IMMUTABLE] = true
//   Frost(publicMethod.prototype)
//   return Frost(publicMethod)
// }
